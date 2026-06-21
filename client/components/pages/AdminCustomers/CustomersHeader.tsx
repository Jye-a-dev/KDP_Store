import { UserStats } from "@/types/api";

interface CustomersHeaderProps {
  stats: UserStats | null;
  onAddClick: () => void;
}

export default function CustomersHeader({ stats, onAddClick }: CustomersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
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
      <button
        type="button"
        onClick={onAddClick}
        className="px-5 py-2.5 bg-[#111111] text-white border-2 border-[#111111] rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_#03AED2] hover:bg-[#F8DE22] hover:text-[#111111] transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_#111111] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_#111111] shrink-0"
      >
        + Thêm Khách Hàng
      </button>
    </div>
  );
}
