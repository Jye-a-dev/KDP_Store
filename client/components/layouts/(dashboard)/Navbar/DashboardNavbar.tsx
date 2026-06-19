"use client";

import Link from "next/link";
import { AuthUser } from "@/contexts/AuthContext";

interface DashboardNavbarProps {
  user: AuthUser;
  isAdmin: boolean;
}

export default function DashboardNavbar({ user, isAdmin }: DashboardNavbarProps) {
  const roleBadge = isAdmin
    ? "bg-[#F8DE22] text-[#111111]"
    : "bg-[#03AED2] text-white";

  return (
    <header className={`md:hidden flex items-center justify-between px-5 py-3.5 border-b-2 border-[#111111] ${isAdmin ? "bg-[#111111]" : "bg-white"}`}>
      <Link href="/" className={`text-lg font-extrabold uppercase ${isAdmin ? "text-[#F8DE22]" : "bg-linear-to-r from-[#D12052] to-[#F45B26] bg-clip-text text-transparent"}`}>
        KDP
      </Link>
      <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${roleBadge}`}>
        {user.full_name.split(" ").pop()}
      </span>
    </header>
  );
}
