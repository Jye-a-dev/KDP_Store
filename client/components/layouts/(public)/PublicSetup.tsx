import type { ReactNode } from "react";
import Link from "next/link";

import PublicFooter from "@/components/layouts/(public)/Footer/PublicFooter";
import PublicNavbar from "@/components/layouts/(public)/Navbar/PublicNavbar";

type PublicSetupProps = {
  children: ReactNode;
};

export default function PublicSetup({ children }: PublicSetupProps) {
  return (
    <div className="flex flex-col min-h-screen w-full relative pb-16.25 md:pb-0 bg-white">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#D12052] text-white text-center py-2.5 px-5 text-[11px] font-bold uppercase tracking-[1.5px]">
        Săn Deal Khởi Động Hè - Nhập mã &quot;NewSale_2026&quot; giảm thêm 15%
      </div>

      <PublicNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">{children}</main>

      <PublicFooter />

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16.25 bg-white border-t-2 border-[#111111] flex md:hidden justify-around items-center z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-[#D12052]">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span>Home</span>
        </Link>
        <Link href="#products-section" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-[#555555]">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span>Tìm Kiếm</span>
        </Link>
        <Link href="/login" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-[#111111] relative">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <span className="absolute -top-1 right-2 w-4.5 h-4.5 bg-[#F45B26] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            2
          </span>
          <span>Giỏ Hàng</span>
        </Link>
      </div>
    </div>
  );
}
