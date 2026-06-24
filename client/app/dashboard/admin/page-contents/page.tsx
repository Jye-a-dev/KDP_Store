"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePageContent } from "@/contexts/PageContentContext";
import PageContentModal from "./PageContentModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

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
  
  // Track which rows are expanded for viewing long texts
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  
  // Clipboard copy status feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    item?: ContentItem;
  }>({ open: false, mode: "create" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    key?: string;
  }>({ open: false });



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
    setModal({ open: true, mode: "create" });
  };

  const handleOpenEdit = (item: ContentItem) => {
    setModal({ open: true, mode: "edit", item });
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

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
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

  // Calculate counts for badges
  const getGroupCount = (group: string) => {
    if (group === "all") return list.length;
    return list.filter(item => getGroup(item.key) === group).length;
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8 px-4 sm:px-6">
      {/* Header section with modern layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b-4 border-[#111111] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-[#F8DE22] border-2 border-[#111111] rounded-xl shadow-[2px_2px_0px_#111111]">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-[#111111]">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-tight">
              Cấu hình Giao Diện
            </h1>
          </div>
          <p className="text-sm text-[#444] font-medium mt-2 max-w-xl">
            Quản lý và cập nhật các chuỗi văn bản hiển thị trên trang chủ, biểu ngữ thông báo và các chiến dịch khuyến mãi công khai.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full md:w-auto px-5 py-3 bg-[#F8DE22] text-[#111111] font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Thêm Khoá Mới
        </button>
      </div>

      {/* Polish Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">Tổng số Key</p>
            <p className="text-3xl font-black mt-1 text-[#111111]">{list.length}</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-center font-bold text-amber-600 text-lg">
            #
          </div>
        </div>
        <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">Hero Section</p>
            <p className="text-3xl font-black mt-1 text-[#111111]">{list.filter(x => getGroup(x.key) === 'hero').length}</p>
          </div>
          <div className="w-10 h-10 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-lg">
            H
          </div>
        </div>
        <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">Newsletter & Promo</p>
            <p className="text-3xl font-black mt-1 text-[#111111]">
              {list.filter(x => ['newsletter', 'promo'].includes(getGroup(x.key))).length}
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center font-bold text-emerald-600 text-lg">
            %
          </div>
        </div>
        <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">Khóa Custom</p>
            <p className="text-3xl font-black mt-1 text-[#111111]">{list.filter(x => getGroup(x.key) === 'custom').length}</p>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg">
            C
          </div>
        </div>
      </div>

      {/* Advanced Filters & Search box */}
      <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[4px_4px_0px_#111111] mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Tìm kiếm theo khóa (key) hoặc giá trị cấu hình..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border-2 border-[#111111] rounded-xl text-xs font-bold placeholder:text-[#888] focus:outline-none bg-[#fdfdfd] shadow-[inner_2px_2px_0px_rgba(0,0,0,0.05)] focus:bg-white transition-all"
          />
          <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-[#555]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-black transition-colors rounded-md"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Categories / Groups Selector list with counts */}
        <div className="flex flex-wrap gap-2 items-center">
          {Object.entries(groupLabels).map(([group, label]) => {
            const count = getGroupCount(group);
            const active = filterGroup === group;
            return (
              <button
                key={group}
                onClick={() => setFilterGroup(group)}
                className={`px-3.5 py-2 rounded-xl border-2 border-[#111111] text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? "bg-[#111111] text-white shadow-[2px_2px_0px_#F8DE22]"
                    : "bg-white text-[#111111] hover:bg-[#f3f4f6] active:translate-y-px"
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

      {/* Main Content Table/Cards Wrapper */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
            <p className="text-[11px] font-black uppercase tracking-widest text-[#555]">Đang tải cấu hình...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy nội dung phù hợp</p>
            <p className="text-xs text-[#666] mt-1 max-w-sm mx-auto">
              Hãy thử tìm kiếm từ khóa khác hoặc tạo khóa cấu hình mới phục vụ hiển thị.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#111111] bg-[#f9fafb]">
                  <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#111111] w-[30%]">Khoá cấu hình</th>
                  <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#111111] w-[50%]">Nội dung / Giá trị</th>
                  <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-widest text-[#111111] w-[20%] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b border-[#111111]/10">
                {filteredList.map((item) => {
                  const grp = getGroup(item.key);
                  const grpBadge = grp === 'hero' ? 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' :
                    grp === 'newsletter' ? 'bg-[#EEF2F6] text-[#334155] border-[#CBD5E1]' :
                      grp === 'promo' ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' :
                        grp === 'announcement' ? 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]' :
                          'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]';

                  const isExpanded = !!expandedKeys[item.key];
                  const hasLongText = item.value.length > 120;
                  
                  return (
                    <tr key={item.key} className="hover:bg-[#FCFCFC] transition-colors group">
                      {/* Key details with Copy helper */}
                      <td className="px-6 py-4.5 align-top">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 max-w-full">
                            <span className="font-mono text-xs font-bold text-[#111111] bg-gray-100 px-2 py-1 rounded-md border border-gray-200 block truncate select-all" title={item.key}>
                              {item.key}
                            </span>
                            <button
                              onClick={() => copyToClipboard(item.key)}
                              className="p-1 text-[#888] hover:text-[#111111] hover:bg-gray-100 rounded-md transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100 shrink-0"
                              title="Sao chép Key"
                            >
                              {copiedKey === item.key ? (
                                <svg width="14" height="14" fill="none" stroke="#059669" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              ) : (
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                              )}
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${grpBadge}`}>
                              {groupLabels[grp] || grp}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Config values with Expandable preview */}
                      <td className="px-6 py-4.5 align-top">
                        <div className="flex flex-col gap-1.5">
                          <div className="text-xs text-[#222] font-semibold leading-relaxed whitespace-pre-wrap font-sans break-all max-w-xl">
                            {hasLongText && !isExpanded ? `${item.value.slice(0, 120)}...` : item.value}
                          </div>
                          
                          <div className="flex items-center justify-between gap-4 mt-1.5">
                            {hasLongText && (
                              <button
                                onClick={() => toggleExpand(item.key)}
                                className="text-[10px] font-black text-[#555] hover:text-black uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                {isExpanded ? (
                                  <>
                                    <span>Thu gọn</span>
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path d="M18 15l-6-6-6 6" />
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <span>Xem đầy đủ</span>
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path d="M6 9l6 6 6-6" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                            
                            {item.updated_at && (
                              <span className="text-[9px] text-[#888] font-bold tracking-tight block ml-auto">
                                Cập nhật: {new Date(item.updated_at).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-6 py-4.5 align-top text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2.5 bg-white border-2 border-[#111111] rounded-xl hover:bg-[#F8DE22] hover:shadow-[1px_1px_0px_#111111] active:translate-y-px transition-all cursor-pointer flex items-center justify-center"
                            title="Chỉnh sửa giá trị"
                          >
                            <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, key: item.key })}
                            className="p-2.5 bg-white border-2 border-[#111111] rounded-xl hover:bg-[#E11D48] hover:text-white hover:shadow-[1px_1px_0px_#111111] active:translate-y-px transition-all cursor-pointer flex items-center justify-center"
                            title="Xóa Key này"
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
      <PageContentModal
        isOpen={modal.open}
        mode={modal.mode}
        item={modal.item}
        onClose={() => setModal({ open: false, mode: "create" })}
        onSaved={() => {
          setModal({ open: false, mode: "create" });
          fetchList();
          refresh();
        }}
        createKey={createKey}
        updateText={updateText}
      />

      {/* CONFIRM DELETE MODAL */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false })}
        onConfirm={handleDelete}
        deleteKeyName={deleteConfirm.key}
      />
    </div>
  );
}
