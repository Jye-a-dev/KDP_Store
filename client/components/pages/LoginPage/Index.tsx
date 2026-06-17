"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
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
      // Redirect based on role — user state is updated by login()
      // We re-read from localStorage since state hasn't re-rendered yet
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
    <div className="w-full max-w-sm flex flex-col items-center">
      {/* Neo-brutalist Card Wrapper */}
      <div className="w-full bg-white border-2 border-[#111111] p-8 rounded-3xl shadow-[6px_6px_0px_#111111] text-left">
        <h3 className="text-[24px] font-extrabold uppercase relative inline-block mb-6">
          Đăng Nhập
          <span className="absolute -z-10 bottom-0.5 -left-0.75 -right-0.75 h-2 bg-[#F8DE22]" />
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold uppercase rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email input */}
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

          {/* Password input */}
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

          {/* Submit Button */}
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

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[#111111]/10"></div>
          <span className="px-3 text-[10px] font-extrabold uppercase text-[#aaa] tracking-wider">Hoặc</span>
          <div className="flex-1 border-t border-[#111111]/10"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <button className="w-full bg-white border-2 border-[#111111] py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:bg-[#f7f9fa] shadow-[2px_2px_0px_#111111] active:translate-y-0.5 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://docs.material-tailwind.com/icons/google.svg" alt="Google" className="h-4 w-4" />
            <span>Tiếp tục với Google</span>
          </button>
        </div>
      </div>

      {/* Switch links */}
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-[#555555]">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-[#D12052] underline hover:text-[#F45B26]">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
