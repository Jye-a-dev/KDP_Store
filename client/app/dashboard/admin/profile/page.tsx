"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/hooks/useUsers";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella"
];

export default function AdminProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { updateUser, isLoading } = useUsers();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [avatarSource, setAvatarSource] = useState<"presets" | "device" | "url" | "drive">("presets");
  const [driveInput, setDriveInput] = useState("");

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
      // Update on backend
      await updateUser(user.id, {
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
      });

      // Update client context state
      updateProfile({
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
      });

      setSuccessMsg("🎉 Cập nhật hồ sơ admin thành công!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Cập nhật hồ sơ thất bại");
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-8 px-4 pt-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/admin")}
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
          Hồ Sơ Admin
          <span className="absolute -z-10 bottom-0.5 left-0 right-0 h-2 bg-[#F8DE22]/35" />
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
                src={avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=Admin"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
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

              {/* Presets */}
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

              {/* Device */}
              {avatarSource === "device" && (
                <div className="flex flex-col gap-1.5">
                  <input
                    type="file"
                    accept="image/*"
                    id="admin-avatar-file-input"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="admin-avatar-file-input"
                    className="py-2 bg-white border-2 border-[#111111] rounded-lg text-center text-[10px] font-extrabold uppercase cursor-pointer hover:bg-neutral-50 shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111]"
                  >
                    📁 Chọn file từ máy tính
                  </label>
                  {avatarUrl.startsWith("data:image/") && (
                    <span className="text-[9px] font-bold text-emerald-600">✓ Đã tải ảnh lên thành công</span>
                  )}
                </div>
              )}

              {/* URL */}
              {avatarSource === "url" && (
                <input
                  type="text"
                  value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Nhập link ảnh tùy chỉnh (https://...)"
                  className="border-2 border-[#111111] py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:bg-[#f7f9fa] bg-white"
                />
              )}

              {/* Drive */}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-[#111111] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Lưu Thay Đổi Hồ Sơ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
