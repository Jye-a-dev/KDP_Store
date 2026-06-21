"use client";

import React, { useState, useEffect } from "react";
import { User, UserAddress } from "@/types/api";
import AddressSection from "./AddressSection";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
];

interface CustomerEditSectionProps {
  mode: "edit" | "create";
  user?: User;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  role: "customer" | "admin";
  setRole: (val: "customer" | "admin") => void;
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  avatarUrl: string;
  setAvatarUrl: (val: string) => void;
  addresses: UserAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<UserAddress[]>>;
  error: string;
  isLoading: boolean;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function CustomerEditSection({
  mode,
  user,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  fullName,
  setFullName,
  phone,
  setPhone,
  isActive,
  setIsActive,
  avatarUrl,
  setAvatarUrl,
  addresses,
  setAddresses,
  error,
  isLoading,
  onClose,
  handleSubmit,
}: CustomerEditSectionProps) {
  // Avatar Source state
  const [avatarSource, setAvatarSource] = useState<"presets" | "device" | "url" | "drive">("presets");
  const [driveInput, setDriveInput] = useState("");

  useEffect(() => {
    const initialAvatar = user?.avatar_url || "";
    if (PRESET_AVATARS.includes(initialAvatar) || !initialAvatar) {
      setAvatarSource("presets");
    } else if (initialAvatar.startsWith("data:image/")) {
      setAvatarSource("device");
    } else if (initialAvatar.includes("drive.google.com") || initialAvatar.includes("drive.google.com/uc")) {
      setAvatarSource("drive");
      setDriveInput(initialAvatar);
    } else {
      setAvatarSource("url");
    }
  }, [user?.avatar_url]);

  const convertGoogleDriveUrl = (url: string): string => {
    if (!url) return "";
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Kích thước hình ảnh tối đa 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDriveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDriveInput(input);
    const converted = convertGoogleDriveUrl(input);
    setAvatarUrl(converted);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Avatar Edit Section */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-[#111111]/10 rounded-xl bg-neutral-50/50">
        <div className="w-16 h-16 rounded-full border-2 border-[#111111] overflow-hidden bg-white shadow-[2px_2px_0px_#111111] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=Avatar"}
            alt="Avatar Preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2.5 w-full">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#03AED2]">
            Ảnh Đại Diện Khách Hàng
          </span>

          <div className="flex border border-[#111111] rounded-lg overflow-hidden bg-white text-[9px]">
            {(["presets", "device", "url", "drive"] as const).map((src) => {
              const labels = {
                presets: "Presets",
                device: "Thiết bị",
                url: "URL",
                drive: "Drive",
              };
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setAvatarSource(src)}
                  className={`flex-1 py-1 font-extrabold uppercase cursor-pointer border-r border-[#111111] last:border-none transition-colors ${
                    avatarSource === src
                      ? "bg-[#111111] text-white"
                      : "bg-white text-[#111111] hover:bg-[#f7f9fa]"
                  }`}
                >
                  {labels[src]}
                </button>
              );
            })}
          </div>

          {avatarSource === "presets" && (
            <div className="flex gap-2 justify-center py-1">
              {PRESET_AVATARS.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setAvatarUrl(src)}
                  className={`w-7 h-7 rounded-full border overflow-hidden transition-all ${
                    avatarUrl === src
                      ? "border-2 border-[#03AED2] scale-110 shadow-md"
                      : "border-gray-300 hover:scale-105"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {avatarSource === "device" && (
            <div className="flex flex-col gap-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border file:border-gray-300 file:text-[10px] file:font-semibold file:bg-white file:text-[#111111] hover:file:bg-neutral-50 cursor-pointer"
              />
              {avatarUrl.startsWith("data:image/") && (
                <span className="text-[8px] font-bold text-emerald-600">✓ Đã tải ảnh lên thành công</span>
              )}
            </div>
          )}

          {avatarSource === "url" && (
            <input
              type="text"
              value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Nhập link ảnh tùy chỉnh (https://...)"
              className="border border-[#111111] py-1.5 px-3 rounded-lg text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white"
            />
          )}

          {avatarSource === "drive" && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={driveInput}
                onChange={handleDriveChange}
                placeholder="Dán link Google Drive..."
                className="border border-[#111111] py-1.5 px-3 rounded-lg text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white"
              />
              <span className="text-[8px] font-semibold text-gray-500 uppercase">
                💡 Link chia sẻ Drive ở chế độ công khai xem
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Account Details */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
          Email <span className="text-[#D12052]">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="border-2 border-[#111111] py-2.5 px-3 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
          {mode === "create" ? "Mật khẩu" : "Mật khẩu mới (để trống nếu không đổi)"}{" "}
          {mode === "create" && <span className="text-[#D12052]">*</span>}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "create" ? "••••••••" : "Nhập mật khẩu mới..."}
          className="border-2 border-[#111111] py-2.5 px-3 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
          Vai trò <span className="text-[#D12052]">*</span>
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "customer" | "admin")}
          className="border-2 border-[#111111] py-2.5 px-3 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa] bg-white cursor-pointer"
        >
          <option value="customer">Khách Hàng (Customer)</option>
          <option value="admin">Quản Trị Viên (Admin)</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
          Họ và tên <span className="text-[#D12052]">*</span>
        </label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border-2 border-[#111111] py-2.5 px-3 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">Số điện thoại</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0901234567"
          className="border-2 border-[#111111] py-2.5 px-3 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#03AED2] border border-gray-300" />
        </label>
        <span className="text-xs font-bold text-[#111111]">Tài khoản đang hoạt động</span>
      </div>

      {/* Address Book Sub-Component */}
      <AddressSection
        addresses={addresses}
        setAddresses={setAddresses}
        fullName={fullName}
        phone={phone}
      />

      {/* Action buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#111111]/10 mt-6 bg-white shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#f7f9fa] transition-all cursor-pointer bg-white"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl bg-[#111111] text-white border-2 border-[#111111] text-[12px] font-extrabold uppercase hover:bg-[#F8DE22] hover:text-[#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer shadow-[3px_3px_0px_#D12052] disabled:opacity-60"
        >
          {isLoading ? "Đang lưu..." : "Lưu Lại"}
        </button>
      </div>
    </form>
  );
}
