"use client";

import { useState } from "react";
import HtmlEditor from "@/components/common/HtmlEditor";

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (createdPage: any) => void;
  token: string;
  apiUrl: string;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
};

export default function CreatePageModal({
  isOpen,
  onClose,
  onCreated,
  token,
  apiUrl,
}: CreatePageModalProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newGroup, setNewGroup] = useState<"service" | "explore">("service");

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newTitle.trim() || !newSlug.trim() || !newContent.trim()) {
      alert("Vui lòng điền đầy đủ các thông tin!");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/static-pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug,
          content: newContent,
          group_type: newGroup,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? "Lỗi khi tạo trang tĩnh mới!");
      }

      const createdPage = await res.json();
      setNewTitle("");
      setNewSlug("");
      setNewContent("");
      setNewGroup("service");
      onCreated(createdPage);
    } catch (err: any) {
      alert(err.message ?? "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal header */}
        <div className="px-6 py-4.5 bg-[#f9fafb] border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#03AED2] border-2 border-[#111111] rounded-full inline-block" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
              Tạo Trang Tĩnh Mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-black hover:bg-[#E11D48] hover:text-white cursor-pointer transition-colors shadow-[1px_1px_0px_#111111]"
          >
            ✕
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                Tiêu đề trang
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  setNewSlug(slugify(e.target.value));
                }}
                placeholder="Ví dụ: Hướng dẫn mua hàng"
                className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white text-black"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                Đường dẫn tĩnh (Slug)
              </label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
                placeholder="huong-dan-mua-hang"
                className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
              Phân nhóm trang
            </label>
            <div className="flex gap-3">
              {[
                { value: "service", label: "Chính Sách Dịch Vụ" },
                { value: "explore", label: "Khám Phá KDP Store" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setNewGroup(option.value as any)}
                  className={`px-4 py-2 border-2 border-[#111111] text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer ${
                    newGroup === option.value
                      ? "bg-[#03AED2] text-white shadow-[2px_2px_0px_#111111]"
                      : "bg-white text-[#111111] hover:bg-neutral-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
              Nội dung trang
            </label>
            <HtmlEditor value={newContent} onChange={setNewContent} />
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-4 border-t border-[#111111]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2.5 bg-[#03AED2] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer"
            >
              ➕ Tạo trang mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
