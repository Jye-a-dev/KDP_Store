"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StaticPage } from "@/types/api";

export default function AdminStaticPages() {
  const { token } = useAuth();
  const [list, setList] = useState<StaticPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  
  // Clipboard feedback
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    item?: StaticPage;
  }>({ open: false, mode: "create" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id?: number;
    title?: string;
  }>({ open: false });

  const [formData, setFormData] = useState({ slug: "", title: "", content: "", group_type: "service" as "service" | "explore" });
  const [formError, setFormError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  const fetchList = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/static-pages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
    } catch (err) {
      console.error("Failed to load static pages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  const handleOpenCreate = () => {
    setFormData({ slug: "", title: "", content: "", group_type: "service" });
    setFormError("");
    setModal({ open: true, mode: "create" });
  };

  const handleOpenEdit = (item: StaticPage) => {
    setFormData({
      slug: item.slug,
      title: item.title,
      content: item.content,
      group_type: item.group_type,
    });
    setFormError("");
    setModal({ open: true, mode: "edit", item });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      setFormError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(formData.slug)) {
      setFormError("Slug chỉ được chứa chữ cái viết thường, chữ số và dấu gạch ngang (-).");
      return;
    }

    try {
      const url = modal.mode === "create" 
        ? `${API_URL}/static-pages` 
        : `${API_URL}/static-pages/${modal.item?.id}`;
        
      const method = modal.mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message ?? "Lỗi lưu dữ liệu trang.");
      }

      setModal({ open: false, mode: "create" });
      fetchList();
    } catch (err: any) {
      setFormError(err.message ?? "Lỗi hệ thống.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      const res = await fetch(`${API_URL}/static-pages/${deleteConfirm.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setDeleteConfirm({ open: false });
        fetchList();
      }
    } catch (err) {
      // ignore
    }
  };

  const copyToClipboard = (slug: string) => {
    const fullLink = `/explore-services/${slug}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 1500);
  };

  const filteredList = list.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = filterGroup === "all" || item.group_type === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const groupLabels: Record<string, string> = {
    all: "Tất Cả",
    service: "Dịch Vụ (Footer)",
    explore: "Khám Phá (Footer)",
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-4 border-[#111111] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#F8DE22] border-2 border-[#111111] rounded-xl shadow-[2px_2px_0px_#111111]">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 13.5-13.5z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-tight">
              Quản lý Trang tĩnh
            </h1>
          </div>
          <p className="text-sm text-[#444] font-medium mt-2 max-w-xl">
            Tạo mới, chỉnh sửa và cấu hình các trang chính sách dịch vụ và khám phá. Danh sách này được liên kết động tại Footer.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full md:w-auto px-5 py-3 bg-[#F8DE22] text-[#111111] font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Tạo Trang Mới
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">Tổng số Trang</p>
            <p className="text-3xl font-black mt-1 text-[#111111]">{list.length}</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-center font-bold text-amber-600 text-lg">
            Σ
          </div>
        </div>
        <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">Dịch Vụ (Service)</p>
            <p className="text-3xl font-black mt-1 text-[#111111]">{list.filter(x => x.group_type === 'service').length}</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-lg">
            S
          </div>
        </div>
        <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">Khám Phá (Explore)</p>
            <p className="text-3xl font-black mt-1 text-[#111111]">{list.filter(x => x.group_type === 'explore').length}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center font-bold text-emerald-600 text-lg">
            E
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, slug hoặc nội dung..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold placeholder:text-[#888] focus:outline-none bg-[#fdfdfd] focus:bg-white transition-all"
          />
          <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-[#555]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-black">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {Object.entries(groupLabels).map(([group, label]) => {
            const active = filterGroup === group;
            const count = group === 'all' ? list.length : list.filter(x => x.group_type === group).length;
            return (
              <button
                key={group}
                onClick={() => setFilterGroup(group)}
                className={`px-3.5 py-2 rounded-xl border-2 border-[#111111] text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-[#111111] text-white shadow-[2px_2px_0px_#F8DE22]"
                    : "bg-white text-[#111111] hover:bg-[#f3f4f6]"
                }`}
              >
                <span>{label}</span>
                <span className={`inline-block px-1.5 py-px rounded-md text-[9px] font-extrabold ${
                  active ? "bg-white/20 text-[#F8DE22]" : "bg-gray-100 text-[#555]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
            <p className="text-[11px] font-black uppercase tracking-widest text-[#555]">Đang tải danh sách trang...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center px-4">
            <p className="text-sm font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy trang nào</p>
            <p className="text-xs text-[#666] mt-1">Hãy thử tìm kiếm từ khóa khác hoặc tạo trang mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#111111] bg-[#f9fafb]">
                  <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#111111] w-[35%]">Tiêu Đề & Slug</th>
                  <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#111111] w-[20%]">Nhóm Vị Trí</th>
                  <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#111111] w-[25%]">Ngày cập nhật</th>
                  <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#111111] w-[20%] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b border-[#111111]/10">
                {filteredList.map((item) => {
                  const isActiveService = item.group_type === 'service';
                  const grpBadge = isActiveService 
                    ? 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' 
                    : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';

                  return (
                    <tr key={item.id} className="hover:bg-[#FCFCFC] transition-colors group">
                      <td className="px-6 py-4.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-[#111111] text-xs uppercase tracking-wide block truncate max-w-sm">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] font-bold text-gray-500 truncate max-w-50">
                              /explore-services/{item.slug}
                            </span>
                            <button
                              onClick={() => copyToClipboard(item.slug)}
                              className="p-0.5 text-gray-400 hover:text-black rounded transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
                              title="Copy liên kết"
                            >
                              {copiedSlug === item.slug ? (
                                <svg width="12" height="12" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              ) : (
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${grpBadge}`}>
                          {item.group_type === 'service' ? 'Dịch vụ' : 'Khám phá'}
                        </span>
                      </td>

                      <td className="px-6 py-4.5 text-xs font-semibold text-gray-600">
                        {item.updated_at ? new Date(item.updated_at).toLocaleString("vi-VN") : "—"}
                      </td>

                      <td className="px-6 py-4.5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2.5 bg-white border-2 border-[#111111] rounded-xl hover:bg-[#F8DE22] hover:shadow-[1px_1px_0px_#111111] active:translate-y-px transition-all cursor-pointer flex items-center justify-center"
                            title="Sửa nội dung"
                          >
                            <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, id: item.id, title: item.title })}
                            className="p-2.5 bg-white border-2 border-[#111111] rounded-xl hover:bg-[#E11D48] hover:text-white hover:shadow-[1px_1px_0px_#111111] active:translate-y-px transition-all cursor-pointer flex items-center justify-center"
                            title="Xóa trang"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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

      {/* CREATE & EDIT MODAL OVERLAY */}
      {modal.open && (
        <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 bg-[#f9fafb] border-b-2 border-[#111111] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#F8DE22] border-2 border-[#111111] rounded-full inline-block" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                  {modal.mode === "create" ? "Tạo Trang Tĩnh Mới" : "Sửa Nội Dung Trang Tĩnh"}
                </h3>
              </div>
              <button
                onClick={() => setModal({ open: false, mode: "create" })}
                className="w-7 h-7 border-2 border-[#111111] rounded-lg flex items-center justify-center text-xs font-black hover:bg-[#E11D48] hover:text-white cursor-pointer transition-colors shadow-[1px_1px_0px_#111111]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3.5 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    Tiêu Đề Trang
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ví dụ: Chính Sách Bảo Hành"
                    className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                    Đường dẫn tĩnh (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="ví-du-chinh-sach-bao-hanh"
                    className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Nhóm Phân Loại ở Footer
                </label>
                <select
                  value={formData.group_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, group_type: e.target.value as "service" | "explore" }))}
                  className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer"
                >
                  <option value="service">Dịch Vụ (Cột 1 ở Footer)</option>
                  <option value="explore">Khám Phá (Cột 2 ở Footer)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#111111] mb-1.5">
                  Nội Dung Trang (Hỗ trợ định dạng HTML)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Nhập nội dung hiển thị của trang dạng mã HTML. Ví dụ: <p>Nội dung...</p> hoặc <h2>Tiêu đề phụ</h2>"
                  rows={10}
                  className="w-full px-3.5 py-3 border-2 border-[#111111] rounded-xl text-xs font-semibold focus:outline-none bg-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 mt-3 pt-4 border-t border-[#111111]/10">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: "create" })}
                  className="px-4.5 py-2.5 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F8DE22] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-[#111111]/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-3 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#E11D48] border-2 border-[#111111] rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                Xác nhận xóa trang tĩnh
              </h3>
            </div>
            
            <p className="text-xs text-[#444] font-semibold leading-relaxed">
              Bạn có chắc chắn muốn xoá vĩnh viễn trang tĩnh <code className="font-mono bg-red-50 text-[#E11D48] border border-red-100 px-1.5 py-0.5 rounded font-black break-all">{deleteConfirm.title}</code>? Liên kết tương ứng ở Footer cũng sẽ bị gỡ bỏ.
            </p>
            
            <div className="flex justify-end gap-3 mt-2.5 pt-4 border-t border-[#111111]/10">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ open: false })}
                className="px-5 py-3 border-2 border-[#111111] text-[#111111] text-xs font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-3 bg-[#E11D48] text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#111111] cursor-pointer transition-all"
              >
                Xác nhận xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
