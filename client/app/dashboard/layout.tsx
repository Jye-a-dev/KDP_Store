"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageContentProvider } from "@/contexts/PageContentContext";
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import "../globals.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <AuthProvider>
          <PageContentProvider>
            <DashboardSetup>{children}</DashboardSetup>
          </PageContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
