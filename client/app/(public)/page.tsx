import { Suspense } from "react";
import MainPage from "@/components/pages/MainPage/Index";

export default function PublicPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#D12052]" />
      </div>
    }>
      <MainPage />
    </Suspense>
  );
}
