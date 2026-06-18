interface AdminQuickActionsProps {
  onAddCategory: () => void;
  onAddProduct: () => void;
}

export default function AdminQuickActions({ onAddCategory, onAddProduct }: AdminQuickActionsProps) {
  return (
    <div className="flex items-center gap-3 px-[5%] mb-6 flex-wrap bg-[#F8DE22]/10 border-2 border-[#111111] p-3 rounded-2xl mx-[5%] shadow-[3px_3px_0px_#111111]">
      <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mr-2">
        🛠️ BẢNG ĐIỀU KHIỂN ADMIN:
      </span>
      <button
        onClick={onAddCategory}
        className="bg-[#111111] text-white px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border-2 border-[#111111] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#D12052]"
      >
        + Thêm Danh Mục
      </button>
      <button
        onClick={onAddProduct}
        className="bg-[#03AED2] text-white px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border-2 border-[#111111] hover:bg-white hover:text-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#111111]"
      >
        + Thêm Sản Phẩm
      </button>
    </div>
  );
}
