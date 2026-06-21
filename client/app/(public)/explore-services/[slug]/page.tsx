"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { StaticPage } from "@/types/api";

// Helper to convert dynamic text strings into valid paths (slugs)
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes
};

// Rich Text Editor Component using contentEditable for Neobrutalist design
interface HtmlEditorProps {
  value: string;
  onChange: (val: string) => void;
}

function HtmlEditor({ value, onChange }: HtmlEditorProps) {
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
            <div className="w-[1px] h-6 bg-[#111111]/20 mx-1" />
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
            <div className="w-[1px] h-6 bg-[#111111]/20 mx-1" />
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
            <div className="w-[1px] h-6 bg-[#111111]/20 mx-1" />
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
          className={`p-4 min-h-[350px] outline-none prose max-w-none text-[#222] font-semibold text-xs leading-relaxed font-sans bg-white ${
            isHtmlMode ? "hidden" : "block"
          }`}
          style={{ minHeight: "350px" }}
        />
        <textarea
          value={htmlValue}
          onChange={handleHtmlChange}
          className={`w-full p-4 min-h-[350px] font-mono text-xs text-amber-200 bg-[#1e1e1e] outline-none border-none leading-relaxed ${
            isHtmlMode ? "block" : "hidden"
          }`}
          style={{ minHeight: "350px", resize: "vertical" }}
        />
      </div>
    </div>
  );
}

export default function ExploreServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const [page, setPage] = useState<StaticPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editGroup, setEditGroup] = useState<"service" | "explore">("service");

  // Create states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newGroup, setNewGroup] = useState<"service" | "explore">("service");

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/static-pages/slug/${slug}`);
        if (!res.ok) {
          throw new Error("Không thể tải thông tin trang này");
        }
        const data = await res.json();
        setPage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug, API_URL]);

  const handleSaveEdit = async () => {
    if (!page) return;
    if (!editTitle.trim() || !editSlug.trim() || !editContent.trim()) {
      alert("Vui lòng điền đầy đủ các thông tin!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/static-pages/${page.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          slug: editSlug,
          content: editContent,
          group_type: editGroup,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? "Lỗi khi cập nhật trang!");
      }

      const updatedPage = await res.json();
      setPage(updatedPage);
      setIsEditing(false);
      
      if (updatedPage.slug !== slug) {
        router.replace(`/explore-services/${updatedPage.slug}`);
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.message ?? "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async () => {
    if (!page) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn trang \"" + page.title + "\"?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/static-pages/${page.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Lỗi khi xóa trang tĩnh!");
      }

      alert("Đã xóa trang tĩnh thành công!");
      router.push("/");
    } catch (err: any) {
      alert(err.message ?? "Có lỗi xảy ra!");
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newSlug.trim() || !newContent.trim()) {
      alert("Vui lòng điền đầy đủ các thông tin!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/static-pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug,
          content: newContent,
          group_type: newGroup,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? "Lỗi khi tạo trang tĩnh mới!");
      }

      const createdPage = await res.json();
      setShowCreateModal(false);
      setNewTitle("");
      setNewSlug("");
      setNewContent("");
      setNewGroup("service");
      
      alert("Tạo trang tĩnh mới thành công!");
      router.push(`/explore-services/${createdPage.slug}`);
    } catch (err: any) {
      alert(err.message ?? "Có lỗi xảy ra!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-125 w-full items-center justify-center bg-white py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center text-center px-6 py-20 bg-white">
        <div className="text-5xl">⚠️</div>
        <h3 className="mt-4 text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy nội dung</h3>
        <p className="mt-1 text-sm text-[#555555]">
          {error || "Trang bạn tìm kiếm không khả dụng hoặc đã bị gỡ bỏ."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-12 px-[5%] md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Quay lại trang chủ
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#03AED2] text-white border-2 border-[#111111] px-4 py-2 text-xs font-extrabold uppercase tracking-wider shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer rounded-none"
            >
              ➕ Tạo Trang Mới
            </button>
          )}
        </div>

        {/* Admin Action Toolbar */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-[#f9fafb] border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#F8DE22] border-2 border-[#111111] rounded-full inline-block animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
                Công cụ quản trị trang tĩnh
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setEditTitle(page.title);
                      setEditSlug(page.slug);
                      setEditContent(page.content);
                      setEditGroup(page.group_type);
                      setIsEditing(true);
                    }}
                    className="px-3.5 py-2 bg-[#F8DE22] text-[#111111] border-2 border-[#111111] text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer rounded-xl"
                  >
                    ✏️ Sửa Trang
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3.5 py-2 bg-[#D12052] text-white border-2 border-[#111111] text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] transition-all cursor-pointer rounded-xl"
                  >
                    🗑️ Xóa Trang
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3.5 py-2 bg-emerald-500 text-white border-2 border-[#111111] text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer rounded-xl"
                  >
                    💾 Lưu Lại
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 bg-white text-[#111111] border-2 border-[#111111] text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer rounded-xl"
                  >
                    ✕ Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content Box styled in Neo-brutalism */}
        <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden">
          {isEditing ? (
            <div className="p-8 flex flex-col gap-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#111111] border-b-2 border-[#111111] pb-3">
                Chỉnh sửa thông tin trang tĩnh
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    Tiêu đề trang
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => {
                      setEditTitle(e.target.value);
                      setEditSlug(slugify(e.target.value));
                    }}
                    className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    Đường dẫn tĩnh (Slug)
                  </label>
                  <input
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(slugify(e.target.value))}
                    className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Phân nhóm trang
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "service", label: "Chính Sách Dịch Vụ" },
                    { value: "explore", label: "Khám Phá KDP Store" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEditGroup(option.value as any)}
                      className={`px-4 py-2 border-2 border-[#111111] text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer ${
                        editGroup === option.value
                          ? "bg-[#F8DE22] text-[#111111] shadow-[2px_2px_0px_#111111]"
                          : "bg-white text-[#111111] hover:bg-neutral-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Nội dung trang
                </label>
                <HtmlEditor value={editContent} onChange={setEditContent} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#111111]/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4.5 py-2.5 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2.5 bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer"
                >
                  💾 Lưu thay đổi
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header title block */}
              <div className="px-6 py-8 bg-[#F8DE22] border-b-2 border-[#111111]">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#111111] bg-white/40 border border-[#111111] px-2 py-0.5 rounded">
                  {page.group_type === "service" ? "Chính Sách Dịch Vụ" : "Khám Phá KDP Store"}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-[#111111] uppercase tracking-wide mt-3 leading-tight">
                  {page.title}
                </h1>
              </div>

              {/* HTML rendering section */}
              <div className="p-8 prose max-w-none text-[#222] font-semibold text-xs leading-relaxed font-sans">
                <div 
                  className="flex flex-col gap-4 dynamic-html-content"
                  dangerouslySetInnerHTML={{ __html: page.content }} 
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create New Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="px-6 py-4.5 bg-[#f9fafb] border-b-2 border-[#111111] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#03AED2] border-2 border-[#111111] rounded-full inline-block" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                  Tạo Trang Tĩnh Mới
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-black hover:bg-[#E11D48] hover:text-white cursor-pointer transition-colors shadow-[1px_1px_0px_#111111]"
              >
                ✕
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    Tiêu đề trang
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      setNewSlug(slugify(e.target.value));
                    }}
                    placeholder="Ví dụ: Hướng dẫn mua hàng"
                    className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white text-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    Đường dẫn tĩnh (Slug)
                  </label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(slugify(e.target.value))}
                    placeholder="huong-dan-mua-hang"
                    className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Phân nhóm trang
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "service", label: "Chính Sách Dịch Vụ" },
                    { value: "explore", label: "Khám Phá KDP Store" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewGroup(option.value as any)}
                      className={`px-4 py-2 border-2 border-[#111111] text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer ${
                        newGroup === option.value
                          ? "bg-[#03AED2] text-white shadow-[2px_2px_0px_#111111]"
                          : "bg-white text-[#111111] hover:bg-neutral-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Nội dung trang
                </label>
                <HtmlEditor value={newContent} onChange={setNewContent} />
              </div>

              <div className="flex justify-end gap-3 mt-3 pt-4 border-t border-[#111111]/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4.5 py-2.5 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="px-5 py-2.5 bg-[#03AED2] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer"
                >
                  ➕ Tạo trang mới
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
