import { useState, useEffect } from "react";
import { Product, Category } from "@/types/api";
import { useProducts } from "@/hooks/useProducts";

interface ProductModalProps {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductModal({
  mode,
  product,
  categories,
  onClose,
  onSaved,
}: ProductModalProps) {
  const { createProduct, updateProduct, isLoading, error: hookError } = useProducts();
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [stock, setStock] = useState(product?.stock ? String(product.stock) : "10");
  const [categoryId, setCategoryId] = useState<string>(
    product?.category_id !== undefined && product?.category_id !== null
      ? String(product.category_id)
      : ""
  );
  const [isPublished, setIsPublished] = useState(product?.is_published ?? true);
  const [images2d, setImages2d] = useState<string>(
    Array.isArray(product?.images_2d)
      ? product.images_2d.join(", ")
      : typeof product?.images_2d === "string"
        ? product.images_2d
        : ""
  );
  const [model3dUrl, setModel3dUrl] = useState(product?.model_3d_url ?? "");
  const [error, setError] = useState("");

  // Automatically generate SKU and Slug-like SKU when name changes (only in create mode)
  useEffect(() => {
    if (mode === "create" && name.trim()) {
      const generatedSku = name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .slice(0, 10) + "-" + Math.floor(100 + Math.random() * 900);
      setSku(generatedSku);
    }
  }, [name, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên sản phẩm không được để trống");
      return;
    }
    if (!sku.trim()) {
      setError("Mã SKU không được để trống");
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) < 0) {
      setError("Giá sản phẩm phải là số dương hợp lệ");
      return;
    }

    setError("");

    const imgArray = images2d
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0);

    const body: Partial<Product> = {
      name: name.trim(),
      sku: sku.trim(),
      price: price.trim(),
      description: description.trim(),
      stock: Number(stock),
      category_id: categoryId ? Number(categoryId) : undefined,
      is_published: isPublished,
      images_2d: imgArray,
      model_3d_url: model3dUrl.trim() || null,
    };

    try {
      if (mode === "create") {
        await createProduct(body);
      } else {
        await updateProduct(product!.id, body);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const displayError = error || hookError || "";

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] w-full max-w-lg my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#111111]">
          <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#111111]">
            {mode === "create" ? "Thêm Sản Phẩm Mới" : "Chỉnh Sửa Sản Phẩm"}
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
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {displayError && (
            <div className="p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold rounded-lg">
              ⚠️ {displayError}
            </div>
          )}

          {/* Tên & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Tên sản phẩm <span className="text-[#D12052]">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Áo Hoodie Streetwear"
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Mã SKU <span className="text-[#D12052]">*</span>
              </label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="VD: HD-ST-01"
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
            </div>
          </div>

          {/* Giá & Tồn kho */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Giá bán (VNĐ) <span className="text-[#D12052]">*</span>
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="VD: 350000"
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Số lượng tồn kho
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
            </div>
          </div>

          {/* Danh mục & Trạng thái hiển thị */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Thuộc danh mục
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
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
            <div className="flex flex-col gap-1.5 justify-center">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] mb-1">
                Hiển thị cửa hàng
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#03AED2]"></div>
                <span className="ml-2 text-xs font-bold text-gray-700">Công khai</span>
              </label>
            </div>
          </div>

          {/* URL hình ảnh 2D */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Danh sách ảnh 2D (Ngăn cách bằng dấu phẩy)
            </label>
            <textarea
              rows={2}
              value={images2d}
              onChange={(e) => setImages2d(e.target.value)}
              placeholder="VD: https://link1.jpg, https://link2.jpg"
              className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* URL Model 3D */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Đường dẫn Model 3D (.glb / .gltf)
            </label>
            <input
              value={model3dUrl}
              onChange={(e) => setModel3dUrl(e.target.value)}
              placeholder="VD: https://storage.kdpstore.vn/models/sofa.glb"
              className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Mô tả chi tiết */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chất liệu, form dáng, cách phối đồ..."
              className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#f7f9fa] transition-all cursor-pointer text-[#111111]"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-[#111111] text-white border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer shadow-[3px_3px_0px_#D12052] disabled:opacity-60"
            >
              {isLoading ? "Đang lưu..." : mode === "create" ? "Tạo Mới" : "Lưu Lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
