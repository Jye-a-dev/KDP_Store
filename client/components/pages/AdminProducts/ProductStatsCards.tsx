import { ProductStats } from "@/types/api";

interface ProductStatsCardsProps {
  stats: ProductStats | null;
}

export default function ProductStatsCards({ stats }: ProductStatsCardsProps) {
  const cards = [
    { label: "Tổng sản phẩm", value: stats?.total ?? "—", accent: "bg-[#F8DE22]" },
    { label: "Đang hiển thị", value: stats?.published ?? "—", accent: "bg-[#03AED2]/20" },
    { label: "Đang ẩn", value: stats?.hidden ?? "—", accent: "bg-[#555]/20" },
    { label: "Hết hàng", value: stats?.out_of_stock ?? "—", accent: "bg-[#D12052]/20" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((s) => (
        <div key={s.label} className="bg-white border-2 border-[#111111] rounded-2xl p-4 shadow-[3px_3px_0px_#111111]">
          <p className="text-2xl font-extrabold text-[#111111]">{s.value}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#555] mt-0.5">{s.label}</p>
          <div className={`h-1 w-8 rounded-full mt-2 ${s.accent}`} />
        </div>
      ))}
    </div>
  );
}
