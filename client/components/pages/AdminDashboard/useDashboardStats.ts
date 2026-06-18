"use client";

import { useAdminStats } from "@/hooks/useAdminStats";
import { formatVND } from "./helpers";
import { StatCard } from "./types";

export function useDashboardStats() {
  const { orders, orderStats, userStats, isLoading, fetchAdminDashboardData } = useAdminStats();

  const stats: StatCard[] = [
    {
      label: "Doanh Thu (Delivered)",
      value: orderStats ? formatVND(orderStats.total_revenue) : "—",
      delta: orderStats ? `${orderStats.delivered} đơn delivered` : "Đang tải...",
      positive: true,
      icon: "💰",
      accent: "bg-[#F8DE22]",
    },
    {
      label: "Tổng Đơn Hàng",
      value: orderStats ? String(orderStats.total) : "—",
      delta: orderStats ? `${orderStats.pending} chờ · ${orderStats.processing} giao` : "Đang tải...",
      positive: true,
      icon: "📦",
      accent: "bg-[#03AED2]/20",
    },
    {
      label: "Khách Hàng",
      value: userStats ? String(userStats.customers) : "—",
      delta: userStats ? `${userStats.active} active · ${userStats.inactive} inactive` : "Đang tải...",
      positive: true,
      icon: "👥",
      accent: "bg-[#D12052]/20",
    },
    {
      label: "Đã Huỷ",
      value: orderStats ? String(orderStats.cancelled) : "—",
      delta: orderStats
        ? `${orderStats.total > 0 ? ((orderStats.cancelled / orderStats.total) * 100).toFixed(1) : 0}% tổng đơn`
        : "Đang tải...",
      positive: (orderStats?.cancelled ?? 0) === 0,
      icon: "↩️",
      accent: "bg-[#F45B26]/20",
    },
  ];

  return { orders, stats, isLoading, fetchAdminDashboardData };
}
