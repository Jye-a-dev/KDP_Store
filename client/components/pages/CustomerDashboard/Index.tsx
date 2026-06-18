"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import WelcomeBanner from "./WelcomeBanner";
import CustomerStatsRow from "./CustomerStatsRow";
import PromoBanner from "./PromoBanner";
import RecentOrdersList from "./RecentOrdersList";
import AccountQuickLinks from "./AccountQuickLinks";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { orders, orderStats: stats, isLoading, fetchCustomerOrders } = useOrders();
  const now = new Date();

  useEffect(() => {
    if (user?.id) {
      fetchCustomerOrders(user.id);
    }
  }, [user?.id, fetchCustomerOrders]);

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-8">
      <WelcomeBanner fullName={user?.full_name} email={user?.email} now={now} />
      <CustomerStatsRow stats={stats} />
      <PromoBanner />
      <RecentOrdersList orders={orders} isLoading={isLoading} />
      <AccountQuickLinks />
    </div>
  );
}
