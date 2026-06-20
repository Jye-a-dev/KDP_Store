import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderStats, PaginatedResponse } from "@/types/api";
import { fetchWithTimeout } from "@/utils/fetchWithTimeout";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  order_status?: string;
  sort_by?: "created_at" | "total_amount";
  sort_order?: "ASC" | "DESC";
}

export function useOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchCustomerOrders = useCallback(
    async (userId: string, params: OrderQueryParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const headers = getHeaders();
        const query = new URLSearchParams();
        query.set("user_id", userId);
        query.set("limit", String(params.limit ?? 100));
        query.set("sort_by", params.sort_by ?? "created_at");
        query.set("sort_order", params.sort_order ?? "DESC");
        if (params.order_status) query.set("order_status", params.order_status);

        const [ordersRes, statsRes] = await Promise.all([
          fetchWithTimeout(
            `${API_URL}/orders?${query.toString()}`,
            { headers }
          ),
          fetchWithTimeout(`${API_URL}/orders/count?user_id=${userId}`, { headers }),
        ]);

        if (!ordersRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch customer order data");
        }

        const ordersData = (await ordersRes.json()) as PaginatedResponse<Order> | Order[];
        const statsData = (await statsRes.json()) as OrderStats;

        setOrders(Array.isArray(ordersData) ? ordersData : ordersData.data ?? []);
        setOrderStats(statsData);
      } catch (err) {
        setOrders([]);
        setOrderStats(null);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [getHeaders]
  );

  const fetchAdminOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchWithTimeout(
        `${API_URL}/orders?limit=5&sort_by=created_at&sort_order=DESC`,
        { headers: getHeaders() }
      );
      if (!res.ok) throw new Error("Failed to fetch admin orders");
      const data = (await res.json()) as PaginatedResponse<Order> | Order[];
      setOrders(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setOrders([]);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders]);

  const fetchOrdersList = useCallback(
    async (params: OrderQueryParams = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        query.set("page", String(params.page ?? 1));
        query.set("limit", String(params.limit ?? 10));
        query.set("sort_by", params.sort_by ?? "created_at");
        query.set("sort_order", params.sort_order ?? "DESC");
        if (params.order_status) query.set("order_status", params.order_status);

        const res = await fetchWithTimeout(`${API_URL}/orders?${query.toString()}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = (await res.json()) as PaginatedResponse<Order>;
        setOrders(data.data ?? []);
        setPagination({
          page: data.page ?? 1,
          limit: data.limit ?? 10,
          total: data.total ?? 0,
          total_pages: data.total_pages ?? 1,
        });
      } catch (err) {
        setOrders([]);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [getHeaders]
  );

  const fetchOrderStats = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/orders/count`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch order stats");
      const data = (await res.json()) as OrderStats;
      setOrderStats(data);
    } catch (err) {
      setOrderStats(null);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }, [getHeaders]);

  const updateOrderStatus = useCallback(
    async (id: string, order_status: string) => {
      if (!token) throw new Error("Unauthorized");
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_URL}/orders/${id}`, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ order_status }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { message?: string };
          throw new Error(data.message ?? "Failed to update order");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    [token, getHeaders]
  );

  const updateOrder = useCallback(
    async (id: string, data: Record<string, unknown>) => {
      if (!token) throw new Error("Unauthorized");
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_URL}/orders/${id}`, {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const body = (await res.json()) as { message?: string };
          throw new Error(body.message ?? "Failed to update order");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    [token, getHeaders]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      if (!token) throw new Error("Unauthorized");
      setError(null);
      try {
        const res = await fetchWithTimeout(`${API_URL}/orders/${id}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
        if (!res.ok) {
          const body = (await res.json()) as { message?: string };
          throw new Error(body.message ?? "Failed to delete order");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    [token, getHeaders]
  );

  return {
    orders,
    orderStats,
    pagination,
    isLoading,
    error,
    fetchCustomerOrders,
    fetchAdminOrders,
    fetchOrdersList,
    fetchOrderStats,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
  };
}

