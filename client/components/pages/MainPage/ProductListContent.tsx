import { Product } from "@/types/api";
import ProductCard from "./ProductCard";

interface ProductListContentProps {
  isLoading: boolean;
  products: Product[];
  isAdmin: boolean;
  getCategoryName: (categoryId: number) => string;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onResetFilters: () => void;
}

export default function ProductListContent({
  isLoading,
  products,
  isAdmin,
  getCategoryName,
  onEditProduct,
  onDeleteProduct,
  onResetFilters,
}: ProductListContentProps) {
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

  // Group products by category name
  const groupedProducts: Record<string, Product[]> = {};
  products.forEach((product) => {
    const catName = product.category_id ? getCategoryName(product.category_id) : "Sản Phẩm Khác";
    if (!groupedProducts[catName]) {
      groupedProducts[catName] = [];
    }
    groupedProducts[catName].push(product);
  });

  return (
    <div className="flex flex-col gap-12 w-full px-[5%]">
      {Object.entries(groupedProducts).map(([categoryName, catProducts]) => (
        <div key={categoryName} className="flex flex-col gap-6">
          {/* Section Divider Header */}
          <div className="flex items-center gap-4">
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-wider text-[#111111] bg-[#F8DE22]/20 px-3 py-1 border-l-4 border-[#F8DE22] select-none">
              {categoryName}
            </h3>
            <span className="text-[10px] text-[#777] font-extrabold uppercase tracking-widest">
              ({catProducts.length} sản phẩm)
            </span>
            <div className="flex-1 h-0.5 bg-[#111111]/5" />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {catProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getCategoryName={getCategoryName}
                isAdmin={isAdmin}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
