"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePageContent, PageContent } from "@/contexts/PageContentContext";

interface EditableTextProps {
  contentKey: keyof PageContent;
  element?: "span" | "div" | "h1" | "h2" | "h3" | "p" | "mark";
  className?: string;
  multiline?: boolean;
}

export default function EditableText({
  contentKey,
  element = "span",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { user } = useAuth();
  const { content, updateText } = usePageContent();
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState("");

  const isAdmin = user?.role === "admin";
  const textValue = content[contentKey] || "";

  const handleStartEdit = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVal(textValue);
    setIsEditing(true);
  };

  const handleSave = (e?: React.MouseEvent | React.FormEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateText(contentKey, val);
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <span className="inline-flex items-center gap-1 z-50 relative" onClick={(e) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="border-2 border-[#111111] bg-white text-[#111111] font-semibold text-xs p-2 rounded-xl outline-none shadow-[2px_2px_0px_#111111] min-w-60 max-w-full"
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="border-2 border-[#111111] bg-white text-[#111111] font-semibold text-xs px-2.5 py-1 rounded-lg outline-none shadow-[2px_2px_0px_#111111]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
        )}
        {/* Đổi <button> thành <span role="button"> để tránh Hydration Error */}
        <span
          role="button"
          tabIndex={0}
          onClick={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave(e)}
          className="w-6 h-6 rounded bg-green-500 text-white border border-[#111111] flex items-center justify-center text-[10px] cursor-pointer shadow-[1px_1px_0px_#111111]"
          title="Lưu"
        >
          ✓
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={handleCancel}
          onKeyDown={(e) => e.key === "Enter" && handleCancel(e)}
          className="w-6 h-6 rounded bg-[#D12052] text-white border border-[#111111] flex items-center justify-center text-[10px] cursor-pointer shadow-[1px_1px_0px_#111111]"
          title="Hủy"
        >
          ✕
        </span>
      </span>
    );
  }

  const Tag = element as any;

  if (!isAdmin) {
    return <Tag className={className}>{textValue}</Tag>;
  }

  return (
    <Tag className={`relative group/editable inline-block ${className}`}>
      {textValue}
      {/* Đổi <button> thành <span role="button"> để tránh Hydration Error */}
      <span
        role="button"
        tabIndex={0}
        onClick={handleStartEdit}
        onKeyDown={(e) => e.key === "Enter" && handleStartEdit(e)}
        className="absolute -top-3.5 -right-3.5 opacity-0 group-hover/editable:opacity-100 bg-[#F8DE22] text-[#111111] border border-[#111111] shadow-[1px_1px_0px_#111111] rounded w-5 h-5 flex items-center justify-center text-[9px] cursor-pointer transition-opacity z-40"
        title="Chỉnh sửa nội dung"
      >
        ✏️
      </span>
    </Tag>
  );
}