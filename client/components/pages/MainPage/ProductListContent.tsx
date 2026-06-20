import { useMemo } from "react";
import Link from "next/link";
import { Category, Product } from "@/types/api";
import ProductCard from "./ProductCard";

interface ProductListContentProps {
  categories: Category[];
  isLoading: boolean;
  products: Product[];
  isAdmin: boolean;
  getCategoryName: (categoryId: number) => string;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onResetFilters: () => void;
  searchQuery: string;
}

export default function ProductListContent({
  categories,
  isLoading,
  products,
  isAdmin,
  getCategoryName,
  onEditProduct,
  onDeleteProduct,
  onResetFilters,
  searchQuery,
}: ProductListContentProps) {
  // Stable random selection of up to 4 products per category
  const randomProductsByCategory = useMemo(() => {
    const map: Record<number, Product[]> = {};
    categories.forEach((cat) => {
      const catProducts = products.filter((p) => p.category_id === cat.id);
      const shuffled = [...catProducts].sort(() => 0.5 - Math.random());
      map[cat.id] = shuffled.slice(0, 4);
    });
    return map;
  }, [categories, products]);

  if (isLoading) {
    return (
      <div className="flex min-h-100 w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-75 w-full flex-col items-center justify-center text-center px-6">
        <div className="text-5xl">🔍</div>
        <h3 className="mt-4 text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy sản phẩm nào</h3>
        <p className="mt-1 text-sm text-[#555555]">
          Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    );
  }

  // If there's an active search query, render a flat grid of all matching products
  if (searchQuery.trim() !== "") {
    return (
      <div className="flex flex-col gap-6 w-full px-[5%]">
        <div className="flex items-center gap-4">
          <h3 className="text-base md:text-lg font-extrabold uppercase tracking-wider text-[#111111] bg-[#F8DE22]/20 px-3 py-1 border-l-4 border-[#F8DE22] select-none">
            Kết quả tìm kiếm
          </h3>
          <span className="text-[10px] text-[#777] font-extrabold uppercase tracking-widest">
            ({products.length} sản phẩm)
          </span>
          <div className="flex-1 h-0.5 bg-[#111111]/5" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              getCategoryName={getCategoryName}
              isAdmin={isAdmin}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      </div>
    );
  }

  // Standard homepage display: Group products by category, picking up to 4 random products each
  return (
    <div className="flex flex-col gap-16 w-full px-[5%]">
      {categories.map((category) => {
        const catProducts = randomProductsByCategory[category.id] ?? [];
        if (catProducts.length === 0) return null;

        return (
          <div key={category.id} className="flex flex-col gap-6">
            {/* Section Header */}
            <div className="flex justify-between items-center border-b border-[#111111]/10 pb-3">
              <div className="flex items-center gap-4">
                <h3 className="text-base md:text-lg font-extrabold uppercase tracking-wider text-[#111111] bg-[#F8DE22]/20 px-3 py-1 border-l-4 border-[#F8DE22] select-none">
                  {category.name}
                </h3>
              </div>
              
              {/* View All Button */}
              <Link
                href={`/categories/${category.slug}`}
                className="text-[11px] font-black uppercase text-[#03AED2] hover:text-[#111111] transition-colors flex items-center gap-1 group/btn cursor-pointer"
              >
                Xem tất cả
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transition-transform group-hover/btn:translate-x-0.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {catProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  getCategoryName={getCategoryName}
                  isAdmin={isAdmin}
                  onDelete={onDeleteProduct}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
