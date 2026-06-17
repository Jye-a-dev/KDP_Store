import { StatCard } from "./types";

interface AnimatedStatProps {
  stat: StatCard;
  index: number;
}

export default function AnimatedStat({ stat, index }: AnimatedStatProps) {
  return (
    <div
      className="bg-white border-2 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_#111111] flex flex-col gap-3 hover:shadow-[6px_6px_0px_#111111] transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#555]">{stat.label}</span>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${stat.accent}`}>
          {stat.icon}
        </span>
      </div>
      <p className="text-3xl font-extrabold text-[#111111] leading-none">{stat.value}</p>
      <p className={`text-[11px] font-bold ${stat.positive ? "text-green-600" : "text-[#D12052]"}`}>
        {stat.delta} so với tháng trước
      </p>
    </div>
  );
}
