"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function PublicNavbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { setIsCartOpen, cartCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinkClass =
    "font-bold uppercase text-[12px] tracking-[0.5px] text-[#111111] hover:text-[#03AED2] relative after:content-[''] after:absolute after:w-0 after:h-0.75 after:-bottom-1.25 after:left-0 after:bg-[#03AED2] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <div className="w-full px-[5%] pt-4 sticky top-0 z-50">
      <header className="mx-auto max-w-7xl flex justify-between items-center px-8 py-3.5 rounded-full border-2 border-[#111111] bg-white/95 backdrop-blur-md shadow-[4px_4px_0px_#111111]">
        {/* Gradient Logo */}
        <Link
          href="/"
          className="logo text-[24px] font-extrabold uppercase tracking-wide bg-linear-to-r from-[#D12052] to-[#F45B26] bg-clip-text text-transparent"
        >
          KDP Store
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-8.75 list-none">
            <li>
              <Link href="#products-section" className={navLinkClass}>
                Hàng Mới
              </Link>
            </li>
            <li>
              <Link href="#products-section" className={navLinkClass}>
                Streetwear
              </Link>
            </li>
            <li>
              <Link href="#products-section" className={navLinkClass}>
                Activewear
              </Link>
            </li>
            <li>
              <Link href="#products-section" className={navLinkClass}>
                Phụ Kiện
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-all hover:bg-[#F8DE22] hover:scale-105 active:scale-95 relative"
              title="Giỏ Hàng"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F45B26] text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {isLoading ? (
            /* Skeleton while hydrating */
            <div className="h-9 w-28 rounded-full bg-[#111111]/10 animate-pulse" />
          ) : isAuthenticated && user ? (
            /* Logged-in state */
            <div className="flex items-center gap-3">
              <Link
                href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"}
                className="hidden sm:block font-bold uppercase text-[11px] tracking-wider text-[#555555] hover:text-[#03AED2] transition-colors cursor-pointer"
                title={user.role === "admin" ? "Vào trang quản trị Admin" : "Vào trang quản trị cá nhân"}
              >
                👋 {user.full_name.split(" ").pop()} {user.role === "admin" && "(Admin)"}
              </Link>
              <button
                id="navbar-logout-btn"
                onClick={handleLogout}
                className="bg-[#D12052] text-white font-bold uppercase text-[11px] tracking-[0.5px] px-5 py-2.5 rounded-full border-2 border-[#D12052] shadow-[2px_2px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] hover:border-[#111111] transition-all duration-300 cursor-pointer"
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            /* Guest state */
            <Link
              id="navbar-login-btn"
              href="/login"
              className="bg-[#111111] text-white font-bold uppercase text-[11px] tracking-[0.5px] px-5 py-2.5 rounded-full border-2 border-[#111111] shadow-[2px_2px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all duration-300"
            >
              Đăng Nhập / Đăng Ký
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
