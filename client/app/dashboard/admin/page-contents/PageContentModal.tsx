"use client";

import { useState, useEffect } from "react";

interface ContentItem {
  key: string;
  value: string;
  updated_at?: string;
}

interface PageContentModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  item?: ContentItem;
  onClose: () => void;
  onSaved: () => void;
  createKey: (key: string, value: string) => Promise<any>;
  updateText: (key: string, value: string) => Promise<any>;
}

export default function PageContentModal({
  isOpen,
  mode,
  item,
  onClose,
  onSaved,
  createKey,
  updateText,
}: PageContentModalProps) {
  const [formData, setFormData] = useState({ key: "", value: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && item) {
        setFormData({ key: item.key, value: item.value });
      } else {
        setFormData({ key: "", value: "" });
      }
      setFormError("");
    }
  }, [isOpen, mode, item]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.value.trim()) {
      setFormError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      if (mode === "create") {
        const keyPattern = /^[a-zA-Z0-9_]+$/;
        if (!keyPattern.test(formData.key)) {
          setFormError("Key chỉ được chứa chữ cái, số và dấu gạch dưới (_).");
          return;
        }
        await createKey(formData.key, formData.value);
      } else {
        await updateText(formData.key, formData.value);
      }
      onSaved();
    } catch (err: any) {
      setFormError(err.message ?? "Lỗi lưu dữ liệu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal header */}
        <div className="px-6 py-4.5 bg-[#f9fafb] border-b-2 border-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F8DE22] border-2 border-[#111111] rounded-full inline-block" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
              {mode === "create" ? "Tạo Cấu Hình Mới" : "Chỉnh Sửa Giá Trị Cấu Hình"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-black hover:bg-[#E11D48] hover:text-white cursor-pointer transition-colors shadow-[1px_1px_0px_#111111]"
          >
            ✕
          </button>
        </div>

        {/* Modal form */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          {formError && (
            <div className="p-3.5 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
              Mã Key Định Danh {mode === "edit" && <span className="text-red-500 font-bold">(Không thể sửa)</span>}
            </label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData((prev) => ({ ...prev, key: e.target.value }))}
              disabled={mode === "edit"}
              placeholder="Ví dụ: hero_title_main, announcement_banner_text"
              className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            />
            {mode === "create" && (
              <p className="text-[10px] text-gray-500 font-bold mt-1.5">
                * Chỉ cho phép chữ cái thường/hoa, chữ số và dấu gạch dưới (_). Nên đặt tiền tố như <code className="font-mono text-black font-extrabold bg-gray-100 px-1 py-px rounded">hero_</code> hoặc <code className="font-mono text-black font-extrabold bg-gray-100 px-1 py-px rounded">announcement_</code> để tự động phân nhóm.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
              Nội dung hiển thị (Giá trị cấu hình)
            </label>
            <textarea
              value={formData.value}
              onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
              placeholder="Nhập chuỗi văn bản hoặc HTML đơn giản muốn hiển thị..."
              rows={6}
              className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-semibold focus:outline-none bg-white font-sans focus:bg-[#fdfdfd] transition-colors"
            />
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
