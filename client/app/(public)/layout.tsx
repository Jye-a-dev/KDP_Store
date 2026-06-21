import type { ReactNode } from "react";

import PublicSetup from "@/components/layouts/(public)/PublicSetup";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageContentProvider } from "@/contexts/PageContentContext";
import { CartProvider } from "@/contexts/CartContext";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <AuthProvider>
        <CartProvider>
          <PageContentProvider>
            <PublicSetup>{children}</PublicSetup>
          </PageContentProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}


