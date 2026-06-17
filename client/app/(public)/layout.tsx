import type { Metadata } from "next";
import type { ReactNode } from "react";

import PublicSetup from "@/components/layouts/(public)/PublicSetup";
import { AuthProvider } from "@/contexts/AuthContext";

import "../globals.css";

export const metadata: Metadata = {
  title: "KDP Store - Thời Trang Phong Cách",
  description: "Khám phá bộ sưu tập thời trang streetwear độc đáo tại KDP Store.",
};

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-white text-[#111111] antialiased">
        <AuthProvider>
          <PublicSetup>{children}</PublicSetup>
        </AuthProvider>
      </body>
    </html>
  );
}

