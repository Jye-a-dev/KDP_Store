"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const getApiUrl = () => {
  const defaultApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      try {
        const url = new URL(defaultApiUrl);
        if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
          url.hostname = hostname;
          return url.origin;
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return defaultApiUrl;
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Không tìm thấy thông tin mã đơn hàng.");
      setIsLoading(false);
      return;
    }

    const confirmPaymentAndLoadOrder = async () => {
      const apiBase = getApiUrl();
      try {
        // 1. Update order status to paid on the backend
        const updateRes = await fetch(`${apiBase}/orders/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_info: {
              method: "MOMO",
              status: "paid",
              paid_at: new Date().toISOString(),
            },
          }),
        });

        if (!updateRes.ok) {
          throw new Error("Không thể xác nhận trạng thái thanh toán trên hệ thống.");
        }

        // 2. Fetch the updated order details
        const orderRes = await fetch(`${apiBase}/orders/${orderId}`);
        if (!orderRes.ok) {
          throw new Error("Không thể tải thông tin đơn hàng.");
        }

        const data = await orderRes.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
      } finally {
        setIsLoading(false);
      }
    };

    confirmPaymentAndLoadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#03AED2] border-t-transparent mb-4"></div>
        <p className="font-extrabold uppercase text-xs tracking-wider text-[#111111]">Đang xác nhận thanh toán...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto bg-white">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-lg font-black text-[#D12052] uppercase tracking-wide">Thanh toán thất bại</h2>
        <p className="text-xs font-semibold text-gray-500 mt-2 mb-6">{error ?? "Đơn hàng không hợp lệ hoặc đã bị hủy."}</p>
        <Link
          href="/"
          className="px-6 py-3 border-2 border-[#111111] bg-[#111111] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_#D12052] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#D12052] transition-all"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-10 px-4 flex flex-col items-center bg-white min-h-[80vh] justify-center">
      {/* Success Card */}
      <div className="w-full bg-white border-4 border-[#111111] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#111111] flex flex-col items-center text-center">
        {/* Animated Checkmark Circle */}
        <div className="w-20 h-20 bg-[#C8FFD4] border-4 border-[#111111] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#111111] mb-6 animate-bounce">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className="text-xl md:text-2xl font-black text-[#111111] uppercase tracking-wide leading-tight">
          Xác Nhận Thanh Toán Thành Công
        </h1>

        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2">
          Cảm ơn bạn đã mua sắm tại KDP Store
        </p>

        {/* Divider */}
        <div className="w-full border-t-2 border-dashed border-[#111111]/20 my-6"></div>

        {/* Order Details */}
        <div className="w-full flex flex-col gap-3.5 text-left bg-[#f7f9fa] border-2 border-[#111111] rounded-2xl p-4 md:p-5 shadow-[3px_3px_0px_#111111]">
          <div className="flex justify-between items-center text-xs border-b border-[#111111]/10 pb-2">
            <span className="font-bold text-gray-500 uppercase text-[10px]">Mã Đơn Hàng</span>
            <span className="font-extrabold text-[#111111] font-mono select-all truncate max-w-45">{order.id}</span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-[#111111]/10 pb-2">
            <span className="font-bold text-gray-500 uppercase text-[10px]">Trạng Thái Thanh Toán</span>
            <span className="bg-[#C8FFD4] border border-[#111111]/20 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
              Đã Thanh Toán (MoMo)
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-[#111111]/10 pb-2">
            <span className="font-bold text-gray-500 uppercase text-[10px]">Tổng Thanh Toán</span>
            <span className="font-black text-[#D12052]">{Number(order.final_amount).toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex flex-col text-xs pt-1.5">
            <span className="font-bold text-gray-500 uppercase mb-1 text-[10px]">Địa Chỉ Nhận Hàng</span>
            <span className="font-bold text-[#111111]">{order.shipping_name} - {order.shipping_phone}</span>
            <span className="text-gray-600 mt-0.5">{order.shipping_address}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3.5 bg-[#F8DE22] text-[#111111] font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/dashboard/customer/orders"
            className="flex-1 py-3.5 bg-white text-[#111111] font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
          >
            Lịch sử đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#03AED2] border-t-transparent mb-4"></div>
        <p className="font-extrabold uppercase text-xs tracking-wider text-[#111111]">Đang tải...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
