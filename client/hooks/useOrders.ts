import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderStats } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function useOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerOrders = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [ordersRes, statsRes] = await Promise.all([
          fetch(
            `${API_URL}/orders?user_id=${userId}&limit=5&sort_by=created_at&sort_order=DESC`,
            { headers }
          ),
          fetch(`${API_URL}/orders/count?user_id=${userId}`, { headers }),
        ]);

        if (!ordersRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch customer order data");
        }

        const ordersData = (await ordersRes.json()) as { data: Order[] };
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
    [token]
  );

  const fetchAdminOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        `${API_URL}/orders?limit=5&sort_by=created_at&sort_order=DESC`,
        { headers }
      );
      if (!res.ok) throw new Error("Failed to fetch admin orders");
      const data = (await res.json()) as { data: Order[] };
      setOrders(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      setOrders([]);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    orders,
    orderStats,
    isLoading,
    error,
    fetchCustomerOrders,
    fetchAdminOrders,
  };
}
