"use client";

import { useState } from "react";
import { User } from "@/types/api";
import { UpdateUserData } from "@/hooks/useUsers";

interface CustomerModalProps {
  user: User;
  onClose: () => void;
  onSaved: () => void;
  onUpdate: (id: string, data: UpdateUserData) => Promise<void>;
}

export default function CustomerModal({ user, onClose, onSaved, onUpdate }: CustomerModalProps) {
  const [fullName, setFullName] = useState(user.full_name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isActive, setIsActive] = useState(user.is_active);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Họ tên không được để trống");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await onUpdate(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        is_active: isActive,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = error;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#111111]">
          <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#111111]">
            Chỉnh Sửa Khách Hàng
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f9fa] transition-colors cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {displayError && (
            <div className="p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold rounded-lg">
              ⚠️ {displayError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">Email</label>
            <input
              value={user.email}
              disabled
              className="border-2 border-[#111111]/30 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#f7f9fa] text-[#555]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
              Họ và tên <span className="text-[#D12052]">*</span>
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-2 border-[#111111] py-2.5 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">Số điện thoại</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0901234567"
              className="border-2 border-[#111111] py-2.5 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#03AED2]" />
            </label>
            <span className="text-xs font-bold text-[#111111]">Tài khoản đang hoạt động</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#f7f9fa] transition-all cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-[#111111] text-white border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer shadow-[3px_3px_0px_#D12052] disabled:opacity-60"
            >
              {isLoading ? "Đang lưu..." : "Lưu Lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
