"use client";

import { useEffect, useState, useRef } from "react";

interface HtmlEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function HtmlEditor({ value, onChange }: HtmlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);

  // Sync value when modified externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    setHtmlValue(value);
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlValue(html);
      onChange(html);
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlValue(val);
    onChange(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  const execCommand = (command: string, val: string = "") => {
    document.execCommand(command, false, val);
    handleInput();
  };

  return (
    <div className="border-2 border-[#111111] rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#111111] transition-all">
      {/* Editor Toolbar */}
      <div className="bg-[#f3f4f6] border-b-2 border-[#111111] p-2 flex flex-wrap gap-1.5 items-center select-none">
        {!isHtmlMode ? (
          <>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("bold");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-xs rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Chữ đậm"
            >
              B
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("italic");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-xs rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Chữ nghiêng"
            >
              I
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("underline");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-xs rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Gạch chân"
            >
              U
            </button>
            <div className="w-px h-6 bg-[#111111]/20 mx-1" />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("formatBlock", "<h1>");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("formatBlock", "<h2>");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("formatBlock", "<p>");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Đoạn văn"
            >
              P
            </button>
            <div className="w-px h-6 bg-[#111111]/20 mx-1" />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("insertUnorderedList");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Danh sách không thứ tự"
            >
              • List
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("insertOrderedList");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Danh sách có thứ tự"
            >
              1. List
            </button>
            <div className="w-px h-6 bg-[#111111]/20 mx-1" />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                const url = prompt("Nhập liên kết URL:");
                if (url) execCommand("createLink", url);
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Thêm liên kết"
            >
              Link 🔗
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                execCommand("removeFormat");
              }}
              className="px-2.5 py-1.5 bg-white border-2 border-[#111111] hover:bg-[#F8DE22] font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-[1px_1px_0px_#111111] active:translate-y-px active:shadow-none"
              title="Xóa định dạng"
            >
              Clear 🧹
            </button>
          </>
        ) : (
          <span className="text-[10px] font-black text-neutral-500 px-2 uppercase tracking-wide">
            Chế độ sửa mã nguồn HTML
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`ml-auto px-3 py-1.5 border-2 border-[#111111] text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
            isHtmlMode ? "bg-[#111111] text-white" : "bg-[#F8DE22] text-[#111111] shadow-[1.5px_1.5px_0px_#111111] active:translate-y-px"
          }`}
        >
          {isHtmlMode ? "👁️ Trực quan" : "‹› Mã HTML"}
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-4 min-h-87.5 outline-none prose max-w-none text-[#222] font-semibold text-xs leading-relaxed font-sans bg-white"
          style={{ minHeight: "350px" }}
          tabIndex={0}
        />
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          className={`w-full p-4 min-h-87.5 font-mono text-xs text-amber-200 bg-[#1e1e1e] outline-none border-none leading-relaxed ${
            isHtmlMode ? "block" : "hidden"
          }`}
          style={{ minHeight: "350px", resize: "vertical" }}
        />
      </div>
    </div>
  );
}
