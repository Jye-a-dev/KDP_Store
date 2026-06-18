import { OrderStats } from "@/types/api";

interface OrdersHeaderProps {
  stats: OrderStats | null;
}

export default function OrdersHeader({ stats }: OrdersHeaderProps) {
  return (
    <div className="mb-8">
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
  );
}
