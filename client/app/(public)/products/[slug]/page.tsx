"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/api";
import ProductCard from "@/components/pages/MainPage/ProductCard";
import CheckoutModal from "./CheckoutModal";
import ProductMediaViewer from "./ProductMediaViewer";
import ProductEditForm from "./ProductEditForm";
import ProductDetails from "./ProductDetails";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuth();
  const { addToCart } = useCart();
  const { categories, fetchAll: fetchCategories } = useCategories();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"2d" | "3d">("2d");
  const [selectedColor, setSelectedColor] = useState("#D12052");
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  // Checkout modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const productSlug = params?.slug;

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteInline = async () => {
    if (!product) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Lỗi khi xóa sản phẩm");
      }

      router.push("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa");
    }
  };

  // Load product detail by slug
  useEffect(() => {
    if (!productSlug) return;
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/slug/${productSlug}`);
        if (!res.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }
        const data = await res.json();
        setProduct(data);
        if (data.materials_config?.colors && data.materials_config.colors.length > 0) {
          setSelectedColor(data.materials_config.colors[0]);
        } else {
          setSelectedColor("#D12052");
        }
        if (data.model_3d_url) {
          setActiveTab("3d");
        } else {
          setActiveTab("2d");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productSlug]);

  // Load all products for recommendations
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?limit=100`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.data ?? [];
          setAllProducts(list);
        }
      } catch (err) {
        console.error("Failed to load recommended products:", err);
      }
    };
    fetchAllProducts();
  }, [productSlug]);

  // Load categories for name mapping
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load Google's <model-viewer> web component dynamically
  useEffect(() => {
    if (product?.model_3d_url && !document.getElementById("model-viewer-script")) {
      const script = document.createElement("script");
      script.id = "model-viewer-script";
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      document.body.appendChild(script);
    }
  }, [product?.model_3d_url]);

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Sản phẩm";
  };

  // Parse images
  const getImages = (images2d: string[] | string): string[] => {
    if (Array.isArray(images2d)) return images2d;
    try {
      const parsed = JSON.parse(images2d);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return typeof images2d === "string" && images2d ? [images2d] : [];
  };

  const images = product ? getImages(product.images_2d) : [];
  const [mainImage, setMainImage] = useState("");

  // Sync main image when product loads
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!product) return;

    const priceVal = Math.round(Number(product.price));
    const discountVal = product.discount_price ? Math.round(Number(product.discount_price)) : null;
    const hasRealDiscount = discountVal !== null && discountVal > 0 && discountVal < priceVal;
    const finalPrice = hasRealDiscount ? discountVal! : (product.id % 3 === 0 ? Math.round(priceVal) : priceVal);

    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      color: selectedColor || "Mặc định",
      image: mainImage || images[0],
      slug: product.slug,
    }, quantity);

    setSuccessMsg("🎉 Đã thêm sản phẩm vào giỏ hàng thành công!");
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsCheckoutOpen(true);
  };



  if (isLoading) {
    return (
      <div className="flex min-h-125 w-full items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-100 w-full flex-col items-center justify-center text-center px-6 bg-white">
        <div className="text-5xl">⚠️</div>
        <h3 className="mt-4 text-lg font-bold text-[#111111] uppercase tracking-wide">Không tìm thấy sản phẩm</h3>
        <p className="mt-1 text-sm text-[#555555]">
          {error || "Sản phẩm không khả dụng hoặc đã bị gỡ bỏ."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 border-2 border-[#111111] bg-[#111111] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0px_#F8DE22] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const isFurniture = !!product.model_3d_url;
  const modelUrl = product.model_3d_url || "";

  // Filter recommendations
  const sameCategoryProducts = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const otherCategoryProducts = allProducts
    .filter((p) => p.category_id !== product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full bg-white py-12 px-[5%] md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Back Navigation */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Quay lại trang chủ
        </button>

        {/* Detail Box */}
        <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col md:flex-row mb-16">

          {/* Left Column: Media Viewer */}
          <ProductMediaViewer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isFurniture={isFurniture}
            productName={product.name}
            mainImage={mainImage}
            setMainImage={setMainImage}
            images={images}
            modelUrl={modelUrl}
          />

          {/* Right Column: Information & Actions */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            {isEditing ? (
              <ProductEditForm
                product={product}
                setProduct={setProduct}
                categories={categories}
                token={token}
                setIsEditing={setIsEditing}
                onSuccess={(msg) => {
                  setSuccessMsg(msg);
                  setTimeout(() => setSuccessMsg(""), 3000);
                }}
                router={router}
                productSlug={productSlug}
                API_URL={API_URL}
              />
            ) : (
              <ProductDetails
                product={product}
                getCategoryName={getCategoryName}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                quantity={quantity}
                setQuantity={setQuantity}
                user={user}
                setIsEditing={setIsEditing}
                handleDeleteInline={handleDeleteInline}
                handleAddToCart={handleAddToCart}
                handleBuyNow={handleBuyNow}
                successMsg={successMsg}
              />
            )}
          </div>
        </div>

        {/* Same Category Recommendations */}
        {sameCategoryProducts.length > 0 && (
          <div className="mb-12 border-t-2 border-[#111111]/10 pt-10">
            <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-[#111111] mb-6 inline-block relative">
              Sản phẩm cùng danh mục
              <span className="absolute -z-10 bottom-0.5 left-0 right-0 h-2 bg-[#F8DE22]/50" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sameCategoryProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  getCategoryName={getCategoryName}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Category Recommendations */}
        {otherCategoryProducts.length > 0 && (
          <div className="border-t-2 border-[#111111]/10 pt-10">
            <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-[#111111] mb-6 inline-block relative">
              Có thể bạn cũng thích
              <span className="absolute -z-10 bottom-0.5 left-0 right-0 h-2 bg-[#03AED2]/20" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {otherCategoryProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  getCategoryName={getCategoryName}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={product}
        quantity={quantity}
        selectedColor={selectedColor}
        mainImage={mainImage}
        token={token}
        user={user}
        onSuccess={(msg) => setSuccessMsg(msg)}
      />
    </div>
  );
}
