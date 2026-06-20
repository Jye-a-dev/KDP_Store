import { Category, CategoryNode } from "./types";
import CategoryTreeRow from "./CategoryTreeRow";

interface CategoryTreeTableProps {
  search: string;
  isLoading: boolean;
  filteredTree: CategoryNode[];
  onSearchChange: (value: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number, name: string) => void;
}

export default function CategoryTreeTable({
  search,
  isLoading,
  filteredTree,
  onSearchChange,
  onEdit,
  onDelete,
}: CategoryTreeTableProps) {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111] gap-4 flex-wrap">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111111]">
          Cây Danh Mục
        </h2>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm tên hoặc slug..."
            className="border-2 border-[#111111] py-2 pl-9 pr-4 rounded-xl text-[12px] font-semibold outline-none focus:bg-[#f7f9fa] w-56"
          />
          <svg className="absolute left-3 top-2.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
        </div>
      ) : filteredTree.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <span className="text-4xl">🗂️</span>
          <p className="text-[13px] font-bold text-[#555]">Không có danh mục nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#111111]/10">
                {["Tên Danh Mục", "Slug", "Cấp", "Navbar", "Hành Động"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTree.map((node) => (
                <CategoryTreeRow
                  key={node.id}
                  node={node}
                  depth={0}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
