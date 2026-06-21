"use client";

import { useState } from "react";
import { User, UserAddress } from "@/types/api";
import { UpdateUserData } from "@/hooks/useUsers";
import CustomerDetailsSection from "./CustomerDetailsSection";
import CustomerEditSection from "./CustomerEditSection";

interface CustomerModalProps {
  user?: User;
  initialMode: "details" | "edit" | "create";
  onClose: () => void;
  onSaved: () => void;
  onUpdate?: (id: string, data: UpdateUserData) => Promise<void>;
  onCreate?: (data: any) => Promise<void>;
  defaultRole?: "customer" | "admin";
}

export default function CustomerModal({
  user,
  initialMode,
  onClose,
  onSaved,
  onUpdate,
  onCreate,
  defaultRole = "customer",
}: CustomerModalProps) {
  const [mode, setMode] = useState<"details" | "edit" | "create">(initialMode);
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [role, setRole] = useState<"customer" | "admin">(user?.role ?? defaultRole);
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? "");
  const [addresses, setAddresses] = useState<UserAddress[]>(user?.addresses ?? []);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      if (!email.trim() || !fullName.trim()) {
        setError("Email và họ tên không được để trống");
        return;
      }
      if (!password.trim()) {
        setError("Mật khẩu không được để trống khi tạo tài khoản");
        return;
      }
    } else {
      if (!fullName.trim()) {
        setError("Họ tên không được để trống");
        return;
      }
    }
    setError("");
    setIsLoading(true);

    try {
      if (mode === "create") {
        if (onCreate) {
          await onCreate({
            email: email.trim(),
            password_hash: password.trim(),
            full_name: fullName.trim(),
            phone: phone.trim() || undefined,
            is_active: isActive,
            avatar_url: avatarUrl || undefined,
            role: role,
            addresses: addresses,
          });
        }
      } else if (user) {
        if (onUpdate) {
          await onUpdate(user.id, {
            email: email.trim() || undefined,
            password_hash: password.trim() || undefined,
            full_name: fullName.trim(),
            phone: phone.trim() || undefined,
            is_active: isActive,
            avatar_url: avatarUrl || undefined,
            role: role,
            addresses: addresses,
          });
        }
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#111111] bg-white shrink-0">
          <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#111111]">
            {mode === "create"
              ? `Thêm ${role === "admin" ? "Admin" : "Khách Hàng"} Mới`
              : `Hồ Sơ ${user?.role === "admin" ? "Admin" : "Khách Hàng"}`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f9fa] transition-colors cursor-pointer border-2 border-transparent active:border-[#111111]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        {initialMode !== "create" && (
          <div className="flex border-b-2 border-[#111111] bg-neutral-50 shrink-0">
            <button
              type="button"
              onClick={() => setMode("details")}
              className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors border-r-2 border-[#111111] cursor-pointer ${
                mode === "details" ? "bg-white text-[#111111]" : "text-[#555] hover:bg-[#f7f9fa]"
              }`}
            >
              📋 Chi Tiết
            </button>
            <button
              type="button"
              onClick={() => setMode("edit")}
              className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                mode === "edit" ? "bg-white text-[#111111]" : "text-[#555] hover:bg-[#f7f9fa]"
              }`}
            >
              ✏️ Chỉnh Sửa
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white text-[#111111]">
          {mode === "details" && user ? (
            <CustomerDetailsSection user={user} formatDateTime={formatDateTime} />
          ) : (
            <CustomerEditSection
              mode={mode === "details" ? "edit" : mode}
              user={user}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              role={role}
              setRole={setRole}
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              isActive={isActive}
              setIsActive={setIsActive}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              addresses={addresses}
              setAddresses={setAddresses}
              error={error}
              isLoading={isLoading}
              onClose={onClose}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

