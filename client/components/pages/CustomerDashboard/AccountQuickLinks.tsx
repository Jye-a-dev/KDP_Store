const ACCOUNT_LINKS = [
  { icon: "👤", label: "Thông tin cá nhân", desc: "Cập nhật tên, email, số điện thoại" },
  { icon: "📍", label: "Địa chỉ giao hàng", desc: "Quản lý địa chỉ nhận hàng" },
  { icon: "🔑", label: "Đổi mật khẩu",     desc: "Bảo mật tài khoản của bạn" },
  { icon: "🔔", label: "Thông báo",         desc: "Cài đặt nhận thông báo" },
];

export default function AccountQuickLinks() {
  return (
    <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
      <div className="px-5 py-4 border-b-2 border-[#111111]">
        <h2 className="text-[13px] font-extrabold uppercase tracking-wider text-[#111]">Tài Khoản</h2>
      </div>
      {ACCOUNT_LINKS.map((item) => (
        <button
          key={item.label}
          type="button"
          className="w-full flex items-center gap-4 px-5 py-4 border-b border-[#111111]/10 last:border-none hover:bg-[#f7f9fa] transition-colors cursor-pointer text-left"
        >
          <span className="text-xl w-8 text-center shrink-0">{item.icon}</span>
          <div className="flex-1">
            <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#111]">{item.label}</p>
            <p className="text-[11px] text-[#999]">{item.desc}</p>
          </div>
          <svg width="16" height="16" fill="none" stroke="#aaa" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      ))}
    </div>
  );
}
