"use client";

import Link from "next/link";

interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  description: string;
  stock: number;
  images_2d: string[] | string;
  model_3d_url: string | null;
  is_published: boolean;
}

interface ProductCardProps {
  product: Product;
  getCategoryName: (catId: number) => string;
}

export default function ProductCard({
  product,
  getCategoryName,
}: ProductCardProps) {
  const getProductImage = (images2d: string[] | string) => {
    if (Array.isArray(images2d)) {
      return images2d[0] || "";
    }
    try {
      const parsed = JSON.parse(images2d);
      if (Array.isArray(parsed)) return parsed[0] || "";
    } catch {
      // ignore
    }
    return typeof images2d === "string" ? images2d : "";
  };

  const imageUrl = getProductImage(product.images_2d);
  // 3D badge: detect by SKU prefix (FS- = furniture/3D)
  const isFurniture = product.sku.startsWith("FS-") || product.sku.startsWith("3D-");
  const priceVal = Math.round(Number(product.price));
  
  // Simulated discount logic for aesthetic matching (sale badges)
  const hasDiscount = product.id % 3 === 0;
  const displayPrice = priceVal;
  const oldPrice = Math.round(priceVal * 1.25);

  // Badge configs to look like the streetwear mock
  let badgeColor = "bg-[#03AED2] text-white"; // Cyan default (New In)
  let badgeText = "New In";
  
  if (hasDiscount) {
    badgeColor = "bg-[#D12052] text-[#F8DE22]"; // Pink/Yellow (Sale)
    badgeText = "Sale -20%";
  } else if (product.id % 4 === 2) {
    badgeColor = "bg-[#111111] text-white"; // Black (Limited)
    badgeText = "Limited";
  }

  return (
    <div className="group flex flex-col bg-white text-left relative">
      {/* Image Wrap */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#f7f9fa] border border-[#e8ecef] mb-4">
        {/* Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wide z-10 ${badgeColor}`}>
          {badgeText}
        </span>
        {/* Wishlist button */}
        <button className="absolute top-3 right-3 bg-white border border-[#111111] rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition hover:bg-[#D12052] hover:border-[#D12052] hover:text-white z-10">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick Add Hover button (slides up from bottom, hidden on mobile) */}
        <Link 
          href="/login"
          className="absolute bottom-0 left-0 w-full bg-[#111111] text-white py-3.5 text-center text-[11px] font-bold uppercase tracking-[1px] translate-y-full transition-transform duration-300 group-hover:translate-y-0 group-hover:bg-[#03AED2] hidden md:block"
        >
          {isFurniture ? "Trải nghiệm 3D +" : "Thêm Ngay +"}
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 px-1">
        <span className="text-[10px] font-bold uppercase text-[#D12052] tracking-wider">
          {isFurniture ? "3D Ready - " : ""}{getCategoryName(product.category_id)}
        </span>
        <h3 className="font-semibold text-[13px] md:text-[14px] text-[#111111] line-clamp-1">
          {product.name}
        </h3>
        
        {/* Price rendering */}
        <div className="flex items-center gap-2 mt-1">
          <span className={`font-bold text-[14px] md:text-[15px] ${hasDiscount ? "text-[#D12052]" : "text-[#111111]"}`}>
            {displayPrice.toLocaleString("vi-VN")}đ
          </span>
          {hasDiscount && (
            <span className="text-[#aaa] text-[11px] md:text-[12px] line-through font-normal">
              {oldPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Custom Color Swatches (aesthetic) */}
        <div className="flex gap-1.5 mt-1">
          {isFurniture ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border border-black/20 cursor-pointer" style={{ backgroundColor: "#8B5A2B" }} />
              <div className="w-3.5 h-3.5 rounded-full border border-black/20 cursor-pointer" style={{ backgroundColor: "#555" }} />
              <div className="w-3.5 h-3.5 rounded-full border border-black/20 cursor-pointer" style={{ backgroundColor: "#d2b48c" }} />
            </>
          ) : (
            <>
              <div className="w-3.5 h-3.5 rounded-full border border-black/20 cursor-pointer bg-[#03AED2]" />
              <div className="w-3.5 h-3.5 rounded-full border border-black/20 cursor-pointer bg-[#F45B26]" />
              <div className="w-3.5 h-3.5 rounded-full border border-black/20 cursor-pointer bg-[#111111]" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
