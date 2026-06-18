export const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:    { label: "Chờ xác nhận", color: "text-[#F8DE22] bg-[#F8DE22]/20" },
  processing: { label: "Đang giao",    color: "text-[#03AED2] bg-[#03AED2]/10" },
  delivered:  { label: "Hoàn thành",   color: "text-green-600 bg-green-50" },
  cancelled:  { label: "Đã huỷ",       color: "text-[#D12052] bg-[#D12052]/10" },
};

export function formatVND(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M₫`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K₫`;
  return `${n}₫`;
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN");
}

export function getGreeting(hour: number) {
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}
