export default function SocialLoginSection() {
  return (
    <>
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-[#111111]/10"></div>
        <span className="px-3 text-[10px] font-extrabold uppercase text-[#aaa] tracking-wider">Hoặc</span>
        <div className="flex-1 border-t border-[#111111]/10"></div>
      </div>

      <div className="flex flex-col gap-3">
        <button className="w-full bg-white border-2 border-[#111111] py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-[#f7f9fa] shadow-[2px_2px_0px_#111111] active:translate-y-0.5 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://docs.material-tailwind.com/icons/google.svg" alt="Google" className="h-4 w-4" />
          <span>Tiếp tục với Google</span>
        </button>
      </div>
    </>
  );
}
