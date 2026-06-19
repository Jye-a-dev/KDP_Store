"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/pages/MainPage/ProductCard";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { categories, fetchAll: fetchCategories } = useCategories();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const loadWishlist = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const wishlistIds = JSON.parse(
        localStorage.getItem(`kdp_wishlist_${user.id}`) || "[]"
      ) as number[];

      if (wishlistIds.length === 0) {
        setWishlistProducts([]);
        setIsLoading(false);
        return;
      }

      // Fetch all products
      const res = await fetch(`${API_URL}/products?limit=100`);
      if (!res.ok) throw new Error("Không thể tải sản phẩm");
      const resData = await res.json();
      const list = (Array.isArray(resData) ? resData : resData.data ?? []) as Product[];

      // Filter
      const filtered = list.filter((p) => wishlistIds.includes(p.id));
      setWishlistProducts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user?.id]);

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Sản phẩm";
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8 px-4 pt-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/customer")}
        className="mb-6 inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Quay lại Dashboard
      </button>

      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] p-6 mb-8">
        <h1 className="text-xl font-extrabold uppercase tracking-wider text-[#111111] mb-6 inline-block relative">
          Sản phẩm yêu thích
          <span className="absolute -z-10 bottom-0.5 left-0 right-0 h-2 bg-[#D12052]/20" />
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">❤️</div>
            <p className="text-sm font-bold text-[#555] mb-2">Danh sách yêu thích trống</p>
            <p className="text-xs text-gray-400">Hãy thêm các sản phẩm bạn thích khi tham quan cửa hàng của chúng tôi!</p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer rounded-xl"
            >
              Xem Sản Phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                getCategoryName={getCategoryName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
