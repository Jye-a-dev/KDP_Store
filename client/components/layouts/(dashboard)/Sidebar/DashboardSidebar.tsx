"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthUser } from "@/contexts/AuthContext";
import { IconLogout } from "../config";

interface DashboardSidebarProps {
  user: AuthUser;
  isAdmin: boolean;
  navItems: Array<{ href: string; label: string; icon: React.ReactNode }>;
  handleLogout: () => void;
}

export default function DashboardSidebar({
  user,
  isAdmin,
  navItems,
  handleLogout,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const sidebarBg = isAdmin ? "bg-[#111111]" : "bg-white border-r-2 border-[#111111]";
  const sidebarText = isAdmin ? "text-white" : "text-[#111111]";
  const logoGradient = isAdmin
    ? "text-[#F8DE22]"
    : "bg-linear-to-r from-[#D12052] to-[#F45B26] bg-clip-text text-transparent";
  const activeClass = isAdmin
    ? "bg-[#F8DE22] text-[#111111]"
    : "bg-[#111111] text-white";
  const hoverClass = isAdmin
    ? "hover:bg-white/10"
    : "hover:bg-[#f7f9fa]";
  const roleBadge = isAdmin
    ? "bg-[#F8DE22] text-[#111111]"
    : "bg-[#03AED2] text-white";

  return (
    <aside className={`hidden md:flex flex-col w-64 fixed top-0 left-0 h-full z-40 ${sidebarBg}`}>
      {/* Logo */}
      <div className={`px-6 py-5 border-b ${isAdmin ? "border-white/10" : "border-[#111111]/10"}`}>
        <Link href="/" className={`text-xl font-extrabold uppercase tracking-wide ${logoGradient}`}>
          KDP Store
        </Link>
        <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest ${roleBadge}`}>
          {isAdmin ? "Admin" : "Customer"}
        </div>
      </div>

      {/* User info */}
      <div className={`px-6 py-4 border-b ${isAdmin ? "border-white/10" : "border-[#111111]/10"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 shrink-0 ${
            isAdmin ? "border-[#F8DE22]" : "border-[#111111]/20 bg-white"
          }`}>
            {user.avatar_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={user.avatar_url} 
                alt={user.full_name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-sm font-extrabold uppercase ${
                isAdmin ? "bg-[#F8DE22] text-[#111111]" : "bg-[#D12052] text-white"
              }`}>
                {user.full_name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-extrabold uppercase truncate ${sidebarText}`}>{user.full_name}</p>
            <p className={`text-[10px] truncate ${isAdmin ? "text-white/50" : "text-[#999]"}`}>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? activeClass
                      : `${sidebarText} ${hoverClass} ${isAdmin ? "text-white/70" : "text-[#555]"}`
                  }`}
                >
                  <span className={isActive ? "" : isAdmin ? "opacity-60" : "opacity-50"}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className={`px-3 py-4 border-t ${isAdmin ? "border-white/10" : "border-[#111111]/10"}`}>
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider mb-1 transition-all ${isAdmin ? "text-white/60 hover:text-white hover:bg-white/10" : "text-[#555] hover:bg-[#f7f9fa]"}`}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Trang Chủ
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all cursor-pointer ${isAdmin ? "text-[#F45B26] hover:bg-[#F45B26]/10" : "text-[#D12052] hover:bg-[#D12052]/10"}`}
        >
          <IconLogout />
          Đăng Xuất
        </button>
      </div>
    </aside>
  );
}
