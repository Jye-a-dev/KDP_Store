"use client";

import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { Product, Category } from "@/types/api";

export function useMainPage() {
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

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const refreshProducts = () => fetchProducts(selectedCategory, debouncedSearch);

  return {
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
  };
}
