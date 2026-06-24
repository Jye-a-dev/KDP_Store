import { useState, useCallback } from "react";
import { useAuth } from "../../features/auth/controllers/auth_context";
import { User, UserStats, PaginatedResponse, UserAddress } from "../types/api";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { API_BASE_URL } from "../constants/api_config";

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
}

export interface UpdateUserData {
  full_name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
  role?: "customer" | "admin";
  avatar_url?: string;
  addresses?: UserAddress[];
  password_hash?: string;
}

export interface CreateUserData {
  email: string;
  password_hash?: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role?: "customer" | "admin";
  is_active?: boolean;
  addresses?: UserAddress[];
}

export function useUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchUsers = useCallback(
    async (params: UserQueryParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        query.set("page", String(params.page ?? 1));
        query.set("limit", String(params.limit ?? 10));
        query.set("sort_by", "created_at");
        query.set("sort_order", "DESC");
        if (params.search?.trim()) query.set("search", params.search.trim());
        if (params.role) query.set("role", params.role);
        if (params.is_active !== undefined) query.set("is_active", String(params.is_active));

        const res = await fetchWithTimeout(`${API_BASE_URL}/users?${query.toString()}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = (await res.json()) as PaginatedResponse<User>;
        setUsers(data.data ?? []);
        setPagination({
          page: data.page ?? 1,
          limit: data.limit ?? 10,
          total: data.total ?? 0,
          total_pages: data.total_pages ?? 1,
        });
      } catch (err) {
        setUsers([]);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [getHeaders]
  );

  const fetchUserStats = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/users/count`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch user stats");
      const data = (await res.json()) as UserStats;
      setUserStats(data);
    } catch (err) {
      setUserStats(null);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [getHeaders]);

  const updateUser = useCallback(
    async (id: string, data: UpdateUserData) => {
      if (!token) throw new Error("Unauthorized");
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const body = (await res.json()) as { message?: string };
          throw new Error(body.message ?? "Failed to update user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    [token, getHeaders]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      if (!token) throw new Error("Unauthorized");
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        if (!res.ok) {
          const body = (await res.json()) as { message?: string };
          throw new Error(body.message ?? "Failed to delete user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    [token, getHeaders]
  );

  const createUser = useCallback(
    async (data: CreateUserData) => {
      if (!token) throw new Error("Unauthorized");
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/users`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const body = (await res.json()) as { message?: string };
          throw new Error(body.message ?? "Failed to create user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    [token, getHeaders]
  );

  return {
    users,
    userStats,
    pagination,
    isLoading,
    error,
    fetchUsers,
    fetchUserStats,
    updateUser,
    deleteUser,
    createUser,
  };
}
