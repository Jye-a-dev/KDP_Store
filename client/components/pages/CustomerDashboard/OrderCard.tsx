import { Order } from "@/types/api";
import { STATUS_LABEL, formatDate, formatVND } from "./helpers";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const s = STATUS_LABEL[order.order_status] ?? { label: order.order_status, color: "text-[#555] bg-[#f7f9fa] border-[#ddd]" };
  const firstItem = order.items?.[0];

  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[3px_3px_0px_#111111] p-4 flex items-center gap-4 hover:shadow-[5px_5px_0px_#111111] hover:-translate-y-0.5 transition-all duration-200">
      <div className="w-14 h-14 rounded-xl border-2 border-[#111111] overflow-hidden shrink-0 bg-[#f7f9fa] flex items-center justify-center text-2xl">
        🛍️
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-extrabold uppercase text-[#aaa] mb-0.5">
          #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at)}
        </p>
        <p className="text-sm font-bold text-[#111] truncate">
          {firstItem ? `${firstItem.name}${order.items.length > 1 ? ` +${order.items.length - 1} sản phẩm` : ""}` : "—"}
        </p>
        <p className="text-sm font-extrabold text-[#111] mt-0.5">{formatVND(Number(order.final_amount))}</p>
      </div>
      <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.color}`}>
        {s.label}
      </span>
    </div>
  );
}
