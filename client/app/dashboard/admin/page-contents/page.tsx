"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePageContent } from "@/contexts/PageContentContext";

interface ContentItem {
  key: string;
  value: string;
  updated_at?: string;
}

export default function AdminPageContents() {
  const { token } = useAuth();
  const { content, createKey, updateText, deleteKey, refresh, isLoading } = usePageContent();
  const [list, setList] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("all");

  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    item?: ContentItem;
  }>({ open: false, mode: "create" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    key?: string;
  }>({ open: false });

  const [formData, setFormData] = useState({ key: "", value: "" });
  const [formError, setFormError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  const fetchList = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/page-contents/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
    } catch (err) {
      const localList = Object.entries(content).map(([k, v]) => ({
        key: k,
        value: v,
      }));
      setList(localList);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token, content]);

  const handleOpenCreate = () => {
    setFormData({ key: "", value: "" });
    setFormError("");
    setModal({ open: true, mode: "create" });
  };

  const handleOpenEdit = (item: ContentItem) => {
    setFormData({ key: item.key, value: item.value });
    setFormError("");
    setModal({ open: true, mode: "edit", item });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.value.trim()) {
      setFormError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      if (modal.mode === "create") {
        const keyPattern = /^[a-zA-Z0-9_]+$/;
        if (!keyPattern.test(formData.key)) {
          setFormError("Key chỉ được chứa chữ cái, số và dấu gạch dưới (_).");
          return;
        }
        await createKey(formData.key, formData.value);
      } else {
        await updateText(formData.key, formData.value);
      }
      setModal({ open: false, mode: "create" });
      fetchList();
      refresh();
    } catch (err: any) {
      setFormError(err.message ?? "Lỗi lưu dữ liệu.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.key) return;
    try {
      await deleteKey(deleteConfirm.key);
      setDeleteConfirm({ open: false });
      fetchList();
      refresh();
    } catch (err) {
      // ignore
    }
  };

  const getGroup = (key: string) => {
    if (key.startsWith("announcement_")) return "announcement";
    if (key.startsWith("hero_")) return "hero";
    if (key.startsWith("newsletter_")) return "newsletter";
    if (key.startsWith("customer_promo_")) return "promo";
    return "custom";
  };

  const groupLabels: Record<string, string> = {
    all: "Tất Cả",
    announcement: "Thanh Thông Báo",
    hero: "Hero Section",
    newsletter: "Newsletter",
    promo: "Khuyến Mãi",
    custom: "Khác / Custom",
  };

  const filteredList = list.filter((item) => {
    const matchesSearch =
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = filterGroup === "all" || getGroup(item.key) === filterGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] uppercase tracking-wide">
            Cấu hình Giao Diện
          </h1>
          <p className="text-xs text-[#555] font-semibold mt-1">
            Quản lý và cập nhật toàn bộ sao chép (copy) của trang chủ và layout công khai.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#F8DE22] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Thêm Khoá Mới
        </button>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-2 border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111]">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#777]">Tổng số Key</p>
          <p className="text-2xl font-extrabold mt-1">{list.length}</p>
        </div>
        <div className="bg-white border-2 border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111]">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#777]">Hero Section</p>
          <p className="text-2xl font-extrabold mt-1">{list.filter(x => getGroup(x.key) === 'hero').length}</p>
        </div>
        <div className="bg-white border-2 border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111]">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#777]">Newsletter & Promo</p>
          <p className="text-2xl font-extrabold mt-1">
            {list.filter(x => ['newsletter', 'promo'].includes(getGroup(x.key))).length}
          </p>
        </div>
        <div className="bg-white border-2 border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111]">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#777]">Khóa Tùy Biến (Custom)</p>
          <p className="text-2xl font-extrabold mt-1">{list.filter(x => getGroup(x.key) === 'custom').length}</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white border-2 border-[#111111] p-4 rounded-2xl shadow-[4px_4px_0px_#111111] mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm key hoặc nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-[#111111] rounded-xl text-xs font-semibold placeholder:text-[#888] focus:outline-none"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-[#888]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(groupLabels).map(([group, label]) => (
            <button
              key={group}
              onClick={() => setFilterGroup(group)}
              className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${filterGroup === group
                  ? "bg-[#111111] text-white"
                  : "bg-white text-[#111111] hover:bg-[#f3f4f6]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List / Table */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#777]">Đang tải cấu hình...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-[#555] uppercase tracking-wide">Không tìm thấy nội dung phù hợp</p>
            <p className="text-xs text-[#888] mt-1">Hãy thử tìm kiếm từ khóa khác hoặc tạo khóa cấu hình mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#111111] bg-[#f9fafb]">
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-wider text-[#111111] w-1/4">Key Cấu Hình</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">Giá Trị / Nội Dung</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-wider text-[#111111] w-40 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => {
                  const grp = getGroup(item.key);
                  const grpBadge = grp === 'hero' ? 'bg-amber-100 text-amber-800' :
                    grp === 'newsletter' ? 'bg-blue-100 text-blue-800' :
                      grp === 'promo' ? 'bg-emerald-100 text-emerald-800' :
                        grp === 'announcement' ? 'bg-rose-100 text-rose-800' :
                          'bg-gray-100 text-gray-800';

                  return (
                    <tr key={item.key} className="border-b border-[#111111]/10 hover:bg-[#fdfdfd] transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-[#111111] block truncate max-w-50" title={item.key}>
                          {item.key}
                        </span>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${grpBadge}`}>
                          {groupLabels[grp] || grp}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-[#333] font-medium line-clamp-3 whitespace-pre-wrap max-w-md">
                          {item.value}
                        </p>
                        {item.updated_at && (
                          <span className="text-[9px] text-[#999] font-medium block mt-1">
                            Cập nhật: {new Date(item.updated_at).toLocaleString("vi-VN")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 border-2 border-[#111111] rounded-xl hover:bg-[#F8DE22] transition-colors cursor-pointer"
                            title="Sửa nội dung"
                          >
                            <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, key: item.key })}
                            className="p-2 border-2 border-[#111111] rounded-xl hover:bg-[#D12052] hover:text-white transition-colors cursor-pointer"
                            title="Xóa Key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {modal.open && (
        <div className="fixed inset-0 bg-[#111111]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#f9fafb] border-b-2 border-[#111111] flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#111111]">
                {modal.mode === "create" ? "Tạo Khoá Cấu Hình Mới" : "Sửa Nội Dung Key"}
              </h3>
              <button
                onClick={() => setModal({ open: false, mode: "create" })}
                className="w-6 h-6 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-bold hover:bg-[#D12052] hover:text-white cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-semibold rounded-xl">
                  ⚠️ {formError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-1.5">
                  Key Định Danh {modal.mode === "edit" && <span className="text-red-500">(Không thể sửa)</span>}
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  disabled={modal.mode === "edit"}
                  placeholder="Ví dụ: custom_main_footer_title"
                  className="w-full px-3 py-2 border-2 border-[#111111] rounded-xl text-xs font-semibold focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#111111] mb-1.5">
                  Nội dung hiển thị (Giá trị)
                </label>
                <textarea
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Nhập nội dung bạn muốn gán cho key này..."
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-[#111111] rounded-xl text-xs font-semibold focus:outline-none bg-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 mt-2">
                <span
                  role="button"
                  onClick={() => setModal({ open: false, mode: "create" })}
                  className="px-4 py-2 border-2 border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  Hủy
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F8DE22] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
                >
                  Lưu Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-[#111111]/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#111111]">
              ⚠️ Xác nhận xóa Key
            </h3>
            <p className="text-xs text-[#555] font-semibold leading-relaxed">
              Bạn có chắc chắn muốn xóa key cấu hình <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-red-600 font-bold">{deleteConfirm.key}</code>? Hành động này sẽ không thể khôi phục và giao diện hiển thị key này có thể bị lỗi.
            </p>
            <div className="flex justify-end gap-2.5 mt-2">
              <span
                role="button"
                onClick={() => setDeleteConfirm({ open: false })}
                className="px-4 py-2 border-2 border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                Hủy
              </span>
              <span
                role="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-[#D12052] text-white text-xs font-bold uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] cursor-pointer transition-all"
              >
                Xóa Bỏ
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
