"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
  slug: string;
}

interface CartContextValue {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: number, color: string) => void;
  updateQuantity: (id: number, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage based on user state
  useEffect(() => {
    const key = user?.id ? `kdp_cart_${user.id}` : "kdp_cart_guest";
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    }
  }, [user?.id]);

  // Persist cart items
  const saveCart = useCallback((items: CartItem[]) => {
    const key = user?.id ? `kdp_cart_${user.id}` : "kdp_cart_guest";
    localStorage.setItem(key, JSON.stringify(items));
    setCartItems(items);
  }, [user?.id]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">, qty: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === item.id && i.color === item.color);
      let updated: CartItem[];
      if (existingIdx > -1) {
        updated = [...prev];
        updated[existingIdx].quantity += qty;
      } else {
        updated = [...prev, { ...item, quantity: qty }];
      }
      saveCart(updated);
      return updated;
    });
  }, [saveCart]);

  const removeFromCart = useCallback((id: number, color: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => !(i.id === id && i.color === color));
      saveCart(updated);
      return updated;
    });
  }, [saveCart]);

  const updateQuantity = useCallback((id: number, color: string, qty: number) => {
    setCartItems((prev) => {
      const updated = prev.map((i) => (i.id === id && i.color === color ? { ...i, quantity: Math.max(qty, 1) } : i));
      saveCart(updated);
      return updated;
    });
  }, [saveCart]);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

  const cartTotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
