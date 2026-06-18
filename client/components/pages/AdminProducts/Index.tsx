"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types/api";
import ProductModal from "@/components/pages/MainPage/ProductModal";
import AdminDeleteModal from "@/components/pages/admin/AdminDeleteModal";
import ProductsHeader from "./ProductsHeader";
import ProductStatsCards from "./ProductStatsCards";
import ProductsTable from "./ProductsTable";

export default function AdminProducts() {
  const { token } = useAuth();
  const { categories, fetchAll: fetchCategories } = useCategories();
  const {
    products,
    productStats,
    pagination,
    isLoading,
    fetchAdminProducts,
    fetchProductStats,
    deleteProduct,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [page, setPage] = useState(1);

  const [productModal, setProductModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    product?: Product;
  }>({ open: false, mode: "create" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id?: number;
    name?: string;
  }>({ open: false });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCategories();
    fetchProductStats();
  }, [fetchCategories, fetchProductStats]);

  const loadProducts = useCallback(() => {
    fetchAdminProducts({
      page,
      limit: 10,
      search: debouncedSearch,
      is_published: publishedFilter === "" ? undefined : publishedFilter === "true",
    });
  }, [fetchAdminProducts, page, debouncedSearch, publishedFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteProduct(deleteConfirm.id);
      setDeleteConfirm({ open: false });
      loadProducts();
      fetchProductStats();
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8">
      <ProductsHeader
        totalCount={productStats?.total ?? pagination.total}
        onAddProduct={() => setProductModal({ open: true, mode: "create" })}
      />
      <ProductStatsCards stats={productStats} />
      <ProductsTable
        products={products}
        categories={categories}
        isLoading={isLoading}
        search={search}
        publishedFilter={publishedFilter}
        page={pagination.page}
        totalPages={pagination.total_pages}
        total={pagination.total}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onPublishedFilterChange={(v) => { setPublishedFilter(v); setPage(1); }}
        onEdit={(p) => setProductModal({ open: true, mode: "edit", product: p })}
        onDelete={(id, name) => setDeleteConfirm({ open: true, id, name })}
        onPageChange={setPage}
      />

      {productModal.open && token && (
        <ProductModal
          mode={productModal.mode}
          product={productModal.product}
          categories={categories}
          onClose={() => setProductModal({ open: false, mode: "create" })}
          onSaved={() => {
            setProductModal({ open: false, mode: "create" });
            loadProducts();
            fetchProductStats();
          }}
        />
      )}

      {deleteConfirm.open && (
        <AdminDeleteModal
          itemName={deleteConfirm.name}
          description="Hành động này không thể hoàn tác."
          onCancel={() => setDeleteConfirm({ open: false })}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
