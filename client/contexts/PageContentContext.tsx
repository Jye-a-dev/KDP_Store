"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchWithTimeout } from "@/utils/fetchWithTimeout";

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
  newsletter_cta_url: string;
  customer_promo_badge: string;
  customer_promo_title: string;
  customer_promo_code: string;
  customer_promo_desc: string;
  customer_promo_btn: string;
  [key: string]: string;
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
  newsletter_cta_url: "/products",
  customer_promo_badge: "Z-CLUB Member",
  customer_promo_title: "Ưu đãi dành riêng cho bạn",
  customer_promo_code: "ZCLUB15",
  customer_promo_desc: "giảm thêm 15%",
  customer_promo_btn: "Mua Ngay",
};

interface PageContentContextValue {
  content: PageContent;
  updateText: (key: string, value: string) => Promise<void>;
  createKey: (key: string, value: string) => Promise<void>;
  deleteKey: (key: string) => Promise<void>;
  resetAll: () => void;
  refresh: () => Promise<void>;
  isLoading: boolean;
}

const PageContentContext = createContext<PageContentContextValue | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "kdp_access_token";

export function PageContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PageContent>(DEFAULT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithTimeout(`${API_URL}/page-contents`);
      if (res.ok) {
        const data = await res.json();
        setContent({ ...DEFAULT_CONTENT, ...data });
      }
    } catch (err) {
      console.error("Failed to fetch page contents from API, using default/cached content", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load from API on mount
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateText = async (key: string, value: string) => {
    // 1. Update locally for immediate responsiveness
    setContent((prev) => ({ ...prev, [key]: value }));

    // 2. Call API to persist in database
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;

      await fetchWithTimeout(`${API_URL}/page-contents/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });
    } catch (err) {
      console.error("Failed to save page content key to API:", err);
    }
  };

  const createKey = async (key: string, value: string) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Unauthorized");

      const res = await fetchWithTimeout(`${API_URL}/page-contents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to create page content");
      }
      setContent((prev) => ({ ...prev, [key]: value }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteKey = async (key: string) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Unauthorized");

      const res = await fetchWithTimeout(`${API_URL}/page-contents/${key}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to delete page content");
      }
      setContent((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const resetAll = () => {
    setContent(DEFAULT_CONTENT);
  };

  return (
    <PageContentContext.Provider
      value={{
        content,
        updateText,
        createKey,
        deleteKey,
        resetAll,
        refresh: fetchContent,
        isLoading,
      }}
    >
      {isLoading ? (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white transition-opacity duration-300">
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer spinning gradient ring using brand colors */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D12052] border-r-[#F45B26] border-l-[#03AED2] animate-spin"></div>
            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full border border-neutral-100 animate-pulse"></div>
            {/* Inner branding dots and pulses */}
            <div className="absolute w-8 h-8 rounded-full bg-[#D12052] animate-ping opacity-75"></div>
            <div className="absolute w-6 h-6 rounded-full bg-[#F45B26] shadow-lg"></div>
          </div>
          <p className="mt-8 text-xs font-extrabold tracking-[3px] text-[#111111] uppercase animate-pulse select-none">
            Đang kết nối tới máy chủ...
          </p>
          <span className="mt-2 text-[10px] text-neutral-400 font-medium">
            Vui lòng chờ trong giây lát
          </span>
        </div>
      ) : (
        children
      )}
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
