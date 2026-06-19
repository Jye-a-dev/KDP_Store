"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng người dùng về trang chủ ngay lập tức
    router.replace("/");
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
    </div>
  );
}
