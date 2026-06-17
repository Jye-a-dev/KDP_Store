"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderStats, UserStats } from "@/types/api";
import AnimatedStat from "./AnimatedStat";
import { StatCard } from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "Chờ xác nhận", color: "text-[#F8DE22] bg-[#F8DE22]/20" },
  processing: { label: "Đang giao",    color: "text-[#03AED2] bg-[#03AED2]/10" },
  delivered:  { label: "Hoàn thành",   color: "text-green-600 bg-green-50" },
  cancelled:  { label: "Đã huỷ",       color: "text-[#D12052] bg-[#D12052]/10" },
};

function formatVND(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K₫`;
  return `${n}₫`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN");
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  const [orders,     setOrders]     = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [userStats,  setUserStats]  = useState<UserStats | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const [ordersRes, orderStatsRes, userStatsRes] = await Promise.all([
        fetch(`${API_URL}/orders?limit=5&sort_by=created_at&sort_order=DESC`, { headers }),
        fetch(`${API_URL}/orders/count`, { headers }),
        fetch(`${API_URL}/users/count`, { headers }),
      ]);

      const ordersData     = (await ordersRes.json())     as { data: Order[] };
      const orderStatsData = (await orderStatsRes.json()) as OrderStats;
      const userStatsData  = (await userStatsRes.json())  as UserStats;

      setOrders(Array.isArray(ordersData) ? ordersData : ordersData.data ?? []);
      setOrderStats(orderStatsData);
      setUserStats(userStatsData);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const STATS: StatCard[] = [
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

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#03AED2] mb-1">
              {greeting}, {user?.full_name.split(" ").pop()} 👋
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#111111] leading-tight">
              Tổng Quan<br />
              <mark className="bg-[#F8DE22] text-[#111111] px-2 py-0.5">Admin Panel</mark>
            </h1>
            <p className="mt-2 text-sm text-[#555] font-semibold">
              {now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-[#111111] px-4 py-2 rounded-full shadow-[3px_3px_0px_#111111]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <AnimatedStat key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111]">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">Đơn Hàng Gần Đây</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#111] border-t-[#F8DE22] rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <span className="text-4xl">📭</span>
            <p className="text-[13px] font-bold text-[#555]">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#111111]/10">
                  {["Mã ĐH", "Khách Hàng", "Sản Phẩm", "Số Tiền", "Ngày", "Trạng Thái"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const s = STATUS_LABEL[order.order_status] ?? { label: order.order_status, color: "text-[#555] bg-[#f7f9fa]" };
                  const firstItem = order.items?.[0];
                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-[#111111]/5 hover:bg-[#f7f9fa] transition-colors ${
                        i === orders.length - 1 ? "border-none" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 text-[12px] font-extrabold text-[#111]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] font-semibold text-[#333]">
                        {order.shipping_name}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-[#555] max-w-40 truncate">
                        {firstItem ? `${firstItem.name}${order.items.length > 1 ? ` +${order.items.length - 1}` : ""}` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] font-extrabold text-[#111]">
                        {formatVND(Number(order.final_amount))}
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-[#aaa]">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
