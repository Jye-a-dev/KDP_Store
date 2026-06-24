import React, { useState } from "react";

interface ProductImageUploaderProps {
  images2d: string;
  setImages2d: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductImageUploader({
  images2d,
  setImages2d,
}: ProductImageUploaderProps) {
  const [addMode, setAddMode] = useState<"device" | "url" | "drive">("device");
  const [tempUrl, setTempUrl] = useState("");
  const [tempDrive, setTempDrive] = useState("");

  const convertGoogleDriveUrl = (url: string): string => {
    if (!url) return "";
    const match =
      url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  const appendImageUrl = (newUrl: string) => {
    setImages2d((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return newUrl;
      return `${trimmed}, ${newUrl}`;
    });
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Kích thước tối đa 2MB!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        appendImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTempUrl = () => {
    if (!tempUrl.trim()) return;
    appendImageUrl(tempUrl.trim());
    setTempUrl("");
  };

  const handleAddTempDrive = () => {
    if (!tempDrive.trim()) return;
    const converted = convertGoogleDriveUrl(tempDrive.trim());
    appendImageUrl(converted);
    setTempDrive("");
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
        Danh sách ảnh 2D (Ngăn cách bằng dấu phẩy)
      </label>
      <textarea
        rows={2}
        value={images2d}
        onChange={(e) => setImages2d(e.target.value)}
        placeholder="VD: https://link1.jpg, https://link2.jpg"
        className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
      />

      {/* Helper tool to add images from multi-sources */}
      <div className="border-2 border-dashed border-[#111111]/20 p-3 rounded-xl bg-neutral-50/50 space-y-3 mt-1.5">
        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#03AED2] block">
          Thêm nhanh ảnh (Thiết bị, URL, Google Drive)
        </span>
        <div className="flex border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111] bg-white">
          {(["device", "url", "drive"] as const).map((m) => {
            const labels = {
              device: "📁 Thiết bị",
              url: "🔗 URL",
              drive: "🤖 Drive",
            };
            return (
              <button
                key={m}
                type="button"
                onClick={() => setAddMode(m)}
                className={`flex-1 py-1 text-[9px] font-extrabold uppercase cursor-pointer border-r border-[#111111] last:border-none transition-colors ${
                  addMode === m
                    ? "bg-[#111111] text-white"
                    : "bg-white text-[#111111] hover:bg-[#f7f9fa]"
                }`}
              >
                {labels[m]}
              </button>
            );
          })}
        </div>

        {addMode === "device" && (
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              id="product-file-input"
              className="hidden"
              onChange={handleProductFileChange}
            />
            <label
              htmlFor="product-file-input"
              className="py-1.5 bg-white border-2 border-[#111111] rounded-lg text-center text-[10px] font-extrabold uppercase cursor-pointer hover:bg-neutral-50 shadow-[1.5px_1.5px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#111111] block"
            >
              Chọn file ảnh từ thiết bị
            </label>
          </div>
        )}

        {addMode === "url" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="Dán link ảnh tại đây..."
              className="flex-1 border-2 border-[#111111] py-1 px-2.5 rounded-lg text-xs font-semibold bg-white outline-none"
            />
            <button
              type="button"
              onClick={handleAddTempUrl}
              className="px-3 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1.5px_1.5px_0px_#111111]"
            >
              Thêm
            </button>
          </div>
        )}

        {addMode === "drive" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={tempDrive}
              onChange={(e) => setTempDrive(e.target.value)}
              placeholder="Dán link Google Drive tại đây..."
              className="flex-1 border-2 border-[#111111] py-1 px-2.5 rounded-lg text-xs font-semibold bg-white outline-none"
            />
            <button
              type="button"
              onClick={handleAddTempDrive}
              className="px-3 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1.5px_1.5px_0px_#111111]"
            >
              Thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
