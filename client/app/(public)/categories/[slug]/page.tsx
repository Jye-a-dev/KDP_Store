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

  // Filters State
  const [priceFilter, setPriceFilter] = useState("all");
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

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

  // Base list of descendant products in this category
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

  // Filtered and sorted products list
  const filteredProducts = useMemo(() => {
    let list = [...displayProducts];

    // Price filtering
    if (priceFilter !== "all") {
      list = list.filter((p) => {
        const priceVal = Math.round(Number(p.price));
        const getActiveDiscount = () => {
          if (!p.discount_price) return null;
          const val = Math.round(Number(p.discount_price));
          if (val <= 0 || val >= priceVal) return null;
          const now = new Date();
          if (p.sale_start_date && new Date(p.sale_start_date) > now) return null;
          if (p.sale_end_date && new Date(p.sale_end_date) < now) return null;
          return val;
        };
        const actualPrice = getActiveDiscount() ?? priceVal;

        if (priceFilter === "under-1m") {
          return actualPrice < 1000000;
        } else if (priceFilter === "1m-5m") {
          return actualPrice >= 1000000 && actualPrice <= 5000000;
        } else if (priceFilter === "over-5m") {
          return actualPrice > 5000000;
        } else if (priceFilter === "custom") {
          const min = customMinPrice ? parseFloat(customMinPrice) : 0;
          const max = customMaxPrice ? parseFloat(customMaxPrice) : Infinity;
          return actualPrice >= min && actualPrice <= max;
        }
        return true;
      });
    }

    // Status filtering
    if (statusFilter !== "all") {
      list = list.filter((p) => {
        const priceVal = Math.round(Number(p.price));
        const getActiveDiscount = () => {
          if (!p.discount_price) return null;
          const val = Math.round(Number(p.discount_price));
          if (val <= 0 || val >= priceVal) return null;
          const now = new Date();
          if (p.sale_start_date && new Date(p.sale_start_date) > now) return null;
          if (p.sale_end_date && new Date(p.sale_end_date) < now) return null;
          return val;
        };
        const hasDiscount = getActiveDiscount() !== null;

        if (statusFilter === "in-stock") {
          return p.stock > 0;
        } else if (statusFilter === "on-sale") {
          return hasDiscount;
        } else if (statusFilter === "3d") {
          return !!p.model_3d_url;
        }
        return true;
      });
    }

    // Sorting
    if (sortBy === "price-asc") {
      list.sort((a, b) => {
        const getActualPrice = (p: any) => {
          const priceVal = Math.round(Number(p.price));
          if (!p.discount_price) return priceVal;
          const val = Math.round(Number(p.discount_price));
          if (val <= 0 || val >= priceVal) return priceVal;
          const now = new Date();
          if (p.sale_start_date && new Date(p.sale_start_date) > now) return priceVal;
          if (p.sale_end_date && new Date(p.sale_end_date) < now) return priceVal;
          return val;
        };
        return getActualPrice(a) - getActualPrice(b);
      });
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => {
        const getActualPrice = (p: any) => {
          const priceVal = Math.round(Number(p.price));
          if (!p.discount_price) return priceVal;
          const val = Math.round(Number(p.discount_price));
          if (val <= 0 || val >= priceVal) return priceVal;
          const now = new Date();
          if (p.sale_start_date && new Date(p.sale_start_date) > now) return priceVal;
          if (p.sale_end_date && new Date(p.sale_end_date) < now) return priceVal;
          return val;
        };
        return getActualPrice(b) - getActualPrice(a);
      });
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [displayProducts, priceFilter, customMinPrice, customMaxPrice, statusFilter, sortBy]);

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
                ({filteredProducts.length} / {displayProducts.length} sản phẩm)
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

        {/* Filter Bar */}
        <div className="bg-[#f9fafb] border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] p-5 mb-8 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
              <span>⚡ Bộ lọc nâng cao</span>
            </h3>
            {(priceFilter !== "all" || statusFilter !== "all" || sortBy !== "default" || searchQuery !== "") && (
              <button
                onClick={() => {
                  setPriceFilter("all");
                  setCustomMinPrice("");
                  setCustomMaxPrice("");
                  setStatusFilter("all");
                  setSortBy("default");
                  setSearchQuery("");
                }}
                className="px-3.5 py-1.5 bg-white border-2 border-[#111111] text-[10px] font-black uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition-all cursor-pointer flex items-center gap-1"
              >
                ✕ Đặt lại bộ lọc
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Filter Column */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Khoảng giá</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "under-1m", label: "< 1M" },
                  { value: "1m-5m", label: "1M - 5M" },
                  { value: "over-5m", label: "> 5M" },
                  { value: "custom", label: "Tự nhập" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPriceFilter(item.value)}
                    className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      priceFilter === item.value
                        ? "bg-[#F8DE22] text-[#111111] shadow-[2px_2px_0px_#111111]"
                        : "bg-white text-[#111111] hover:bg-[#f3f4f6]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {priceFilter === "custom" && (
                <div className="flex items-center gap-2 mt-2 animate-in fade-in duration-200">
                  <input
                    type="number"
                    placeholder="Min (đ)"
                    value={customMinPrice}
                    onChange={(e) => setCustomMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border-2 border-[#111111] rounded-lg text-xs font-semibold focus:outline-none bg-white text-black placeholder:text-[#aaa]"
                  />
                  <span className="text-[11px] font-bold text-[#111111]">-</span>
                  <input
                    type="number"
                    placeholder="Max (đ)"
                    value={customMaxPrice}
                    onChange={(e) => setCustomMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border-2 border-[#111111] rounded-lg text-xs font-semibold focus:outline-none bg-white text-black placeholder:text-[#aaa]"
                  />
                </div>
              )}
            </div>

            {/* Status Filter Column */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Trạng thái</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "in-stock", label: "Còn hàng" },
                  { value: "on-sale", label: "Khuyến mãi" },
                  { value: "3d", label: "Interactive 3D" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStatusFilter(item.value)}
                    className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      statusFilter === item.value
                        ? "bg-[#03AED2] text-white shadow-[2px_2px_0px_#111111]"
                        : "bg-white text-[#111111] hover:bg-[#f3f4f6]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Column */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#111111]">Sắp xếp</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border-2 border-[#111111] rounded-xl text-xs font-semibold focus:outline-none bg-white text-black shadow-[3px_3px_0px_#111111]"
              >
                <option value="default">Mặc định</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A-Z</option>
                <option value="name-desc">Tên: Z-A</option>
              </select>
            </div>
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
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-75 w-full flex-col items-center justify-center text-center px-6 border-2 border-dashed border-gray-200 rounded-3xl py-12 bg-gray-50/50">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy sản phẩm nào</h3>
            <p className="text-xs text-[#555555] mt-1">Không có sản phẩm nào khớp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {filteredProducts.map((product) => (
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
