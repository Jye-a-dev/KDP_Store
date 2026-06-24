"use client";

import { useState } from "react";

interface Product3dConfigProps {
  editModel3dUrl: string;
  setEditModel3dUrl: (url: string) => void;
  token: string | null;
  apiUrl: string;
}

export default function Product3dConfig({
  editModel3dUrl,
  setEditModel3dUrl,
  token,
  apiUrl,
}: Product3dConfigProps) {
  const [isUploading3d, setIsUploading3d] = useState(false);

  const handleUpload3d = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".gltf", ".glb", ".obj", ".fbx"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      alert("Chỉ chấp nhận file 3D định dạng .gltf, .glb, .obj, .fbx");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading3d(true);
    try {
      const res = await fetch(`${apiUrl}/products/upload-3d`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message ?? "Upload thất bại");
      }

      const data = await res.json();
      setEditModel3dUrl(data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi upload");
    } finally {
      setIsUploading3d(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
        Đường dẫn Model 3D (.glb)
      </label>
      <div className="flex gap-2">
        <input
          value={editModel3dUrl}
          onChange={(e) => setEditModel3dUrl(e.target.value)}
          placeholder="VD: /uploads/3d/model-123.glb"
          className="flex-1 border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
        />
        <input
          type="file"
          accept=".gltf,.glb,.obj,.fbx"
          id="edit-model-3d-file-input"
          className="hidden"
          onChange={handleUpload3d}
          disabled={isUploading3d}
        />
        <label
          htmlFor="edit-model-3d-file-input"
          className={`px-4 py-2 bg-[#F8DE22] border-2 border-[#111111] rounded-xl text-[10px] font-extrabold uppercase cursor-pointer shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#111111] flex items-center justify-center min-w-21.25 text-center select-none ${
            isUploading3d ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {isUploading3d ? "Đang tải..." : "Tải file"}
        </label>
      </div>
    </div>
  );
}
