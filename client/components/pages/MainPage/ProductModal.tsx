import { useState, useEffect } from "react";
import { Product, Category } from "@/types/api";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import ProductSecondHandForm from "./ProductSecondHandForm";
import ProductColorManager from "./ProductColorManager";
import ProductImageUploader from "./ProductImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const formatDateTimeLocal = (dateStr?: string | Date | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const tzoffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzoffset).toISOString().slice(0, 16);
};

interface ProductModalProps {
  mode: "create" | "edit";
  product?: Product | null;
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
  const { token } = useAuth();
  const [isUploading3d, setIsUploading3d] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product?.price ? String(product.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    product?.discount_price ? String(product.discount_price) : ""
  );
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
  const [badge, setBadge] = useState(product?.badge ?? "None");
  const [originalPrice, setOriginalPrice] = useState(
    product?.original_price ? String(product.original_price) : ""
  );
  const [condition, setCondition] = useState(product?.condition ?? "Mới 95%");
  const [importDate, setImportDate] = useState(
    product?.import_date
      ? new Date(product.import_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [saleStartDate, setSaleStartDate] = useState(
    product?.sale_start_date ? formatDateTimeLocal(product.sale_start_date) : ""
  );
  const [saleEndDate, setSaleEndDate] = useState(
    product?.sale_end_date ? formatDateTimeLocal(product.sale_end_date) : ""
  );
  const [colors, setColors] = useState<string[]>(
    product?.materials_config?.colors || []
  );
  const [colorInput, setColorInput] = useState("#03aed2");
  const [error, setError] = useState("");

  const handleUpload3d = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".gltf", ".glb", ".obj", ".fbx"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert("Chỉ chấp nhận file 3D định dạng .gltf, .glb, .obj, .fbx");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading3d(true);
    try {
      const res = await fetch(`${API_URL}/products/upload-3d`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Upload thất bại");
      }

      const data = await res.json();
      setModel3dUrl(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi upload");
    } finally {
      setIsUploading3d(false);
    }
  };

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
    if (discountPrice.trim() && (isNaN(Number(discountPrice)) || Number(discountPrice) < 0)) {
      setError("Giá khuyến mãi phải là số dương hợp lệ");
      return;
    }
    if (discountPrice.trim() && price.trim() && Number(discountPrice) >= Number(price)) {
      setError("Giá khuyến mãi phải nhỏ hơn giá bán gốc");
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
      discount_price: discountPrice.trim() ? discountPrice.trim() : null,
      original_price: originalPrice.trim() ? originalPrice.trim() : null,
      condition: condition.trim(),
      import_date: importDate ? new Date(importDate).toISOString() : undefined,
      sale_start_date: saleStartDate ? new Date(saleStartDate).toISOString() : null,
      sale_end_date: saleEndDate ? new Date(saleEndDate).toISOString() : null,
      description: description.trim(),
      stock: Number(stock),
      category_id: categoryId ? Number(categoryId) : undefined,
      is_published: isPublished,
      images_2d: imgArray,
      model_3d_url: model3dUrl.trim() || null,
      badge: badge === "None" ? null : badge.trim(),
      materials_config: {
        colors: colors,
        textures: product?.materials_config?.textures || [],
      },
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

          {/* Giá & Giá khuyến mãi */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Giá bán gốc (VNĐ) <span className="text-[#D12052]">*</span>
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
                Giá khuyến mãi (VNĐ)
              </label>
              <input
                type="text"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="VD: 280000"
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
            </div>
          </div>

          {/* Thời hạn Khuyến mãi */}
          {discountPrice.trim() && (
            <div className="bg-amber-50/50 p-4 border-2 border-dashed border-[#F8DE22]/40 rounded-2xl flex flex-col gap-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 flex items-center gap-1">
                ⏱️ Thời hạn Khuyến mãi
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                    Từ ngày
                  </label>
                  <input
                    type="datetime-local"
                    value={saleStartDate}
                    onChange={(e) => setSaleStartDate(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                    Đến ngày
                  </label>
                  <input
                    type="datetime-local"
                    value={saleEndDate}
                    onChange={(e) => setSaleEndDate(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-[9.5px] text-amber-700/80 font-bold leading-normal">
                💡 Hệ thống sẽ tự động hiển thị giá bán gốc khi nằm ngoài thời hạn trên. Nếu để trống, khuyến mãi sẽ luôn có hiệu lực.
              </p>
            </div>
          )}

          {/* Thông tin Second-hand */}
          <ProductSecondHandForm
            condition={condition}
            setCondition={setCondition}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            importDate={importDate}
            setImportDate={setImportDate}
          />

          {/* Số lượng tồn kho & Huy hiệu */}
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Huy hiệu / Nhãn sản phẩm
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white cursor-pointer"
              >
                <option value="None">Không có (None)</option>
                <option value="New In">Mới (New In)</option>
                <option value="Sale Off">Giảm giá (Sale Off)</option>
                <option value="Limited">Giới hạn (Limited)</option>
              </select>
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

          {/* Quản lý màu sắc (Color CRUD) */}
          <ProductColorManager
            colors={colors}
            setColors={setColors}
            colorInput={colorInput}
            setColorInput={setColorInput}
          />

          {/* URL hình ảnh 2D */}
          <ProductImageUploader
            images2d={images2d}
            setImages2d={setImages2d}
          />

          {/* URL Model 3D */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Đường dẫn Model 3D (.glb / .gltf)
            </label>
            <div className="flex gap-2">
              <input
                value={model3dUrl}
                onChange={(e) => setModel3dUrl(e.target.value)}
                placeholder="VD: /uploads/3d/model-123.glb"
                className="flex-1 border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
              />
              <input
                type="file"
                accept=".gltf,.glb,.obj,.fbx"
                id="model-3d-file-input"
                className="hidden"
                onChange={handleUpload3d}
                disabled={isUploading3d}
              />
              <label
                htmlFor="model-3d-file-input"
                className={`px-4 py-2 bg-[#F8DE22] border-2 border-[#111111] rounded-xl text-[11px] font-extrabold uppercase cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#111111] flex items-center justify-center min-w-22.5 text-center select-none ${
                  isUploading3d ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {isUploading3d ? "Đang tải..." : "Tải file"}
              </label>
            </div>
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
