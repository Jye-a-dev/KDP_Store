"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import "../../app/globals.css";

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconGrid = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBox = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);
const IconShoppingBag = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconHeart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconUser = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconLogout = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconBarChart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

// ─── Nav configs per role ─────────────────────────────────────────────────────
const ADMIN_NAV = [
  { href: "/dashboard/admin", label: "Tổng Quan", icon: <IconGrid /> },
  { href: "/dashboard/admin/orders", label: "Đơn Hàng", icon: <IconShoppingBag /> },
  { href: "/dashboard/admin/products", label: "Sản Phẩm", icon: <IconBox /> },
  { href: "/dashboard/admin/customers", label: "Khách Hàng", icon: <IconUsers /> },
  { href: "/dashboard/admin/analytics", label: "Phân Tích", icon: <IconBarChart /> },
];

const CUSTOMER_NAV = [
  { href: "/dashboard/customer", label: "Tổng Quan", icon: <IconGrid /> },
  { href: "/dashboard/customer/orders", label: "Đơn Hàng", icon: <IconShoppingBag /> },
  { href: "/dashboard/customer/wishlist", label: "Yêu Thích", icon: <IconHeart /> },
  { href: "/dashboard/customer/profile", label: "Hồ Sơ", icon: <IconUser /> },
];

// ─── Inner layout (needs auth context) ───────────────────────────────────────
function DashboardInner({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Role-based redirect
    if (user?.role === "admin" && pathname === "/dashboard") {
      router.replace("/dashboard/admin");
    } else if (user?.role === "customer" && pathname === "/dashboard") {
      router.replace("/dashboard/customer");
    }
    // Protect admin routes from customers
    if (user?.role === "customer" && pathname.startsWith("/dashboard/admin")) {
      router.replace("/dashboard/customer");
    }
    // Protect customer routes from admins (optional, admin can see customer view)
  }, [isLoading, isAuthenticated, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#555]">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const navItems = user.role === "admin" ? ADMIN_NAV : CUSTOMER_NAV;
  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
    <div className="flex min-h-screen bg-[#f7f9fa]">
      {/* ── Sidebar (Desktop) ── */}
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
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold uppercase border-2 ${isAdmin ? "bg-[#F8DE22] text-[#111111] border-[#F8DE22]" : "bg-[#D12052] text-white border-[#D12052]"}`}>
              {user.full_name.charAt(0)}
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

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className={`md:hidden flex items-center justify-between px-5 py-3.5 border-b-2 border-[#111111] ${isAdmin ? "bg-[#111111]" : "bg-white"}`}>
          <Link href="/" className={`text-lg font-extrabold uppercase ${isAdmin ? "text-[#F8DE22]" : "bg-linear-to-r from-[#D12052] to-[#F45B26] bg-clip-text text-transparent"}`}>
            KDP
          </Link>
          <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded ${roleBadge}`}>
            {user.full_name.split(" ").pop()}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8">{children}</main>

        {/* Mobile bottom nav */}
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
      </div>
    </div>
  );
}

// ─── Exported Layout ──────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <AuthProvider>
          <DashboardInner>{children}</DashboardInner>
        </AuthProvider>
      </body>
    </html>
  );
}
