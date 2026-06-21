import type { ReactNode } from "react";
import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#111111]">
      <AuthProvider>
        <div className="flex min-h-screen w-full">
          {/* Left Side: Premium Image Cover (Hidden on mobile) */}
          <div 
            className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative items-center justify-center p-12"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1080&q=80')`
            }}
          >
            {/* Top Logo */}
            <div className="absolute top-10 left-10">
              <Link href="/" className="text-2xl font-extrabold uppercase tracking-wide bg-linear-to-r from-[#D12052] to-[#F45B26] bg-clip-text text-transparent">
                KDP Store
              </Link>
            </div>

            {/* Centered Brand Concept */}
            <div className="text-left text-white max-w-md z-10">
              <span className="text-[11px] uppercase tracking-[3px] bg-[#03AED2] text-white px-3 py-1 font-bold inline-block mb-5">
                Z-CLUB Member Perks
              </span>
              <h2 className="text-[42px] font-extrabold leading-tight uppercase mb-4">
                Trải Nghiệm<br />
                <mark className="bg-[#F8DE22] text-[#111111] px-2.5 py-0.5 inline-block">Không Gian 3D</mark>
              </h2>
              <p className="font-semibold text-sm leading-relaxed text-white/90">
                Đăng nhập để lưu danh sách sản phẩm yêu thích, tương tác vật liệu 3D thời gian thực và nhận các đợt phát hành giới hạn sớm nhất.
              </p>
            </div>

            {/* Bottom Credit */}
            <div className="absolute bottom-10 left-10 text-xs text-white/60 font-semibold uppercase tracking-wider">
              &copy; 2026 KDP Store. All Rights Reserved.
            </div>
          </div>

          {/* Right Side: Centered Auth Forms */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white relative">
            {/* Back to Home button for mobile/desktop */}
            <div className="absolute top-8 right-8">
              <Link 
                href="/" 
                className="flex items-center gap-1.5 font-bold uppercase text-[11px] tracking-[0.5px] text-[#111111] hover:text-[#D12052] transition"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Trang Chủ</span>
              </Link>
            </div>

            {children}
          </div>
        </div>
      </AuthProvider>
    </div>
  );
}

