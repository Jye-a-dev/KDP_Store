import { UserStats } from "@/types/api";

interface CustomersHeaderProps {
  stats: UserStats | null;
}

export default function CustomersHeader({ stats }: CustomersHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#03AED2] mb-1">
        Admin Panel
      </p>
      <h1 className="text-3xl font-extrabold uppercase text-[#111111] leading-tight">
        Quản Lý <mark className="bg-[#F8DE22] px-2 py-0.5">Khách Hàng</mark>
      </h1>
      <p className="mt-1 text-sm text-[#555]">
        {stats
          ? `${stats.customers} khách hàng · ${stats.active} active · ${stats.inactive} inactive`
          : "Đang tải..."}
      </p>
    </div>
  );
}
