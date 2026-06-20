"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StaticPage } from "@/types/api";

export default function ExploreServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [page, setPage] = useState<StaticPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/static-pages/slug/${slug}`);
        if (!res.ok) {
          throw new Error("Không thể tải thông tin trang này");
        }
        const data = await res.json();
        setPage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug, API_URL]);

  if (isLoading) {
    return (
      <div className="flex min-h-125 w-full items-center justify-center bg-white py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center text-center px-6 py-20 bg-white">
        <div className="text-5xl">⚠️</div>
        <h3 className="mt-4 text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy nội dung</h3>
        <p className="mt-1 text-sm text-[#555555]">
          {error || "Trang bạn tìm kiếm không khả dụng hoặc đã bị gỡ bỏ."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-12 px-[5%] md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Quay lại trang chủ
        </button>

        {/* Content Box styled in Neo-brutalism */}
        <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden">
          {/* Header title block */}
          <div className="px-6 py-8 bg-[#F8DE22] border-b-2 border-[#111111]">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#111111] bg-white/40 border border-[#111111] px-2 py-0.5 rounded">
              {page.group_type === "service" ? "Chính Sách Dịch Vụ" : "Khám Phá KDP Store"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide mt-3 leading-tight">
              {page.title}
            </h1>
          </div>

          {/* HTML rendering section */}
          <div className="p-8 prose max-w-none text-[#222] font-semibold text-xs leading-relaxed font-sans">
            <div 
              className="flex flex-col gap-4 dynamic-html-content"
              dangerouslySetInnerHTML={{ __html: page.content }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
