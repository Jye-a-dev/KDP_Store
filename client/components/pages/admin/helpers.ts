export const ORDER_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "Chờ xác nhận", color: "text-[#F8DE22] bg-[#F8DE22]/20" },
  processing: { label: "Đang xử lý",   color: "text-[#03AED2] bg-[#03AED2]/10" },
  shipped:    { label: "Đã gửi hàng",  color: "text-purple-600 bg-purple-50" },
  delivered:  { label: "Hoàn thành",   color: "text-green-600 bg-green-50" },
  cancelled:  { label: "Đã huỷ",       color: "text-[#D12052] bg-[#D12052]/10" },
};

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export function formatVNDFull(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

export function formatDateTime(d: string) {
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
