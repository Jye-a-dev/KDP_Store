"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { CartProvider } from "@/contexts/CartContext";
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <PageContentProvider>
          <DashboardSetup>{children}</DashboardSetup>
        </PageContentProvider>
      </CartProvider>
    </AuthProvider>
  );
}

