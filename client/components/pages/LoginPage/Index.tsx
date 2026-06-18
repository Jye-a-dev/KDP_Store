"use client";

import AuthCard from "@/components/pages/auth/AuthCard";
import AuthFooterLink from "@/components/pages/auth/AuthFooterLink";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      <AuthCard title="Đăng Nhập">
        <LoginForm />
      </AuthCard>
      <AuthFooterLink
        text="Chưa có tài khoản?"
        linkText="Đăng ký ngay"
        href="/register"
      />
    </div>
  );
}
