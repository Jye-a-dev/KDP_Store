import { useState } from "react";
import Link from "next/link";
import EditableText from "@/components/layouts/(public)/EditableText";
import { usePageContent } from "@/contexts/PageContentContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Newsletter() {
  const { content, updateText } = usePageContent();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlVal, setUrlVal] = useState("");

  const ctaUrl = content.newsletter_cta_url || "/products";

  return (
    <section className="w-full bg-[#F8DE22] py-20 px-5 text-center text-[#111111] border-y-3 border-[#111111]">
      <div className="max-w-137.5 mx-auto flex flex-col items-center">
        <EditableText
          contentKey="newsletter_title"
          element="h3"
          className="text-[22px] md:text-[26px] font-extrabold uppercase tracking-wide mb-2.5"
        />
        <EditableText
          contentKey="newsletter_description"
          element="p"
          className="text-[13px] md:text-[14px] mb-6 font-semibold leading-relaxed block"
          multiline
        />
        
        <div className="flex flex-col items-center gap-3 w-full">
          {isEditingUrl ? (
            <div className="flex items-center gap-2 mt-2 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={urlVal}
                onChange={(e) => setUrlVal(e.target.value)}
                placeholder="Nhập URL liên kết (VD: /products)..."
                className="flex-1 border-2 border-[#111111] bg-white text-[#111111] font-semibold text-xs px-3 py-3.5 rounded-xl outline-none shadow-[2px_2px_0px_#111111]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateText("newsletter_cta_url", urlVal);
                    setIsEditingUrl(false);
                  }
                  if (e.key === "Escape") setIsEditingUrl(false);
                }}
              />
              <span
                role="button"
                tabIndex={0}
                onClick={() => {
                  updateText("newsletter_cta_url", urlVal);
                  setIsEditingUrl(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateText("newsletter_cta_url", urlVal);
                    setIsEditingUrl(false);
                  }
                }}
                className="w-10 h-10 rounded-xl bg-green-500 text-white border-2 border-[#111111] flex items-center justify-center text-xs font-black cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111]"
                title="Lưu"
              >
                ✓
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={() => setIsEditingUrl(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingUrl(false);
                }}
                className="w-10 h-10 rounded-xl bg-[#D12052] text-white border-2 border-[#111111] flex items-center justify-center text-xs font-black cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111]"
                title="Hủy"
              >
                ✕
              </span>
            </div>
          ) : (
            <div className="relative group/cta">
              <Link 
                href={ctaUrl}
                className="inline-block bg-[#F45B26] text-white border-2 border-[#111111] uppercase font-extrabold px-8 py-4 text-xs md:text-sm tracking-widest rounded-xl shadow-[4px_4px_0px_#111111] hover:bg-[#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all duration-300"
              >
                <EditableText contentKey="newsletter_btn" />
              </Link>
              {isAdmin && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setUrlVal(ctaUrl);
                    setIsEditingUrl(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setUrlVal(ctaUrl);
                      setIsEditingUrl(true);
                    }
                  }}
                  className="absolute -top-3 -right-3 bg-[#03AED2] text-white border border-[#111111] shadow-[1px_1px_0px_#111111] rounded w-6 h-6 flex items-center justify-center text-[10px] cursor-pointer hover:scale-105 z-40"
                  title="Sửa URL liên kết"
                >
                  🔗
                </span>
              )}
            </div>
          )}
          {isAdmin && !isEditingUrl && (
            <span className="text-[9px] text-[#111111]/60 font-bold uppercase tracking-wider mt-1 block">
              Liên kết hiện tại: <code className="font-mono bg-white/20 px-1 py-0.5 rounded">{ctaUrl}</code>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
