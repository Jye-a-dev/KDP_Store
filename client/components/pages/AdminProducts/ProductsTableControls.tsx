import React from "react";

interface ProductsTableControlsProps {
  viewMode: "table" | "grouped";
  onViewModeChange: (mode: "table" | "grouped") => void;
  publishedFilter: string;
  onPublishedFilterChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ProductsTableControls({
  viewMode,
  onViewModeChange,
  publishedFilter,
  onPublishedFilterChange,
  search,
  onSearchChange,
}: ProductsTableControlsProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111] gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        {/* View Mode Switcher */}
        <div className="flex border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111]">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors ${
              viewMode === "table"
                ? "bg-[#111111] text-white"
                : "bg-white text-[#111111] hover:bg-[#f7f9fa]"
            }`}
          >
            Dạng Bảng
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grouped")}
            className={`px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider cursor-pointer border-l-2 border-[#111111] transition-colors ${
              viewMode === "grouped"
                ? "bg-[#111111] text-white"
                : "bg-white text-[#111111] hover:bg-[#f7f9fa]"
            }`}
          >
            Dạng Nhóm
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={publishedFilter}
          onChange={(e) => onPublishedFilterChange(e.target.value)}
          className="border-2 border-[#111111] py-2 px-4 rounded-xl text-[12px] font-semibold outline-none bg-white cursor-pointer shadow-[2px_2px_0px_#111111]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang hiển thị</option>
          <option value="false">Đang ẩn</option>
        </select>
        <div className="relative shadow-[2px_2px_0px_#111111] rounded-xl overflow-hidden border-2 border-[#111111]">
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm tên hoặc SKU..."
            className="py-2 pl-9 pr-4 rounded-xl text-[12px] font-semibold outline-none bg-white focus:bg-[#f7f9fa] w-56 border-none"
          />
          <svg
            className="absolute left-3 top-2.5"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>
    </div>
  );
}
