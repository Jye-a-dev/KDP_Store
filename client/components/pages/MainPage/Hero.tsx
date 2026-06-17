"use client";

export default function Hero() {
  return (
    <section 
      className="h-[55vh] md:h-[75vh] w-full bg-cover bg-center flex items-center px-[5%] md:px-[8%] relative"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1920&q=80')`
      }}
    >
      <div className="text-white max-w-150 text-left z-10">
        <span className="text-[11px] uppercase tracking-[2px] bg-[#03AED2] text-white px-2.5 py-1 font-bold inline-block mb-4">
          Drop 01 // Xu Hướng Đột Phá
        </span>
        <h1 className="text-[34px] sm:text-[44px] md:text-[60px] font-extrabold leading-[1.1] uppercase mb-4 tracking-tight">
          Bứt phá<br />
          <mark className="bg-[#F8DE22] text-[#111111] px-2.5 py-0.5 inline-block">Màu Sắc</mark>
        </h1>
        <p className="mb-6 font-semibold text-[13px] md:text-[15px] text-white/90 leading-relaxed max-w-lg">
          Đập tan sự đơn điệu với những thiết kế Oversize và nội thất tương tác 3D mang tuyên ngôn cá tính mạnh mẽ.
        </p>
        <a 
          href="#products-section" 
          className="inline-block bg-[#F45B26] text-white px-8.75 md:px-11.25 py-3.5 md:py-4 uppercase text-[12px] md:text-[13px] font-bold tracking-[1px] shadow-[0_4px_15px_rgba(244,91,38,0.4)] transition-all duration-300 hover:bg-[#D12052] hover:shadow-[0_4px_15px_rgba(209,32,82,0.4)] hover:-translate-y-0.5 cursor-pointer"
        >
          Mua Ngay Cực Cháy
        </a>
      </div>
    </section>
  );
}
