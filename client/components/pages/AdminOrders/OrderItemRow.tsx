"use client";

import { Product } from "@/types/api";

interface OrderItemRowProps {
  idx: number;
  item: { product_id: number; quantity: number; color: string };
  allProducts: Product[];
  onChange: (idx: number, field: "product_id" | "quantity" | "color", value: any) => void;
  onRemove: (idx: number) => void;
}

export default function OrderItemRow({
  idx,
  item,
  allProducts,
  onChange,
  onRemove,
}: OrderItemRowProps) {
  const prod = allProducts.find((p) => p.id === Number(item.product_id));
  const subtotal = prod ? Math.round(Number(prod.price)) * item.quantity : 0;

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-3 items-center p-3 bg-[#f7f9fa] border border-[#111111]/10 rounded-xl">
      <select
        required
        value={item.product_id}
        onChange={(e) => onChange(idx, "product_id", e.target.value)}
        className="flex-1 min-w-37.5 border-2 border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold outline-none bg-white cursor-pointer"
      >
        <option value={0}>-- Chọn sản phẩm --</option>
        {allProducts.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({Math.round(Number(p.price)).toLocaleString("vi-VN")}đ)
          </option>
        ))}
      </select>

      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={item.color}
          onChange={(e) => onChange(idx, "color", e.target.value)}
          className="w-8 h-8 rounded-lg border border-[#111111]/30 cursor-pointer"
        />
        <input
          type="number"
          min={1}
          required
          value={item.quantity}
          onChange={(e) => onChange(idx, "quantity", Math.max(1, Number(e.target.value)))}
          className="w-16 border-2 border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold outline-none text-center"
        />
      </div>

      <span className="text-xs font-bold text-[#D12052] shrink-0 min-w-17.5 text-right">
        {subtotal.toLocaleString("vi-VN")}đ
      </span>

      <button
        type="button"
        onClick={() => onRemove(idx)}
        className="bg-[#D12052] text-white border border-[#111111] p-1.5 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
      >
        ✕
      </button>
    </div>
  );
}
