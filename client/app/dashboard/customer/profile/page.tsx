"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/hooks/useUsers";
import { UserAddress } from "@/types/api";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella"
];

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { updateUser, isLoading } = useUsers();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      const currentAvatar = user.avatar_url || "";
      setAvatarUrl(currentAvatar);
      setAddresses(user.addresses || []);

      if (PRESET_AVATARS.includes(currentAvatar) || !currentAvatar) {
        setAvatarSource("presets");
      } else if (currentAvatar.startsWith("data:image/")) {
        setAvatarSource("device");
      } else if (currentAvatar.includes("drive.google.com") || currentAvatar.includes("drive/folders") || currentAvatar.includes("drive.google.com/uc")) {
        setAvatarSource("drive");
        setDriveInput(currentAvatar);
      } else {
        setAvatarSource("url");
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!user?.id) return;

    try {
      // 1. Update on backend
      await updateUser(user.id, {
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
        addresses: addresses,
      });

      // 2. Update client auth context state and localStorage
      updateProfile({
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
        addresses: addresses,
      });

      setSuccessMsg("🎉 Cập nhật hồ sơ thành công!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Cập nhật hồ sơ thất bại");
    }
  };

  // Address CRUD Handlers
  const handleOpenNewAddress = () => {
    setEditingAddressIndex(null);
    setAddrName(user?.full_name || "");
    setAddrPhone(user?.phone || "");
    setAddrValue("");
    setAddrIsDefault(addresses.length === 0); // Default if first address
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

    // If marked default, unmark others
    if (addrIsDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, is_default: false }));
    }

    if (editingAddressIndex !== null) {
      updatedAddresses[editingAddressIndex] = newAddr;
    } else {
      updatedAddresses.push(newAddr);
    }

    // Double check if at least one is default (if exists)
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.is_default)) {
      updatedAddresses[0].is_default = true;
    }

    setAddresses(updatedAddresses);
    setIsAddressFormOpen(false);
  };

  const handleDeleteAddress = (index: number) => {
    const isDeletedDefault = addresses[index].is_default;
    let updatedAddresses = addresses.filter((_, i) => i !== index);
    
    // Assign new default if we deleted the default one
    if (isDeletedDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].is_default = true;
    }

    setAddresses(updatedAddresses);
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-8 px-4 pt-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/customer")}
        className="mb-6 inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Quay lại Dashboard
      </button>

      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] p-6 mb-8">
        <h1 className="text-xl font-extrabold uppercase tracking-wider text-[#111111] mb-6 inline-block relative">
          Thông tin cá nhân
          <span className="absolute -z-10 bottom-0.5 left-0 right-0 h-2 bg-[#03AED2]/20" />
        </h1>

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 text-xs font-bold rounded-xl">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Avatar Edit Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-[#111111]/10 rounded-xl bg-neutral-50/50">
            <div className="w-20 h-20 rounded-full border-2 border-[#111111] overflow-hidden bg-white shadow-[2px_2px_0px_#111111] shrink-0">
              <img
                src={avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=Avatar"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#03AED2]">
                Ảnh Đại Diện
              </span>

              {/* Source Switcher */}
              <div className="flex border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111] bg-white">
                {(["presets", "device", "url", "drive"] as const).map((src) => {
                  const labels = {
                    presets: "Presets",
                    device: "Thiết bị",
                    url: "URL",
                    drive: "Google Drive"
                  };
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setAvatarSource(src)}
                      className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase cursor-pointer border-r border-[#111111] last:border-none transition-colors ${
                        avatarSource === src ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#f7f9fa]"
                      }`}
                    >
                      {labels[src]}
                    </button>
                  );
                })}
              </div>

              {/* Presets sub-panel */}
              {avatarSource === "presets" && (
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAvatarUrl(p)}
                      className={`w-9 h-9 rounded-full border-2 border-[#111111] overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform bg-white ${
                        avatarUrl === p ? "ring-2 ring-[#F8DE22] border-[#F8DE22]" : ""
                      }`}
                    >
                      <img src={p} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Device sub-panel */}
              {avatarSource === "device" && (
                <div className="flex flex-col gap-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-file-input"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="avatar-file-input"
                    className="py-2 bg-white border-2 border-[#111111] rounded-lg text-center text-[10px] font-extrabold uppercase cursor-pointer hover:bg-neutral-50 shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111]"
                  >
                    📁 Chọn file từ máy tính
                  </label>
                  {avatarUrl.startsWith("data:image/") && (
                    <span className="text-[9px] font-bold text-emerald-600">✓ Đã tải ảnh lên thành công</span>
                  )}
                </div>
              )}

              {/* URL sub-panel */}
              {avatarSource === "url" && (
                <input
                  type="text"
                  value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Nhập link ảnh tùy chỉnh (https://...)"
                  className="border-2 border-[#111111] py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white"
                />
              )}

              {/* Drive sub-panel */}
              {avatarSource === "drive" && (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={driveInput}
                    onChange={handleDriveChange}
                    placeholder="Dán link chia sẻ Google Drive tại đây..."
                    className="border-2 border-[#111111] py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white"
                  />
                  <span className="text-[8px] font-semibold text-gray-500 uppercase">
                    💡 Link chia sẻ Drive ở chế độ &quot;Bất kỳ ai có liên kết đều xem được&quot;
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Địa chỉ Email (Không thể thay đổi)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="border-2 border-[#111111]/20 bg-neutral-100 py-3 px-4 rounded-xl text-sm font-semibold text-gray-400 outline-none cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Họ và tên
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Số điện thoại
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09XXXXXXXX"
              className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Address Book Section */}
          <div className="border-t-2 border-[#111111]/10 pt-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-[13px] font-extrabold uppercase text-[#111111] tracking-wider">
                🏠 Sổ Địa Chỉ Nhận Hàng
              </h3>
              {!isAddressFormOpen && (
                <button
                  type="button"
                  onClick={handleOpenNewAddress}
                  className="px-3 py-1.5 bg-[#03AED2] text-white border-2 border-[#111111] rounded-xl text-[10px] font-extrabold uppercase cursor-pointer hover:bg-[#0295b3] transition-colors shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111]"
                >
                  + Thêm Địa Chỉ
                </button>
              )}
            </div>

            {/* Address Form */}
            {isAddressFormOpen && (
              <div className="p-4 border-2 border-[#111111] rounded-xl bg-[#f7f9fa] shadow-[3px_3px_0px_#111111] mb-4 space-y-4">
                <h4 className="text-[11px] font-extrabold uppercase text-[#111111]">
                  {editingAddressIndex !== null ? "✏️ Sửa địa chỉ" : "✨ Thêm địa chỉ mới"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-extrabold uppercase text-[#555]">Họ tên người nhận</label>
                    <input
                      type="text"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="border-2 border-[#111111] py-2 px-3 rounded-lg text-xs font-semibold bg-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-extrabold uppercase text-[#555]">Số điện thoại</label>
                    <input
                      type="tel"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      placeholder="09XXXXXXXX"
                      className="border-2 border-[#111111] py-2 px-3 rounded-lg text-xs font-semibold bg-white outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555]">Địa chỉ nhận hàng</label>
                  <input
                    type="text"
                    value={addrValue}
                    onChange={(e) => setAddrValue(e.target.value)}
                    placeholder="Số 123, Đường ABC, Phường X, Quận Y, TP. Z"
                    className="border-2 border-[#111111] py-2 px-3 rounded-lg text-xs font-semibold bg-white outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    disabled={editingAddressIndex !== null && addresses[editingAddressIndex]?.is_default}
                    className="w-4 h-4 border-2 border-[#111111] rounded cursor-pointer"
                  />
                  <label htmlFor="is_default" className="text-[10px] font-extrabold uppercase text-[#111111] cursor-pointer">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddressFormOpen(false)}
                    className="px-3 py-1.5 border-2 border-[#111111] bg-white rounded-lg text-[10px] font-extrabold uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    className="px-3 py-1.5 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer hover:bg-[#e6c51f] transition-colors"
                  >
                    Lưu Địa Chỉ
                  </button>
                </div>
              </div>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
              <p className="text-[11px] font-semibold text-[#888] italic bg-neutral-50 p-4 border-2 border-dashed border-[#111111]/10 rounded-xl text-center">
                Chưa có địa chỉ nào được đăng ký. Hãy thêm địa chỉ để nhận hàng nhanh chóng hơn.
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-4 p-4 border-2 border-[#111111] rounded-xl bg-[#f7f9fa]/50 shadow-[2px_2px_0px_#111111] hover:bg-[#f7f9fa] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12px] font-extrabold text-[#111111]">{addr.name}</span>
                        <span className="text-[10px] font-bold text-[#666]">({addr.phone})</span>
                        {addr.is_default && (
                          <span className="text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#333] font-medium leading-relaxed">{addr.address}</p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditAddress(idx)}
                        className="px-2 py-1 bg-white border border-[#111111] rounded text-[9px] font-extrabold uppercase cursor-pointer hover:bg-[#F8DE22] transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(idx)}
                        className="px-2 py-1 bg-white text-[#D12052] border border-[#D12052] rounded text-[9px] font-extrabold uppercase cursor-pointer hover:bg-[#D12052]/10 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-[#111111] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Lưu Tất Cả Thay Đổi"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
