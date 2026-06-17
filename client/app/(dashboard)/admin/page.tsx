"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ReactNode;
  accent: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: "#KDP-0091", customer: "Nguyễn Văn A", product: "Áo Oversized Drop", amount: "689.000₫", status: "Đang giao", statusColor: "text-[#03AED2] bg-[#03AED2]/10" },
  { id: "#KDP-0090", customer: "Trần Thị B", product: "Quần Cargo Khaki", amount: "520.000₫", status: "Hoàn thành", statusColor: "text-green-600 bg-green-50" },
  { id: "#KDP-0089", customer: "Lê Minh C", product: "Giày Chunky Platform", amount: "1.250.000₫", status: "Chờ xác nhận", statusColor: "text-[#F8DE22] bg-[#F8DE22]/20" },
  { id: "#KDP-0088", customer: "Phạm Thu D", product: "Hoodie Gradient Wash", amount: "780.000₫", status: "Hoàn thành", statusColor: "text-green-600 bg-green-50" },
  { id: "#KDP-0087", customer: "Hoàng Đức E", product: "Balo Canvas", amount: "450.000₫", status: "Đã huỷ", statusColor: "text-[#D12052] bg-[#D12052]/10" },
];

const QUICK_ACTIONS = [
  { label: "Thêm Sản Phẩm", icon: "📦", href: "#", accent: "bg-[#F8DE22]" },
  { label: "Tạo Mã Giảm Giá", icon: "🏷️", href: "#", accent: "bg-[#03AED2]" },
  { label: "Xem Báo Cáo", icon: "📊", href: "#", accent: "bg-[#D12052]" },
  { label: "Cài Đặt Store", icon: "⚙️", href: "#", accent: "bg-[#F45B26]" },
];

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ─── Stat card component ──────────────────────────────────────────────────────
function AnimatedStat({ stat, index }: { stat: StatCard; index: number }) {
  return (
    <div
      className="bg-white border-2 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_#111111] flex flex-col gap-3 hover:shadow-[6px_6px_0px_#111111] transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#555]">{stat.label}</span>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${stat.accent}`}>
          {stat.icon}
        </span>
      </div>
      <p className="text-3xl font-extrabold text-[#111111] leading-none">{stat.value}</p>
      <p className={`text-[11px] font-bold ${stat.positive ? "text-green-600" : "text-[#D12052]"}`}>
        {stat.delta} so với tháng trước
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { user } = useAuth();
  const revenue = useCounter(182500000, 1200);
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  const STATS: StatCard[] = [
    {
      label: "Doanh Thu Tháng",
      value: `${(revenue / 1_000_000).toFixed(1)}M₫`,
      delta: "+12.4%",
      positive: true,
      icon: "💰",
      accent: "bg-[#F8DE22]",
    },
    {
      label: "Tổng Đơn Hàng",
      value: "1,284",
      delta: "+8.1%",
      positive: true,
      icon: "📦",
      accent: "bg-[#03AED2]/20",
    },
    {
      label: "Khách Hàng Mới",
      value: "347",
      delta: "+22.6%",
      positive: true,
      icon: "👥",
      accent: "bg-[#D12052]/20",
    },
    {
      label: "Tỷ Lệ Hoàn Trả",
      value: "2.3%",
      delta: "-0.5%",
      positive: true,
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

          {/* Live indicator */}
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

      {/* ── Quick Actions ── */}
      <div className="mb-8">
        <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-[#555] mb-3">
          Thao Tác Nhanh
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 bg-white border-2 border-[#111111] rounded-2xl p-4 shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl border-2 border-[#111111] ${action.accent}`}>
                {action.icon}
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#111]">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Revenue Chart placeholder ── */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_#111111] mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">Biểu Đồ Doanh Thu</h2>
          <div className="flex gap-2">
            {["7N", "1T", "3T", "1N"].map((t, i) => (
              <button key={t} className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border-2 border-[#111111] transition-all cursor-pointer ${i === 1 ? "bg-[#111111] text-white" : "hover:bg-[#f7f9fa]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        {/* Bar chart visual */}
        <div className="flex items-end gap-2 h-36">
          {[65, 82, 48, 91, 73, 88, 95, 60, 77, 84, 92, 78].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${i === 10 ? "bg-[#F8DE22] border-2 border-[#111111]" : "bg-[#111111]/10 hover:bg-[#111111]/20"}`}
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"].map((m) => (
            <span key={m} className="text-[9px] font-bold text-[#aaa] flex-1 text-center">{m}</span>
          ))}
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111]">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">Đơn Hàng Gần Đây</h2>
          <button className="text-[11px] font-extrabold uppercase tracking-wider text-[#03AED2] hover:underline cursor-pointer">
            Xem Tất Cả →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#111111]/10">
                {["Mã ĐH", "Khách Hàng", "Sản Phẩm", "Số Tiền", "Trạng Thái"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ORDERS.map((order, i) => (
                <tr key={order.id} className={`border-b border-[#111111]/5 hover:bg-[#f7f9fa] transition-colors ${i === MOCK_ORDERS.length - 1 ? "border-none" : ""}`}>
                  <td className="px-5 py-3.5 text-[12px] font-extrabold text-[#111]">{order.id}</td>
                  <td className="px-5 py-3.5 text-[12px] font-semibold text-[#333]">{order.customer}</td>
                  <td className="px-5 py-3.5 text-[12px] text-[#555] max-w-40 truncate">{order.product}</td>
                  <td className="px-5 py-3.5 text-[12px] font-extrabold text-[#111]">{order.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
