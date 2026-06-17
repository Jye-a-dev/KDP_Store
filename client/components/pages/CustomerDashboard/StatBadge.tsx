interface StatBadgeProps {
  label: string;
  value: string;
  accent: string;
}

export default function StatBadge({ label, value, accent }: StatBadgeProps) {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl p-4 shadow-[3px_3px_0px_#111111] flex flex-col gap-1">
      <p className="text-2xl font-extrabold text-[#111111]">{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#555]">{label}</p>
      <div className={`h-1 w-8 rounded-full ${accent}`} />
    </div>
  );
}
