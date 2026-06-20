import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderStats, UserStats } from "@/types/api";
import { fetchWithTimeout } from "@/utils/fetchWithTimeout";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function useAdminStats() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const [ordersRes, orderStatsRes, userStatsRes] = await Promise.all([
        fetchWithTimeout(`${API_URL}/orders?limit=5&sort_by=created_at&sort_order=DESC`, { headers }),
        fetchWithTimeout(`${API_URL}/orders/count`, { headers }),
        fetchWithTimeout(`${API_URL}/users/count`, { headers }),
      ]);

      if (!ordersRes.ok || !orderStatsRes.ok || !userStatsRes.ok) {
        throw new Error("Failed to fetch admin dashboard stats");
      }

      const ordersData = (await ordersRes.json()) as { data: Order[] };
      const orderStatsData = (await orderStatsRes.json()) as OrderStats;
      const userStatsData = (await userStatsRes.json()) as UserStats;

      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.data ?? []);
      setOrderStats(orderStatsData);
      setUserStats(userStatsData);
    } catch (err) {
      setOrders([]);
      setOrderStats(null);
      setUserStats(null);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    orders,
    orderStats,
    userStats,
    isLoading,
    error,
    fetchAdminDashboardData,
  };
}
