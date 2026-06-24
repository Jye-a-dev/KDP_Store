"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { StaticPage } from "@/types/api";
import HtmlEditor from "@/components/common/HtmlEditor";
import CreatePageModal from "./CreatePageModal";

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
      <CreatePageModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(createdPage) => {
          setShowCreateModal(false);
          alert("Tạo trang tĩnh mới thành công!");
          router.push(`/explore-services/${createdPage.slug}`);
        }}
        token={token ?? ""}
        apiUrl={API_URL}
      />
    </div>
  );
}
