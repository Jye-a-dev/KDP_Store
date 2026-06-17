"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface PageContent {
  announcement_bar: string;
  hero_tagline: string;
  hero_title_normal: string;
  hero_title_highlight: string;
  hero_description: string;
  hero_btn: string;
  newsletter_title: string;
  newsletter_description: string;
  newsletter_placeholder: string;
  newsletter_btn: string;
  customer_promo_badge: string;
  customer_promo_title: string;
  customer_promo_code: string;
  customer_promo_desc: string;
  customer_promo_btn: string;
}

const DEFAULT_CONTENT: PageContent = {
  announcement_bar: "Săn Deal Khởi Động Hè - Nhập mã \"NewSale_2026\" giảm thêm 15%",
  hero_tagline: "Drop 01 // Xu Hướng Đột Phá",
  hero_title_normal: "Bứt phá",
  hero_title_highlight: "Màu Sắc",
  hero_description: "Đập tan sự đơn điệu với những thiết kế Oversize và nội thất tương tác 3D mang tuyên ngôn cá tính mạnh mẽ.",
  hero_btn: "Mua Ngay Cực Cháy",
  newsletter_title: "Gia Nhập Cộng Đồng Z-CLUB",
  newsletter_description: "Nhận ngay thông báo về các đợt Sneaker Drop, nội thất 3D giới hạn và ưu đãi dành riêng cho thành viên.",
  newsletter_placeholder: "Nhập email của bạn...",
  newsletter_btn: "Đăng Ký",
  customer_promo_badge: "Z-CLUB Member",
  customer_promo_title: "Ưu đãi dành riêng cho bạn",
  customer_promo_code: "ZCLUB15",
  customer_promo_desc: "giảm thêm 15%",
  customer_promo_btn: "Mua Ngay",
};

interface PageContentContextValue {
  content: PageContent;
  updateText: (key: keyof PageContent, value: string) => void;
  resetAll: () => void;
}

const PageContentContext = createContext<PageContentContextValue | null>(null);

const STORAGE_KEY = "kdp_page_content";

export function PageContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PageContent>(DEFAULT_CONTENT);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContent({ ...DEFAULT_CONTENT, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const updateText = (key: keyof PageContent, value: string) => {
    setContent((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(DEFAULT_CONTENT);
  };

  return (
    <PageContentContext.Provider value={{ content, updateText, resetAll }}>
      {children}
    </PageContentContext.Provider>
  );
}

export function usePageContent() {
  const ctx = useContext(PageContentContext);
  if (!ctx) {
    throw new Error("usePageContent must be used within PageContentProvider");
  }
  return ctx;
}
