"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePageContent } from "@/contexts/PageContentContext";
import EditableText from "@/components/layouts/(public)/EditableText";

export default function Hero() {
  const { user } = useAuth();
  const { content, updateText } = usePageContent();
  const [showModal, setShowModal] = useState(false);
  const [bannerInput, setBannerInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const isAdmin = user?.role === "admin";
  const bannerUrl = content.hero_banner_url || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1920&q=80";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerInput(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setIsUploading(false);
        alert("Lỗi khi đọc file!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = async () => {
    try {
      await updateText("hero_banner_url", bannerInput);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật ảnh banner!");
    }
  };

  return (
    <section 
      className="h-[55vh] md:h-[75vh] w-full bg-cover bg-center flex items-center px-[5%] md:px-[8%] relative"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.25)), url('${bannerUrl}')`
      }}
    >
      <div className="text-white max-w-150 text-left z-10">
        <EditableText
          contentKey="hero_tagline"
          element="span"
          className="text-[11px] uppercase tracking-[2px] bg-[#03AED2] text-white px-2.5 py-1 font-bold inline-block mb-4"
        />
        <h1 className="text-[34px] sm:text-[44px] md:text-[60px] font-extrabold leading-[1.1] uppercase mb-4 tracking-tight flex flex-col items-start gap-1">
          <EditableText contentKey="hero_title_normal" element="span" />
          <EditableText
            contentKey="hero_title_highlight"
            element="mark"
            className="bg-[#F8DE22] text-[#111111] px-2.5 py-0.5 inline-block"
          />
        </h1>
        <EditableText
          contentKey="hero_description"
          element="p"
          className="mb-6 font-semibold text-[13px] md:text-[15px] text-white/90 leading-relaxed max-w-lg block"
          multiline
        />
        <div className="block">
          <a 
            href="#products-section" 
            className="inline-block bg-[#F45B26] text-white px-8.75 md:px-11.25 py-3.5 md:py-4 uppercase text-[12px] md:text-[13px] font-bold tracking-[1px] border-3 border-[#111111] shadow-[5px_5px_0px_#111111] md:hover:bg-[#D12052] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[4px_4px_0px_#111111] transition-all duration-200 cursor-pointer"
          >
            <EditableText contentKey="hero_btn" />
          </a>
        </div>
      </div>

      {isAdmin && (
        <button
          onClick={() => {
            setBannerInput(bannerUrl);
            setShowModal(true);
          }}
          className="absolute bottom-4 right-4 z-20 px-4 py-2.5 bg-[#F8DE22] text-[#111111] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center gap-2"
        >
          ✏️ Sửa Ảnh Banner
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden">
            <div className="px-6 py-4.5 bg-[#f9fafb] border-b-2 border-[#111111] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#F8DE22] border-2 border-[#111111] rounded-full inline-block" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                  Chỉnh Sửa Ảnh Banner
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-black hover:bg-[#E11D48] hover:text-white cursor-pointer transition-colors shadow-[1px_1px_0px_#111111]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Đường dẫn ảnh (URL)
                </label>
                <input
                  type="text"
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white text-black"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Hoặc tải ảnh từ thiết bị
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-2 file:border-[#111111] file:text-xs file:font-black file:bg-[#F8DE22] file:text-[#111111] hover:file:bg-[#F8DE22]/90 cursor-pointer"
                />
              </div>

              {bannerInput && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">Xem trước:</p>
                  <div className="relative aspect-video w-full border-2 border-[#111111] rounded-xl overflow-hidden bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bannerInput}
                      alt="Banner Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-3 pt-4 border-t border-[#111111]/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4.5 py-2.5 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveBanner}
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-[#F8DE22] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Đang tải lên..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

