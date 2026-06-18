import { Category } from "@/types/api";

interface ProductFilterBarProps {
  categories: Category[];
  selectedCategory: number | null;
  searchQuery: string;
  isAdmin: boolean;
  onSelectCategory: (id: number | null) => void;
  onSearchChange: (query: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: number, name: string) => void;
}

export default function ProductFilterBar({
  categories,
  selectedCategory,
  searchQuery,
  isAdmin,
  onSelectCategory,
  onSearchChange,
  onEditCategory,
  onDeleteCategory,
}: ProductFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-[5%] mb-8">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => onSelectCategory(null)}
          className={`font-bold uppercase text-[11px] tracking-[0.5px] px-5 py-2.5 border-2 border-[#111111] transition-all duration-300 ${
            selectedCategory === null
              ? "bg-[#D12052] text-white border-[#D12052] shadow-[2px_2px_0px_#111111]"
              : "bg-white text-[#111111] hover:bg-[#F8DE22]"
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <div key={cat.id} className="relative group/cat">
            <button
              onClick={() => onSelectCategory(cat.id)}
              className={`font-bold uppercase text-[11px] tracking-[0.5px] px-5 py-2.5 border-2 border-[#111111] transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-[#D12052] text-white border-[#D12052] shadow-[2px_2px_0px_#111111]"
                  : "bg-white text-[#111111] hover:bg-[#F8DE22]"
              }`}
            >
              {cat.name}
            </button>
            {isAdmin && (
              <div className="absolute -top-2 -right-2 hidden group-hover/cat:flex gap-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(cat);
                  }}
                  className="w-5 h-5 bg-[#F8DE22] border-2 border-[#111111] rounded flex items-center justify-center text-[10px] cursor-pointer shadow-[1px_1px_0px_#111111]"
                  title="Sửa danh mục"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        `Bạn có chắc muốn xóa danh mục "${cat.name}"? Các danh mục con sẽ trở thành danh mục gốc.`
                      )
                    ) {
                      onDeleteCategory(cat.id, cat.name);
                    }
                  }}
                  className="w-5 h-5 bg-[#D12052] text-white border-2 border-[#111111] rounded flex items-center justify-center text-[10px] cursor-pointer shadow-[1px_1px_0px_#111111]"
                  title="Xóa danh mục"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border-2 border-[#111111] bg-white py-3 px-5 pl-12 text-sm text-[#111111] font-semibold outline-none shadow-[3px_3px_0px_#111111] focus:bg-[#f7f9fa]"
        />
        <div className="absolute left-4 top-3.5 text-[#111111]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
