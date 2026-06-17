"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import StatBadge from "./StatBadge";
import EditableText from "@/components/layouts/(public)/EditableText";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "Chờ xác nhận", color: "text-[#F8DE22] bg-[#F8DE22]/20 border-[#F8DE22]/30" },
  processing: { label: "Đang giao",    color: "text-[#03AED2] bg-[#03AED2]/10 border-[#03AED2]/30" },
  delivered:  { label: "Hoàn thành",   color: "text-green-600 bg-green-50 border-green-200" },
  cancelled:  { label: "Đã huỷ",       color: "text-[#D12052] bg-[#D12052]/10 border-[#D12052]/30" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN");
}

// Format currency
function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const { user } = useAuth();
  const { orders, orderStats: stats, isLoading, fetchCustomerOrders } = useOrders();

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  useEffect(() => {
    if (user?.id) {
      fetchCustomerOrders(user.id);
    }
  }, [user?.id, fetchCustomerOrders]);

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      {/* ── Welcome Banner ── */}
      <div className="relative bg-[#111111] rounded-3xl border-2 border-[#111111] shadow-[6px_6px_0px_#F8DE22] p-6 md:p-8 mb-8 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#F8DE22]/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-64 h-20 bg-[#D12052]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-5">
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
        <div className="relative z-10 mt-4 inline-flex items-center gap-2 bg-[#F8DE22] text-[#111111] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
          <span>⭐</span> <EditableText contentKey="customer_promo_badge" />
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatBadge label="Tổng đơn hàng" value={String(stats?.total ?? "—")} accent="bg-[#03AED2]" />
        <StatBadge label="Hoàn thành"    value={String(stats?.delivered ?? "—")} accent="bg-green-400" />
        <StatBadge label="Đang giao"     value={String((stats?.pending ?? 0) + (stats?.processing ?? 0))} accent="bg-[#F8DE22]" />
      </div>

      {/* ── Promo banner ── */}
      <div className="bg-[#D12052] border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] p-4 mb-8 flex items-center justify-between gap-4">
        <div>
          <EditableText
            contentKey="customer_promo_title"
            element="p"
            className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-0.5 block"
          />
          <div className="text-white font-extrabold uppercase text-sm flex items-center gap-1.5">
            Nhập{" "}
            <mark className="bg-[#F8DE22] text-[#111111] px-1 inline-block">
              <EditableText contentKey="customer_promo_code" />
            </mark>{" "}
            <EditableText contentKey="customer_promo_desc" />
          </div>
        </div>
        <button type="button" className="shrink-0 bg-white text-[#D12052] text-[11px] font-extrabold uppercase tracking-wider px-4 py-2 rounded-full border-2 border-white shadow-[2px_2px_0px_#111111] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer">
          <EditableText contentKey="customer_promo_btn" />
        </button>
      </div>

      {/* ── Recent Orders ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">
            Đơn Hàng Gần Đây
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border-2 border-[#111111] rounded-2xl p-8 text-center shadow-[3px_3px_0px_#111111]">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-[13px] font-bold text-[#555]">Bạn chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const s = STATUS_LABEL[order.order_status] ?? { label: order.order_status, color: "text-[#555] bg-[#f7f9fa] border-[#ddd]" };
              const firstItem = order.items?.[0];
              return (
                <div
                  key={order.id}
                  className="bg-white border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] p-4 flex items-center gap-4 hover:shadow-[5px_5px_0px_#111111] hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl border-2 border-[#111111] overflow-hidden shrink-0 bg-[#f7f9fa] flex items-center justify-center text-2xl">
                    🛍️
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-extrabold uppercase text-[#aaa] mb-0.5">
                      #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at)}
                    </p>
                    <p className="text-sm font-bold text-[#111] truncate">
                      {firstItem ? `${firstItem.name}${order.items.length > 1 ? ` +${order.items.length - 1} sản phẩm` : ""}` : "—"}
                    </p>
                    <p className="text-sm font-extrabold text-[#111] mt-0.5">{formatVND(Number(order.final_amount))}</p>
                  </div>
                  {/* Status */}
                  <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.color}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Account quick links ── */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        <div className="px-5 py-4 border-b-2 border-[#111111]">
          <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">Tài Khoản</h2>
        </div>
        {[
          { icon: "👤", label: "Thông tin cá nhân", desc: "Cập nhật tên, email, số điện thoại" },
          { icon: "📍", label: "Địa chỉ giao hàng", desc: "Quản lý địa chỉ nhận hàng" },
          { icon: "🔑", label: "Đổi mật khẩu",     desc: "Bảo mật tài khoản của bạn" },
          { icon: "🔔", label: "Thông báo",         desc: "Cài đặt nhận thông báo" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
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
