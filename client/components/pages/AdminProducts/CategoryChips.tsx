import React from "react";
import { Category } from "@/types/api";

interface CategoryChipsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectedCategoryChange: (value: string) => void;
}

export default function CategoryChips({
  categories,
  selectedCategory,
  onSelectedCategoryChange,
}: CategoryChipsProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap bg-white border-2 border-[#111111] p-4 rounded-2xl shadow-[3px_3px_0px_#111111]">
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#03AED2]">
          Lọc theo danh mục
        </span>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectedCategoryChange("")}
            className={`px-3.5 py-1.5 rounded-xl border-2 border-[#111111] text-[11px] font-extrabold uppercase transition-all shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111] cursor-pointer ${
              selectedCategory === ""
                ? "bg-[#F8DE22] text-[#111111]"
                : "bg-white text-[#555] hover:bg-[#f7f9fa]"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectedCategoryChange(String(cat.id))}
              className={`px-3.5 py-1.5 rounded-xl border-2 border-[#111111] text-[11px] font-extrabold uppercase transition-all shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111] cursor-pointer ${
                selectedCategory === String(cat.id)
                  ? "bg-[#F8DE22] text-[#111111]"
                  : "bg-white text-[#555] hover:bg-[#f7f9fa]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
