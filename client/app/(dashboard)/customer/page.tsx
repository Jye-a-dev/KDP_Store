"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: "#KDP-0091",
    date: "15/06/2026",
    product: "Áo Oversized Drop Shoulder",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=80&q=80",
    amount: "689.000₫",
    status: "Đang giao",
    statusColor: "text-[#03AED2] bg-[#03AED2]/10 border-[#03AED2]/30",
  },
  {
    id: "#KDP-0088",
    date: "10/06/2026",
    product: "Hoodie Gradient Wash",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=80&q=80",
    amount: "780.000₫",
    status: "Hoàn thành",
    statusColor: "text-green-600 bg-green-50 border-green-200",
  },
  {
    id: "#KDP-0082",
    date: "03/06/2026",
    product: "Quần Cargo Wide Leg",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b1ef4?w=80&q=80",
    amount: "520.000₫",
    status: "Hoàn thành",
    statusColor: "text-green-600 bg-green-50 border-green-200",
  },
];

const MOCK_WISHLIST = [
  {
    id: 1,
    name: "Áo Khoác Y2K Neon",
    price: "950.000₫",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&q=80",
    tag: "HOT",
    tagColor: "bg-[#D12052] text-white",
  },
  {
    id: 2,
    name: "Sneaker Platform Chunky",
    price: "1.200.000₫",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80",
    tag: "MỚI",
    tagColor: "bg-[#03AED2] text-white",
  },
  {
    id: 3,
    name: "Balo Canvas Streetwear",
    price: "450.000₫",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&q=80",
    tag: "SALE",
    tagColor: "bg-[#F8DE22] text-[#111111]",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────
function StatBadge({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl p-4 shadow-[3px_3px_0px_#111111] flex flex-col gap-1">
      <p className="text-2xl font-extrabold text-[#111111]">{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#555]">{label}</p>
      <div className={`h-1 w-8 rounded-full ${accent}`} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      {/* ── Welcome Banner ── */}
      <div className="relative bg-[#111111] rounded-3xl border-2 border-[#111111] shadow-[6px_6px_0px_#F8DE22] p-6 md:p-8 mb-8 overflow-hidden">
        {/* BG decoration */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#F8DE22]/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-20 bg-[#D12052]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-[#F8DE22] border-2 border-[#F8DE22] flex items-center justify-center text-2xl font-extrabold text-[#111111] shrink-0">
            {user?.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#F8DE22]/70 mb-1">
              {greeting} ✨
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase leading-tight">
              {user?.full_name}
            </h1>
            <p className="text-xs text-white/50 font-semibold mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Member tag */}
        <div className="relative z-10 mt-4 inline-flex items-center gap-2 bg-[#F8DE22] text-[#111111] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
          <span>⭐</span> Z-CLUB Member
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatBadge label="Đơn hàng" value="3" accent="bg-[#03AED2]" />
        <StatBadge label="Yêu thích" value="3" accent="bg-[#D12052]" />
        <StatBadge label="Điểm thưởng" value="840" accent="bg-[#F8DE22]" />
      </div>

      {/* ── Promo banner ── */}
      <div className="bg-[#D12052] border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] p-4 mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-0.5">Ưu đãi dành riêng cho bạn</p>
          <p className="text-white font-extrabold uppercase text-sm">Nhập <mark className="bg-[#F8DE22] text-[#111111] px-1">ZCLUB15</mark> giảm thêm 15%</p>
        </div>
        <button className="shrink-0 bg-white text-[#D12052] text-[11px] font-extrabold uppercase tracking-wider px-4 py-2 rounded-full border-2 border-white shadow-[2px_2px_0px_#111111] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer">
          Mua Ngay
        </button>
      </div>

      {/* ── Recent Orders ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">
            Đơn Hàng Gần Đây
          </h2>
          <button className="text-[11px] font-extrabold uppercase tracking-wider text-[#03AED2] hover:underline cursor-pointer">
            Tất Cả →
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.id}
              className="bg-white border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] p-4 flex items-center gap-4 hover:shadow-[5px_5px_0px_#111111] hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Product image */}
              <div className="w-14 h-14 rounded-xl border-2 border-[#111111] overflow-hidden shrink-0 bg-[#f7f9fa]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold uppercase text-[#aaa] mb-0.5">{order.id} · {order.date}</p>
                <p className="text-sm font-bold text-[#111] truncate">{order.product}</p>
                <p className="text-sm font-extrabold text-[#111] mt-0.5">{order.amount}</p>
              </div>

              {/* Status */}
              <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${order.statusColor}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wishlist ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">
            Danh Sách Yêu Thích
          </h2>
          <button className="text-[11px] font-extrabold uppercase tracking-wider text-[#D12052] hover:underline cursor-pointer">
            Xem Tất Cả →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_WISHLIST.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] overflow-hidden hover:shadow-[5px_5px_0px_#111111] hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="relative aspect-square bg-[#f7f9fa] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${item.tagColor}`}>
                  {item.tag}
                </span>
                {/* Heart icon */}
                <button className="absolute top-2 right-2 w-7 h-7 bg-white border-2 border-[#111111] rounded-full flex items-center justify-center text-[#D12052] shadow cursor-pointer hover:bg-[#D12052] hover:text-white transition-all">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="p-3">
                <p className="text-[11px] font-extrabold text-[#111] truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[13px] font-extrabold text-[#D12052]">{item.price}</p>
                  <button className="text-[9px] font-extrabold uppercase bg-[#111111] text-white px-2.5 py-1 rounded-full hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer">
                    Mua
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Account quick links ── */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        <div className="px-5 py-4 border-b-2 border-[#111111]">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">Tài Khoản</h2>
        </div>
        {[
          { icon: "👤", label: "Thông tin cá nhân", desc: "Cập nhật tên, email, số điện thoại" },
          { icon: "📍", label: "Địa chỉ giao hàng", desc: "Quản lý địa chỉ nhận hàng" },
          { icon: "🔑", label: "Đổi mật khẩu", desc: "Bảo mật tài khoản của bạn" },
          { icon: "🔔", label: "Thông báo", desc: "Cài đặt nhận thông báo" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 px-5 py-4 border-b border-[#111111]/10 last:border-none hover:bg-[#f7f9fa] transition-colors cursor-pointer text-left"
          >
            <span className="text-xl w-8 text-center shrink-0">{item.icon}</span>
            <div className="flex-1">
              <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#111]">{item.label}</p>
              <p className="text-[11px] text-[#999]">{item.desc}</p>
            </div>
            <svg width="16" height="16" fill="none" stroke="#aaa" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
