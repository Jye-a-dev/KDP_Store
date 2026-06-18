import StatBadge from "./StatBadge";

interface OrderStats {
  total?: number;
  delivered?: number;
  pending?: number;
  processing?: number;
}

interface CustomerStatsRowProps {
  stats: OrderStats | null;
}

export default function CustomerStatsRow({ stats }: CustomerStatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <StatBadge label="Tổng đơn hàng" value={String(stats?.total ?? "—")} accent="bg-[#03AED2]" />
      <StatBadge label="Hoàn thành"    value={String(stats?.delivered ?? "—")} accent="bg-green-400" />
      <StatBadge label="Đang giao"     value={String((stats?.pending ?? 0) + (stats?.processing ?? 0))} accent="bg-[#F8DE22]" />
    </div>
  );
}
