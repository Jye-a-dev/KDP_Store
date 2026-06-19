import { useState } from "react";
import { Category, CategoryNode } from "./types";

interface CategoryTreeRowProps {
  node: CategoryNode;
  depth: number;
  onEdit: (c: Category) => void;
  onDelete: (id: number, name: string) => void;
}

export default function CategoryTreeRow({
  node,
  depth,
  onEdit,
  onDelete,
}: CategoryTreeRowProps) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <>
      <tr className="border-b border-[#111111]/5 hover:bg-[#f7f9fa] transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren ? (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-5 h-5 flex items-center justify-center text-[#aaa] hover:text-[#111] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d={open ? "M19 9l-7 7-7-7" : "M9 18l6-6-6-6"} />
                </svg>
              </button>
            ) : (
              <span className="w-5 h-5 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc]" />
              </span>
            )}
            <span className="text-[13px] font-bold text-[#111]">{node.name}</span>
            {node.children.length > 0 && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-[#03AED2]/10 text-[#03AED2] rounded">
                {node.children.length} con
              </span>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <code className="text-[11px] bg-[#f7f9fa] px-2 py-0.5 rounded border border-[#eee] text-[#555]">
            {node.slug}
          </code>
        </td>
        <td className="px-4 py-3 text-[11px] text-[#aaa]">
          {node.parent_id === null ? (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#F8DE22] text-[#111] rounded">Gốc</span>
          ) : (
            <span className="text-[#555]">ID #{node.parent_id}</span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(node)}
              className="text-[10px] font-extrabold uppercase px-3 py-1.5 bg-[#111] text-white rounded-lg hover:bg-[#F8DE22] hover:text-[#111] transition-all cursor-pointer"
            >
              Sửa
            </button>
            <button
              type="button"
              onClick={() => onDelete(node.id, node.name)}
              className="text-[10px] font-extrabold uppercase px-3 py-1.5 bg-[#D12052]/10 text-[#D12052] rounded-lg hover:bg-[#D12052] hover:text-white transition-all cursor-pointer"
            >
              Xóa
            </button>
          </div>
        </td>
      </tr>
      {open &&
        node.children.map((child) => (
          <CategoryTreeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}
