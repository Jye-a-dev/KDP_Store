"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types/api";
import ProductCard from "@/components/pages/MainPage/ProductCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { categories, fetchAll: fetchCategories } = useCategories();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"2d" | "3d">("2d");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  const productSlug = params?.slug;

  // Load product detail by slug
  useEffect(() => {
    if (!productSlug) return;
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/slug/${productSlug}`);
        if (!res.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }
        const data = await res.json();
        setProduct(data);
        if (data.model_3d_url) {
          setActiveTab("3d");
        } else {
          setActiveTab("2d");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productSlug]);

  // Load all products for recommendations
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=100`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.data ?? [];
          setAllProducts(list);
        }
      } catch (err) {
        console.error("Failed to load recommended products:", err);
      }
    };
    fetchAllProducts();
  }, [productSlug]);

  // Load categories for name mapping
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load Google's <model-viewer> web component dynamically
  useEffect(() => {
    if (product?.model_3d_url && !document.getElementById("model-viewer-script")) {
      const script = document.createElement("script");
      script.id = "model-viewer-script";
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      document.body.appendChild(script);
    }
  }, [product?.model_3d_url]);

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Sản phẩm";
  };

  // Parse images
  const getImages = (images2d: string[] | string): string[] => {
    if (Array.isArray(images2d)) return images2d;
    try {
      const parsed = JSON.parse(images2d);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return typeof images2d === "string" && images2d ? [images2d] : [];
  };

  const images = product ? getImages(product.images_2d) : [];
  const [mainImage, setMainImage] = useState("");

  // Sync main image when product loads
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setSuccessMsg("🎉 Đã thêm sản phẩm vào giỏ hàng thành công!");
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-125 w-full items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center text-center px-6 bg-white">
        <div className="text-5xl">⚠️</div>
        <h3 className="mt-4 text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy sản phẩm</h3>
        <p className="mt-1 text-sm text-[#555555]">
          {error || "Sản phẩm không khả dụng hoặc đã bị gỡ bỏ."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const isFurniture = !!product.model_3d_url;
  const modelUrl = product.model_3d_url || "";

  // Filter recommendations
  const sameCategoryProducts = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const otherCategoryProducts = allProducts
    .filter((p) => p.category_id !== product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full bg-white py-12 px-[5%] md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Back Navigation */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Quay lại trang chủ
        </button>

        {/* Detail Box */}
        <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col md:flex-row mb-16">
          
          {/* Left Column: Media Viewer */}
          <div className="w-full md:w-1/2 bg-[#f7f9fa] border-b-2 md:border-b-0 md:border-r-2 border-[#111111] relative flex flex-col justify-between p-6">
            {/* Header Actions */}
            <div className="flex gap-2 mb-4 z-10">
              <button
                onClick={() => setActiveTab("2d")}
                className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "2d" ? "bg-[#111111] text-white" : "bg-white text-[#111111]"
                }`}
              >
                Hình Ảnh 2D
              </button>
              {isFurniture && (
                <button
                  onClick={() => setActiveTab("3d")}
                  className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === "3d" ? "bg-[#111111] text-white" : "bg-white text-[#111111]"
                  }`}
                >
                  Trải Nghiệm 3D Interactive
                </button>
              )}
            </div>

            {/* Media Content */}
            <div className="flex-1 flex items-center justify-center min-h-87.5 md:min-h-112.5">
              {activeTab === "2d" ? (
                <div className="w-full flex flex-col items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
                    alt={product.name}
                    className="max-h-80 object-contain rounded-xl border border-gray-200 bg-white p-2"
                  />
                  {images.length > 1 && (
                    <div className="flex gap-2 flex-wrap justify-center">
                      {images.map((img, idx) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={idx}
                          src={img}
                          alt="Thumbnail"
                          onClick={() => setMainImage(img)}
                          className={`w-12 h-12 object-cover rounded-lg border-2 cursor-pointer transition-all ${
                            mainImage === img ? "border-[#D12052] scale-105" : "border-[#111111] opacity-75 hover:opacity-100"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full min-h-87.5 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <model-viewer
                    src={modelUrl}
                    camera-controls
                    auto-rotate
                    ar
                    shadow-intensity="1"
                    style={{ width: "100%", height: "400px", outline: "none" }}
                    className="bg-transparent"
                  >
                    {/* @ts-ignore */}
                  </model-viewer>
                </div>
              )}
            </div>
            
            {isFurniture && activeTab === "3d" && (
              <p className="text-[10px] text-gray-500 text-center font-bold uppercase mt-2">
                💡 Giữ chuột trái và kéo để xoay mô hình • Cuộn để phóng to
              </p>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D12052] bg-[#D12052]/10 px-2.5 py-1 rounded">
                  {getCategoryName(product.category_id)}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#777] ml-2">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#111111] uppercase tracking-wide mt-1">
                  {product.name}
                </h1>
                
                {/* Price */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-3xl font-black text-[#D12052]">
                    {Math.round(Number(product.price)).toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-sm text-[#aaa] line-through">
                    {Math.round(Number(product.price) * 1.25).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-b border-gray-100 py-4 my-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-2">
                  Mô tả sản phẩm
                </h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {product.description || "Sản phẩm thiết kế độc quyền KDP Store. Phù hợp cho phong cách trẻ trung, năng động và xu hướng mới."}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-4">
                {/* Color Selector */}
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-2.5">
                    Chọn màu sắc
                  </h4>
                  <div className="flex gap-2">
                    {["#D12052", "#F45B26", "#111111", "#F8DE22"].map((color) => (
                      <div
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer shadow-sm transition-all hover:scale-110 ${
                          selectedColor === color ? "border-[#03AED2] scale-105 ring-2 ring-offset-1 ring-black/10" : "border-black/15"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-2.5">
                    Số lượng
                  </h4>
                  <div className="inline-flex items-center border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111] bg-white">
                    <button
                      onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                      className="px-3.5 py-1.5 bg-white font-bold hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="px-5 py-1.5 text-xs font-extrabold font-mono border-l-2 border-r-2 border-[#111111]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3.5 py-1.5 bg-white font-bold hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="mt-8">
              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-500 text-emerald-700 text-xs font-semibold rounded-xl">
                  {successMsg}
                </div>
              )}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#F8DE22] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Thêm vào giỏ hàng
              </button>
            </div>

          </div>
        </div>

        {/* Same Category Recommendations */}
        {sameCategoryProducts.length > 0 && (
          <div className="mb-12 border-t-2 border-[#111111]/10 pt-10">
            <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-[#111111] mb-6 inline-block relative">
              Sản phẩm cùng danh mục
              <span className="absolute -z-10 bottom-0.5 left-0 right-0 h-2 bg-[#F8DE22]/50" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sameCategoryProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  getCategoryName={getCategoryName}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Category Recommendations */}
        {otherCategoryProducts.length > 0 && (
          <div className="border-t-2 border-[#111111]/10 pt-10">
            <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-[#111111] mb-6 inline-block relative">
              Có thể bạn cũng thích
              <span className="absolute -z-10 bottom-0.5 left-0 right-0 h-2 bg-[#03AED2]/20" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {otherCategoryProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  getCategoryName={getCategoryName}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
