import { useState } from "react";
import { Category, CategoryNode } from "./types";
import { flattenForSelect } from "./helpers";
import { useCategories } from "@/hooks/useCategories";

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
  const { createCategory, updateCategory, isLoading: hookLoading, error: hookError } = useCategories();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [parentId, setParentId] = useState<string>(
    category?.parent_id !== null && category?.parent_id !== undefined
      ? String(category.parent_id)
      : ""
  );
  const [showOnNavbar, setShowOnNavbar] = useState(category?.show_on_navbar ?? false);
  const [error, setError] = useState("");

  const parentOptions = flattenForSelect(tree, 0, category?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }
    setError("");

    const pId = parentId !== "" ? Number(parentId) : null;

    try {
      if (mode === "create") {
        await createCategory(name.trim(), pId, showOnNavbar, slug);
      } else {
        await updateCategory(category!.id, name.trim(), pId, showOnNavbar, slug);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const displayError = error || hookError || "";
  const loading = hookLoading;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#111111]">
          <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#111111]">
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
          {displayError && (
            <div className="p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold rounded-lg">
              ⚠️ {displayError}
            </div>
          )}

          {/* Tên */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Tên danh mục <span className="text-[#D12052]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Áo Thun Oversize"
              className="border-2 border-[#111111] py-2.5 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Đường dẫn tĩnh (Slug) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="VD: ao-thun-oversize (Để trống sẽ sinh tự động)"
              className="border-2 border-[#111111] py-2.5 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Parent */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Thuộc danh mục cha
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="border-2 border-[#111111] py-2.5 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa] bg-white cursor-pointer"
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

          {/* Hiển thị trên Navbar */}
          <div className="flex items-center gap-2.5 py-1">
            <input
              type="checkbox"
              id="show_on_navbar"
              checked={showOnNavbar}
              onChange={(e) => setShowOnNavbar(e.target.checked)}
              className="w-4 h-4 accent-[#03AED2] cursor-pointer"
            />
            <label
              htmlFor="show_on_navbar"
              className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] cursor-pointer select-none"
            >
              Hiển thị trên Navbar
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#f7f9fa] transition-all cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#111111] text-white border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer shadow-[3px_3px_0px_#D12052] disabled:opacity-60"
            >
              {loading ? "Đang lưu..." : mode === "create" ? "Tạo Mới" : "Lưu Lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
