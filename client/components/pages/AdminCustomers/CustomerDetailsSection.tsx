"use client";

import React from "react";
import { User } from "@/types/api";

interface CustomerDetailsSectionProps {
  user: User;
  formatDateTime: (dateStr?: string) => string;
}

export default function CustomerDetailsSection({
  user,
  formatDateTime,
}: CustomerDetailsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-[#111111] rounded-xl bg-[#03AED2]/5 shadow-[3px_3px_0px_#111111]">
        <div className="w-20 h-20 rounded-full border-2 border-[#111111] overflow-hidden bg-white shadow-[2px_2px_0px_#111111] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url || "https://api.dicebear.com/7.x/initials/svg?seed=Avatar"}
            alt={user.full_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center sm:text-left space-y-1 w-full">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h3 className="text-lg font-extrabold text-[#111111]">{user.full_name}</h3>
            <span className="text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 bg-[#F8DE22] text-[#111111] border border-[#111111] rounded shadow-[1px_1px_0px_#111111]">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-[#555] font-semibold">{user.email}</p>
          <p className="text-xs text-[#555] font-semibold">SĐT: {user.phone ?? "Chưa cung cấp"}</p>
        </div>
      </div>

      {/* Detail Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 border-2 border-[#111111] rounded-xl bg-[#f7f9fa]">
          <span className="text-[9px] font-extrabold text-[#888] uppercase tracking-wider">Ngày đăng ký</span>
          <p className="text-xs font-bold text-[#111111] mt-0.5">{formatDateTime(user.created_at)}</p>
        </div>
        <div className="p-3.5 border-2 border-[#111111] rounded-xl bg-[#f7f9fa]">
          <span className="text-[9px] font-extrabold text-[#888] uppercase tracking-wider">Trạng thái</span>
          <p className="mt-1 flex items-center">
            <span
              className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-[#111111] ${
                user.is_active
                  ? "bg-green-50 text-green-700"
                  : "bg-[#D12052]/10 text-[#D12052]"
              }`}
            >
              {user.is_active ? "Đang hoạt động" : "Bị vô hiệu"}
            </span>
          </p>
        </div>
      </div>

      {/* Addresses List */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
          🏠 Sổ địa chỉ nhận hàng ({user.addresses?.length ?? 0})
        </h4>
        {!user.addresses || user.addresses.length === 0 ? (
          <p className="text-xs text-[#888] italic bg-neutral-50 p-4 border-2 border-dashed border-[#111111]/10 rounded-xl text-center">
            Khách hàng chưa đăng ký địa chỉ nhận hàng nào.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {user.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-3.5 border-2 border-[#111111] rounded-xl bg-white shadow-[2px_2px_0px_#111111]"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] font-extrabold text-[#111111]">{addr.name}</span>
                  <span className="text-[10.5px] font-bold text-[#555]">({addr.phone})</span>
                  {addr.is_default && (
                    <span className="text-[7.5px] font-extrabold uppercase px-1.5 py-0.2 bg-green-50 text-green-700 border border-green-200 rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#333] mt-1 leading-relaxed">{addr.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
