"use client";

import { useEffect, useState } from "react";
import Hero from "./Hero";
import FeaturedCollections from "./FeaturedCollections";
import ProductCard from "./ProductCard";
import Newsletter from "./Newsletter";

interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  description: string;
  stock: number;
  images_2d: string[] | string;
  model_3d_url: string | null;
  is_published: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${apiUrl}/categories`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setCategories(list);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch products
  useEffect(() => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    let url = `${apiUrl}/products`;
    const params: string[] = [];

    if (selectedCategory !== null) {
      params.push(`category_id=${selectedCategory}`);
    }
    if (debouncedSearch.trim() !== "") {
      params.push(`search=${encodeURIComponent(debouncedSearch)}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setProducts(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      });
  }, [selectedCategory, debouncedSearch]);

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Sản phẩm";
  };

  // Find category IDs to wire up the collections cards
  const furnitureCat = categories.find((c) => c.slug === "furniture")?.id || null;
  const clothingCat = categories.find((c) => c.slug.includes("clothing") || c.slug.includes("men"))?.id || null;
  const accessoriesCat = categories.find((c) => c.slug === "jewelery" || c.slug === "electronics")?.id || null;

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const element = document.getElementById("products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex w-full flex-col font-sans bg-white">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. PREMIUM CATEGORIES */}
      <FeaturedCollections
        furnitureCat={furnitureCat}
        clothingCat={clothingCat}
        accessoriesCat={accessoriesCat}
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
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-bold uppercase text-[11px] tracking-[0.5px] px-5 py-2.5 border-2 border-[#111111] transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-[#D12052] text-white border-[#D12052] shadow-[2px_2px_0px_#111111]"
                    : "bg-white text-[#111111] hover:bg-[#F8DE22]"
                }`}
              >
                {cat.name}
              </button>
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
                furnitureCat={furnitureCat}
                getCategoryName={getCategoryName}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. NEWSLETTER BLOCK */}
      <Newsletter />
    </div>
  );
}
