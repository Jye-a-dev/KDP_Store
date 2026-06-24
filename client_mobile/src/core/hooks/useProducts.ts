import { useState, useCallback } from "react";
import { Product, ProductStats, PaginatedResponse } from "../types/api";
import { useAuth } from "../../features/auth/controllers/auth_context";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { API_BASE_URL } from "../constants/api_config";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  is_published?: boolean;
  sort_by?: "created_at" | "name" | "price" | "stock";
  sort_order?: "ASC" | "DESC";
}

export function useProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchProducts = useCallback(
    async (selectedCategory: number | null, debouncedSearch: string) => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/products`;
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

        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = (await res.json()) as PaginatedResponse<Product> | Product[];
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

  const fetchAdminProducts = useCallback(
    async (params: ProductQueryParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        query.set("page", String(params.page ?? 1));
        query.set("limit", String(params.limit ?? 10));
        query.set("sort_by", params.sort_by ?? "created_at");
        query.set("sort_order", params.sort_order ?? "DESC");
        if (params.search?.trim()) query.set("search", params.search.trim());
        if (params.category_id !== undefined) query.set("category_id", String(params.category_id));
        if (params.is_published !== undefined) query.set("is_published", String(params.is_published));

        const res = await fetchWithTimeout(`${API_BASE_URL}/products?${query.toString()}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = (await res.json()) as PaginatedResponse<Product>;
        setProducts(data.data ?? []);
        setPagination({
          page: data.page ?? 1,
          limit: data.limit ?? 10,
          total: data.total ?? 0,
          total_pages: data.total_pages ?? 1,
        });
      } catch (err) {
        setProducts([]);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [getHeaders]
  );

  const fetchProductStats = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/products/count`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch product stats");
      const data = (await res.json()) as ProductStats;
      setProductStats(data);
    } catch (err) {
      setProductStats(null);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [getHeaders]);

  const createProduct = useCallback(
    async (productData: Partial<Product>) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/products`, {
          method: "POST",
          headers: getHeaders(),
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
    [token, getHeaders]
  );

  const updateProduct = useCallback(
    async (id: number, productData: Partial<Product>) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
          method: "PATCH",
          headers: getHeaders(),
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
    [token, getHeaders]
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
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
    [token, getHeaders]
  );

  return {
    products,
    productStats,
    pagination,
    isLoading,
    error,
    fetchProducts,
    fetchAdminProducts,
    fetchProductStats,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
