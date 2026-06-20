"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { Product, Category } from "@/types/api";

export function useMainPage() {
  const { user, token } = useAuth();
  const { categories, tree, fetchAll: fetchCategories, deleteCategory } = useCategories();
  const { products, isLoading, fetchProducts, deleteProduct } = useProducts();
  
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(null, debouncedSearch);
  }, [debouncedSearch, fetchProducts]);

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Sản phẩm";
  };

  const router = useRouter();

  const handleCategorySelect = (categoryId: number | null) => {
    if (categoryId === null) {
      const element = document.getElementById("products-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      const cat = categories.find((c) => c.id === categoryId);
      if (cat) {
        router.push(`/categories/${cat.slug}`);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      fetchCategories();
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

  const resetFilters = () => {
    setSearchQuery("");
  };

  const refreshProducts = () => fetchProducts(null, debouncedSearch);

  return {
    token,
    categories,
    tree,
    products,
    isLoading,
    isAdmin,
    selectedCategory: null as number | null,
    setSelectedCategory: handleCategorySelect,
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
  };
}
