"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthCard from "@/components/pages/auth/AuthCard";
import AuthErrorAlert from "@/components/pages/auth/AuthErrorAlert";
import AuthFooterLink from "@/components/pages/auth/AuthFooterLink";
import SocialLoginSection from "@/components/pages/auth/SocialLoginSection";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin đăng nhập.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      const stored = localStorage.getItem("kdp_user");
      const u = stored ? JSON.parse(stored) : null;
      if (u?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <AuthErrorAlert message={error} />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
            Địa chỉ Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="ten@viethuong.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Mật khẩu
            </label>
            <Link href="#" className="text-[10px] font-extrabold uppercase text-[#555555] hover:text-[#D12052]">
              Quên mật khẩu?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
          />
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#111111] text-white py-3.5 rounded-xl uppercase font-bold text-xs tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_#D12052] hover:bg-[#F8DE22] hover:text-[#111111] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Đăng Nhập Vào Hệ Thống"
          )}
        </button>
      </form>

      <SocialLoginSection />
    </>
  );
}
