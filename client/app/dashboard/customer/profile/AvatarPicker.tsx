"use client";

import { useState, useEffect } from "react";

const PRESET_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buster",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
];

interface AvatarPickerProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

export default function AvatarPicker({ avatarUrl, setAvatarUrl }: AvatarPickerProps) {
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
    if (avatarUrl) {
      if (PRESET_AVATARS.includes(avatarUrl)) {
        setAvatarSource("presets");
      } else if (avatarUrl.startsWith("data:image/")) {
        setAvatarSource("device");
      } else if (
        avatarUrl.includes("drive.google.com") ||
        avatarUrl.includes("drive/folders") ||
        avatarUrl.includes("drive.google.com/uc")
      ) {
        setAvatarSource("drive");
        setDriveInput(avatarUrl);
      } else {
        setAvatarSource("url");
      }
    }
  }, [avatarUrl]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-[#111111]/10 rounded-xl bg-neutral-50/50">
      <div className="w-20 h-20 rounded-full border-2 border-[#111111] overflow-hidden bg-white shadow-[2px_2px_0px_#111111] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
              drive: "Google Drive",
            };
            return (
              <button
                key={src}
                type="button"
                onClick={() => setAvatarSource(src)}
                className={`flex-1 py-1.5 text-[9px] font-extrabold uppercase cursor-pointer border-r border-[#111111] last:border-none transition-colors ${
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
  );
}
