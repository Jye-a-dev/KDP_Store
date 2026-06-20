import { User } from "@/types/api";
import { formatDateTime } from "@/components/pages/admin/helpers";
import AdminPagination from "@/components/pages/admin/AdminPagination";

interface CustomersTableProps {
  users: User[];
  isLoading: boolean;
  search: string;
  activeFilter: string;
  page: number;
  totalPages: number;
  total: number;
  onSearchChange: (value: string) => void;
  onActiveFilterChange: (value: string) => void;
  onViewDetails: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string, name: string) => void;
  onPageChange: (page: number) => void;
}

export default function CustomersTable({
  users,
  isLoading,
  search,
  activeFilter,
  page,
  totalPages,
  total,
  onSearchChange,
  onActiveFilterChange,
  onViewDetails,
  onEdit,
  onDelete,
  onPageChange,
}: CustomersTableProps) {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[#111111] gap-4 flex-wrap">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111111]">
          Danh Sách Khách Hàng
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={activeFilter}
            onChange={(e) => onActiveFilterChange(e.target.value)}
            className="border-2 border-[#111111] py-2 px-4 rounded-xl text-[12px] font-semibold outline-none bg-white cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Bị vô hiệu</option>
          </select>
          <div className="relative">
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tên hoặc email..."
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
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <span className="text-4xl">👥</span>
          <p className="text-[13px] font-bold text-[#555]">Không có khách hàng nào</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#111111]/10">
                  {["Khách Hàng", "Email", "Điện Thoại", "Ngày Tham Gia", "Trạng Thái", "Hành Động"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#aaa]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`border-b border-[#111111]/5 hover:bg-[#f7f9fa] transition-colors ${
                      i === users.length - 1 ? "border-none" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#111111] overflow-hidden flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#111111]">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-extrabold text-[#111111]">
                              {user.full_name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] font-extrabold text-[#111111]">{user.full_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-[#555]">{user.email}</td>
                    <td className="px-4 py-3.5 text-[12px] text-[#555]">{user.phone ?? "—"}</td>
                    <td className="px-4 py-3.5 text-[11px] text-[#aaa] whitespace-nowrap">
                      {formatDateTime(user.created_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          user.is_active
                            ? "text-green-600 bg-green-50"
                            : "text-[#D12052] bg-[#D12052]/10"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onViewDetails(user)}
                          className="px-2.5 py-1 bg-[#03AED2] text-white border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1px_1px_0px_#111111] hover:bg-[#0295b3] transition-colors"
                        >
                          Chi Tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(user)}
                          className="px-2.5 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1px_1px_0px_#111111] hover:bg-[#e6c51f] transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(user.id, user.full_name)}
                          className="px-2.5 py-1 bg-[#D12052] text-white border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1px_1px_0px_#111111] hover:bg-[#b0163f] transition-colors"
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
