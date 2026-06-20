"use client";

import { Product } from "@/types/api";

interface ProductDetailsProps {
  product: Product;
  getCategoryName: (id: number) => string;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  quantity: number;
  setQuantity: (updater: number | ((q: number) => number)) => void;
  user: any;
  setIsEditing: (b: boolean) => void;
  handleDeleteInline: () => void;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
  successMsg: string;
}

export default function ProductDetails({
  product,
  getCategoryName,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  user,
  setIsEditing,
  handleDeleteInline,
  handleAddToCart,
  handleBuyNow,
  successMsg,
}: ProductDetailsProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D12052] bg-[#D12052]/10 px-2.5 py-1 rounded">
            {getCategoryName(product.category_id)}
          </span>
          {(() => {
            if (!product.badge || product.badge.trim() === "None") return null;
            const rawBadge = product.badge.trim();
            let text = rawBadge;
            let color = "bg-[#03AED2] text-white";

            const priceVal = Math.round(Number(product.price));
            const discountVal = product.discount_price
              ? Math.round(Number(product.discount_price))
              : null;
            const hasRealDiscount =
              discountVal !== null && discountVal > 0 && discountVal < priceVal;

            if (rawBadge === "Sale Off") {
              if (hasRealDiscount) {
                const pct = Math.round((1 - discountVal! / priceVal) * 100);
                text = `Sale -${pct}%`;
              } else {
                text = "Sale Off";
              }
              color = "bg-[#D12052] text-[#F8DE22]";
            } else if (rawBadge === "Limited") {
              text = "Limited";
              color = "bg-[#111111] text-white";
            } else if (rawBadge === "New In") {
              text = "New In";
              color = "bg-[#03AED2] text-white";
            } else {
              const l = rawBadge.toLowerCase();
              if (
                l.includes("sale") ||
                l.includes("off") ||
                l.includes("%") ||
                l.includes("giam")
              ) {
                color = "bg-[#D12052] text-[#F8DE22]";
              } else if (l.includes("limited") || l.includes("gioi han")) {
                color = "bg-[#111111] text-white";
              }
            }
            return (
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded ml-2 ${color}`}
              >
                {text}
              </span>
            );
          })()}
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
          {(() => {
            const priceVal = Math.round(Number(product.price));
            const discountVal = product.discount_price
              ? Math.round(Number(product.discount_price))
              : null;
            const hasRealDiscount =
              discountVal !== null && discountVal > 0 && discountVal < priceVal;

            if (hasRealDiscount) {
              return (
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-3xl font-black text-[#D12052]">
                    {discountVal!.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-sm text-[#aaa] line-through">
                    {priceVal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              );
            } else if (product.id % 3 === 0) {
              return (
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-3xl font-black text-[#D12052]">
                    {priceVal.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-sm text-[#aaa] line-through">
                    {Math.round(priceVal * 1.25).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              );
            } else {
              return (
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-3xl font-black text-[#111111]">
                    {priceVal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              );
            }
          })()}
        </div>

        {/* Secondhand Product Spec Badges */}
        <div className="flex flex-wrap gap-2.5 mt-3 p-4 bg-neutral-50 border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111]">
          <div className="flex-1 min-w-25">
            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Độ mới</p>
            <p className="text-xs font-black text-[#D12052] mt-0.5">{product.condition ?? "Mới 95%"}</p>
          </div>
          <div className="w-px bg-[#111111]/15 self-stretch my-1" />
          <div className="flex-1 min-w-25">
            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Giá gốc hãng</p>
            <p className="text-xs font-black text-neutral-500 mt-0.5 line-through decoration-red-500/80 decoration-1.5">
              {product.original_price ? `${Math.round(Number(product.original_price)).toLocaleString("vi-VN")}đ` : "Chưa cập nhật"}
            </p>
          </div>
          <div className="w-px bg-[#111111]/15 self-stretch my-1" />
          <div className="flex-1 min-w-25">
            <p className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Ngày nhập hàng</p>
            <p className="text-xs font-black text-[#111111] mt-0.5">
              {product.import_date ? new Date(product.import_date).toLocaleDateString("vi-VN") : "Hôm nay"}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-b border-gray-100 py-4 my-2">
          <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-2">
            Mô tả sản phẩm
          </h4>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            {product.description ||
              "Sản phẩm thiết kế độc quyền KDP Store. Phù hợp cho phong cách trẻ trung, năng động và xu hướng mới."}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {/* Color Selector */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-2.5">
              Chọn màu sắc
            </h4>
            <div className="flex gap-2 flex-wrap">
              {(product.materials_config?.colors && product.materials_config.colors.length > 0
                ? product.materials_config.colors
                : ["#D12052", "#F45B26", "#111111", "#F8DE22"]
              ).map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer shadow-sm transition-all hover:scale-110 ${
                    selectedColor === color
                      ? "border-[#03AED2] scale-105 ring-2 ring-offset-1 ring-black/10"
                      : "border-black/15"
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
            {product.stock <= 1 ? (
              <div className="inline-flex items-center bg-[#f7f9fa] px-4 py-2.5 rounded-xl border-2 border-[#111111] text-xs font-extrabold text-[#555] shadow-[2px_2px_0px_#111111]">
                Duy nhất 1 sản phẩm
              </div>
            ) : (
              <div className="inline-flex items-center border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111] bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="px-3.5 py-1.5 bg-white font-bold hover:bg-gray-100 cursor-pointer text-sm"
                >
                  -
                </button>
                <span className="px-5 py-1.5 text-xs font-extrabold font-mono border-l-2 border-r-2 border-[#111111]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                  className="px-3.5 py-1.5 bg-white font-bold hover:bg-gray-100 cursor-pointer text-sm"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8">
        {/* Admin Quick Actions */}
        {user?.role === "admin" && (
          <div className="flex gap-3 mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-2 bg-[#F8DE22] text-[#111111] font-bold text-[10px] uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
            >
              ✏️ Sửa sản phẩm
            </button>
            <button
              onClick={handleDeleteInline}
              className="flex-1 py-2 bg-[#D12052] text-white font-bold text-[10px] uppercase tracking-wider rounded-lg border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
            >
              🗑️ Xóa sản phẩm
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-500 text-emerald-700 text-xs font-semibold rounded-xl">
            {successMsg}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-4 bg-[#F8DE22] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Thêm vào giỏ hàng
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-4 bg-[#D12052] text-white font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  );
}
