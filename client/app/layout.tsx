import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "KDP Store - Thời Trang Phong Cách",
  description: "Khám phá bộ sưu tập thời trang streetwear độc đáo tại KDP Store.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
