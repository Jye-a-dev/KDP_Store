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
  const [editImagesList, setEditImagesList] = useState<string[]>([]);
  const [editColorsList, setEditColorsList] = useState<string[]>([]);
  const [editModel3dUrl, setEditModel3dUrl] = useState("");
  const [editBadge, setEditBadge] = useState("None");
  const [editIsPublished, setEditIsPublished] = useState(true);
  const [inlineError, setInlineError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Temporary inputs
  const [newColor, setNewColor] = useState("#000000");
  const [newImageUrl, setNewImageUrl] = useState("");

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

      let imagesVal: string[] = [];
      if (Array.isArray(product.images_2d)) {
        imagesVal = product.images_2d;
      } else if (typeof product.images_2d === "string") {
        try {
          const parsed = JSON.parse(product.images_2d);
          if (Array.isArray(parsed)) imagesVal = parsed;
        } catch {
          imagesVal = product.images_2d ? [product.images_2d] : [];
        }
      }
      setEditImagesList(imagesVal);
      setEditColorsList(product.materials_config?.colors || []);
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

    const body = {
      name: editName.trim(),
      sku: editSku.trim(),
      price: editPrice.trim(),
      discount_price: editDiscountPrice.trim() ? editDiscountPrice.trim() : null,
      description: editDescription.trim(),
      stock: Number(editStock),
      category_id: editCategoryId ? Number(editCategoryId) : null,
      is_published: editIsPublished,
      images_2d: editImagesList,
      model_3d_url: editModel3dUrl.trim() || null,
      badge: editBadge === "None" ? null : editBadge.trim(),
      materials_config: {
        colors: editColorsList,
        textures: product.materials_config?.textures || [],
      },
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

      {/* Colors Selection CRUD */}
      <div className="flex flex-col gap-1.5 p-3 bg-gray-50 border-2 border-dashed border-[#111111]/20 rounded-2xl">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
          🎨 Quản lý màu sắc ({editColorsList.length})
        </label>
        
        {/* Existing Swatches */}
        {editColorsList.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-2">
            {editColorsList.map((color, idx) => (
              <div 
                key={idx}
                className="group relative flex items-center gap-1.5 py-1 px-2.5 bg-white border-2 border-[#111111] rounded-lg text-[10px] font-extrabold font-mono shadow-[1px_1px_0px_#111111]"
              >
                <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: color }} />
                <span>{color.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => setEditColorsList(editColorsList.filter((_, i) => i !== idx))}
                  className="ml-1 text-[#D12052] font-black cursor-pointer hover:scale-125 transition-transform"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 font-bold uppercase py-1">Không có màu sắc nào được thêm.</p>
        )}

        {/* Add Color inputs */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 p-0 cursor-pointer"
          />
          <input
            type="text"
            placeholder="#HEX"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="flex-1 border-2 border-[#111111] py-1 px-2 rounded-lg text-[11px] font-extrabold font-mono outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (newColor.trim() && !editColorsList.includes(newColor.trim())) {
                setEditColorsList([...editColorsList, newColor.trim()]);
              }
            }}
            className="bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border-2 border-[#111111] hover:bg-gray-800 cursor-pointer active:scale-95 transition-transform"
          >
            Thêm màu
          </button>
        </div>
      </div>

      {/* Images List CRUD */}
      <div className="flex flex-col gap-1.5 p-3 bg-gray-50 border-2 border-dashed border-[#111111]/20 rounded-2xl">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
          🖼️ Quản lý danh sách ảnh ({editImagesList.length})
        </label>
        
        {/* Existing Images */}
        {editImagesList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 max-h-48 overflow-y-auto pr-1">
            {editImagesList.map((img, idx) => (
              <div 
                key={idx}
                className="group relative flex flex-col items-center bg-white border-2 border-[#111111] rounded-lg overflow-hidden shadow-[2px_2px_0px_#111111] p-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Preview" className="w-full h-16 object-contain" />
                <button
                  type="button"
                  onClick={() => setEditImagesList(editImagesList.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer border border-black/10"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-gray-400 font-bold uppercase py-1">Chưa có ảnh nào.</p>
        )}

        {/* Add Image URL */}
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            placeholder="URL ảnh mới..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1 border-2 border-[#111111] py-1 px-2.5 rounded-lg text-[11px] font-semibold outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (newImageUrl.trim() && !editImagesList.includes(newImageUrl.trim())) {
                setEditImagesList([...editImagesList, newImageUrl.trim()]);
                setNewImageUrl("");
              }
            }}
            className="bg-[#03AED2] text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border-2 border-[#111111] hover:bg-[#039ebf] cursor-pointer active:scale-95 transition-transform"
          >
            Thêm ảnh
          </button>
        </div>
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
