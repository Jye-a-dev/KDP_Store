"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Category, CategoryNode } from "./types";
import { buildTree } from "./helpers";
import CategoryTreeRow from "./CategoryTreeRow";
import CategoryModal from "./CategoryModal";

export default function AdminCategories() {
  const { token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  const [all, setAll] = useState<Category[]>([]);
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    category?: Category;
  }>({ open: false, mode: "create" });

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id?: number;
    name?: string;
  }>({ open: false });

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories?limit=200`);
      const data = await res.json() as { data: Category[] };
      const list = Array.isArray(data) ? data : data.data ?? [];
      setAll(list);
      setTree(buildTree(list));
    } catch {
      setAll([]);
      setTree([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async () => {
    if (!deleteConfirm.id || !token) return;
    try {
      await fetch(`${API_URL}/categories/${deleteConfirm.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirm({ open: false });
      fetchAll();
    } catch {
      // ignore
    }
  };

  // Filter tree by search
  const filteredTree = search.trim()
    ? buildTree(
        all.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.slug.includes(search.toLowerCase())
        )
      )
    : tree;

  const rootCount = all.filter((c) => c.parent_id === null).length;
  const subCount = all.filter((c) => c.parent_id !== null).length;

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-8">
      {/* ── Header ── */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#03AED2] mb-1">
            Admin Panel
          </p>
          <h1 className="text-3xl font-extrabold uppercase text-[#111] leading-tight">
            Quản Lý <mark className="bg-[#F8DE22] px-2 py-0.5">Danh Mục</mark>
          </h1>
          <p className="mt-1 text-sm text-[#555]">
            {all.length} danh mục · {rootCount} gốc · {subCount} danh mục con
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ open: true, mode: "create" })}
          className="flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl border-2 border-[#111] text-[12px] font-extrabold uppercase hover:bg-[#F8DE22] hover:text-[#111] transition-all cursor-pointer shadow-[3px_3px_0px_#D12052]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Thêm Danh Mục
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Tổng danh mục", value: all.length, accent: "bg-[#F8DE22]" },
          { label: "Danh mục gốc", value: rootCount, accent: "bg-[#03AED2]/20" },
          { label: "Danh mục con", value: subCount, accent: "bg-[#D12052]/20" },
        ].map((s) => (
          <div key={s.label} className="bg-white border-2 border-[#111] rounded-2xl p-4 shadow-[3px_3px_0px_#111]">
            <p className="text-2xl font-extrabold text-[#111]">{s.value}</p>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#555] mt-0.5">{s.label}</p>
            <div className={`h-1 w-8 rounded-full mt-2 ${s.accent}`} />
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white border-2 border-[#11] rounded-2xl shadow-[4px_4px_0px_#11] overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#11] gap-4 flex-wrap">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#11]">
            Cây Danh Mục
          </h2>
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên hoặc slug..."
              className="border-2 border-[#11] py-2 pl-9 pr-4 rounded-xl text-[12px] font-semibold outline-none focus:bg-[#f7f9fa] w-56"
            />
            <svg className="absolute left-3 top-2.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#11] border-t-[#F8DE22] rounded-full animate-spin" />
          </div>
        ) : filteredTree.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <span className="text-4xl">🗂️</span>
            <p className="text-[13px] font-bold text-[#555]">Không có danh mục nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#11]/10">
                  {["Tên Danh Mục", "Slug", "Cấp", "Hành Động"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTree.map((node) => (
                  <CategoryTreeRow
                    key={node.id}
                    node={node}
                    depth={0}
                    onEdit={(c) => setModal({ open: true, mode: "edit", category: c })}
                    onDelete={(id, name) => setDeleteConfirm({ open: true, id, name })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Form ── */}
      {modal.open && token && (
        <CategoryModal
          mode={modal.mode}
          category={modal.category}
          tree={tree}
          token={token}
          onClose={() => setModal({ open: false, mode: "create" })}
          onSaved={() => {
            setModal({ open: false, mode: "create" });
            fetchAll();
          }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#11] rounded-2xl shadow-[8px_8px_0px_#D12052] w-full max-w-sm p-6">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-[15px] font-extrabold uppercase text-[#11] mb-2">Xác Nhận Xóa</h3>
            <p className="text-sm text-[#555] mb-6">
              Bạn có chắc muốn xóa danh mục{" "}
              <strong>&quot;{deleteConfirm.name}&quot;</strong>?
              <br />
              <span className="text-[#D12052] text-xs">Các danh mục con sẽ được chuyển thành danh mục gốc.</span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ open: false })}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#11] text-[12px] font-extrabold uppercase hover:bg-[#f7f9fa] cursor-pointer"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-[#D12052] text-white border-2 border-[#D12052] text-[12px] font-extrabold uppercase hover:bg-[#B01040] transition-all cursor-pointer"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
