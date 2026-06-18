interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({ page, totalPages, total, onPageChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-[#111111]/10">
      <p className="text-[11px] font-semibold text-[#555]">
        {total} kết quả · Trang {page}/{totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[11px] font-extrabold uppercase disabled:opacity-40 hover:bg-[#f7f9fa] cursor-pointer disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[11px] font-extrabold uppercase disabled:opacity-40 hover:bg-[#f7f9fa] cursor-pointer disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
