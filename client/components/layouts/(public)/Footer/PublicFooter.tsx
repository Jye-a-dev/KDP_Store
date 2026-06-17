import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="bg-[#111111] text-white px-[5%] py-17.5 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12.5">
        {/* Col 1 */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[14px] uppercase text-[#03AED2] mb-5 tracking-wide">
            Dịch vụ
          </h4>
          <ul className="list-none flex flex-col gap-3">
            <li>
              <Link href="#" className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300">
                Đổi Trả Dễ Dàng
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300">
                Bảo Hành Sản Phẩm
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300">
                Membership Perks
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 2 */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[14px] uppercase text-[#03AED2] mb-5 tracking-wide">
            Khám phá
          </h4>
          <ul className="list-none flex flex-col gap-3">
            <li>
              <Link href="#" className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300">
                Về KDP Store
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300">
                Lookbook 2026
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300">
                Chính Sách Xanh
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[14px] uppercase text-[#03AED2] mb-5 tracking-wide">
            Hotline hỗ trợ
          </h4>
          <p className="text-[#aaa] text-[13px] leading-[1.8]">
            1900 xxxx (9:00 - 22:00)
            <br />
            Sẵn sàng giải đáp mọi thắc mắc của bạn.
          </p>
        </div>

        {/* Col 4 */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[14px] uppercase text-[#03AED2] mb-5 tracking-wide">
            Social
          </h4>
          <p className="text-[#aaa] text-[13px] leading-[1.8]">
            @zstudio.official
            <br />
            Tiktok / Instagram / Facebook
          </p>
        </div>
      </div>
    </footer>
  );
}
