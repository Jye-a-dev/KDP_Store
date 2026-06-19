"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardFooterProps {
  isAdmin: boolean;
  navItems: Array<{ href: string; label: string; icon: React.ReactNode }>;
}

export default function DashboardFooter({ isAdmin, navItems }: DashboardFooterProps) {
  const pathname = usePathname();

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t-2 border-[#111111] flex justify-around items-center py-2 z-50 ${isAdmin ? "bg-[#111111]" : "bg-white"}`}>
      {navItems.slice(0, 4).map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
              isActive
                ? isAdmin ? "text-[#F8DE22]" : "text-[#D12052]"
                : isAdmin ? "text-white/40" : "text-[#aaa]"
            }`}
          >
            {item.icon}
            <span>{item.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
