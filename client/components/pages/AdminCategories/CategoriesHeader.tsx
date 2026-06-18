interface CategoriesHeaderProps {
  totalCount: number;
  rootCount: number;
  subCount: number;
  onAddCategory: () => void;
}

export default function CategoriesHeader({
  totalCount,
  rootCount,
  subCount,
  onAddCategory,
}: CategoriesHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#03AED2] mb-1">
          Admin Panel
        </p>
        <h1 className="text-3xl font-extrabold uppercase text-[#111] leading-tight">
          Quản Lý <mark className="bg-[#F8DE22] px-2 py-0.5">Danh Mục</mark>
        </h1>
        <p className="mt-1 text-sm text-[#555]">
          {totalCount} danh mục · {rootCount} gốc · {subCount} danh mục con
        </p>
      </div>
      <button
        type="button"
        onClick={onAddCategory}
        className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl border-2 border-[#111] text-[12px] font-extrabold uppercase hover:bg-[#F8DE22] hover:text-[#111] transition-all cursor-pointer shadow-[3px_3px_0px_#D12052]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Thêm Danh Mục
      </button>
    </div>
  );
}
