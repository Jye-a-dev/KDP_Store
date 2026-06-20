"use client";

import { useCallback, useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types/api";
import OrdersHeader from "./OrdersHeader";
import OrderStatsCards from "./OrderStatsCards";
import OrdersTable from "./OrdersTable";
import CreateOrderModal from "./CreateOrderModal";
import EditOrderModal from "./EditOrderModal";
import DeleteOrderModal from "./DeleteOrderModal";

export default function AdminOrders() {
  const { token } = useAuth();
  const {
    orders,
    orderStats,
    pagination,
    isLoading,
    fetchOrdersList,
    fetchOrderStats,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
  } = useOrders();

  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  // Modal visibility states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Load orders list
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

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    setIsEditOpen(true);
  };

  const handleRefreshData = () => {
    loadOrders();
    fetchOrderStats();
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-8 px-4 pt-4">
      <OrdersHeader stats={orderStats} onCreateClick={handleOpenCreate} />
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
        onEditClick={handleOpenEdit}
        onDeleteClick={setOrderToDelete}
      />

      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        token={token}
        onSuccess={handleRefreshData}
      />

      <EditOrderModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingOrder(null);
        }}
        order={editingOrder}
        updateOrder={updateOrder}
        onSuccess={handleRefreshData}
      />

      <DeleteOrderModal
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        orderId={orderToDelete}
        deleteOrder={deleteOrder}
        onSuccess={handleRefreshData}
      />
    </div>
  );
}
