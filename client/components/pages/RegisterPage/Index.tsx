"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ các thông tin đăng ký.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await register(name, email, password);
      // Redirect based on role — user state is updated by register()
      const stored = localStorage.getItem("kdp_user");
      const u = stored ? JSON.parse(stored) : null;
      if (u?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại."
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
          Đăng Ký
          <span className="absolute -z-10 bottom-0.5 -left-0.75 -right-0.75 h-2 bg-[#F8DE22]" />
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-[#D12052]/10 border border-[#D12052] text-[#D12052] text-xs font-bold uppercase rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Họ và Tên
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Địa chỉ Email
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="ten@viethuong.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Mật khẩu
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Confirm Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
              Xác nhận mật khẩu
            </label>
            <input
              id="register-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-2 border-[#111111] py-3 px-4 rounded-xl text-sm font-semibold outline-none focus:bg-[#f7f9fa]"
            />
          </div>

          {/* Submit Button */}
          <button
            id="register-submit"
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111111] text-white py-3.5 rounded-xl uppercase font-bold text-xs tracking-wider border-2 border-[#111111] shadow-[3px_3px_0px_#D12052] hover:bg-[#F8DE22] hover:text-[#111111] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Đăng Ký Tài Khoản Mới"
            )}
          </button>
        </form>
      </div>

      {/* Switch links */}
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-[#555555]">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-[#D12052] underline hover:text-[#F45B26]">
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
}
