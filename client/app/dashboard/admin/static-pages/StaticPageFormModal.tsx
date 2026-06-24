"use client";

import { useState, useEffect } from "react";
import { StaticPage } from "@/types/api";
import RichTextEditor from "@/components/common/RichTextEditor";

interface StaticPageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  mode: "create" | "edit";
  item?: StaticPage;
  token: string | null;
  apiUrl: string;
}

export default function StaticPageFormModal({
  isOpen,
  onClose,
  onSaved,
  mode,
  item,
  token,
  apiUrl,
}: StaticPageFormModalProps) {
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    content: "",
    group_type: "service" as "service" | "explore",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && item) {
        setFormData({
          slug: item.slug,
          title: item.title,
          content: item.content,
          group_type: item.group_type,
        });
      } else {
        setFormData({
          slug: "",
          title: "",
          content: "",
          group_type: "service",
        });
      }
      setFormError("");
    }
  }, [isOpen, mode, item]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      setFormError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(formData.slug)) {
      setFormError("Slug chỉ được chứa chữ cái viết thường, chữ số và dấu gạch ngang (-).");
      return;
    }

    try {
      const url =
        mode === "create"
          ? `${apiUrl}/static-pages`
          : `${apiUrl}/static-pages/${item?.id}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? "Lỗi lưu dữ liệu trang.");
      }

      onSaved();
    } catch (err: any) {
      setFormError(err.message ?? "Lỗi hệ thống.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4.5 bg-[#f9fafb] border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F8DE22] border-2 border-[#111111] rounded-full inline-block" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
              {mode === "create" ? "Tạo Trang Tĩnh Mới" : "Sửa Nội Dung Trang Tĩnh"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-black hover:bg-[#E11D48] hover:text-white cursor-pointer transition-colors shadow-[1px_1px_0px_#111111]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {formError && (
            <div className="p-3.5 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                Tiêu Đề Trang
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Ví dụ: Chính Sách Bảo Hành"
                className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                Đường dẫn tĩnh (Slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  }))
                }
                placeholder="ví-du-chinh-sach-bao-hanh"
                className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
              Nhóm Phân Loại ở Footer
            </label>
            <select
              value={formData.group_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  group_type: e.target.value as "service" | "explore",
                }))
              }
              className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer"
            >
              <option value="service">Dịch Vụ (Cột 1 ở Footer)</option>
              <option value="explore">Khám Phá (Cột 2 ở Footer)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
              Nội Dung Trang (Hỗ trợ định dạng HTML)
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              placeholder="Nhập nội dung hiển thị của trang..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-4 border-t border-[#111111]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#F8DE22] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
