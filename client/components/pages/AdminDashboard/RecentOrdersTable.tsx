import { Order } from "@/types/api";
import { STATUS_LABEL, formatVND, formatDate } from "./helpers";

interface RecentOrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

export default function RecentOrdersTable({ orders, isLoading }: RecentOrdersTableProps) {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111]">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">Đơn Hàng Gần Đây</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#111] border-t-[#F8DE22] rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <span className="text-4xl">📭</span>
          <p className="text-[13px] font-bold text-[#555]">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#111111]/10">
                {["Mã ĐH", "Khách Hàng", "Sản Phẩm", "Số Tiền", "Ngày", "Trạng Thái"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const s = STATUS_LABEL[order.order_status] ?? { label: order.order_status, color: "text-[#555] bg-[#f7f9fa]" };
                const firstItem = order.items?.[0];
                return (
                  <tr
                    key={order.id}
                    className={`border-b border-[#111111]/5 hover:bg-[#f7f9fa] transition-colors ${
                      i === orders.length - 1 ? "border-none" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 text-[12px] font-extrabold text-[#111]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] font-semibold text-[#333]">
                      {order.shipping_name}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-[#555] max-w-40 truncate">
                      {firstItem ? `${firstItem.name}${order.items.length > 1 ? ` +${order.items.length - 1}` : ""}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] font-extrabold text-[#111]">
                      {formatVND(Number(order.final_amount))}
                    </td>
                    <td className="px-5 py-3.5 text-[11px] text-[#aaa]">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.color}`}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
