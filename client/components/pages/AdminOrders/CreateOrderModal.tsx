"use client";

import { useEffect, useState } from "react";
import { Product, User } from "@/types/api";
import OrderItemRow from "./OrderItemRow";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  onSuccess: () => void;
}

export default function CreateOrderModal({
  isOpen,
  onClose,
  token,
  onSuccess,
}: CreateOrderModalProps) {
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

  // Load options for creation when modal opens
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

    if (token && isOpen) {
      fetchOptions();
    }
  }, [token, isOpen]);

  // Reset state when opening modal
  useEffect(() => {
    if (isOpen) {
      setCreateUserId("");
      setCreateShippingName("");
      setCreateShippingPhone("");
      setCreateShippingAddress("");
      setCreatePaymentMethod("COD");
      setCreatePaymentStatus("pending");
      setCreateShippingFee(30000);
      setCreateItems([{ product_id: 0, quantity: 1, color: "#D12052" }]);
      setCreateError(null);
    }
  }, [isOpen]);

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

  const calculateCreateTotal = () => {
    const itemsTotal = createItems.reduce((acc, item) => {
      const prod = allProducts.find((p) => p.id === Number(item.product_id));
      if (!prod) return acc;
      return acc + Math.round(Number(prod.price)) * item.quantity;
    }, 0);
    return itemsTotal + Number(createShippingFee);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

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

      onSuccess();
      onClose();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Đã có lỗi xảy ra"
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-4 border-[#111111] rounded-3xl w-full max-w-2xl shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#111111] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#111111]">
          <h3 className="font-extrabold uppercase tracking-wider text-sm">
            Tạo Đơn Hàng Mới
          </h3>
          <button
            type="button"
            onClick={onClose}
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
              {createItems.map((item, idx) => (
                <OrderItemRow
                  key={idx}
                  idx={idx}
                  item={item}
                  allProducts={allProducts}
                  onChange={handleCreateItemChange}
                  onRemove={handleRemoveCreateItem}
                />
              ))}
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
                onClick={onClose}
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
  );
}
