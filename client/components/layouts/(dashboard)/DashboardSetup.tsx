"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import DashboardSidebar from "./Sidebar/DashboardSidebar";
import DashboardNavbar from "./Navbar/DashboardNavbar";
import DashboardFooter from "./Footer/DashboardFooter";
import { ADMIN_NAV, CUSTOMER_NAV } from "./config";

interface DashboardSetupProps {
  children: ReactNode;
}

export default function DashboardSetup({ children }: DashboardSetupProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Handle invalid user roles to prevent black screens/loops
    if (user && user.role !== "admin" && user.role !== "customer") {
      logout();
      router.replace("/login");
      return;
    }
    if (user?.role === "admin" && pathname === "/dashboard") {
      router.replace("/dashboard/admin");
    } else if (user?.role === "customer" && pathname === "/dashboard") {
      router.replace("/dashboard/customer");
    }
    if (user?.role === "customer" && pathname.startsWith("/dashboard/admin")) {
      router.replace("/dashboard/customer");
    }
  }, [isLoading, isAuthenticated, user, pathname, router, logout]);

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

  return (
    <div className="flex min-h-screen bg-[#f7f9fa]">
      {/* ── Sidebar (Desktop) ── */}
      <DashboardSidebar
        user={user}
        isAdmin={isAdmin}
        navItems={navItems}
        handleLogout={handleLogout}
      />

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <DashboardNavbar user={user} isAdmin={isAdmin} />

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8">{children}</main>

        {/* Mobile bottom nav */}
        <DashboardFooter isAdmin={isAdmin} navItems={navItems} />
      </div>
    </div>
  );
}
