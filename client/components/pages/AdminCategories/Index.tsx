"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "./types";
import { buildTree } from "./helpers";
import CategoriesHeader from "./CategoriesHeader";
import CategoryStats from "./CategoryStats";
import CategoryTreeTable from "./CategoryTreeTable";
import CategoryModal from "./CategoryModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function AdminCategories() {
  const { token } = useAuth();
  const { categories: all, tree, isLoading, fetchAll, deleteCategory, updateCategory } = useCategories();
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    category?: Category;
  }>({ open: false, mode: "create" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id?: number;
    name?: string;
  }>({ open: false });

  // Trạng thái kéo thả sắp xếp (Drag & Drop)
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ id: number; position: "before" | "after" | "inside" } | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderConfirm, setReorderConfirm] = useState<{
    open: boolean;
    draggedId?: number;
    targetId?: number;
    draggedName?: string;
    targetName?: string;
  }>({ open: false });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteCategory(deleteConfirm.id);
      setDeleteConfirm({ open: false });
      fetchAll();
    } catch {
      // ignore
    }
  };

  // Helper để kiểm tra quan hệ cha con khi kéo thả tránh vòng lặp vô tận
  const isDescendantOf = (list: Category[], childId: number, parentId: number): boolean => {
    let current = list.find((c) => c.id === childId);
    while (current && current.parent_id !== null) {
      if (current.parent_id === parentId) return true;
      current = list.find((c) => c.id === current!.parent_id);
    }
    return false;
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;

    // Không cho phép kéo thả vào danh mục con của chính nó
    if (id !== 0 && isDescendantOf(all, id, draggedId)) {
      return;
    }

    if (id === 0) {
      setDragOverTarget({ id: 0, position: "inside" });
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const threshold = rect.height / 3;

    let position: "before" | "after" | "inside" = "inside";
    if (relativeY < threshold) {
      position = "before";
    } else if (relativeY > rect.height - threshold) {
      position = "after";
    }

    setDragOverTarget({ id, position });
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id || !dragOverTarget) return;

    const dragged = all.find((c) => c.id === draggedId);
    const target = all.find((c) => c.id === id);
    if (!dragged || !target) return;

    setReorderConfirm({
      open: true,
      draggedId,
      targetId: id,
      draggedName: dragged.name,
      targetName: target.name,
    });
  };

  const handleDropOnRoot = () => {
    if (draggedId === null) return;
    performReorder(draggedId, 0, "inside");
  };

  const performReorder = async (
    draggedId: number,
    targetId: number,
    position: "before" | "after" | "inside"
  ) => {
    setReorderConfirm({ open: false });
    setDraggedId(null);
    setDragOverTarget(null);

    const dragged = all.find((c) => c.id === draggedId);
    if (!dragged) return;

    setIsReordering(true);

    try {
      if (targetId === 0) {
        // Đưa về danh mục gốc (root)
        let siblings = all
          .filter((c) => c.parent_id === null && c.id !== draggedId)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        siblings.push(dragged);

        for (let i = 0; i < siblings.length; i++) {
          const item = siblings[i];
          const newOrder = i * 10;
          if (item.sort_order !== newOrder || item.parent_id !== null) {
            await updateCategory(item.id, item.name, null, item.show_on_navbar, item.slug, newOrder);
          }
        }
      } else {
        const target = all.find((c) => c.id === targetId);
        if (!target) return;

        const targetParentId = position === "inside" ? target.id : target.parent_id;
        let siblings = all
          .filter((c) => c.parent_id === targetParentId && c.id !== draggedId)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        if (position === "inside") {
          siblings.push(dragged);
        } else {
          const idx = siblings.findIndex((c) => c.id === targetId);
          if (position === "before") {
            siblings.splice(idx, 0, dragged);
          } else {
            siblings.splice(idx + 1, 0, dragged);
          }
        }

        for (let i = 0; i < siblings.length; i++) {
          const item = siblings[i];
          const newOrder = i * 10;
          const newParentId = item.id === draggedId ? targetParentId : item.parent_id;

          if (item.sort_order !== newOrder || item.parent_id !== newParentId) {
            await updateCategory(
              item.id,
              item.name,
              newParentId,
              item.show_on_navbar,
              item.slug,
              newOrder
            );
          }
        }
      }
      await fetchAll();
    } catch (err) {
      console.error("Lỗi khi sắp xếp lại danh mục:", err);
    } finally {
      setIsReordering(false);
    }
  };

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
      <CategoriesHeader
        totalCount={all.length}
        rootCount={rootCount}
        subCount={subCount}
        onAddCategory={() => setModal({ open: true, mode: "create" })}
      />

      <CategoryStats
        totalCount={all.length}
        rootCount={rootCount}
        subCount={subCount}
      />

      <CategoryTreeTable
        search={search}
        isLoading={isLoading}
        filteredTree={filteredTree}
        onSearchChange={setSearch}
        onEdit={(c) => setModal({ open: true, mode: "edit", category: c })}
        onDelete={(id, name) => setDeleteConfirm({ open: true, id, name })}
        draggedId={draggedId}
        dragOverTarget={dragOverTarget}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDropOnRoot={handleDropOnRoot}
        isReordering={isReordering}
      />

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

      {deleteConfirm.open && (
        <DeleteConfirmModal
          categoryName={deleteConfirm.name}
          onCancel={() => setDeleteConfirm({ open: false })}
          onConfirm={handleDelete}
        />
      )}

      {reorderConfirm.open && reorderConfirm.draggedId && reorderConfirm.targetId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-[#111111] rounded-2xl p-6 max-w-sm w-full shadow-[8px_8px_0px_#111111] animate-in fade-in zoom-in-95 duration-100">
            <h3 className="text-[14px] font-extrabold uppercase text-[#111] mb-2 flex items-center gap-1">
              🗂️ Di Chuyển Danh Mục
            </h3>
            <p className="text-[12px] font-bold text-gray-600 mb-5 leading-relaxed">
              Bạn muốn sắp xếp danh mục <span className="text-[#111] font-black underline">{reorderConfirm.draggedName}</span> thế nào so với <span className="text-[#111] font-black underline">{reorderConfirm.targetName}</span>?
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => performReorder(reorderConfirm.draggedId!, reorderConfirm.targetId!, "before")}
                className="py-2 px-4 bg-white border-2 border-[#111111] text-[#111] font-bold text-[12px] rounded-xl hover:bg-[#F8DE22] shadow-[3px_3px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer text-left"
              >
                ⬆️ Đứng trước "{reorderConfirm.targetName}"
              </button>
              <button
                type="button"
                onClick={() => performReorder(reorderConfirm.draggedId!, reorderConfirm.targetId!, "after")}
                className="py-2 px-4 bg-white border-2 border-[#111111] text-[#111] font-bold text-[12px] rounded-xl hover:bg-[#F8DE22] shadow-[3px_3px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer text-left"
              >
                ⬇️ Đứng sau "{reorderConfirm.targetName}"
              </button>
              <button
                type="button"
                onClick={() => performReorder(reorderConfirm.draggedId!, reorderConfirm.targetId!, "inside")}
                className="py-2 px-4 bg-[#111] text-white font-bold text-[12px] rounded-xl hover:bg-[#03AED2] shadow-[3px_3px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#111111] transition-all cursor-pointer text-left"
              >
                📁 Làm con của "{reorderConfirm.targetName}"
              </button>
              <button
                type="button"
                onClick={() => setReorderConfirm({ open: false })}
                className="mt-2 py-1.5 px-4 bg-gray-100 text-gray-500 font-bold text-[12px] rounded-xl hover:bg-gray-200 transition-colors cursor-pointer text-center"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
