"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/api";

interface ProductEditFormProps {
  product: Product;
  setProduct: (p: Product) => void;
  categories: { id: number; name: string }[];
  token: string | null;
  setIsEditing: (b: boolean) => void;
  onSuccess: (msg: string) => void;
  router: any;
  productSlug: any;
  API_URL: string;
}

export default function ProductEditForm({
  product,
  setProduct,
  categories,
  token,
  setIsEditing,
  onSuccess,
  router,
  productSlug,
  API_URL,
}: ProductEditFormProps) {
  // Inline edit states
  const [editName, setEditName] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDiscountPrice, setEditDiscountPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editImages2d, setEditImages2d] = useState("");
  const [editModel3dUrl, setEditModel3dUrl] = useState("");
  const [editBadge, setEditBadge] = useState("None");
  const [editIsPublished, setEditIsPublished] = useState(true);
  const [inlineError, setInlineError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync edit states when product data updates
  useEffect(() => {
    if (product) {
      setEditName(product.name ?? "");
      setEditSku(product.sku ?? "");
      setEditPrice(product.price ? String(product.price) : "");
      setEditDiscountPrice(product.discount_price ? String(product.discount_price) : "");
      setEditDescription(product.description ?? "");
      setEditStock(product.stock ? String(product.stock) : "10");
      setEditCategoryId(
        product.category_id !== null && product.category_id !== undefined
          ? String(product.category_id)
          : ""
      );
      setEditModel3dUrl(product.model_3d_url ?? "");
      setEditBadge(product.badge ?? "None");
      setEditIsPublished(product.is_published ?? true);

      const imagesVal = Array.isArray(product.images_2d)
        ? product.images_2d.join(", ")
        : typeof product.images_2d === "string"
        ? product.images_2d
        : "";
      setEditImages2d(imagesVal);
    }
  }, [product]);

  const handleSaveInline = async () => {
    if (!editName.trim()) {
      setInlineError("Tên sản phẩm không được để trống");
      return;
    }
    if (!editSku.trim()) {
      setInlineError("Mã SKU không được để trống");
      return;
    }
    if (!editPrice.trim() || isNaN(Number(editPrice)) || Number(editPrice) < 0) {
      setInlineError("Giá sản phẩm phải là số dương hợp lệ");
      return;
    }
    if (editDiscountPrice.trim() && (isNaN(Number(editDiscountPrice)) || Number(editDiscountPrice) < 0)) {
      setInlineError("Giá khuyến mãi phải là số dương hợp lệ");
      return;
    }
    if (editDiscountPrice.trim() && editPrice.trim() && Number(editDiscountPrice) >= Number(editPrice)) {
      setInlineError("Giá khuyến mãi phải nhỏ hơn giá bán gốc");
      return;
    }

    setInlineError("");
    setIsSaving(true);

    const imgArray = editImages2d
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0);

    const body = {
      name: editName.trim(),
      sku: editSku.trim(),
      price: editPrice.trim(),
      discount_price: editDiscountPrice.trim() ? editDiscountPrice.trim() : null,
      description: editDescription.trim(),
      stock: Number(editStock),
      category_id: editCategoryId ? Number(editCategoryId) : null,
      is_published: editIsPublished,
      images_2d: imgArray,
      model_3d_url: editModel3dUrl.trim() || null,
      badge: editBadge === "None" ? null : editBadge.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? "Lỗi cập nhật sản phẩm");
      }

      const updatedProduct = await res.json();
      setProduct(updatedProduct);
      setIsEditing(false);
      onSuccess("🎉 Đã cập nhật sản phẩm thành công!");

      if (updatedProduct.slug !== productSlug) {
        router.replace(`/products/${updatedProduct.slug}`);
      }
    } catch (err) {
      setInlineError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-black uppercase text-[#D12052] border-b-2 border-[#111111]/10 pb-2">
        Chỉnh sửa inline (Admin)
      </h2>

      {inlineError && (
        <div className="p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
          ⚠️ {inlineError}
        </div>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
          Tên sản phẩm
        </label>
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      {/* Giá bán gốc & Giá khuyến mãi */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            Giá bán gốc (đ)
          </label>
          <input
            type="text"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            Giá khuyến mãi (đ)
          </label>
          <input
            type="text"
            value={editDiscountPrice}
            onChange={(e) => setEditDiscountPrice(e.target.value)}
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
          />
        </div>
      </div>

      {/* SKU & Tồn kho */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            SKU
          </label>
          <input
            value={editSku}
            onChange={(e) => setEditSku(e.target.value)}
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            Số lượng tồn kho
          </label>
          <input
            type="number"
            value={editStock}
            onChange={(e) => setEditStock(e.target.value)}
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
          />
        </div>
      </div>

      {/* Danh mục & Huy hiệu */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            Danh mục
          </label>
          <select
            value={editCategoryId}
            onChange={(e) => setEditCategoryId(e.target.value)}
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white cursor-pointer"
          >
            <option value="">— Chưa phân loại —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            Huy hiệu / Nhãn sản phẩm
          </label>
          <select
            value={editBadge}
            onChange={(e) => setEditBadge(e.target.value)}
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white cursor-pointer"
          >
            <option value="None">Không có (None)</option>
            <option value="New In">Mới (New In)</option>
            <option value="Sale Off">Giảm giá (Sale Off)</option>
            <option value="Limited">Giới hạn (Limited)</option>
          </select>
        </div>
      </div>

      {/* Model 3D URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
          Đường dẫn Model 3D (.glb)
        </label>
        <input
          value={editModel3dUrl}
          onChange={(e) => setEditModel3dUrl(e.target.value)}
          placeholder="VD: /models/sofa.glb"
          className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      {/* Images 2D list */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
          Ảnh 2D (Ngăn cách bằng dấu phẩy)
        </label>
        <textarea
          rows={2}
          value={editImages2d}
          onChange={(e) => setEditImages2d(e.target.value)}
          className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
          Mô tả chi tiết
        </label>
        <textarea
          rows={3}
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      {/* Public Checkbox */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          id="editIsPublished"
          checked={editIsPublished}
          onChange={(e) => setEditIsPublished(e.target.checked)}
          className="w-4 h-4 accent-[#03AED2] border-2 border-[#111111] rounded cursor-pointer"
        />
        <label htmlFor="editIsPublished" className="text-xs font-extrabold uppercase text-[#111111] cursor-pointer">
          Công khai trên cửa hàng
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => {
            setIsEditing(false);
            setInlineError("");
          }}
          className="flex-1 py-3 border-2 border-[#111111] text-[11px] font-black uppercase rounded-xl hover:bg-gray-100 transition-all cursor-pointer text-[#111111]"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSaveInline}
          disabled={isSaving}
          className="flex-1 py-3 bg-[#03AED2] text-white border-2 border-[#111111] text-[11px] font-black uppercase rounded-xl hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer shadow-[3px_3px_0px_#111111]"
        >
          {isSaving ? "Đang lưu..." : "Lưu lại"}
        </button>
      </div>
    </div>
  );
}
