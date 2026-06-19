"use client";

import { useCallback, useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Order, Product, User } from "@/types/api";
import OrdersHeader from "./OrdersHeader";
import OrderStatsCards from "./OrderStatsCards";
import OrdersTable from "./OrdersTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

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
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Available options
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Create order states
  const [createUserId, setCreateUserId] = useState("");
  const [createShippingName, setCreateShippingName] = useState("");
  const [createShippingPhone, setCreateShippingPhone] = useState("");
  const [createShippingAddress, setCreateShippingAddress] = useState("");
  const [createPaymentMethod, setCreatePaymentMethod] = useState("COD");
  const [createPaymentStatus, setCreatePaymentStatus] = useState("pending");
  const [createShippingFee, setCreateShippingFee] = useState(30000);
  const [createItems, setCreateItems] = useState<
    { product_id: number; quantity: number; color: string }[]
  >([{ product_id: 0, quantity: 1, color: "#D12052" }]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit order states
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editShippingName, setEditShippingName] = useState("");
  const [editShippingPhone, setEditShippingPhone] = useState("");
  const [editShippingAddress, setEditShippingAddress] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editOrderStatus, setEditOrderStatus] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Load options for creation on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [prodRes, userRes] = await Promise.all([
          fetch(`${API_URL}/products?limit=100`),
          fetch(`${API_URL}/users?limit=100`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        if (prodRes.ok) {
          const resData = await prodRes.json();
          setAllProducts(Array.isArray(resData) ? resData : resData.data ?? []);
        }
        if (userRes.ok) {
          const resData = await userRes.json();
          setAllUsers(Array.isArray(resData) ? resData : resData.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };
    if (token) {
      fetchOptions();
    }
  }, [token]);

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

  // ── CREATE ORDER HANDLERS ──────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setCreateUserId("");
    setCreateShippingName("");
    setCreateShippingPhone("");
    setCreateShippingAddress("");
    setCreatePaymentMethod("COD");
    setCreatePaymentStatus("pending");
    setCreateShippingFee(30000);
    setCreateItems([{ product_id: 0, quantity: 1, color: "#D12052" }]);
    setCreateError(null);
    setIsCreateOpen(true);
  };

  const handleUserSelectChange = (userId: string) => {
    setCreateUserId(userId);
    const selectedUser = allUsers.find((u) => u.id === userId);
    if (selectedUser) {
      setCreateShippingName(selectedUser.full_name || "");
      setCreateShippingPhone(selectedUser.phone || "");
    }
  };

  const handleAddCreateItem = () => {
    setCreateItems([
      ...createItems,
      { product_id: 0, quantity: 1, color: "#D12052" },
    ]);
  };

  const handleRemoveCreateItem = (idx: number) => {
    setCreateItems(createItems.filter((_, i) => i !== idx));
  };

  const handleCreateItemChange = (
    idx: number,
    field: "product_id" | "quantity" | "color",
    value: any
  ) => {
    const updated = [...createItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setCreateItems(updated);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    // Validations
    if (!createShippingName || !createShippingPhone || !createShippingAddress) {
      setCreateError("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    const invalidItems = createItems.some((item) => item.product_id === 0);
    if (invalidItems || createItems.length === 0) {
      setCreateError("Vui lòng chọn sản phẩm hợp lệ.");
      return;
    }

    setIsCreating(true);
    try {
      const body = {
        user_id: createUserId || undefined,
        items: createItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          color: item.color,
        })),
        shipping_fee: Number(createShippingFee),
        shipping_name: createShippingName,
        shipping_phone: createShippingPhone,
        shipping_address: createShippingAddress,
        payment_info: {
          method: createPaymentMethod,
          status: createPaymentStatus,
        },
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Tạo đơn hàng thất bại.");
      }

      setIsCreateOpen(false);
      loadOrders();
      fetchOrderStats();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Đã có lỗi xảy ra"
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Real-time calculation of new order amount
  const calculateCreateTotal = () => {
    const itemsTotal = createItems.reduce((acc, item) => {
      const prod = allProducts.find((p) => p.id === Number(item.product_id));
      if (!prod) return acc;
      return acc + Math.round(Number(prod.price)) * item.quantity;
    }, 0);
    return itemsTotal + Number(createShippingFee);
  };

  // ── EDIT ORDER HANDLERS ──────────────────────────────────────────────────
  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    setEditShippingName(order.shipping_name || "");
    setEditShippingPhone(order.shipping_phone || "");
    setEditShippingAddress(order.shipping_address || "");
    setEditPaymentMethod(order.payment_info?.method || "COD");
    setEditPaymentStatus(order.payment_info?.status || "pending");
    setEditOrderStatus(order.order_status || "pending");
    setEditError(null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setEditError(null);
    setIsUpdating(true);

    try {
      const body = {
        order_status: editOrderStatus,
        shipping_name: editShippingName,
        shipping_phone: editShippingPhone,
        shipping_address: editShippingAddress,
        payment_info: {
          method: editPaymentMethod,
          status: editPaymentStatus,
        },
      };

      await updateOrder(editingOrder.id, body);
      setIsEditOpen(false);
      loadOrders();
      fetchOrderStats();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Cập nhật thất bại"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ── DELETE ORDER HANDLERS ──────────────────────────────────────────────────
  const handleDeleteSubmit = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      await deleteOrder(orderToDelete);
      setOrderToDelete(null);
      loadOrders();
      fetchOrderStats();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xóa đơn hàng thất bại");
    } finally {
      setIsDeleting(false);
    }
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

      {/* ── CREATE ORDER MODAL ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-2xl shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#111111] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#111111]">
              <h3 className="font-extrabold uppercase tracking-wider text-sm">
                Tạo Đơn Hàng Mới
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-white/70 hover:text-white text-lg font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
            >
              {createError && (
                <div className="p-3 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
                  ⚠️ {createError}
                </div>
              )}

              {/* Customer Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-[#111] tracking-wider">
                  Chọn khách hàng có sẵn (Tùy chọn)
                </label>
                <select
                  value={createUserId}
                  onChange={(e) => handleUserSelectChange(e.target.value)}
                  className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                >
                  <option value="">Khách vãng lai (Guest)</option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Tên người nhận
                  </label>
                  <input
                    type="text"
                    required
                    value={createShippingName}
                    onChange={(e) => setCreateShippingName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    required
                    value={createShippingPhone}
                    onChange={(e) => setCreateShippingPhone(e.target.value)}
                    placeholder="09XXXXXXXX"
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                  Địa chỉ nhận hàng
                </label>
                <textarea
                  required
                  rows={2}
                  value={createShippingAddress}
                  onChange={(e) => setCreateShippingAddress(e.target.value)}
                  placeholder="Địa chỉ giao hàng chi tiết..."
                  className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] resize-none"
                />
              </div>

              {/* Items Section */}
              <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
                    Danh sách sản phẩm mua
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddCreateItem}
                    className="bg-[#03AED2] text-white border-2 border-[#111111] px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide shadow-[1.5px_1.5px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer"
                  >
                    + Thêm sản phẩm
                  </button>
                </div>

                <div className="flex flex-col gap-3.5">
                  {createItems.map((item, idx) => {
                    const prod = allProducts.find(
                      (p) => p.id === Number(item.product_id)
                    );
                    const subtotal = prod
                      ? Math.round(Number(prod.price)) * item.quantity
                      : 0;

                    return (
                      <div
                        key={idx}
                        className="flex flex-wrap md:flex-nowrap gap-3 items-center p-3 bg-[#f7f9fa] border border-[#111111]/10 rounded-xl"
                      >
                        <select
                          required
                          value={item.product_id}
                          onChange={(e) =>
                            handleCreateItemChange(
                              idx,
                              "product_id",
                              e.target.value
                            )
                          }
                          className="flex-1 min-w-37.5 border-2 border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold outline-none bg-white cursor-pointer"
                        >
                          <option value={0}>-- Chọn sản phẩm --</option>
                          {allProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({Math.round(Number(p.price)).toLocaleString("vi-VN")}đ)
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={item.color}
                            onChange={(e) =>
                              handleCreateItemChange(
                                idx,
                                "color",
                                e.target.value
                              )
                            }
                            className="w-8 h-8 rounded-lg border border-[#111111]/30 cursor-pointer"
                          />
                          <input
                            type="number"
                            min={1}
                            required
                            value={item.quantity}
                            onChange={(e) =>
                              handleCreateItemChange(
                                idx,
                                "quantity",
                                Math.max(1, Number(e.target.value))
                              )
                            }
                            className="w-16 border-2 border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold outline-none text-center"
                          />
                        </div>

                        <span className="text-xs font-bold text-[#D12052] shrink-0 min-w-17.5 text-right">
                          {subtotal.toLocaleString("vi-VN")}đ
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveCreateItem(idx)}
                          className="bg-[#D12052] text-white border border-[#111111] p-1.5 rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment details and Shipping fee */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#111111]/10 pt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Phí vận chuyển
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={createShippingFee}
                    onChange={(e) => setCreateShippingFee(Number(e.target.value))}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={createPaymentMethod}
                    onChange={(e) => setCreatePaymentMethod(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                  >
                    <option value="COD">COD</option>
                    <option value="MOMO">MoMo</option>
                    <option value="VNPAY">VNPAY</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Trạng thái thanh toán
                  </label>
                  <select
                    value={createPaymentStatus}
                    onChange={(e) => setCreatePaymentStatus(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                  >
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                  </select>
                </div>
              </div>

              {/* Bill Details & Submit */}
              <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-4">
                <div className="flex justify-between text-sm font-extrabold text-[#111111]">
                  <span>TỔNG CỘNG ĐƠN HÀNG:</span>
                  <span className="text-[#D12052] text-lg font-black">
                    {calculateCreateTotal().toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-3 border-2 border-[#111111] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-50 cursor-pointer text-center"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 py-3 bg-[#03AED2] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isCreating ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Lưu Đơn Hàng"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT / VIEW DETAILED MODAL ── */}
      {isEditOpen && editingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-2xl shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#111111] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#111111]">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#F8DE22]/80">
                  Xem & Cập Nhật Đơn Hàng
                </p>
                <h3 className="font-extrabold uppercase tracking-wider text-sm mt-0.5">
                  #{editingOrder.id.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-white/70 hover:text-white text-lg font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-5"
            >
              {editError && (
                <div className="p-3 bg-[#D12052]/10 border-2 border-[#D12052] text-[#D12052] text-xs font-bold rounded-xl">
                  ⚠️ {editError}
                </div>
              )}

              {/* Items List */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111] mb-2.5">
                  Sản Phẩm Đã Đặt
                </h4>
                <div className="flex flex-col gap-2">
                  {editingOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#f7f9fa] border-2 border-[#111111] rounded-lg flex items-center justify-center text-md shrink-0">
                          🛍️
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111111] uppercase line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[9px] text-gray-500 font-semibold">
                            Màu: {item.color || "Mặc định"} · Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-extrabold text-[#111111] shrink-0">
                        {Number(item.price).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient details edit */}
              <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-3.5">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
                  Thông Tin Giao Hàng & Nhận Hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                      Họ tên người nhận
                    </label>
                    <input
                      type="text"
                      required
                      value={editShippingName}
                      onChange={(e) => setEditShippingName(e.target.value)}
                      className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      required
                      value={editShippingPhone}
                      onChange={(e) => setEditShippingPhone(e.target.value)}
                      className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Địa chỉ chi tiết
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={editShippingAddress}
                    onChange={(e) => setEditShippingAddress(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-[#f7f9fa] resize-none"
                  />
                </div>
              </div>

              {/* Payment & Status edit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#111111]/10 pt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={editPaymentMethod}
                    onChange={(e) => setEditPaymentMethod(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                  >
                    <option value="COD">COD</option>
                    <option value="MOMO">MoMo</option>
                    <option value="VNPAY">VNPAY</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Trạng thái thanh toán
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                  >
                    <option value="pending">Chưa thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-extrabold uppercase text-[#555] tracking-wider">
                    Trạng thái đơn hàng
                  </label>
                  <select
                    value={editOrderStatus}
                    onChange={(e) => setEditOrderStatus(e.target.value)}
                    className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none bg-white cursor-pointer"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang giao</option>
                    <option value="delivered">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Bill Details & Submit */}
              <div className="border-t border-[#111111]/10 pt-4 flex flex-col gap-4">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Tổng tiền hàng:</span>
                  <span>{Number(editingOrder.total_amount).toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Phí vận chuyển:</span>
                  <span>{Number(editingOrder.shipping_fee).toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#111111] border-t border-[#111111] pt-2">
                  <span>TỔNG CỘNG ĐƠN HÀNG:</span>
                  <span className="text-[#D12052] font-black">
                    {Number(editingOrder.final_amount).toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-3 border-2 border-[#111111] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-50 cursor-pointer text-center"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-[#03AED2] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_#111111] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isUpdating ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Lưu Thay Đổi"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-sm shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#D12052] text-white px-6 py-4 border-b-4 border-[#111111] flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h3 className="font-extrabold uppercase tracking-wider text-xs">
                Xác Nhận Xóa Đơn Hàng
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <p className="text-xs text-gray-600 font-bold leading-relaxed">
                Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác và đơn hàng sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 py-2.5 bg-white text-[#111111] font-extrabold text-[10px] uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center"
                >
                  Quay Lại
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-[#D12052] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl border-2 border-[#111111] shadow-[2px_2px_0px_#111111] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0px_#111111] transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Xác Nhận Xóa"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
