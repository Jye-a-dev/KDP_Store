"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleteKeyName?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  deleteKeyName,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#E11D48] border-2 border-[#111111] rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
            Xác nhận xóa khoá cấu hình
          </h3>
        </div>

        <p className="text-xs text-[#444] font-semibold leading-relaxed">
          Bạn có chắc chắn muốn xoá vĩnh viễn khoá cấu hình{" "}
          <code className="font-mono bg-red-50 text-[#E11D48] border border-red-100 px-1.5 py-0.5 rounded font-black break-all">
            {deleteKeyName}
          </code>
          ? Hành động này sẽ loại bỏ nội dung cấu hình và có thể ảnh hưởng tới giao diện hiển thị của người dùng.
        </p>

        <div className="flex justify-end gap-3 mt-2.5 pt-4 border-t border-[#111111]/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 bg-[#E11D48] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] cursor-pointer transition-all"
          >
            Xác nhận xoá
          </button>
        </div>
      </div>
    </div>
  );
}
