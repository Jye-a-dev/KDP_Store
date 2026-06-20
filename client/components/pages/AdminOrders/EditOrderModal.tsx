"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/api";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSuccess: () => void;
  updateOrder: (id: string, body: any) => Promise<void>;
}

export default function EditOrderModal({
  isOpen,
  onClose,
  order,
  onSuccess,
  updateOrder,
}: EditOrderModalProps) {
  // Edit order states
  const [editShippingName, setEditShippingName] = useState("");
  const [editShippingPhone, setEditShippingPhone] = useState("");
  const [editShippingAddress, setEditShippingAddress] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editOrderStatus, setEditOrderStatus] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize fields when order or modal opens
  useEffect(() => {
    if (isOpen && order) {
      setEditShippingName(order.shipping_name || "");
      setEditShippingPhone(order.shipping_phone || "");
      setEditShippingAddress(order.shipping_address || "");
      setEditPaymentMethod(order.payment_info?.method || "COD");
      setEditPaymentStatus(order.payment_info?.status || "pending");
      setEditOrderStatus(order.order_status || "pending");
      setEditError(null);
    }
  }, [isOpen, order]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setEditError(null);
    setIsUpdating(true);

    try {
      const body = {
        order_status: editOrderStatus,
        shipping_name: editShippingName,
        shipping_phone: editShippingPhone,
        shipping_address: editShippingAddress,
        payment_info: {
          method: editPaymentMethod,
          status: editPaymentStatus,
        },
      };

      await updateOrder(order.id, body);
      onSuccess();
      onClose();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Cập nhật thất bại"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-2xl shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#111111] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#111111]">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#F8DE22]/80">
              Xem & Cập Nhật Đơn Hàng
            </p>
            <h3 className="font-extrabold uppercase tracking-wider text-sm mt-0.5">
              #{order.id.toUpperCase()}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white text-lg font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleEditSubmit}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
        >
          {editError && (
            <div className="p-3 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
              ⚠️ {editError}
            </div>
          )}

          {/* Items List */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111] mb-2.5">
              Sản Phẩm Đã Đặt
            </h4>
            <div className="flex flex-col gap-2">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#f7f9fa] border-2 border-[#111111] rounded-lg flex items-center justify-center text-md shrink-0">
                      🛍️
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111111] uppercase line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-gray-500 font-semibold">
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

          {/* Recipient details edit */}
          <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
              Thông Tin Giao Hàng & Nhận Hàng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                  Họ tên người nhận
                </label>
                <input
                  type="text"
                  required
                  value={editShippingName}
                  onChange={(e) => setEditShippingName(e.target.value)}
                  className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  required
                  value={editShippingPhone}
                  onChange={(e) => setEditShippingPhone(e.target.value)}
                  className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                Địa chỉ chi tiết
              </label>
              <textarea
                required
                rows={2}
                value={editShippingAddress}
                onChange={(e) => setEditShippingAddress(e.target.value)}
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] resize-none"
              />
            </div>
          </div>

          {/* Payment & Status edit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#111111]/10 pt-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                Phương thức thanh toán
              </label>
              <select
                value={editPaymentMethod}
                onChange={(e) => setEditPaymentMethod(e.target.value)}
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
              >
                <option value="COD">COD</option>
                <option value="MOMO">MoMo</option>
                <option value="VNPAY">VNPAY</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                Trạng thái thanh toán
              </label>
              <select
                value={editPaymentStatus}
                onChange={(e) => setEditPaymentStatus(e.target.value)}
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
              >
                <option value="pending">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                Trạng thái đơn hàng
              </label>
              <select
                value={editOrderStatus}
                onChange={(e) => setEditOrderStatus(e.target.value)}
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang giao</option>
                <option value="delivered">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Bill Details & Submit */}
          <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-4">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Tổng tiền hàng:</span>
              <span>{Number(order.total_amount).toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Phí vận chuyển:</span>
              <span>{Number(order.shipping_fee).toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#111111] border-t border-[#111111] pt-2">
              <span>TỔNG CỘNG ĐƠN HÀNG:</span>
              <span className="text-[#D12052] font-black">
                {Number(order.final_amount).toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border-2 border-[#111111] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-50 cursor-pointer text-center"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-3 bg-[#03AED2] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isUpdating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Lưu Thay Đổi"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
