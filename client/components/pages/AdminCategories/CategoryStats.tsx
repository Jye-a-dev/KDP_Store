interface CategoryStatsProps {
  totalCount: number;
  rootCount: number;
  subCount: number;
}

const STATS = [
  { key: "total", label: "Tổng danh mục", accent: "bg-[#F8DE22]" },
  { key: "root", label: "Danh mục gốc", accent: "bg-[#03AED2]/20" },
  { key: "sub", label: "Danh mục con", accent: "bg-[#D12052]/20" },
] as const;

export default function CategoryStats({ totalCount, rootCount, subCount }: CategoryStatsProps) {
  const values = { total: totalCount, root: rootCount, sub: subCount };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {STATS.map((s) => (
        <div key={s.key} className="bg-white border-2 border-[#111] rounded-2xl p-4 shadow-[3px_3px_0px_#111]">
          <p className="text-2xl font-extrabold text-[#111]">{values[s.key]}</p>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#555] mt-0.5">{s.label}</p>
          <div className={`h-1 w-8 rounded-full mt-2 ${s.accent}`} />
        </div>
      ))}
    </div>
  );
}
