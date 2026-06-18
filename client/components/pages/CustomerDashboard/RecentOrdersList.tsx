import { Order } from "@/types/api";
import OrderCard from "./OrderCard";

interface RecentOrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export default function RecentOrdersList({ orders, isLoading }: RecentOrdersListProps) {
  return (
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
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
