"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/api";
import { AuthUser } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  selectedColor: string;
  mainImage: string;
  token: string | null;
  user: AuthUser | null;
  onSuccess: (msg: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  product,
  quantity,
  selectedColor,
  mainImage,
  token,
  user,
  onSuccess,
}: CheckoutModalProps) {
  const router = useRouter();

  // Checkout modal states
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Pre-fill shipping info when user is loaded / modal opens
  useEffect(() => {
    if (user && isOpen) {
      setShippingName(user.full_name || "");
      setShippingPhone(user.phone || "");
      setShippingAddress("");
      setPaymentMethod("COD");
      setCheckoutError(null);
    }
  }, [user, isOpen]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingPhone || !shippingAddress) {
      setCheckoutError("Vui lòng nhập đầy đủ thông tin giao hàng.");
      return;
    }
    setCheckoutError(null);
    setIsSubmitting(true);

    try {
      const body = {
        user_id: user?.id,
        items: [
          {
            product_id: product.id,
            quantity: quantity,
            color: selectedColor || "Mặc định",
          },
        ],
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

      onSuccess("🎉 Đặt hàng thành công! Đang chuyển hướng...");
      onClose();
      setTimeout(() => {
        router.push("/dashboard/customer/orders");
      }, 2000);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const images = (images2d: string[] | string): string[] => {
    if (Array.isArray(images2d)) return images2d;
    try {
      const parsed = JSON.parse(images2d);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return typeof images2d === "string" && images2d ? [images2d] : [];
  };

  const productImages = images(product.images_2d);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-lg shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#111111] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#111111]">
          <h3 className="font-extrabold uppercase tracking-wider text-sm">Xác Nhận Đặt Hàng Nhanh</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-lg font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {checkoutError && (
            <div className="p-3.5 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
              ⚠️ {checkoutError}
            </div>
          )}

          {/* Product Info Summary */}
          <div className="flex gap-4 p-3 bg-[#f7f9fa] border-2 border-[#111111] rounded-2xl">
            <div className="w-16 h-16 bg-white border-2 border-[#111111] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainImage || productImages[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-[#111111] truncate uppercase">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-bold uppercase">
                <span>Màu:</span>
                <span className="w-3 h-3 rounded-full border border-black/10 inline-block" style={{ backgroundColor: selectedColor || "#D12052" }} />
                <span className="ml-2">SL: {quantity}</span>
              </div>
              <p className="font-extrabold text-[#D12052] text-xs mt-1">
                {(Math.round(Number(product.price)) * quantity).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          {/* Delivery Form */}
          <div className="flex flex-col gap-3.5">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Thông Tin Giao Hàng</h5>
            
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">Họ và tên người nhận</label>
              <input
                type="text"
                required
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">Số điện thoại</label>
              <input
                type="tel"
                required
                value={shippingPhone}
                onChange={(e) => setShippingPhone(e.target.value)}
                placeholder="09XXXXXXXX"
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">Địa chỉ chi tiết</label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] resize-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-2">
            <h5 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Phương Thức Thanh Toán</h5>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`border-2 rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === "COD" ? "border-[#03AED2] bg-[#03AED2]/5 font-bold" : "border-[#111111] hover:bg-neutral-50"
                }`}
              >
                <input type="radio" checked={paymentMethod === "COD"} readOnly className="accent-[#03AED2]" />
                <span className="text-xs uppercase tracking-wider">COD (Tiền mặt)</span>
              </div>
              <div
                onClick={() => setPaymentMethod("MOMO")}
                className={`border-2 rounded-xl p-3 flex items-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === "MOMO" ? "border-[#03AED2] bg-[#03AED2]/5 font-bold" : "border-[#111111] hover:bg-neutral-50"
                }`}
              >
                <input type="radio" checked={paymentMethod === "MOMO"} readOnly className="accent-[#03AED2]" />
                <span className="text-xs uppercase tracking-wider">MoMo</span>
              </div>
            </div>
          </div>

          {/* Bill Details */}
          <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Tiền sản phẩm:</span>
              <span>{(Math.round(Number(product.price)) * quantity).toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Phí vận chuyển:</span>
              <span>30.000đ</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#111111] border-t border-[#111111] pt-2">
              <span>TỔNG THANH TOÁN:</span>
              <span>{((Math.round(Number(product.price)) * quantity) + 30000).toLocaleString("vi-VN")}đ</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-[#D12052] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Xác Nhận Thanh Toán
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
