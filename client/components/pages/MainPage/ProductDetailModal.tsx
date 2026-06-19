"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/api";

interface ProductDetailModalProps {
  product: Product;
  getCategoryName: (catId: number) => string;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  getCategoryName,
  onClose,
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"2d" | "3d">("2d");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  const isFurniture = !!product.model_3d_url;

  // Load Google's <model-viewer> web component dynamically
  useEffect(() => {
    if (isFurniture && !document.getElementById("model-viewer-script")) {
      const script = document.createElement("script");
      script.id = "model-viewer-script";
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      document.body.appendChild(script);
    }
  }, [isFurniture]);

  // Set default view to 3D if furniture
  useEffect(() => {
    if (isFurniture) {
      setActiveTab("3d");
    }
  }, [isFurniture]);

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

  const images = getImages(product.images_2d);
  const [mainImage, setMainImage] = useState(images[0] || "");

  const handleAddToCart = () => {
    setSuccessMsg("🎉 Đã thêm sản phẩm vào giỏ hàng thành công!");
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  // Fallback 3D model if model_3d_url is empty
  const modelUrl = product.model_3d_url || "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/SheenChair/glTF-Binary/SheenChair.glb";

  return (
    <div className="fixed inset-0 bg-[#111111]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] w-full max-w-4xl my-8 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col md:flex-row">
        
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
          <div className="flex-1 flex items-center justify-center min-h-87.5 md:min-h-100">
            {activeTab === "2d" ? (
              <div className="w-full flex flex-col items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
                  alt={product.name}
                  className="max-h-75 object-contain rounded-xl border border-gray-200 bg-white p-2"
                />
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
              </div>
            ) : (
              <div className="w-full h-full min-h-75 flex items-center justify-center">
                {/* @ts-ignore */}
                <model-viewer
                  src={modelUrl}
                  camera-controls
                  auto-rotate
                  ar
                  shadow-intensity="1"
                  style={{ width: "100%", height: "350px", outline: "none" }}
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
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            {/* Top Close */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D12052] bg-[#D12052]/10 px-2 py-0.5 rounded">
                  {getCategoryName(product.category_id)}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#777] ml-2">
                  SKU: {product.sku}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-bold hover:bg-[#D12052] hover:text-white cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Product Meta */}
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#111111] uppercase tracking-wide mt-1">
                {product.name}
              </h2>
              
              {/* Price */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-2xl font-black text-[#D12052]">
                  {Math.round(Number(product.price)).toLocaleString("vi-VN")}đ
                </span>
                <span className="text-xs text-[#aaa] line-through">
                  {Math.round(Number(product.price) * 1.25).toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-100 py-3 my-1">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-1">
                Mô tả sản phẩm
              </h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed max-h-36 overflow-y-auto">
                {product.description || "Sản phẩm thiết kế độc quyền KDP Store. Phù hợp cho phong cách trẻ trung, năng động và xu hướng mới."}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {/* Color Selector */}
              <div>
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-2">
                  Chọn màu sắc
                </h4>
                <div className="flex gap-2">
                  {["#D12052", "#F45B26", "#111111", "#F8DE22"].map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer shadow-sm transition-all hover:scale-110 ${
                        selectedColor === color ? "border-[#03AED2] scale-105 ring-2 ring-offset-1 ring-black/10" : "border-black/15"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-2">
                  Số lượng
                </h4>
                <div className="inline-flex items-center border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111] bg-white">
                  <button
                    onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                    className="px-3 py-1 bg-white font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-extrabold font-mono border-l-2 border-r-2 border-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1 bg-white font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="mt-6">
            {successMsg && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-500 text-emerald-700 text-xs font-semibold rounded-xl">
                {successMsg}
              </div>
            )}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-[#F8DE22] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Thêm vào giỏ hàng
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
