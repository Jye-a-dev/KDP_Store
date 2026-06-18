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
  const { categories: all, tree, isLoading, fetchAll, deleteCategory } = useCategories();
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
    </div>
  );
}
