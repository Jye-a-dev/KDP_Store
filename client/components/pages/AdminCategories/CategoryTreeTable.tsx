import { Category, CategoryNode } from "./types";
import CategoryTreeRow from "./CategoryTreeRow";

interface CategoryTreeTableProps {
  search: string;
  isLoading: boolean;
  filteredTree: CategoryNode[];
  onSearchChange: (value: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number, name: string) => void;
  draggedId: number | null;
  dragOverTarget: { id: number; position: "before" | "after" | "inside" } | null;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, id: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, id: number) => void;
  onDropOnRoot: () => void;
  isReordering: boolean;
}

export default function CategoryTreeTable({
  search,
  isLoading,
  filteredTree,
  onSearchChange,
  onEdit,
  onDelete,
  draggedId,
  dragOverTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onDropOnRoot,
  isReordering,
}: CategoryTreeTableProps) {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden relative">
      {isReordering && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 gap-2">
          <div className="w-6 h-6 border-3 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
          <span className="text-[12px] font-bold text-[#111]">Đang sắp xếp danh mục...</span>
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111] gap-4 flex-wrap">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
          Cây Danh Mục
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal normal-case">
            Kéo ☰ để di chuyển vị trí
          </span>
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
        <div className="p-4">
          <div className="overflow-x-auto border-2 border-[#111111] rounded-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#111111] bg-gray-50">
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
                    draggedId={draggedId}
                    dragOverTarget={dragOverTarget}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {draggedId !== null && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                onDragOver(e, 0); // Special ID 0 for root
              }}
              onDragLeave={onDragLeave}
              onDrop={(e) => {
                e.preventDefault();
                onDropOnRoot();
              }}
              className={`mt-4 border-2 border-dashed rounded-xl py-4 text-center text-[12px] font-bold transition-all ${
                dragOverTarget?.id === 0
                  ? "border-[#F8DE22] bg-[#F8DE22]/10 text-[#111] scale-[1.01]"
                  : "border-[#111111]/20 text-[#aaa] hover:border-[#111111]/40"
              }`}
            >
              📂 Thả vào đây để đưa về Danh mục Gốc (Root Level)
            </div>
          )}
        </div>
      )}
    </div>
  );
}
