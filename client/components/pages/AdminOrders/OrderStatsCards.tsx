import { OrderStats } from "@/types/api";
import { formatVNDFull } from "@/components/pages/admin/helpers";

interface OrderStatsCardsProps {
  stats: OrderStats | null;
}

export default function OrderStatsCards({ stats }: OrderStatsCardsProps) {
  const cards = [
    { label: "Tổng đơn", value: stats?.total ?? "—", accent: "bg-[#F8DE22]" },
    { label: "Chờ xác nhận", value: stats?.pending ?? "—", accent: "bg-[#03AED2]/20" },
    { label: "Hoàn thành", value: stats?.delivered ?? "—", accent: "bg-green-400" },
    {
      label: "Doanh thu",
      value: stats ? formatVNDFull(stats.total_revenue) : "—",
      accent: "bg-[#D12052]/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((s) => (
        <div key={s.label} className="bg-white border-2 border-[#111111] rounded-2xl p-4 shadow-[3px_3px_0px_#111111]">
          <p className="text-xl font-extrabold text-[#111111] truncate">{s.value}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#555] mt-0.5">{s.label}</p>
          <div className={`h-1 w-8 rounded-full mt-2 ${s.accent}`} />
        </div>
      ))}
    </div>
  );
}
