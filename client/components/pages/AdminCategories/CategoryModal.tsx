import { useState } from "react";
import { Category, CategoryNode } from "./types";
import { flattenForSelect } from "./helpers";

interface CategoryModalProps {
  mode: "create" | "edit";
  category?: Category;
  tree: CategoryNode[];
  token: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function CategoryModal({
  mode,
  category,
  tree,
  token,
  onClose,
  onSaved,
}: CategoryModalProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const [name, setName] = useState(category?.name ?? "");
  const [parentId, setParentId] = useState<string>(
    category?.parent_id !== null && category?.parent_id !== undefined
      ? String(category.parent_id)
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parentOptions = flattenForSelect(tree, 0, category?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }
    setLoading(true);
    setError("");

    const body: { name: string; parent_id?: number | null } = { name: name.trim() };
    if (parentId !== "") body.parent_id = Number(parentId);
    else body.parent_id = null;

    try {
      const res = await fetch(
        mode === "create"
          ? `${API_URL}/categories`
          : `${API_URL}/categories/${category!.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? "Có lỗi xảy ra");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#11] rounded-2xl shadow-[8px_8px_0px_#11] w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#11]">
          <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#11]">
            {mode === "create" ? "Thêm Danh Mục Mới" : "Chỉnh Sửa Danh Mục"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f9fa] transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {/* Tên */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#11]">
              Tên danh mục <span className="text-[#D12052]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Áo Thun Oversize"
              className="border-2 border-[#11] py-2.5 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Parent */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#11]">
              Thuộc danh mục cha
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="border-2 border-[#11] py-2.5 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa] bg-white cursor-pointer"
            >
              <option value="">— Danh mục gốc —</option>
              {parentOptions.map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#aaa]">Để trống nếu đây là danh mục cấp 1</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#11] text-[12px] font-extrabold uppercase hover:bg-[#f7f9fa] transition-all cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#11] text-white border-2 border-[#11] text-[12px] font-extrabold uppercase hover:bg-[#F8DE22] hover:text-[#11] transition-all cursor-pointer shadow-[3px_3px_0px_#D12052] disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : mode === "create" ? "Tạo Mới" : "Lưu Lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
