import EditableText from "@/components/layouts/(public)/EditableText";
import { getGreeting } from "./helpers";

interface WelcomeBannerProps {
  fullName?: string;
  email?: string;
  now: Date;
}

export default function WelcomeBanner({ fullName, email, now }: WelcomeBannerProps) {
  const greeting = getGreeting(now.getHours());

  return (
    <div className="relative bg-[#111111] rounded-3xl border-2 border-[#111111] shadow-[6px_6px_0px_#F8DE22] p-6 md:p-8 mb-8 overflow-hidden">
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#F8DE22]/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 w-64 h-20 bg-[#D12052]/10 blur-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#F8DE22] border-2 border-[#F8DE22] flex items-center justify-center text-2xl font-extrabold text-[#111111] shrink-0">
          {fullName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#F8DE22]/70 mb-1">
            {greeting} ✨
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase leading-tight">
            {fullName}
          </h1>
          <p className="text-xs text-white/50 font-semibold mt-1">{email}</p>
        </div>
      </div>
      <div className="relative z-10 mt-4 inline-flex items-center gap-2 bg-[#F8DE22] text-[#111111] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
        <span>⭐</span> <EditableText contentKey="customer_promo_badge" />
      </div>
    </div>
  );
}
