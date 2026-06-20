"use client";

import { useState, useEffect } from "react";
import { User, UserAddress } from "@/types/api";
import { UpdateUserData } from "@/hooks/useUsers";

interface CustomerModalProps {
  user: User;
  initialMode: "details" | "edit";
  onClose: () => void;
  onSaved: () => void;
  onUpdate: (id: string, data: UpdateUserData) => Promise<void>;
}

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella"
];

export default function CustomerModal({
  user,
  initialMode,
  onClose,
  onSaved,
  onUpdate,
}: CustomerModalProps) {
  const [mode, setMode] = useState<"details" | "edit">(initialMode);
  const [fullName, setFullName] = useState(user.full_name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isActive, setIsActive] = useState(user.is_active);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url ?? "");
  const [addresses, setAddresses] = useState<UserAddress[]>(user.addresses ?? []);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Avatar Source state: presets, device, url, drive
  const [avatarSource, setAvatarSource] = useState<"presets" | "device" | "url" | "drive">("presets");
  const [driveInput, setDriveInput] = useState("");

  // Address Form State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrValue, setAddrValue] = useState("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  useEffect(() => {
    const initialAvatar = user.avatar_url || "";
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
  }, [user.avatar_url]);

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

  // Address CRUD Handlers
  const handleOpenNewAddress = () => {
    setEditingAddressIndex(null);
    setAddrName(fullName || "");
    setAddrPhone(phone || "");
    setAddrValue("");
    setAddrIsDefault(addresses.length === 0);
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (index: number) => {
    const addr = addresses[index];
    setEditingAddressIndex(index);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrValue(addr.address);
    setAddrIsDefault(!!addr.is_default);
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = () => {
    if (!addrName.trim() || !addrPhone.trim() || !addrValue.trim()) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    let updatedAddresses = [...addresses];

    const newAddr: UserAddress = {
      name: addrName.trim(),
      phone: addrPhone.trim(),
      address: addrValue.trim(),
      is_default: addrIsDefault,
    };

    if (addrIsDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, is_default: false }));
    }

    if (editingAddressIndex !== null) {
      updatedAddresses[editingAddressIndex] = newAddr;
    } else {
      updatedAddresses.push(newAddr);
    }

    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.is_default)) {
      updatedAddresses[0].is_default = true;
    }

    setAddresses(updatedAddresses);
    setIsAddressFormOpen(false);
  };

  const handleDeleteAddress = (index: number) => {
    const isDeletedDefault = addresses[index].is_default;
    let updatedAddresses = addresses.filter((_, i) => i !== index);
    
    if (isDeletedDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].is_default = true;
    }

    setAddresses(updatedAddresses);
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

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
        avatar_url: avatarUrl || undefined,
        addresses: addresses,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#111111] bg-white shrink-0">
          <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#111111]">
            Hồ Sơ Khách Hàng
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f9fa] transition-colors cursor-pointer border-2 border-transparent active:border-[#111111]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-[#111111] bg-neutral-50 shrink-0">
          <button
            type="button"
            onClick={() => setMode("details")}
            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors border-r-2 border-[#111111] cursor-pointer ${
              mode === "details" ? "bg-white text-[#111111]" : "text-[#555] hover:bg-[#f7f9fa]"
            }`}
          >
            📋 Chi Tiết
          </button>
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
              mode === "edit" ? "bg-white text-[#111111]" : "text-[#555] hover:bg-[#f7f9fa]"
            }`}
          >
            ✏️ Chỉnh Sửa
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {mode === "details" ? (
            /* ==================== DETAILS VIEW ==================== */
            <div className="space-y-6">
              {/* Profile Overview */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-[#111111] rounded-xl bg-[#03AED2]/5 shadow-[3px_3px_0px_#111111]">
                <div className="w-20 h-20 rounded-full border-2 border-[#111111] overflow-hidden bg-white shadow-[2px_2px_0px_#111111] shrink-0">
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
          ) : (
            /* ==================== EDIT FORM VIEW ==================== */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              {/* Avatar Edit Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-[#111111]/10 rounded-xl bg-neutral-50/50">
                <div className="w-16 h-16 rounded-full border-2 border-[#111111] overflow-hidden bg-white shadow-[2px_2px_0px_#111111] shrink-0">
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
                        drive: "Drive"
                      };
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setAvatarSource(src)}
                          className={`flex-1 py-1 font-extrabold uppercase cursor-pointer border-r border-[#111111] last:border-none transition-colors ${
                            avatarSource === src ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#f7f9fa]"
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
                            avatarUrl === src ? "border-2 border-[#03AED2] scale-110 shadow-md" : "border-gray-300 hover:scale-105"
                          }`}
                        >
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

              {/* Admin Address CRUD Book */}
              <div className="border-t border-[#111111]/10 pt-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h4 className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
                    🏠 Sổ Địa Chỉ Nhận Hàng ({addresses.length})
                  </h4>
                  {!isAddressFormOpen && (
                    <button
                      type="button"
                      onClick={handleOpenNewAddress}
                      className="px-2.5 py-1 bg-[#03AED2] text-white border border-[#111111] rounded-lg text-[9px] font-extrabold uppercase cursor-pointer hover:bg-[#0295b3] transition-colors"
                    >
                      + Thêm
                    </button>
                  )}
                </div>

                {isAddressFormOpen && (
                  <div className="p-3.5 border border-[#111111] rounded-xl bg-[#f7f9fa] mb-3 space-y-3">
                    <h5 className="text-[9px] font-black uppercase text-[#111111]">
                      {editingAddressIndex !== null ? "✏️ Sửa địa chỉ" : "✨ Thêm địa chỉ mới"}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-extrabold uppercase text-[#555]">Họ tên người nhận</label>
                        <input
                          type="text"
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="border border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold bg-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-extrabold uppercase text-[#555]">Số điện thoại</label>
                        <input
                          type="tel"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          placeholder="09XXXXXXXX"
                          className="border border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold bg-white outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-extrabold uppercase text-[#555]">Địa chỉ nhận hàng</label>
                      <input
                        type="text"
                        value={addrValue}
                        onChange={(e) => setAddrValue(e.target.value)}
                        placeholder="Số nhà, tên đường, quận/huyện..."
                        className="border border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold bg-white outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="modal_is_default"
                        checked={addrIsDefault}
                        onChange={(e) => setAddrIsDefault(e.target.checked)}
                        disabled={editingAddressIndex !== null && addresses[editingAddressIndex]?.is_default}
                        className="w-3.5 h-3.5 border border-[#111111] rounded cursor-pointer"
                      />
                      <label htmlFor="modal_is_default" className="text-[9px] font-extrabold uppercase text-[#111111] cursor-pointer">
                        Mặc định
                      </label>
                    </div>
                    <div className="flex gap-2 justify-end text-[9px] font-extrabold">
                      <button
                        type="button"
                        onClick={() => setIsAddressFormOpen(false)}
                        className="px-2.5 py-1 border border-[#111111] bg-white rounded-md hover:bg-gray-100 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        className="px-2.5 py-1 bg-[#F8DE22] border border-[#111111] rounded-md hover:bg-[#e6c51f] transition-colors"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <p className="text-[10px] font-semibold text-[#888] italic bg-neutral-50 p-3 border border-dashed border-gray-300 rounded-xl text-center">
                    Chưa có địa chỉ nào được đăng ký.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start gap-3 p-3 border border-gray-300 rounded-xl bg-[#f7f9fa]/50 hover:bg-[#f7f9fa] transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-extrabold text-[#111111]">{addr.name}</span>
                            <span className="text-[10px] font-semibold text-[#666]">({addr.phone})</span>
                            {addr.is_default && (
                              <span className="text-[7px] font-extrabold uppercase px-1 bg-green-50 text-green-700 border border-green-200 rounded">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#333] font-medium leading-normal">{addr.address}</p>
                        </div>

                        <div className="flex gap-1 shrink-0 text-[8px] font-extrabold">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAddress(idx)}
                            className="px-2 py-0.5 bg-white border border-[#111111] rounded hover:bg-[#F8DE22] transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(idx)}
                            className="px-2 py-0.5 bg-white text-[#D12052] border border-[#D12052] rounded hover:bg-[#D12052]/10 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
          )}
        </div>
      </div>
    </div>
  );
}
