"use client";

import { useState } from "react";

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  onSuccess: () => void;
  deleteOrder: (id: string) => Promise<void>;
}

export default function DeleteOrderModal({
  isOpen,
  onClose,
  orderId,
  onSuccess,
  deleteOrder,
}: DeleteOrderModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSubmit = async () => {
    if (!orderId) return;
    setIsDeleting(true);
    try {
      await deleteOrder(orderId);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xóa đơn hàng thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !orderId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-sm shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#D12052] text-white px-6 py-4 border-b-4 border-[#111111] flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <h3 className="font-extrabold uppercase tracking-wider text-xs">
            Xác Nhận Xóa Đơn Hàng
          </h3>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <p className="text-xs text-gray-600 font-bold leading-relaxed">
            Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác và đơn hàng sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white text-[#111111] font-extrabold text-[10px] uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
            >
              Quay Lại
            </button>
            <button
              type="button"
              onClick={handleDeleteSubmit}
              disabled={isDeleting}
              className="flex-1 py-2.5 bg-[#D12052] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Xác Nhận Xóa"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
