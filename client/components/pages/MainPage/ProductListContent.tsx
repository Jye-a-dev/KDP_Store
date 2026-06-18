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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-[5%] w-full">
      {products.map((product) => (
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
  );
}
