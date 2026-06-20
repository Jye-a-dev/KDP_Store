"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import ProductCard from "@/components/pages/MainPage/ProductCard";
import ProductModal from "@/components/pages/MainPage/ProductModal";
import CategoryModal from "@/components/pages/AdminCategories/CategoryModal";

function CategoryPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const { user, token } = useAuth();
  const isAdmin = user?.role === "admin";

  const { categories, tree, fetchAll: fetchCategories, deleteCategory } = useCategories();
  const { products, isLoading, fetchProducts, deleteProduct } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [productModal, setProductModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    product?: any;
  }>({ open: false, mode: "create" });

  const [categoryModal, setCategoryModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    category?: any;
  }>({ open: false, mode: "create" });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Sync debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeCategory = categories.find((c) => c.slug === slug);

  useEffect(() => {
    fetchProducts(null, debouncedSearch);
  }, [debouncedSearch, fetchProducts]);

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Sản phẩm";
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      fetchCategories();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts(null, debouncedSearch);
    } catch (err) {
      console.error(err);
    }
  };

  const displayProducts = useMemo(() => {
    if (!activeCategory) return [];
    
    const getDescendantIds = (catId: number): number[] => {
      const ids = [catId];
      const children = categories.filter((c) => c.parent_id === catId);
      children.forEach((child) => {
        ids.push(...getDescendantIds(child.id));
      });
      return ids;
    };

    const descendantIds = getDescendantIds(activeCategory.id);
    return products.filter((p) => p.category_id !== null && descendantIds.includes(p.category_id));
  }, [activeCategory, categories, products]);

  if (!activeCategory && !isLoading && categories.length > 0) {
    return (
      <div className="flex min-h-125 w-full flex-col items-center justify-center text-center px-6 bg-white">
        <div className="text-5xl">⚠️</div>
        <h3 className="mt-4 text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy danh mục</h3>
        <p className="mt-1 text-sm text-[#555555]">Danh mục không tồn tại hoặc đã bị gỡ bỏ.</p>
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
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-[#111111] pb-6 mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D12052] bg-[#D12052]/10 px-2.5 py-1 rounded">
                Danh Mục
              </span>
              <span className="text-[10px] text-[#aaa] font-extrabold tracking-widest">
                ({displayProducts.length} sản phẩm)
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#111111] uppercase tracking-wide">
              {activeCategory?.name}
            </h1>
          </div>

          {/* Search bar within Category */}
          <div className="flex gap-3 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 md:flex-initial">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm trong danh mục..."
                className="border-2 border-[#111111] py-2.5 pl-9 pr-4 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] w-full md:w-60 shadow-[3px_3px_0px_#111111]"
              />
              <svg className="absolute left-3 top-3.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            {isAdmin && activeCategory && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCategoryModal({ open: true, mode: "edit", category: activeCategory })}
                  className="bg-[#F8DE22] text-[#111111] border-2 border-[#111111] px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
                >
                  Sửa danh mục
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${activeCategory.name}"?`)) {
                      handleDeleteCategory(activeCategory.id);
                    }
                  }}
                  className="bg-[#D12052] text-white border-2 border-[#111111] px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setProductModal({ open: true, mode: "create" })}
                  className="bg-[#03AED2] text-white border-2 border-[#111111] px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
                >
                  + Thêm sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex min-h-100 w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="flex min-h-75 w-full flex-col items-center justify-center text-center px-6 border-2 border-dashed border-gray-200 rounded-3xl py-12 bg-gray-50/50">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy sản phẩm nào</h3>
            <p className="text-xs text-[#555555] mt-1">Danh mục này hiện tại chưa có sản phẩm hoặc sản phẩm không khớp với từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getCategoryName={getCategoryName}
                isAdmin={isAdmin}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      {productModal.open && token && (
        <ProductModal
          mode={productModal.mode}
          product={productModal.product}
          categories={categories}
          onClose={() => setProductModal({ open: false, mode: "create" })}
          onSaved={() => {
            setProductModal({ open: false, mode: "create" });
            fetchProducts(null, debouncedSearch);
          }}
        />
      )}

      {categoryModal.open && token && (
        <CategoryModal
          mode={categoryModal.mode}
          category={categoryModal.category}
          tree={tree}
          token={token}
          onClose={() => setCategoryModal({ open: false, mode: "create" })}
          onSaved={() => {
            setCategoryModal({ open: false, mode: "create" });
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}
