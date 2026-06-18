"use client";

import { useCallback, useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import OrdersHeader from "./OrdersHeader";
import OrderStatsCards from "./OrderStatsCards";
import OrdersTable from "./OrdersTable";

export default function AdminOrders() {
  const {
    orders,
    orderStats,
    pagination,
    isLoading,
    fetchOrdersList,
    fetchOrderStats,
    updateOrderStatus,
  } = useOrders();

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(() => {
    fetchOrdersList({
      page,
      limit: 10,
      order_status: statusFilter || undefined,
    });
  }, [fetchOrdersList, page, statusFilter]);

  useEffect(() => {
    fetchOrderStats();
  }, [fetchOrderStats]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      loadOrders();
      fetchOrderStats();
    } catch {
      loadOrders();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8">
      <OrdersHeader stats={orderStats} />
      <OrderStatsCards stats={orderStats} />
      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        statusFilter={statusFilter}
        page={pagination.page}
        totalPages={pagination.total_pages}
        total={pagination.total}
        onStatusFilterChange={handleStatusFilterChange}
        onStatusUpdate={handleStatusUpdate}
        onPageChange={setPage}
      />
    </div>
  );
}
