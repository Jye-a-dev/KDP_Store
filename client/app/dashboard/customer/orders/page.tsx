"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { Order } from "@/types/api";

const STATUS_MAP: Record<string, { label: string; color: string; border: string }> = {
  pending: { label: "Chờ xác nhận", color: "text-[#111111] bg-[#F8DE22]/20", border: "border-[#F8DE22]/40" },
  processing: { label: "Đang giao hàng", color: "text-[#03AED2] bg-[#03AED2]/10", border: "border-[#03AED2]/30" },
  delivered: { label: "Hoàn thành", color: "text-green-600 bg-green-50", border: "border-green-200" },
  cancelled: { label: "Đã hủy", color: "text-[#D12052] bg-[#D12052]/10", border: "border-[#D12052]/30" },
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, isLoading, fetchCustomerOrders, updateOrderStatus } = useOrders();
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "processing" | "delivered" | "cancelled">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchCustomerOrders(user.id);
    }
  }, [user?.id, fetchCustomerOrders]);

  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true;
    return order.order_status === selectedTab;
  });

  const handleCancelClick = (orderId: string) => {
    setOrderToCancel(orderId);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      await updateOrderStatus(orderToCancel, "cancelled");
      // Update selected order in state if open
      if (selectedOrder && selectedOrder.id === orderToCancel) {
        setSelectedOrder({
          ...selectedOrder,
          order_status: "cancelled",
        });
      }
      // Re-fetch orders list
      if (user?.id) {
        await fetchCustomerOrders(user.id);
      }
      setOrderToCancel(null);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Không thể hủy đơn hàng");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8 px-4 pt-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/customer")}
        className="mb-6 inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Quay lại Dashboard
      </button>

      {/* Tabs / Filter Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "all", label: "Tất cả" },
          { id: "pending", label: "Chờ xác nhận" },
          { id: "processing", label: "Đang giao" },
          { id: "delivered", label: "Hoàn thành" },
          { id: "cancelled", label: "Đã hủy" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`border-2 border-[#111111] px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
              selectedTab === tab.id
                ? "bg-[#111111] text-white shadow-[2px_2px_0px_#F8DE22] scale-102"
                : "bg-white text-[#111111] hover:bg-neutral-50 shadow-[1px_1px_0px_#111111]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] p-6 mb-8">
        <h1 className="text-xl font-extrabold uppercase tracking-wider text-[#111111] mb-6">
          Lịch sử đơn hàng của bạn
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm font-bold text-[#555]">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const status = STATUS_MAP[order.order_status] ?? { label: order.order_status, color: "text-gray-500 bg-gray-100", border: "border-gray-200" };
              const firstItem = order.items?.[0];
              
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-[5px_5px_0px_#111111] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl border-2 border-[#111111] bg-[#f7f9fa] flex items-center justify-center text-xl shrink-0">
                      🛍️
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase text-[#999] mb-0.5">
                        #{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-sm font-extrabold text-[#111] truncate">
                        {firstItem ? `${firstItem.name}${order.items.length > 1 ? ` +${order.items.length - 1} sản phẩm` : ""}` : "—"}
                      </p>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">
                        Màu: {firstItem?.color || "Mặc định"} · Số lượng: {order.items.reduce((acc, it) => acc + (it.quantity || 1), 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 shrink-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-extrabold uppercase text-gray-400">Tổng thanh toán</p>
                      <p className="text-sm font-black text-[#D12052]">{Number(order.final_amount).toLocaleString("vi-VN")}đ</p>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${status.color} ${status.border} shrink-0`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-2xl shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#111111] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#111111]">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#F8DE22]/80">Chi Tiết Đơn Hàng</p>
                <h3 className="font-extrabold uppercase tracking-wider text-sm mt-0.5">#{selectedOrder.id.toUpperCase()}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setCancelError(null);
                }}
                className="text-white/70 hover:text-white text-lg font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cancelError && (
                <div className="p-3 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
                  ⚠️ {cancelError}
                </div>
              )}

              {/* Order Status Timeline Bar */}
              <div className="bg-[#f7f9fa] border-2 border-[#111111] rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-gray-500">Trạng thái hiện tại:</span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    STATUS_MAP[selectedOrder.order_status]?.color ?? "text-gray-500 bg-gray-100 border-gray-200"
                  }`}>
                    {STATUS_MAP[selectedOrder.order_status]?.label ?? selectedOrder.order_status}
                  </span>
                </div>
                {/* Horizontal progress indicators */}
                <div className="flex justify-between items-center relative mt-2 px-2">
                  <div className="absolute left-4 right-4 h-1 bg-gray-200 top-1/2 -translate-y-1/2 z-0" />
                  <div
                    className="absolute left-4 h-1 bg-[#03AED2] top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: selectedOrder.order_status === "pending" ? "0%" :
                             selectedOrder.order_status === "processing" ? "50%" :
                             selectedOrder.order_status === "delivered" ? "100%" : "0%"
                    }}
                  />
                  {[
                    { id: "pending", label: "Chờ duyệt" },
                    { id: "processing", label: "Đang giao" },
                    { id: "delivered", label: "Hoàn thành" },
                  ].map((step, idx) => {
                    const isPassed =
                      (selectedOrder.order_status === "pending" && idx === 0) ||
                      (selectedOrder.order_status === "processing" && idx <= 1) ||
                      (selectedOrder.order_status === "delivered" && idx <= 2);
                    const isCurrent = selectedOrder.order_status === step.id;

                    // If cancelled, show cancellation status instead
                    if (selectedOrder.order_status === "cancelled") {
                      return null;
                    }

                    return (
                      <div key={step.id} className="flex flex-col items-center z-10 relative">
                        <div className={`w-8 h-8 rounded-full border-2 border-[#111111] flex items-center justify-center font-extrabold text-xs transition-all ${
                          isPassed ? "bg-[#03AED2] text-white" : "bg-white text-gray-400"
                        } ${isCurrent ? "ring-4 ring-[#03AED2]/20" : ""}`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase mt-2.5 ${isPassed ? "text-[#111111]" : "text-gray-400"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}

                  {selectedOrder.order_status === "cancelled" && (
                    <div className="w-full flex items-center justify-center gap-2 py-2">
                      <div className="w-6 h-6 rounded-full bg-[#D12052] text-white flex items-center justify-center text-xs font-bold">✕</div>
                      <span className="text-xs font-black uppercase text-[#D12052]">Đơn hàng này đã bị hủy bỏ</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111] mb-3">Sản Phẩm Đã Mua</h4>
                <div className="flex flex-col gap-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f7f9fa] border-2 border-[#111111] rounded-xl flex items-center justify-center text-lg shrink-0">
                          🛍️
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111111] uppercase line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                            Màu: {item.color || "Mặc định"} · Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-extrabold text-[#111111] shrink-0">
                        {Number(item.price).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-b border-gray-100 py-4 my-2">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111] mb-2.5">Thông Tin Nhận Hàng</h4>
                  <div className="flex flex-col gap-1.5 text-xs font-medium text-gray-600">
                    <p className="font-bold text-[#111111]">Người nhận: {selectedOrder.shipping_name}</p>
                    <p>Điện thoại: {selectedOrder.shipping_phone}</p>
                    <p className="leading-relaxed">Địa chỉ: {selectedOrder.shipping_address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111] mb-2.5">Thanh Toán</h4>
                  <div className="flex flex-col gap-1.5 text-xs font-medium text-gray-600">
                    <p className="font-bold text-[#111111] uppercase">Phương thức: {selectedOrder.payment_info?.method}</p>
                    <p className="flex items-center gap-1.5">
                      Trạng thái: 
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-md border ${
                        selectedOrder.payment_info?.status === "paid"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {selectedOrder.payment_info?.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Tiền sản phẩm:</span>
                  <span>{Number(selectedOrder.total_amount).toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Phí vận chuyển:</span>
                  <span>{Number(selectedOrder.shipping_fee).toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#111111] border-t border-[#111111] pt-2">
                  <span>TỔNG THANH TOÁN:</span>
                  <span className="text-[#D12052] font-black">{Number(selectedOrder.final_amount).toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-2">
                {selectedOrder.order_status === "pending" && (
                  <button
                    onClick={() => handleCancelClick(selectedOrder.id)}
                    disabled={isCancelling}
                    className="flex-1 py-3 bg-[#D12052] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isCancelling ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Hủy Đơn Hàng"
                    )}
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-3 bg-white text-[#111111] font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Cancellation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-sm shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#D12052] text-white px-6 py-4 border-b-4 border-[#111111] flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h3 className="font-extrabold uppercase tracking-wider text-xs">Xác Nhận Hủy Đơn Hàng</h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <p className="text-xs text-gray-600 font-bold leading-relaxed">
                Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này sẽ trả lại các sản phẩm vào kho và không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOrderToCancel(null)}
                  className="flex-1 py-2.5 bg-white text-[#111111] font-extrabold text-[10px] uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
                >
                  Quay Lại
                </button>
                <button
                  type="button"
                  onClick={confirmCancelOrder}
                  className="flex-1 py-2.5 bg-[#D12052] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
                >
                  Xác Nhận Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
