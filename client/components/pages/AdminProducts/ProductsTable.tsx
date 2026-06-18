import { Product, Category } from "@/types/api";
import { formatVNDFull } from "@/components/pages/admin/helpers";
import AdminPagination from "@/components/pages/admin/AdminPagination";

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  search: string;
  publishedFilter: string;
  page: number;
  totalPages: number;
  total: number;
  onSearchChange: (value: string) => void;
  onPublishedFilterChange: (value: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number, name: string) => void;
  onPageChange: (page: number) => void;
}

export default function ProductsTable({
  products,
  categories,
  isLoading,
  search,
  publishedFilter,
  page,
  totalPages,
  total,
  onSearchChange,
  onPublishedFilterChange,
  onEdit,
  onDelete,
  onPageChange,
}: ProductsTableProps) {
  const getCategoryName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name ?? "—";

  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111] gap-4 flex-wrap">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111111]">
          Danh Sách Sản Phẩm
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={publishedFilter}
            onChange={(e) => onPublishedFilterChange(e.target.value)}
            className="border-2 border-[#111111] py-2 px-4 rounded-xl text-[12px] font-semibold outline-none bg-white cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hiển thị</option>
            <option value="false">Đang ẩn</option>
          </select>
          <div className="relative">
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tên hoặc SKU..."
              className="border-2 border-[#111111] py-2 pl-9 pr-4 rounded-xl text-[12px] font-semibold outline-none focus:bg-[#f7f9fa] w-56"
            />
            <svg className="absolute left-3 top-2.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <span className="text-4xl">📦</span>
          <p className="text-[13px] font-bold text-[#555]">Không có sản phẩm nào</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#111111]/10">
                  {["Sản Phẩm", "SKU", "Danh Mục", "Giá", "Tồn Kho", "Trạng Thái", "Hành Động"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`border-b border-[#111111]/5 hover:bg-[#f7f9fa] transition-colors ${
                      i === products.length - 1 ? "border-none" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <p className="text-[12px] font-extrabold text-[#111111] max-w-40 truncate">{product.name}</p>
                    </td>
                    <td className="px-4 py-3.5 text-[11px] font-semibold text-[#555]">{product.sku}</td>
                    <td className="px-4 py-3.5 text-[11px] text-[#555]">{getCategoryName(product.category_id)}</td>
                    <td className="px-4 py-3.5 text-[12px] font-extrabold text-[#111111]">
                      {formatVNDFull(Number(product.price))}
                    </td>
                    <td className="px-4 py-3.5 text-[12px] font-semibold text-[#333]">{product.stock}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          product.is_published
                            ? "text-green-600 bg-green-50"
                            : "text-[#555] bg-[#f7f9fa]"
                        }`}
                      >
                        {product.is_published ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="px-2.5 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1px_1px_0px_#111111]"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(product.id, product.name)}
                          className="px-2.5 py-1 bg-[#D12052] text-white border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1px_1px_0px_#111111]"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
        </>
      )}
    </div>
  );
}
