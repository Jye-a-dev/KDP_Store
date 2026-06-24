"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/api";
import MobileNavigationDrawer from "./MobileNavigationDrawer";

export default function PublicNavbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { setIsCartOpen, cartCount } = useCart();
  const { categories, fetchAll } = useCategories();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const overflowRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(event.target as Node)) {
        setIsOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleCategoryClick = (slug: string) => {
    setIsOverflowOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/categories/${slug}`);
  };

  const getNavLinkClass = (isActive: boolean) => {
    return `font-bold uppercase text-[12px] tracking-[0.5px] relative after:content-[''] after:absolute after:h-0.75 after:-bottom-1.25 after:left-0 after:bg-[#03AED2] after:transition-all after:duration-300 hover:after:w-full ${isActive
      ? "text-[#03AED2] after:w-full"
      : "text-[#111111] hover:text-[#03AED2] after:w-0"
      }`;
  };

  // Filter categories to those with show_on_navbar === true
  const navbarCategories = categories.filter((c) => c.show_on_navbar);

  // Group into root and children.
  // A category is a root nav item if its parent_id is null OR its parent is not in the navbar list
  const rootNavCategories = navbarCategories.filter(
    (c) => c.parent_id === null || !navbarCategories.some((p) => p.id === c.parent_id)
  );

  const getChildrenNavCategories = (parentId: number) => {
    return navbarCategories.filter((c) => c.parent_id === parentId);
  };

  // Limit visible top-level items to prevent breaking the layout, collapsing overflow to a dots menu
  const maxVisible = 4;
  const visibleRoots = rootNavCategories.slice(0, maxVisible);
  const overflowRoots = rootNavCategories.slice(maxVisible);

  const isCategoryActive = (cat: Category) => {
    if (pathname === `/categories/${cat.slug}`) return true;
    const children = getChildrenNavCategories(cat.id);
    return children.some((child) => pathname === `/categories/${child.slug}`);
  };

  const isOverflowActive = overflowRoots.some((cat) => {
    if (pathname === `/categories/${cat.slug}`) return true;
    const children = getChildrenNavCategories(cat.id);
    return children.some((child) => pathname === `/categories/${child.slug}`);
  });

  return (
    <div className="w-full px-[4%] md:px-[5%] pt-4 sticky top-0 z-100">
      <header className="mx-auto max-w-7xl flex justify-between items-center px-4 md:px-8 py-2.5 md:py-3.5 rounded-full border-2 border-[#111111] bg-white/95 backdrop-blur-md shadow-[4px_4px_0px_#111111]">
        {/* Gradient Logo */}
        <Link
          href="/"
          className="logo text-[20px] md:text-[24px] font-extrabold uppercase tracking-wide bg-linear-to-r from-[#D12052] to-[#F45B26] bg-clip-text text-transparent"
        >
          KDP Store
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-8.75 list-none items-center">
            {visibleRoots.map((cat) => {
              const children = getChildrenNavCategories(cat.id);
              const hasChildren = children.length > 0;
              const active = isCategoryActive(cat);

              if (hasChildren) {
                return (
                  <li key={cat.id} className="relative group/dropdown py-2">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`${getNavLinkClass(active)} flex items-center gap-1 cursor-pointer outline-none`}
                    >
                      {cat.name}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover/dropdown:rotate-180">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-1.5 w-48 bg-white border-2 border-[#111111] rounded-xl shadow-[4px_4px_0px_#111111] py-2 hidden group-hover/dropdown:block animate-in fade-in slide-in-from-top-1 duration-200 z-50 before:content-[''] before:absolute before:h-2 before:left-0 before:right-0 before:-top-2">
                      {children.map((child) => {
                        const childActive = pathname === `/categories/${child.slug}`;
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleCategoryClick(child.slug)}
                            className={`w-full text-left px-4 py-2.5 text-[11px] font-extrabold uppercase transition-colors block cursor-pointer outline-none ${childActive
                              ? "bg-[#f7f9fa] text-[#03AED2]"
                              : "text-[#111111] hover:bg-[#f7f9fa] hover:text-[#03AED2]"
                              }`}
                          >
                            {child.name}
                          </button>
                        );
                      })}
                    </div>
                  </li>
                );
              }

              return (
                <li key={cat.id} className="py-2">
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`${getNavLinkClass(active)} cursor-pointer outline-none`}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}

            {/* Overflow Dropdown Menu */}
            {overflowRoots.length > 0 && (
              <li ref={overflowRef} className="relative group/overflow py-2">
                <button
                  type="button"
                  onClick={() => setIsOverflowOpen(!isOverflowOpen)}
                  className={`flex items-center justify-center cursor-pointer outline-none w-8 h-8 rounded-full border-2 border-[#111111] shadow-[1.5px_1.5px_0px_#111111] hover:bg-[#F8DE22] group-hover/overflow:bg-[#F8DE22] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all ${isOverflowActive || isOverflowOpen ? "bg-[#F8DE22]" : "bg-[#f7f9fa]"
                    }`}
                  title="Xem thêm danh mục"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-200 ${isOverflowOpen ? "rotate-90" : "group-hover/overflow:rotate-90"
                    }`}>
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="6" cy="12" r="1.5" />
                    <circle cx="18" cy="12" r="1.5" />
                  </svg>
                </button>
                {/* Dropdown Menu for Overflow items */}
                <div className={`absolute top-full right-0 mt-1.5 w-52 bg-white border-2 border-[#111111] rounded-xl shadow-[4px_4px_0px_#111111] py-2 animate-in fade-in slide-in-from-top-1 duration-200 z-50 before:content-[''] before:absolute before:h-2 before:left-0 before:right-0 before:-top-2 ${isOverflowOpen ? "block" : "hidden group-hover/overflow:block"
                  }`}>
                  {overflowRoots.map((cat) => {
                    const children = getChildrenNavCategories(cat.id);
                    const hasChildren = children.length > 0;
                    const catActive = isCategoryActive(cat);

                    return (
                      <div key={cat.id} className="relative group/nested">
                        <button
                          onClick={() => handleCategoryClick(cat.slug)}
                          className={`w-full text-left px-4 py-2.5 text-[11px] font-extrabold uppercase transition-colors flex justify-between items-center cursor-pointer outline-none ${catActive
                            ? "bg-[#f7f9fa] text-[#03AED2]"
                            : "text-[#111111] hover:bg-[#f7f9fa] hover:text-[#03AED2]"
                            }`}
                        >
                          <span>{cat.name}</span>
                          {hasChildren && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="-rotate-90">
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* Nested sub-dropdown for child categories in the overflow */}
                        {hasChildren && (
                          <div className="absolute right-full top-0 mr-1.5 w-48 bg-white border-2 border-[#111111] rounded-xl shadow-[4px_4px_0px_#111111] py-2 hidden group-hover/nested:block animate-in fade-in slide-in-from-right-1 duration-200 z-50 before:content-[''] before:absolute before:w-2 before:top-0 before:bottom-0 before:-right-2">
                            {children.map((child) => {
                              const childActive = pathname === `/categories/${child.slug}`;
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => handleCategoryClick(child.slug)}
                                  className={`w-full text-left px-4 py-2 text-[11px] font-extrabold uppercase transition-colors block cursor-pointer outline-none ${childActive
                                    ? "bg-[#f7f9fa] text-[#03AED2]"
                                    : "text-[#111111] hover:bg-[#f7f9fa] hover:text-[#03AED2]"
                                    }`}
                                >
                                  {child.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-all hover:bg-[#F8DE22] md:hover:scale-105 active:scale-95 relative"
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

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              /* Skeleton while hydrating */
              <div className="h-9 w-28 rounded-full bg-[#111111]/10 animate-pulse" />
            ) : isAuthenticated && user ? (
              /* Logged-in state */
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"}
                  className="hidden lg:flex items-center gap-2 font-bold uppercase text-[11px] tracking-wider text-[#555555] hover:text-[#03AED2] transition-colors cursor-pointer"
                  title={user.role === "admin" ? "Vào trang quản trị Admin" : "Vào trang quản trị cá nhân"}
                >
                  <div className="w-6 h-6 rounded-full border border-[#111111] overflow-hidden bg-white shadow-[1px_1px_0px_#111111] flex items-center justify-center shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>👋 {user.full_name.split(" ").pop()} {user.role === "admin" && "(Admin)"}</span>
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

          {/* Hamburger Menu Button (Mobile/Tablet) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex md:hidden items-center justify-center cursor-pointer outline-none w-9 h-9 rounded-full border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111] hover:bg-[#F8DE22] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all"
            title="Mở menu"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
        isLoading={isLoading}
        rootNavCategories={rootNavCategories}
        getChildrenNavCategories={getChildrenNavCategories}
        isCategoryActive={isCategoryActive}
        handleCategoryClick={handleCategoryClick}
        pathname={pathname}
      />
    </div>
  );
}
