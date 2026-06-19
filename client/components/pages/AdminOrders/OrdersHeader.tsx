import { OrderStats } from "@/types/api";

interface OrdersHeaderProps {
  stats: OrderStats | null;
  onCreateClick: () => void;
}

export default function OrdersHeader({ stats, onCreateClick }: OrdersHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#03AED2] mb-1">
          Admin Panel
        </p>
        <h1 className="text-3xl font-extrabold uppercase text-[#111111] leading-tight">
          Quản Lý <mark className="bg-[#F8DE22] px-2 py-0.5">Đơn Hàng</mark>
        </h1>
        <p className="mt-1 text-sm text-[#555]">
          {stats ? `${stats.total} đơn · ${stats.pending} chờ · ${stats.processing} đang xử lý` : "Đang tải..."}
        </p>
      </div>

      <button
        onClick={onCreateClick}
        className="bg-[#03AED2] text-white font-bold uppercase text-xs tracking-wider px-5 py-3 rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-[#F8DE22] hover:text-[#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Tạo Đơn Hàng Mới
      </button>
    </div>
  );
}

