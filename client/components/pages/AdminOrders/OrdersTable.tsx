import { Order } from "@/types/api";
import { ORDER_STATUS_LABEL, ORDER_STATUSES, formatVNDFull, formatDateTime } from "@/components/pages/admin/helpers";
import AdminPagination from "@/components/pages/admin/AdminPagination";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  statusFilter: string;
  page: number;
  totalPages: number;
  total: number;
  onStatusFilterChange: (status: string) => void;
  onStatusUpdate: (orderId: string, status: string) => void;
  onPageChange: (page: number) => void;
  onEditClick: (order: Order) => void;
  onDeleteClick: (orderId: string) => void;
}

export default function OrdersTable({
  orders,
  isLoading,
  statusFilter,
  page,
  totalPages,
  total,
  onStatusFilterChange,
  onStatusUpdate,
  onPageChange,
  onEditClick,
  onDeleteClick,
}: OrdersTableProps) {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111] gap-4 flex-wrap">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111111]">
          Danh Sách Đơn Hàng
        </h2>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="border-2 border-[#111111] py-2 px-4 rounded-xl text-[12px] font-semibold outline-none focus:bg-[#f7f9fa] bg-white cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]?.label ?? s}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <span className="text-4xl">📭</span>
          <p className="text-[13px] font-bold text-[#555]">Không có đơn hàng nào</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#111111]/10">
                  {["Mã ĐH", "Khách Hàng", "Sản Phẩm", "Tổng Tiền", "Ngày", "Trạng Thái", "Cập Nhật", "Hành Động"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const s = ORDER_STATUS_LABEL[order.order_status] ?? {
                    label: order.order_status,
                    color: "text-[#555] bg-[#f7f9fa]",
                  };
                  const firstItem = order.items?.[0];
                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-[#111111]/5 hover:bg-[#f7f9fa] transition-colors ${
                        i === orders.length - 1 ? "border-none" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 text-[12px] font-extrabold text-[#111111]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[12px] font-semibold text-[#333]">{order.shipping_name}</p>
                        <p className="text-[10px] text-[#aaa]">{order.shipping_phone}</p>
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-[#555] max-w-36 truncate">
                        {firstItem
                          ? `${firstItem.name}${order.items.length > 1 ? ` +${order.items.length - 1}` : ""}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-[12px] font-extrabold text-[#111111]">
                        {formatVNDFull(Number(order.final_amount))}
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-[#aaa] whitespace-nowrap">
                        {formatDateTime(order.created_at)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={order.order_status}
                          onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                          className="border-2 border-[#111111] py-1.5 px-2 rounded-lg text-[11px] font-semibold outline-none bg-white cursor-pointer"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {ORDER_STATUS_LABEL[status]?.label ?? status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => onEditClick(order)}
                          className="bg-[#03AED2] text-white border-2 border-[#111111] p-1.5 rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[1.5px_1.5px_0px_#111111] mr-2"
                          title="Xem / Sửa"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 13.5-13.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDeleteClick(order.id)}
                          className="bg-[#D12052] text-white border-2 border-[#111111] p-1.5 rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[1.5px_1.5px_0px_#111111]"
                          title="Xoá đơn"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
        </>
      )}
    </div>
  );
}

