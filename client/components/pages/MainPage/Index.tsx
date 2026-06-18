"use client";

import Hero from "./Hero";
import FeaturedCollections from "./FeaturedCollections";
import Newsletter from "./Newsletter";
import ProductCatalog from "./ProductCatalog";
import ProductModal from "./ProductModal";
import CategoryModal from "@/components/pages/AdminCategories/CategoryModal";
import { useMainPage } from "./useMainPage";

export default function MainPage() {
  const {
    token,
    categories,
    tree,
    products,
    isLoading,
    isAdmin,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    productModal,
    setProductModal,
    categoryModal,
    setCategoryModal,
    getCategoryName,
    handleCategorySelect,
    handleDeleteCategory,
    handleDeleteProduct,
    resetFilters,
    fetchCategories,
    refreshProducts,
  } = useMainPage();

  return (
    <div className="flex w-full flex-col font-sans bg-white">
      <Hero />

      <FeaturedCollections
        categories={categories}
        handleCategorySelect={handleCategorySelect}
      />

      <ProductCatalog
        categories={categories}
        products={products}
        isLoading={isLoading}
        isAdmin={isAdmin}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        getCategoryName={getCategoryName}
        onSelectCategory={setSelectedCategory}
        onSearchChange={setSearchQuery}
        onAddCategory={() => setCategoryModal({ open: true, mode: "create" })}
        onAddProduct={() => setProductModal({ open: true, mode: "create" })}
        onEditCategory={(cat) => setCategoryModal({ open: true, mode: "edit", category: cat })}
        onDeleteCategory={handleDeleteCategory}
        onEditProduct={(p) => setProductModal({ open: true, mode: "edit", product: p })}
        onDeleteProduct={handleDeleteProduct}
        onResetFilters={resetFilters}
      />

      <Newsletter />

      {productModal.open && token && (
        <ProductModal
          mode={productModal.mode}
          product={productModal.product}
          categories={categories}
          onClose={() => setProductModal({ open: false, mode: "create" })}
          onSaved={() => {
            setProductModal({ open: false, mode: "create" });
            refreshProducts();
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
