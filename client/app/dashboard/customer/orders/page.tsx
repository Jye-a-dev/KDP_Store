"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import RecentOrdersList from "@/components/pages/CustomerDashboard/RecentOrdersList";

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, isLoading, fetchCustomerOrders } = useOrders();

  useEffect(() => {
    if (user?.id) {
      fetchCustomerOrders(user.id);
    }
  }, [user?.id, fetchCustomerOrders]);

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8 px-4 pt-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/customer")}
        className="mb-6 inline-flex items-center gap-2 border-2 border-[#111111] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Quay lại Dashboard
      </button>

      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[6px_6px_0px_#111111] p-6 mb-8">
        <h1 className="text-xl font-extrabold uppercase tracking-wider text-[#111111] mb-6">
          Lịch sử đơn hàng của bạn
        </h1>
        <RecentOrdersList orders={orders} isLoading={isLoading} />
      </div>
    </div>
  );
}
