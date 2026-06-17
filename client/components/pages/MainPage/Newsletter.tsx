"use client";

export default function Newsletter() {
  return (
    <section className="w-full bg-[#F8DE22] py-20 px-5 text-center text-[#111111] border-y-3 border-[#111111]">
      <div className="max-w-137.5 mx-auto flex flex-col items-center">
        <h3 className="text-[22px] md:text-[26px] font-extrabold uppercase tracking-wide mb-2.5">
          Gia Nhập Cộng Đồng Z-CLUB
        </h3>
        <p className="text-[13px] md:text-[14px] mb-6 font-semibold leading-relaxed">
          Nhận ngay thông báo về các đợt Sneaker Drop, nội thất 3D giới hạn và ưu đãi dành riêng cho thành viên.
        </p>
        <div className="flex w-full max-w-md bg-white border-2 border-[#111111] p-1.5 shadow-[4px_4px_0px_#111111]">
          <input 
            type="email" 
            placeholder="Nhập email của bạn..."
            className="flex-1 border-none py-3 px-3 text-[13px] md:text-[14px] font-semibold outline-none text-[#111111]"
          />
          <button 
            type="submit"
            className="bg-[#F45B26] text-white border-none uppercase font-bold px-6 text-[12px] cursor-pointer hover:bg-[#111111] transition-all duration-300"
          >
            Đăng Ký
          </button>
        </div>
      </div>
    </section>
  );
}
