"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  discount_price?: string | number | null;
  original_price?: string | number | null;
  condition?: string;
  description: string;
  stock: number;
  images_2d: string[] | string;
  model_3d_url: string | null;
  is_published: boolean;
  badge?: string | null;
}

interface ProductCardProps {
  product: Product;
  getCategoryName: (catId: number) => string;
  isAdmin?: boolean;
  onEdit?: (p: Product) => void;
  onDelete?: (id: number) => void;
}

export default function ProductCard({
  product,
  getCategoryName,
  isAdmin,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [successMsg, setSuccessMsg] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const wishlist = JSON.parse(localStorage.getItem(`kdp_wishlist_${user.id}`) || "[]") as number[];
      setIsLiked(wishlist.includes(product.id));
    }
  }, [user?.id, product.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    const key = `kdp_wishlist_${user.id}`;
    let wishlist = JSON.parse(localStorage.getItem(key) || "[]") as number[];
    if (wishlist.includes(product.id)) {
      wishlist = wishlist.filter(id => id !== product.id);
      setIsLiked(false);
      setSuccessMsg("💔 Đã xóa khỏi danh sách yêu thích");
    } else {
      wishlist.push(product.id);
      setIsLiked(true);
      setSuccessMsg("❤️ Đã thêm vào danh sách yêu thích!");
    }
    localStorage.setItem(key, JSON.stringify(wishlist));
    setTimeout(() => setSuccessMsg(""), 2000);
  };

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
  const isFurniture = !!product.model_3d_url;
  const priceVal = Math.round(Number(product.price));
  const discountVal = product.discount_price ? Math.round(Number(product.discount_price)) : null;
  const hasRealDiscount = discountVal !== null && discountVal > 0 && discountVal < priceVal;

  const displayPrice = hasRealDiscount ? discountVal : priceVal;
  const oldPrice = hasRealDiscount ? priceVal : Math.round(priceVal * 1.25);
  const hasDiscount = hasRealDiscount || (product.id % 3 === 0);

  let badgeColor = "";
  let badgeText = "";

  if (product.badge && product.badge.trim() && product.badge.trim() !== "None") {
    const rawBadge = product.badge.trim();
    if (rawBadge === "Sale Off") {
      if (hasRealDiscount) {
        const pct = Math.round((1 - discountVal! / priceVal) * 100);
        badgeText = `Sale -${pct}%`;
      } else {
        badgeText = "Sale Off";
      }
      badgeColor = "bg-[#D12052] text-[#F8DE22]";
    } else if (rawBadge === "Limited") {
      badgeText = "Limited";
      badgeColor = "bg-[#111111] text-white";
    } else if (rawBadge === "New In") {
      badgeText = "New In";
      badgeColor = "bg-[#03AED2] text-white";
    } else {
      badgeText = rawBadge;
      const l = badgeText.toLowerCase();
      if (l.includes("sale") || l.includes("off") || l.includes("%") || l.includes("giam")) {
        badgeColor = "bg-[#D12052] text-[#F8DE22]";
      } else if (l.includes("limited") || l.includes("gioi han")) {
        badgeColor = "bg-[#111111] text-white";
      } else {
        badgeColor = "bg-[#03AED2] text-white";
      }
    }
  } else if (product.badge === "None") {
    badgeText = "";
  } else {
    if (hasRealDiscount) {
      const pct = Math.round((1 - discountVal! / priceVal) * 100);
      badgeColor = "bg-[#D12052] text-[#F8DE22]";
      badgeText = `Sale -${pct}%`;
    } else if (product.id % 3 === 0) {
      badgeColor = "bg-[#D12052] text-[#F8DE22]";
      badgeText = "Sale -20%";
    } else if (product.id % 4 === 2) {
      badgeColor = "bg-[#111111] text-white";
      badgeText = "Limited";
    } else if (product.id % 4 === 0) {
      badgeColor = "bg-[#03AED2] text-white";
      badgeText = "New In";
    }
  }

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: priceVal,
      color: isFurniture ? "#8B5A2B" : "#03AED2",
      image: imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      slug: product.slug,
    }, 1);

    setSuccessMsg("🎉 Đã thêm vào giỏ hàng!");
    setTimeout(() => {
      setSuccessMsg("");
    }, 2500);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white text-left relative transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] p-2 rounded-2xl cursor-pointer"
    >
      {successMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-bold text-[10px] uppercase py-1.5 px-3 rounded-lg border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] z-30 animate-bounce">
          {successMsg}
        </div>
      )}
      {/* Image Wrap */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#f7f9fa] border border-[#e8ecef] rounded-xl mb-4">
        {/* Badge */}
        {badgeText && (
          <span className={`absolute top-3 left-3 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wide z-10 shadow-md rounded-lg ${badgeColor}`}>
            {badgeText}
          </span>
        )}

        {/* Condition Badge */}
        {product.condition && (
          <span className="absolute bottom-3 left-3 px-2 py-1.5 text-[9px] uppercase font-black tracking-wider z-10 bg-white border-2 border-[#111111] text-[#111111] rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            ✨ {product.condition}
          </span>
        )}

        {/* Wishlist / Admin buttons */}
        {isAdmin ? (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="bg-[#F8DE22] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Sửa sản phẩm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 13.5-13.5z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (window.confirm(`Bạn có chắc muốn xóa sản phẩm ${product.name}?`)) {
                    onDelete(product.id);
                  }
                }}
                className="bg-[#D12052] text-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Xóa sản phẩm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm border shadow-sm rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 z-20 ${
              isLiked ? "text-[#D12052] border-[#D12052] bg-[#D12052]/10" : "text-gray-500 border-transparent hover:bg-[#D12052] hover:border-[#D12052] hover:text-white"
            }`}
          >
            <svg width="16" height="16" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        )}

        {/* Overlay Gradient (appears on hover to make text pop) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#111111]/45 backdrop-blur-xs flex flex-col justify-end p-4 gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#F8DE22] text-[#111111] font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Thêm vào giỏ hàng
          </button>

          <Link
            href={`/products/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white text-[#111111] font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-neutral-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all text-center flex items-center justify-center gap-1.5"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {isFurniture ? "Trải nghiệm 3D" : "Xem thêm"}
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 px-2 pb-1">
        <span className="text-[10px] font-bold uppercase text-[#D12052] tracking-wider transition-colors">
          {isFurniture ? "3D Ready - " : ""}{getCategoryName(product.category_id)}
        </span>
        <h3 className="font-semibold text-[13px] md:text-[14px] text-[#111111] line-clamp-1 transition-colors duration-300 group-hover:text-[#03AED2]">
          {product.name}
        </h3>

        {/* Price rendering */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`font-bold text-[14px] md:text-[16px] transition-all duration-300 ${hasDiscount ? "text-[#D12052]" : "text-[#111111]"}`}>
            {displayPrice.toLocaleString("vi-VN")}đ
          </span>
          {hasDiscount && (
            <span className="text-[#aaa] text-[11px] md:text-[12px] line-through font-normal">
              {oldPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Custom Color Swatches */}
        <div className="flex gap-2 mt-2">
          {isFurniture ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer shadow-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-offset-1 hover:ring-black/20" style={{ backgroundColor: "#8B5A2B" }} />
              <div className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer shadow-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-offset-1 hover:ring-black/20" style={{ backgroundColor: "#555" }} />
              <div className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer shadow-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-offset-1 hover:ring-black/20" style={{ backgroundColor: "#d2b48c" }} />
            </>
          ) : (
            <>
              <div className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer shadow-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-offset-1 hover:ring-black/20 bg-[#03AED2]" />
              <div className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer shadow-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-offset-1 hover:ring-black/20 bg-[#F45B26]" />
              <div className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer shadow-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-offset-1 hover:ring-black/20 bg-[#111111]" />
            </>
          )}
        </div>
      </div>


    </div>
  );
}