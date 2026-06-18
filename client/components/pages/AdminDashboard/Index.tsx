"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedStat from "./AnimatedStat";
import DashboardHeader from "./DashboardHeader";
import RecentOrdersTable from "./RecentOrdersTable";
import { useDashboardStats } from "./useDashboardStats";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { orders, stats, isLoading, fetchAdminDashboardData } = useDashboardStats();
  const now = new Date();

  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8">
      <DashboardHeader userName={user?.full_name} now={now} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <AnimatedStat key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      <RecentOrdersTable orders={orders} isLoading={isLoading} />
    </div>
  );
}
