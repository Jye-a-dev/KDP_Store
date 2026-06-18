"use client";

import AuthCard from "@/components/pages/auth/AuthCard";
import AuthFooterLink from "@/components/pages/auth/AuthFooterLink";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm flex flex-col items-center">
      <AuthCard title="Đăng Ký">
        <RegisterForm />
      </AuthCard>
      <AuthFooterLink
        text="Đã có tài khoản?"
        linkText="Đăng nhập ngay"
        href="/login"
      />
    </div>
  );
}
