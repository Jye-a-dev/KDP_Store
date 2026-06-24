import { useState, useCallback } from "react";
import { useAuth } from "../../features/auth/controllers/auth_context";
import { Category, CategoryNode } from "../types/api";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { API_BASE_URL } from "../constants/api_config";

function buildTree(flat: Category[]): CategoryNode[] {
  const map = new Map<number, CategoryNode>();
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: CategoryNode[] = [];
  map.forEach((node) => {
    if (node.parent_id === null) {
      roots.push(node);
    } else {
      const parent = map.get(node.parent_id);
      if (parent) {
        parent.children.push(node);
        parent.children.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      }
    }
  });
  roots.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return roots;
}

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
      const res = await fetchWithTimeout(`${API_BASE_URL}/categories?limit=200`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = (await res.json()) as { data: Category[] } | Category[];
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
    async (
      name: string,
      parentId?: number | null,
      showOnNavbar?: boolean,
      slug?: string,
      sortOrder?: number,
      imageUrl?: string
    ) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const body = {
          name,
          parent_id: parentId ?? null,
          show_on_navbar: !!showOnNavbar,
          slug: slug?.trim() || undefined,
          sort_order: sortOrder ?? 0,
          image_url: imageUrl || null,
        };
        const res = await fetchWithTimeout(`${API_BASE_URL}/categories`, {
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
    async (
      id: number,
      name: string,
      parentId?: number | null,
      showOnNavbar?: boolean,
      slug?: string,
      sortOrder?: number,
      imageUrl?: string
    ) => {
      if (!token) throw new Error("Unauthorized");
      setIsLoading(true);
      setError(null);
      try {
        const body = {
          name,
          parent_id: parentId ?? null,
          show_on_navbar: !!showOnNavbar,
          slug: slug?.trim() || undefined,
          sort_order: sortOrder !== undefined ? sortOrder : undefined,
          image_url: imageUrl || null,
        };
        const res = await fetchWithTimeout(`${API_BASE_URL}/categories/${id}`, {
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
        const res = await fetchWithTimeout(`${API_BASE_URL}/categories/${id}`, {
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
