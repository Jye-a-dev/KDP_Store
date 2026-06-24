"use client";

import Link from "next/link";
import { useState } from "react";
import { Category } from "@/types/api";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
  rootNavCategories: Category[];
  getChildrenNavCategories: (parentId: number) => Category[];
  isCategoryActive: (cat: Category) => boolean;
  handleCategoryClick: (slug: string) => void;
  pathname: string;
}

export default function MobileNavigationDrawer({
  isOpen,
  onClose,
  user,
  isAuthenticated,
  logout,
  isLoading,
  rootNavCategories,
  getChildrenNavCategories,
  isCategoryActive,
  handleCategoryClick,
  pathname,
}: MobileNavigationDrawerProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleCategoryExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-100 flex md:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#111111]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-xs bg-white border-r-4 border-[#111111] h-full flex flex-col p-6 shadow-[5px_0px_0px_#111111] animate-in slide-in-from-left duration-300 z-10">
        {/* Header */}
        <div className="flex justify-between items-center pb-5 border-b-2 border-[#111111]/10">
          <span className="text-[20px] font-black uppercase tracking-wide bg-linear-to-r from-[#D12052] to-[#F45B26] bg-clip-text text-transparent">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border-2 border-[#111111] bg-white flex items-center justify-center cursor-pointer hover:bg-[#D12052] hover:text-white shadow-[1.5px_1.5px_0px_#111111] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Category list */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#aaa] mb-4">Danh Mục</div>
          <ul className="flex flex-col gap-3 list-none">
            {/* Home link */}
            <li>
              <button
                onClick={() => {
                  onClose();
                  // We expect the parent to route, or handle locally:
                  // Note: Since useRouter isn't inside, we can just use window.location.href or direct route.
                  // But since parent handleCategoryClick routes, we can just close & let router push,
                  // or use relative window links, or parent handleCategoryClick.
                  // Actually, let's just use parent handleCategoryClick for "/" too:
                  handleCategoryClick("");
                }}
                className={`w-full text-left py-2 text-[12px] font-black uppercase transition-colors block cursor-pointer outline-none ${
                  pathname === "/" ? "text-[#03AED2]" : "text-[#111111] hover:text-[#03AED2]"
                }`}
              >
                Trang Chủ
              </button>
            </li>
            {rootNavCategories.map((cat) => {
              const children = getChildrenNavCategories(cat.id);
              const hasChildren = children.length > 0;
              const active = isCategoryActive(cat);
              const isExpanded = !!expandedCategories[cat.id];

              return (
                <li key={cat.id} className="border-b border-[#111111]/5 pb-2">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`flex-1 text-left py-2 text-[12px] font-black uppercase transition-colors block cursor-pointer outline-none ${
                        active ? "text-[#03AED2]" : "text-[#111111] hover:text-[#03AED2]"
                      }`}
                    >
                      {cat.name}
                    </button>
                    {hasChildren && (
                      <button
                        onClick={(e) => toggleCategoryExpand(cat.id, e)}
                        className="w-7 h-7 rounded border border-[#111111] flex items-center justify-center bg-[#f7f9fa] hover:bg-[#F8DE22] shadow-[1px_1px_0px_#111111]"
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Nested subcategories inside mobile drawer */}
                  {hasChildren && isExpanded && (
                    <ul className="pl-4 mt-2 flex flex-col gap-2 border-l-2 border-[#111111]/10 list-none">
                      {children.map((child) => {
                        const childActive = pathname === `/categories/${child.slug}`;
                        return (
                          <li key={child.id}>
                            <button
                              onClick={() => handleCategoryClick(child.slug)}
                              className={`w-full text-left py-1 text-[11px] font-bold uppercase transition-colors block cursor-pointer outline-none ${
                                childActive ? "text-[#03AED2]" : "text-[#111111] hover:text-[#03AED2]"
                              }`}
                            >
                              {child.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer / Auth section */}
        <div className="pt-5 border-t-2 border-[#111111]/10 flex flex-col gap-4">
          {isLoading ? (
            <div className="h-9 w-full rounded-full bg-[#111111]/10 animate-pulse" />
          ) : isAuthenticated && user ? (
            <>
              <Link
                href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"}
                onClick={onClose}
                className="flex flex-col items-center gap-2 font-bold uppercase text-[11px] tracking-wider text-[#555555] hover:text-[#03AED2] transition-colors cursor-pointer text-center"
              >
                <div className="w-10 h-10 rounded-full border-2 border-[#111111] overflow-hidden bg-white shadow-[2px_2px_0px_#111111] flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      user.avatar_url ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`
                    }
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>
                  👋 {user.full_name} {user.role === "admin" && "(Admin)"}
                </span>
              </Link>
              <button
                onClick={logout}
                className="w-full bg-[#D12052] text-white font-bold uppercase text-[11px] tracking-[0.5px] py-3 rounded-full border-2 border-[#D12052] shadow-[2px_2px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] hover:border-[#111111] transition-all duration-300 cursor-pointer"
              >
                Đăng Xuất
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="w-full bg-[#111111] text-white font-bold uppercase text-[11px] tracking-[0.5px] py-3 rounded-full border-2 border-[#111111] shadow-[2px_2px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all duration-300 text-center"
            >
              Đăng Nhập / Đăng Ký
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
