import { Category, Product } from "@/types/api";
import AdminQuickActions from "./AdminQuickActions";
import ProductFilterBar from "./ProductFilterBar";
import ProductListContent from "./ProductListContent";

interface ProductCatalogProps {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  isAdmin: boolean;
  selectedCategory: number | null;
  searchQuery: string;
  getCategoryName: (categoryId: number) => string;
  onSelectCategory: (id: number | null) => void;
  onSearchChange: (query: string) => void;
  onAddCategory: () => void;
  onAddProduct: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onResetFilters: () => void;
}

export default function ProductCatalog({
  categories,
  products,
  isLoading,
  isAdmin,
  selectedCategory,
  searchQuery,
  getCategoryName,
  onSelectCategory,
  onSearchChange,
  onAddCategory,
  onAddProduct,
  onEditCategory,
  onDeleteCategory,
  onEditProduct,
  onDeleteProduct,
  onResetFilters,
}: ProductCatalogProps) {
  return (
    <section id="products-section" className="w-full bg-white py-12 md:py-16 border-t-2 border-[#111111]/10">
      <div className="text-center mb-6">
        <h2 className="text-[26px] md:text-[30px] font-extrabold uppercase relative inline-block z-10">
          Sản Phẩm Đang On-Trend
          <span className="absolute -z-10 bottom-0.5 -left-1.25 -right-1.25 h-3 bg-[#F8DE22]" />
        </h2>
      </div>

      {isAdmin && (
        <AdminQuickActions onAddCategory={onAddCategory} onAddProduct={onAddProduct} />
      )}

      <ProductFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        isAdmin={isAdmin}
        onSelectCategory={onSelectCategory}
        onSearchChange={onSearchChange}
        onEditCategory={onEditCategory}
        onDeleteCategory={(id) => onDeleteCategory(id)}
      />

      <ProductListContent
        categories={categories}
        isLoading={isLoading}
        products={products}
        isAdmin={isAdmin}
        getCategoryName={getCategoryName}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        onResetFilters={onResetFilters}
        searchQuery={searchQuery}
      />
    </section>
  );
}
