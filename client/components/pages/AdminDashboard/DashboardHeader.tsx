import { getGreeting } from "./helpers";

interface DashboardHeaderProps {
  userName?: string;
  now: Date;
}

export default function DashboardHeader({ userName, now }: DashboardHeaderProps) {
  const hour = now.getHours();
  const greeting = getGreeting(hour);
  const firstName = userName?.split(" ").pop();

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#03AED2] mb-1">
            {greeting}, {firstName} 👋
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#111111] leading-tight">
            Tổng Quan<br />
            <mark className="bg-[#F8DE22] text-[#111111] px-2 py-0.5">Admin Panel</mark>
          </h1>
          <p className="mt-2 text-sm text-[#555] font-semibold">
            {now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border-2 border-[#111111] px-4 py-2 rounded-full shadow-[3px_3px_0px_#111111]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider">Live</span>
        </div>
      </div>
    </div>
  );
}
