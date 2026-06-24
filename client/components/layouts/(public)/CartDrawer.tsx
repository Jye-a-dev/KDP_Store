"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CartCheckoutForm from "./CartCheckoutForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function CartDrawer() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New MoMo States
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [showMomoQr, setShowMomoQr] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Sync user info for checkout
  useEffect(() => {
    if (user) {
      setShippingName(user.full_name || "");
      setShippingPhone(user.phone || "");
    }
  }, [user]);

  // Reset states when drawer closes/opens
  useEffect(() => {
    if (!isCartOpen) {
      if (showMomoQr && createdOrder?.id) {
        fetch(`${API_URL}/orders/${createdOrder.id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).catch((err) => console.error("Lỗi khi xóa đơn hàng khi đóng:", err));
      }
      setStep("cart");
      setCheckoutError(null);
      setSuccessMsg(null);
      setCreatedOrder(null);
      setShowMomoQr(false);
      setIsPolling(false);
    }
  }, [isCartOpen, showMomoQr, createdOrder, token, API_URL]);

  // Poll order status if MoMo payment is pending
  useEffect(() => {
    if (!isPolling || !createdOrder?.id) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${createdOrder.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.payment_info?.status === "paid") {
            setIsPolling(false);
            setShowMomoQr(false);
            setSuccessMsg("🎉 Đã nhận được thanh toán MoMo! Đang chuyển hướng...");
            clearCart();
            setTimeout(() => {
              setIsCartOpen(false);
              router.push("/dashboard/customer/orders");
            }, 2000);
          }
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái thanh toán:", err);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isPolling, createdOrder, API_URL, clearCart, setIsCartOpen, router]);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      router.push("/login");
      return;
    }
    setStep("checkout");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingPhone || !shippingAddress) {
      setCheckoutError("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }
    setCheckoutError(null);
    setIsSubmitting(true);

    try {
      const body = {
        user_id: user?.id,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          color: item.color || "Mặc định",
        })),
        shipping_fee: 30000,
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
        payment_info: {
          method: paymentMethod,
          status: "pending",
        },
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = (await res.json()) as { message?: string };
        throw new Error(errData.message || "Đặt hàng thất bại.");
      }

      const created = await res.json();

      if (paymentMethod === "MOMO") {
        setCreatedOrder(created);
        setShowMomoQr(true);
        setIsPolling(true);
      } else {
        setSuccessMsg("🎉 Đặt hàng thành công! Đang chuyển hướng...");
        clearCart();
        setTimeout(() => {
          setIsCartOpen(false);
          router.push("/dashboard/customer/orders");
        }, 2000);
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-150 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md bg-white border-l-4 border-[#111111] h-full shadow-[-8px_0px_0px_#111111] flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b-4 border-[#111111]">
          <div>
            <h3 className="font-extrabold uppercase tracking-wider text-sm">
              {step === "cart" ? "Giỏ Hàng Của Bạn" : "Thông Tin Thanh Toán"}
            </h3>
            {step === "cart" && (
              <p className="text-[10px] text-[#F8DE22] font-bold uppercase mt-0.5">
                {cartCount} sản phẩm
              </p>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-white/70 hover:text-white text-lg font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {successMsg ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-5xl mb-4">🎉</span>
            <h4 className="text-lg font-black text-emerald-600 uppercase tracking-wide">Đặt Hàng Thành Công!</h4>
            <p className="text-xs text-gray-500 font-semibold mt-2">{successMsg}</p>
          </div>
        ) : showMomoQr && createdOrder ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-full max-w-xs bg-white border-4 border-[#111111] rounded-3xl p-5 shadow-[4px_4px_0px_#111111] flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D12052] mb-1">
                Thanh toán qua MoMo
              </span>
              <h4 className="text-xs font-black uppercase text-gray-700 mb-4">
                Quét mã QR bằng điện thoại
              </h4>

              {/* QR Image container */}
              <div className="w-48 h-48 border-2 border-[#111111] bg-white p-2 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#111111] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    `${typeof window !== "undefined" ? window.location.origin : ""}/payment-success?order_id=${createdOrder.id}`
                  )}`}
                  alt="Momo QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Status indicator */}
              <div className="mt-4 flex items-center gap-2 bg-[#03AED2]/10 border border-[#03AED2]/30 px-3 py-1.5 rounded-lg">
                <span className="h-2.5 w-2.5 bg-[#03AED2] rounded-full animate-ping"></span>
                <span className="text-[9px] font-extrabold text-[#03AED2] uppercase tracking-wider">
                  Đang chờ quét mã...
                </span>
              </div>

              <div className="mt-4 text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-relaxed">
                Sau khi quét bằng điện thoại, hệ thống sẽ tự động cập nhật và chuyển hướng.
              </div>
            </div>

            <button
              onClick={async () => {
                if (createdOrder?.id) {
                  try {
                    await fetch(`${API_URL}/orders/${createdOrder.id}`, {
                      method: "DELETE",
                      headers: token ? { Authorization: `Bearer ${token}` } : {},
                    });
                  } catch (err) {
                    console.error("Lỗi khi xóa đơn hàng MoMo hủy:", err);
                  }
                }
                setShowMomoQr(false);
                setIsPolling(false);
                setCreatedOrder(null);
                setStep("checkout");
              }}
              className="mt-6 px-6 py-2.5 border-2 border-[#111111] text-[#111111] hover:bg-neutral-50 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Hủy & Chọn Phương Thức Khác
            </button>
          </div>
        ) : step === "cart" ? (
          // STEP 1: CART ITEMS
          <>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <span className="text-4xl mb-3">🛍️</span>
                  <p className="text-sm font-bold text-[#555]">Giỏ hàng của bạn đang trống</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer rounded-xl"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.color}`}
                    className="flex gap-4 p-3 border-2 border-[#111111] rounded-2xl bg-[#f7f9fa] shadow-[2px_2px_0px_#111111]"
                  >
                    <div className="w-16 h-16 bg-white border-2 border-[#111111] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-xs text-[#111111] uppercase truncate">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id, item.color)}
                            className="text-gray-400 hover:text-[#D12052] transition-colors cursor-pointer"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500 font-bold uppercase">
                          <span>Màu:</span>
                          <span className="w-3 h-3 rounded-full border border-black/10 inline-block" style={{ backgroundColor: item.color }} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-white border border-[#111111]/20 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-xs font-bold text-[#111111] hover:bg-neutral-100 transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 text-[11px] font-extrabold text-[#555] select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}
                            className="px-2 py-1 text-xs font-bold text-[#111111] hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-extrabold text-[#D12052] text-xs">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer calculations & CTAs */}
            {cartItems.length > 0 && (
              <div className="border-t-4 border-[#111111] p-5 flex flex-col gap-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">TỔNG TIỀN HÀNG:</span>
                  <span className="text-lg font-black text-[#111111]">{cartTotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-[#F8DE22] text-[#111111] font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
                >
                  Tiến Hành Thanh Toán
                </button>
              </div>
            )}
          </>
        ) : (
          // STEP 2: CHECKOUT FORM
          <CartCheckoutForm
            shippingName={shippingName}
            setShippingName={setShippingName}
            shippingPhone={shippingPhone}
            setShippingPhone={setShippingPhone}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cartTotal={cartTotal}
            isSubmitting={isSubmitting}
            checkoutError={checkoutError}
            onSubmit={handleCheckoutSubmit}
            onBackToCart={() => setStep("cart")}
          />
        )}
      </div>
    </div>
  );
}
