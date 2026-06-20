import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Category, CategoryNode } from "@/types/api";
import { buildTree } from "@/components/pages/AdminCategories/helpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function useCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/categories?limit=200`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = (await res.json()) as { data: Category[] };
      const list = Array.isArray(data) ? data : data.data ?? [];
      setCategories(list);
      setTree(buildTree(list));
    } catch (err) {
      setCategories([]);
      setTree([]);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (name: string, parentId?: number | null, showOnNavbar?: boolean, slug?: string) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const body = { 
          name, 
          parent_id: parentId ?? null, 
          show_on_navbar: !!showOnNavbar, 
          slug: slug?.trim() || undefined 
        };
        const res = await fetch(`${API_URL}/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? "Failed to create category");
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

  const updateCategory = useCallback(
    async (id: number, name: string, parentId?: number | null, showOnNavbar?: boolean, slug?: string) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const body = { 
          name, 
          parent_id: parentId ?? null, 
          show_on_navbar: !!showOnNavbar, 
          slug: slug?.trim() || undefined 
        };
        const res = await fetch(`${API_URL}/categories/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? "Failed to update category");
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

  const deleteCategory = useCallback(
    async (id: number) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? "Failed to delete category");
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
    categories,
    tree,
    isLoading,
    error,
    fetchAll,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
