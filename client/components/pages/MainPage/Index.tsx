"use client";

import { useEffect, useState } from "react";
import Hero from "./Hero";
import FeaturedCollections from "./FeaturedCollections";
import ProductCard from "./ProductCard";
import Newsletter from "./Newsletter";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import ProductModal from "./ProductModal";
import CategoryModal from "@/components/pages/AdminCategories/CategoryModal";
import { Product, Category } from "@/types/api";

export default function MainPage() {
  const { user, token } = useAuth();
  const { categories, tree, fetchAll: fetchCategories, deleteCategory } = useCategories();
  const { products, isLoading, fetchProducts, deleteProduct } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isAdmin = user?.role === "admin";

  const [productModal, setProductModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    product?: Product;
  }>({ open: false, mode: "create" });

  const [categoryModal, setCategoryModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    category?: Category;
  }>({ open: false, mode: "create" });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products
  useEffect(() => {
    fetchProducts(selectedCategory, debouncedSearch);
  }, [selectedCategory, debouncedSearch, fetchProducts]);

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Sản phẩm";
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById("products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      fetchCategories();
      setSelectedCategory(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts(selectedCategory, debouncedSearch);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex w-full flex-col font-sans bg-white">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. FEATURED CATEGORIES — real API data */}
      <FeaturedCollections
        categories={categories}
        handleCategorySelect={handleCategorySelect}
      />

      {/* 3. PRODUCT CATALOG */}
      <section id="products-section" className="w-full bg-white py-12 md:py-16 border-t-2 border-[#111111]/10">
        <div className="text-center mb-6">
          <h2 className="text-[26px] md:text-[30px] font-extrabold uppercase relative inline-block z-10">
            Sản Phẩm Đang On-Trend
            <span className="absolute -z-10 bottom-0.5 -left-1.25 -right-1.25 h-3 bg-[#F8DE22]" />
          </h2>
        </div>

        {/* Admin Quick Actions */}
        {isAdmin && (
          <div className="flex items-center gap-3 px-[5%] mb-6 flex-wrap bg-[#F8DE22]/10 border-2 border-[#111111] p-3 rounded-2xl mx-[5%] shadow-[3px_3px_0px_#111111]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111] mr-2">
              🛠️ BẢNG ĐIỀU KHIỂN ADMIN:
            </span>
            <button
              onClick={() => setCategoryModal({ open: true, mode: "create" })}
              className="bg-[#111111] text-white px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border-2 border-[#111111] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#D12052]"
            >
              + Thêm Danh Mục
            </button>
            <button
              onClick={() => setProductModal({ open: true, mode: "create" })}
              className="bg-[#03AED2] text-white px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border-2 border-[#111111] hover:bg-white hover:text-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#111111]"
            >
              + Thêm Sản Phẩm
            </button>
          </div>
        )}

        {/* Filter and Search Bar Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-[5%] mb-8">
          {/* Categories Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`font-bold uppercase text-[11px] tracking-[0.5px] px-5 py-2.5 border-2 border-[#111111] transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-[#D12052] text-white border-[#D12052] shadow-[2px_2px_0px_#111111]"
                  : "bg-white text-[#111111] hover:bg-[#F8DE22]"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <div key={cat.id} className="relative group/cat">
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`font-bold uppercase text-[11px] tracking-[0.5px] px-5 py-2.5 border-2 border-[#111111] transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-[#D12052] text-white border-[#D12052] shadow-[2px_2px_0px_#111111]"
                      : "bg-white text-[#111111] hover:bg-[#F8DE22]"
                  }`}
                >
                  {cat.name}
                </button>
                {isAdmin && (
                  <div className="absolute -top-2 -right-2 hidden group-hover/cat:flex gap-1 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryModal({ open: true, mode: "edit", category: cat });
                      }}
                      className="w-5 h-5 bg-[#F8DE22] border-2 border-[#111111] rounded flex items-center justify-center text-[10px] cursor-pointer shadow-[1px_1px_0px_#111111]"
                      title="Sửa danh mục"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Bạn có chắc muốn xóa danh mục "${cat.name}"? Các danh mục con sẽ trở thành danh mục gốc.`
                          )
                        ) {
                          handleDeleteCategory(cat.id);
                        }
                      }}
                      className="w-5 h-5 bg-[#D12052] text-white border-2 border-[#111111] rounded flex items-center justify-center text-[10px] cursor-pointer shadow-[1px_1px_0px_#111111]"
                      title="Xóa danh mục"
                    >
                      ❌
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-[#111111] bg-white py-3 px-5 pl-12 text-sm text-[#111111] font-semibold outline-none shadow-[3px_3px_0px_#111111] focus:bg-[#f7f9fa]"
            />
            <div className="absolute left-4 top-3.5 text-[#111111]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Spinner / Grid Content */}
        {isLoading ? (
          <div className="flex min-h-100 w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-75 w-full flex-col items-center justify-center text-center px-6">
            <div className="text-5xl">🔍</div>
            <h3 className="mt-4 text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy sản phẩm nào</h3>
            <p className="mt-1 text-sm text-[#555555]">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-[5%] w-full">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getCategoryName={getCategoryName}
                isAdmin={isAdmin}
                onEdit={(p) => setProductModal({ open: true, mode: "edit", product: p })}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. NEWSLETTER BLOCK */}
      <Newsletter />

      {/* Product Form Modal */}
      {productModal.open && token && (
        <ProductModal
          mode={productModal.mode}
          product={productModal.product}
          categories={categories}
          onClose={() => setProductModal({ open: false, mode: "create" })}
          onSaved={() => {
            setProductModal({ open: false, mode: "create" });
            fetchProducts(selectedCategory, debouncedSearch);
          }}
        />
      )}

      {/* Category Form Modal */}
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
