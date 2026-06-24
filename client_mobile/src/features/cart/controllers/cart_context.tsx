import React, {
  createContext, useContext, useState, useEffect,
  useCallback, useRef, ReactNode,
} from 'react';
import { API_BASE_URL } from '../../../core/constants/api_config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  quantity: number;
  selectedColor?: string;
}

interface ServerCartItem {
  product_id: number;
  quantity: number;
  selected_color?: string;
}

interface ServerCart {
  id: string;
  user_id: string;
  items: ServerCartItem[];
}

export interface CheckoutInfo {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_fee?: number;
  payment_method?: string; // 'COD' | 'VNPAY'
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  isLoading: boolean;
  cartId: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQty: (productId: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (info: CheckoutInfo) => Promise<{ success: boolean; orderId?: string; error?: string }>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface CartProviderProps {
  children: ReactNode;
  userId?: string;
  token?: string;
}

// Convert local items → server payload
function toServerItems(localItems: CartItem[]): ServerCartItem[] {
  return localItems.map((i) => ({
    product_id: i.productId,
    quantity: i.quantity,
    ...(i.selectedColor ? { selected_color: i.selectedColor } : {}),
  }));
}

export function CartProvider({ children, userId, token }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Keep a ref mirror of items so sync callbacks always see the latest items
  const itemsRef = useRef<CartItem[]>([]);
  const cartIdRef = useRef<string | null>(null);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { cartIdRef.current = cartId; }, [cartId]);

  // Display info cache (productId → name/price/image) for enriching server items
  const displayInfoRef = useRef<Map<number, Omit<CartItem, 'quantity' | 'productId'>>>(new Map());

  // ── Headers ────────────────────────────────────────────────────────────────

  const makeHeaders = useCallback((): HeadersInit => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  // ── Enrich server items with cached display info ───────────────────────────

  const enrichItems = useCallback((serverItems: ServerCartItem[]): CartItem[] =>
    serverItems.map((si) => {
      const info = displayInfoRef.current.get(si.product_id);
      return {
        productId: si.product_id,
        name: info?.name ?? `Sản phẩm #${si.product_id}`,
        price: info?.price ?? 0,
        originalPrice: info?.originalPrice,
        image: info?.image,
        quantity: si.quantity,
        selectedColor: si.selected_color,
      };
    }), []);

  // ── Load/init cart on userId change ───────────────────────────────────────

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setCartId(null);
      itemsRef.current = [];
      cartIdRef.current = null;
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        // Try to get existing cart
        const res = await fetch(`${API_BASE_URL}/carts/user/${userId}`, {
          headers: makeHeaders(),
        });

        if (res.ok) {
          const cart: ServerCart = await res.json();
          if (!cancelled) {
            setCartId(cart.id);
            cartIdRef.current = cart.id;
            const enriched = enrichItems(cart.items ?? []);
            setItems(enriched);
            itemsRef.current = enriched;
          }
        } else if (res.status === 404) {
          // Create new cart for this user
          const createRes = await fetch(`${API_BASE_URL}/carts`, {
            method: 'POST',
            headers: makeHeaders(),
            body: JSON.stringify({ user_id: userId, items: [] }),
          });
          if (createRes.ok && !cancelled) {
            const newCart: ServerCart = await createRes.json();
            setCartId(newCart.id);
            cartIdRef.current = newCart.id;
            setItems([]);
            itemsRef.current = [];
          }
        } else {
          console.error('[Cart] load failed:', res.status, await res.text());
        }
      } catch (e) {
        console.error('[Cart] load error:', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync current items to server via PATCH ────────────────────────────────

  const syncToServer = useCallback(async (newItems: CartItem[]) => {
    const id = cartIdRef.current;
    if (!id) {
      console.warn('[Cart] syncToServer skipped — no cartId yet');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/carts/${id}`, {
        method: 'PATCH',
        headers: makeHeaders(),
        body: JSON.stringify({ items: toServerItems(newItems) }),
      });
      if (!res.ok) {
        console.error('[Cart] PATCH failed:', res.status, await res.text());
      } else {
        console.log('[Cart] synced to server, cartId=', id, 'items=', newItems.length);
      }
    } catch (e) {
      console.error('[Cart] sync error:', e);
    }
  }, [makeHeaders]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const addItem = useCallback(async (newItem: Omit<CartItem, 'quantity'>, qty: number = 1) => {
    // Cache display info
    displayInfoRef.current.set(newItem.productId, {
      name: newItem.name,
      price: newItem.price,
      originalPrice: newItem.originalPrice,
      image: newItem.image,
    });

    // Compute new state from ref (not from setState closure to avoid stale capture)
    const prev = itemsRef.current;
    const existing = prev.find((i) => i.productId === newItem.productId);
    const updated = existing
      ? prev.map((i) => i.productId === newItem.productId ? { ...i, quantity: i.quantity + qty } : i)
      : [...prev, { ...newItem, quantity: qty }];

    itemsRef.current = updated;
    setItems(updated);
    await syncToServer(updated);
  }, [syncToServer]);

  const removeItem = useCallback(async (productId: number) => {
    const updated = itemsRef.current.filter((i) => i.productId !== productId);
    itemsRef.current = updated;
    setItems(updated);
    await syncToServer(updated);
  }, [syncToServer]);

  const updateQty = useCallback(async (productId: number, qty: number) => {
    const updated = qty <= 0
      ? itemsRef.current.filter((i) => i.productId !== productId)
      : itemsRef.current.map((i) => i.productId === productId ? { ...i, quantity: qty } : i);
    itemsRef.current = updated;
    setItems(updated);
    await syncToServer(updated);
  }, [syncToServer]);

  const clearCart = useCallback(async () => {
    itemsRef.current = [];
    setItems([]);
    await syncToServer([]);
  }, [syncToServer]);

  // ── Checkout: POST /orders ────────────────────────────────────────────────

  const checkout = useCallback(async (info: CheckoutInfo): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    const currentItems = itemsRef.current;
    if (currentItems.length === 0) {
      return { success: false, error: 'Giỏ hàng trống' };
    }

    const body = {
      user_id: userId ?? undefined,
      shipping_name: info.shipping_name,
      shipping_phone: info.shipping_phone,
      shipping_address: info.shipping_address,
      shipping_fee: info.shipping_fee ?? 30000,
      items: currentItems.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
        ...(i.selectedColor ? { color: i.selectedColor } : {}),
      })),
      payment_info: {
        method: info.payment_method ?? 'COD',
        status: 'pending',
      },
    };

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = 'Đặt hàng thất bại';
        try { msg = JSON.parse(text)?.message ?? msg; } catch { /* ignore */ }
        console.error('[Checkout] POST /orders failed:', res.status, text);
        return { success: false, error: msg };
      }

      const order = await res.json();
      console.log('[Checkout] Order created:', order.id);

      // Clear cart after successful order
      await clearCart();

      return { success: true, orderId: order.id };
    } catch (e: any) {
      console.error('[Checkout] error:', e);
      return { success: false, error: e?.message ?? 'Lỗi kết nối' };
    }
  }, [userId, makeHeaders, clearCart]);

  // ── Computed ──────────────────────────────────────────────────────────────

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, totalCount, totalPrice, isLoading, cartId,
      addItem, removeItem, updateQty, clearCart, checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
