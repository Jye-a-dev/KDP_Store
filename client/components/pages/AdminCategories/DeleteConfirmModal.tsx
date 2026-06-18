interface DeleteConfirmModalProps {
  categoryName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ categoryName, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#11] rounded-2xl shadow-[8px_8px_0px_#D12052] w-full max-w-sm p-6">
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="text-[15px] font-extrabold uppercase text-[#11] mb-2">Xác Nhận Xóa</h3>
        <p className="text-sm text-[#555] mb-6">
          Bạn có chắc muốn xóa danh mục{" "}
          <strong>&quot;{categoryName}&quot;</strong>?
          <br />
          <span className="text-[#D12052] text-xs">Các danh mục con sẽ được chuyển thành danh mục gốc.</span>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#11] text-[12px] font-extrabold uppercase hover:bg-[#f7f9fa] cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#D12052] text-white border-2 border-[#D12052] text-[12px] font-extrabold uppercase hover:bg-[#B01040] transition-all cursor-pointer"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
