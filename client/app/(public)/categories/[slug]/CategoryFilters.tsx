"use client";

interface CategoryFiltersProps {
  priceFilter: string;
  setPriceFilter: (val: string) => void;
  customMinPrice: string;
  setCustomMinPrice: (val: string) => void;
  customMaxPrice: string;
  setCustomMaxPrice: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function CategoryFilters({
  priceFilter,
  setPriceFilter,
  customMinPrice,
  setCustomMinPrice,
  customMaxPrice,
  setCustomMaxPrice,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
}: CategoryFiltersProps) {
  const isFiltered =
    priceFilter !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "default" ||
    searchQuery !== "";

  const handleReset = () => {
    setPriceFilter("all");
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setStatusFilter("all");
    setSortBy("default");
    setSearchQuery("");
  };

  return (
    <div className="bg-[#f9fafb] border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] p-5 mb-8 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
          <span>⚡ Bộ lọc nâng cao</span>
        </h3>
        {isFiltered && (
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-white border-2 border-[#111111] text-[10px] font-black uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_#111111] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_#111111] md:hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1"
          >
            ✕ Đặt lại bộ lọc
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price Filter Column */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Khoảng giá</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "under-1m", label: "< 1M" },
              { value: "1m-5m", label: "1M - 5M" },
              { value: "over-5m", label: "> 5M" },
              { value: "custom", label: "Tự nhập" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setPriceFilter(item.value)}
                className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase transition-all cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_#111111] ${
                  priceFilter === item.value
                    ? "bg-[#F8DE22] text-[#111111]"
                    : "bg-white text-[#111111] md:hover:bg-[#f3f4f6]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {priceFilter === "custom" && (
            <div className="flex items-center gap-2 mt-2 animate-in fade-in duration-200">
              <input
                type="number"
                placeholder="Min (đ)"
                value={customMinPrice}
                onChange={(e) => setCustomMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 border-2 border-[#111111] rounded-lg text-xs font-semibold focus:outline-none bg-white text-black placeholder:text-[#aaa]"
              />
              <span className="text-[11px] font-bold text-[#111111]">-</span>
              <input
                type="number"
                placeholder="Max (đ)"
                value={customMaxPrice}
                onChange={(e) => setCustomMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 border-2 border-[#111111] rounded-lg text-xs font-semibold focus:outline-none bg-white text-black placeholder:text-[#aaa]"
              />
            </div>
          )}
        </div>

        {/* Status Filter Column */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Trạng thái</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "in-stock", label: "Còn hàng" },
              { value: "on-sale", label: "Khuyến mãi" },
              { value: "3d", label: "Interactive 3D" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusFilter(item.value)}
                className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase transition-all cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_#111111] ${
                  statusFilter === item.value
                    ? "bg-[#03AED2] text-white"
                    : "bg-white text-[#111111] md:hover:bg-[#f3f4f6]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Column */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Sắp xếp</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border-2 border-[#111111] rounded-xl text-xs font-semibold focus:outline-none bg-white text-black shadow-[3px_3px_0px_#111111]"
          >
            <option value="default">Mặc định</option>
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="name-asc">Tên: A-Z</option>
            <option value="name-desc">Tên: Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
