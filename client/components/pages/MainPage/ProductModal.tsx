import { useState, useEffect } from "react";
import { Product, Category } from "@/types/api";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";

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

  // Helper states for adding images from multi-sources
  const [addMode, setAddMode] = useState<"device" | "url" | "drive">("device");
  const [tempUrl, setTempUrl] = useState("");
  const [tempDrive, setTempDrive] = useState("");

  const convertGoogleDriveUrl = (url: string): string => {
    if (!url) return "";
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  const appendImageUrl = (newUrl: string) => {
    setImages2d((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return newUrl;
      return `${trimmed}, ${newUrl}`;
    });
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Kích thước tối đa 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        appendImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

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

  const handleAddTempUrl = () => {
    if (!tempUrl.trim()) return;
    appendImageUrl(tempUrl.trim());
    setTempUrl("");
  };

  const handleAddTempDrive = () => {
    if (!tempDrive.trim()) return;
    const converted = convertGoogleDriveUrl(tempDrive.trim());
    appendImageUrl(converted);
    setTempDrive("");
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
          <div className="bg-neutral-50 p-4 border-2 border-dashed border-[#111111]/20 rounded-2xl flex flex-col gap-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Thông tin Second-hand</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                  Tình trạng (Độ mới)
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="VD: Mới 95%, Likenew"
                  className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                  Giá gốc của hãng (VNĐ)
                </label>
                <input
                  type="text"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="VD: 1500000"
                  className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
                Ngày nhập hàng về kho
              </label>
              <input
                type="date"
                value={importDate}
                onChange={(e) => setImportDate(e.target.value)}
                className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white cursor-pointer"
              />
            </div>
          </div>

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
          <div className="flex flex-col gap-1.5 border-2 border-[#111111] p-4 rounded-2xl bg-white shadow-[3px_3px_0px_#111111]">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
              🎨 Danh sách màu sắc sản phẩm
            </label>
            
            {/* List of active colors */}
            <div className="flex flex-wrap gap-2.5 my-2">
              {colors.length === 0 ? (
                <span className="text-[11px] text-gray-400 font-semibold italic">Chưa chọn màu nào (Sẽ hiển thị màu mặc định)</span>
              ) : (
                colors.map((color, idx) => (
                  <div
                    key={`${color}-${idx}`}
                    className="flex items-center gap-1.5 border-2 border-[#111111] bg-neutral-50 px-2 py-1 rounded-xl shadow-[1.5px_1.5px_0px_#111111]"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: color }}
                    />
                    <code className="text-[10px] font-bold font-mono">{color.toUpperCase()}</code>
                    <button
                      type="button"
                      onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-[#D12052] font-black text-xs cursor-pointer ml-1 select-none transition-colors"
                      title="Xóa màu này"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new color picker + input */}
            <div className="flex gap-2 items-center mt-1">
              <input
                type="color"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="w-8 h-8 rounded-lg border-2 border-[#111111] cursor-pointer bg-white shrink-0 p-0.5"
              />
              <input
                type="text"
                value={colorInput.toUpperCase()}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith("#")) val = "#" + val;
                  setColorInput(val.slice(0, 7));
                }}
                maxLength={7}
                placeholder="#000000"
                className="border-2 border-[#111111] py-1.5 px-3 rounded-xl text-xs font-mono outline-none focus:bg-[#f7f9fa] w-24 text-center"
              />
              <button
                type="button"
                onClick={() => {
                  const cleaned = colorInput.trim().toLowerCase();
                  if (/^#[0-9a-f]{6}$/i.test(cleaned)) {
                    if (!colors.map(c => c.toLowerCase()).includes(cleaned)) {
                      setColors([...colors, cleaned]);
                    }
                  } else {
                    alert("Mã màu hex không hợp lệ! Ví dụ: #03AED2");
                  }
                }}
                className="px-4 py-1.5 bg-[#F8DE22] border-2 border-[#111111] rounded-xl text-[10px] font-extrabold uppercase cursor-pointer shadow-[1.5px_1.5px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#111111]"
              >
                Thêm màu
              </button>
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

            {/* Helper tool to add images from multi-sources */}
            <div className="border-2 border-dashed border-[#111111]/20 p-3 rounded-xl bg-neutral-50/50 space-y-3 mt-1.5">
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#03AED2] block">
                Thêm nhanh ảnh (Thiết bị, URL, Google Drive)
              </span>
              <div className="flex border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111] bg-white">
                {(["device", "url", "drive"] as const).map((m) => {
                  const labels = {
                    device: "📁 Thiết bị",
                    url: "🔗 URL",
                    drive: "🤖 Drive"
                  };
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAddMode(m)}
                      className={`flex-1 py-1 text-[9px] font-extrabold uppercase cursor-pointer border-r border-[#111111] last:border-none transition-colors ${
                        addMode === m ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#f7f9fa]"
                      }`}
                    >
                      {labels[m]}
                    </button>
                  );
                })}
              </div>

              {addMode === "device" && (
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="product-file-input"
                    className="hidden"
                    onChange={handleProductFileChange}
                  />
                  <label
                    htmlFor="product-file-input"
                    className="py-1.5 bg-white border-2 border-[#111111] rounded-lg text-center text-[10px] font-extrabold uppercase cursor-pointer hover:bg-neutral-50 shadow-[1.5px_1.5px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#111111] block"
                  >
                    Chọn file ảnh từ thiết bị
                  </label>
                </div>
              )}

              {addMode === "url" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="Dán link ảnh tại đây..."
                    className="flex-1 border-2 border-[#111111] py-1 px-2.5 rounded-lg text-xs font-semibold bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTempUrl}
                    className="px-3 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1.5px_1.5px_0px_#111111]"
                  >
                    Thêm
                  </button>
                </div>
              )}

              {addMode === "drive" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempDrive}
                    onChange={(e) => setTempDrive(e.target.value)}
                    placeholder="Dán link Google Drive tại đây..."
                    className="flex-1 border-2 border-[#111111] py-1 px-2.5 rounded-lg text-xs font-semibold bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTempDrive}
                    className="px-3 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1.5px_1.5px_0px_#111111]"
                  >
                    Thêm
                  </button>
                </div>
              )}
            </div>
          </div>

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
