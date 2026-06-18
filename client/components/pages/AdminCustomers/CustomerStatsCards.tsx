import { UserStats } from "@/types/api";

interface CustomerStatsCardsProps {
  stats: UserStats | null;
}

export default function CustomerStatsCards({ stats }: CustomerStatsCardsProps) {
  const cards = [
    { label: "Khách hàng", value: stats?.customers ?? "—", accent: "bg-[#F8DE22]" },
    { label: "Đang hoạt động", value: stats?.active ?? "—", accent: "bg-green-400" },
    { label: "Bị vô hiệu", value: stats?.inactive ?? "—", accent: "bg-[#D12052]/20" },
    { label: "Tổng tài khoản", value: stats?.total ?? "—", accent: "bg-[#03AED2]/20" },
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
