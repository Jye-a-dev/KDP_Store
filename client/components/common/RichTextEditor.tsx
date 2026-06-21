"use client";

import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung tại đây...",
}: RichTextEditorProps) {
  const [isVisual, setIsVisual] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync prop value to contentEditable div innerHTML if they diverge
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const execCommand = (command: string, val: string = "") => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addLink = () => {
    const url = prompt("Nhập đường dẫn URL (ví dụ: https://example.com):");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const addImage = () => {
    const url = prompt("Nhập link ảnh (URL):");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const addTable = () => {
    const rows = parseInt(prompt("Nhập số dòng (rows):", "3") || "0", 10);
    const cols = parseInt(prompt("Nhập số cột (cols):", "3") || "0", 10);
    if (rows > 0 && cols > 0) {
      let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 2px solid #111111;">`;
      for (let r = 0; r < rows; r++) {
        tableHtml += "<tr>";
        for (let c = 0; c < cols; c++) {
          tableHtml += `<td style="border: 1px solid #111111; padding: 8px; min-height: 24px;">&nbsp;</td>`;
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</table>";
      execCommand("insertHTML", tableHtml);
    }
  };

  const cleanHTML = () => {
    if (confirm("Bạn có chắc muốn xóa tất cả định dạng của văn bản?")) {
      execCommand("removeFormat");
    }
  };

  return (
    <div className="w-full border-2 border-[#111111] rounded-xl overflow-hidden shadow-[2px_2px_0px_#111111] bg-white">
      {/* Editor Header / Mode Switcher */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#f9fafb] border-b-2 border-[#111111] flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isVisual && (
            <>
              {/* Text Formats */}
              <select
                onChange={(e) => execCommand("formatBlock", e.target.value)}
                defaultValue="<p>"
                className="px-2 py-1 text-[11px] font-bold border-2 border-[#111111] bg-white rounded-md cursor-pointer outline-none"
              >
                <option value="<p>">Đoạn văn (P)</option>
                <option value="<h1>">Tiêu đề chính (H1)</option>
                <option value="<h2>">Tiêu đề phụ (H2)</option>
                <option value="<h3>">Tiêu đề nhỏ (H3)</option>
                <option value="<blockquote>">Trích dẫn</option>
              </select>

              <div className="h-5 w-0.5 bg-[#111111]/20 self-center mx-1" />

              {/* Inline Styles */}
              <button
                type="button"
                onClick={() => execCommand("bold")}
                className="w-7 h-7 flex items-center justify-center font-black border-2 border-[#111111] bg-white rounded-md text-xs hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="In đậm (Bold)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => execCommand("italic")}
                className="w-7 h-7 flex items-center justify-center italic font-bold border-2 border-[#111111] bg-white rounded-md text-xs hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="In nghiêng (Italic)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => execCommand("underline")}
                className="w-7 h-7 flex items-center justify-center underline font-bold border-2 border-[#111111] bg-white rounded-md text-xs hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="Gạch chân (Underline)"
              >
                U
              </button>
              <button
                type="button"
                onClick={() => execCommand("strikeThrough")}
                className="w-7 h-7 flex items-center justify-center line-through font-bold border-2 border-[#111111] bg-white rounded-md text-xs hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="Gạch ngang"
              >
                S
              </button>

              <div className="h-5 w-0.5 bg-[#111111]/20 self-center mx-1" />

              {/* Lists */}
              <button
                type="button"
                onClick={() => execCommand("insertUnorderedList")}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#111111] bg-white rounded-md hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="Danh sách không thứ tự"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => execCommand("insertOrderedList")}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#111111] bg-white rounded-md hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="Danh sách có thứ tự"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="10" y1="6" x2="21" y2="6"></line>
                  <line x1="10" y1="12" x2="21" y2="12"></line>
                  <line x1="10" y1="18" x2="21" y2="18"></line>
                  <path d="M4 6h1v4M3 10h3M4 14h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4v1h3"></path>
                </svg>
              </button>

              <div className="h-5 w-0.5 bg-[#111111]/20 self-center mx-1" />

              {/* Media & Link */}
              <button
                type="button"
                onClick={addLink}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#111111] bg-white rounded-md hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="Thêm liên kết (Link)"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={addImage}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#111111] bg-white rounded-md hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="Thêm ảnh"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={addTable}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#111111] bg-white rounded-md hover:bg-[#F8DE22] active:translate-y-px transition-all cursor-pointer"
                title="Thêm bảng"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
              </button>

              <div className="h-5 w-0.5 bg-[#111111]/20 self-center mx-1" />

              {/* Actions */}
              <button
                type="button"
                onClick={cleanHTML}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#111111] bg-white rounded-md hover:bg-red-500 hover:text-white active:translate-y-px transition-all cursor-pointer"
                title="Xóa định dạng"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* View Switcher buttons */}
        <div className="flex border-2 border-[#111111] rounded-lg overflow-hidden bg-gray-200">
          <button
            type="button"
            onClick={() => setIsVisual(true)}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
              isVisual ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-gray-100"
            }`}
          >
            Trực quan
          </button>
          <button
            type="button"
            onClick={() => setIsVisual(false)}
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
              !isVisual ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-gray-100"
            }`}
          >
            Mã HTML
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="bg-white min-h-75 flex">
        {isVisual ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="w-full p-4 outline-none overflow-y-auto min-h-75 max-h-100 text-xs font-medium leading-relaxed font-sans text-black focus:bg-[#fbfbfb] transition-colors prose-editor"
            data-placeholder={placeholder}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập mã HTML của bạn tại đây..."
            className="w-full p-4 outline-none overflow-y-auto min-h-75 max-h-100 text-xs font-semibold font-mono text-gray-800 focus:bg-[#fbfbfb] border-0 focus:ring-0 transition-colors"
          />
        )}
      </div>

      {/* Editor Footer styling to give some hint */}
      <div className="bg-[#f9fafb] border-t border-[#111111]/10 px-3.5 py-1.5 flex items-center justify-between text-[9px] font-extrabold text-[#777] uppercase tracking-wider">
        <span>{isVisual ? "Chế độ soạn thảo trực quan" : "Chế độ chỉnh sửa code"}</span>
        <span>HTML5 Standard</span>
      </div>

      <style jsx global>{`
        .prose-editor {
          color: #111111;
        }
        .prose-editor:empty::before {
          content: attr(data-placeholder);
          color: #888;
          pointer-events: none;
          display: block;
        }
        .prose-editor h1 {
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
        }
        .prose-editor h2 {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          margin-top: 0.8rem !important;
          margin-bottom: 0.4rem !important;
        }
        .prose-editor h3 {
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          margin-top: 0.6rem !important;
          margin-bottom: 0.3rem !important;
        }
        .prose-editor p {
          margin-bottom: 0.5rem !important;
        }
        .prose-editor ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .prose-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .prose-editor blockquote {
          border-left: 4px solid #111111 !important;
          padding-left: 1rem !important;
          margin: 0.5rem 0 !important;
          color: #555 !important;
          font-style: italic !important;
        }
        .prose-editor a {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        .prose-editor img {
          max-width: 100% !important;
          height: auto !important;
          border: 2px solid #111111 !important;
          border-radius: 8px !important;
          margin: 0.5rem 0 !important;
        }
      `}</style>
    </div>
  );
}
