import { useState, useCallback } from "react";
import { Product } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function useProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (selectedCategory: number | null, debouncedSearch: string) => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `${API_URL}/products`;
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

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = (await res.json()) as { data: Product[] };
        const list = Array.isArray(data) ? data : data.data ?? [];
        setProducts(list);
      } catch (err) {
        setProducts([]);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createProduct = useCallback(
    async (productData: Partial<Product>) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? "Failed to create product");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const updateProduct = useCallback(
    async (id: number, productData: Partial<Product>) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? "Failed to update product");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? "Failed to delete product");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

