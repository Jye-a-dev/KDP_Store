"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StaticPage } from "@/types/api";

export default function PublicFooter() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`${API_URL}/static-pages`);
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (err) {
        console.error("Failed to fetch footer pages:", err);
      }
    };
    fetchPages();
  }, [API_URL]);

  // Fallback defaults matching backend seed if API not loaded or empty
  const displayPages = pages.length > 0 ? pages : [
    { id: 1, slug: "doi-tra-de-dang", title: "Đổi Trả Dễ Dàng", group_type: "service", content: "" },
    { id: 2, slug: "bao-hanh-san-pham", title: "Bảo Hành Sản Phẩm", group_type: "service", content: "" },
    { id: 3, slug: "membership-perks", title: "Membership Perks", group_type: "service", content: "" },
    { id: 4, slug: "ve-kdp-store", title: "Về KDP Store", group_type: "explore", content: "" },
    { id: 5, slug: "lookbook-2026", title: "Lookbook 2026", group_type: "explore", content: "" },
    { id: 6, slug: "chinh-sach-xanh", title: "Chính Sách Xanh", group_type: "explore", content: "" }
  ];

  const servicePages = displayPages.filter(p => p.group_type === "service");
  const explorePages = displayPages.filter(p => p.group_type === "explore");

  return (
    <footer className="bg-[#111111] text-white px-[5%] py-17.5 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12.5">
        {/* Col 1: Dịch vụ */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[14px] uppercase text-[#03AED2] mb-5 tracking-wide">
            Dịch vụ
          </h4>
          <ul className="list-none flex flex-col gap-3">
            {servicePages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/explore-services/${page.slug}`}
                  className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2: Khám phá */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[14px] uppercase text-[#03AED2] mb-5 tracking-wide">
            Khám phá
          </h4>
          <ul className="list-none flex flex-col gap-3">
            {explorePages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/explore-services/${page.slug}`}
                  className="text-[#ccc] text-[13px] hover:text-[#F8DE22] hover:pl-1.25 transition-all duration-300"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Hotline */}
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

        {/* Col 4: Social */}
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
