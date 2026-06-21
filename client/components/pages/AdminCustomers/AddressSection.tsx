"use client";

import React, { useState } from "react";
import { UserAddress } from "@/types/api";

interface AddressSectionProps {
  addresses: UserAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<UserAddress[]>>;
  fullName: string;
  phone: string;
}

export default function AddressSection({
  addresses,
  setAddresses,
  fullName,
  phone,
}: AddressSectionProps) {
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrValue, setAddrValue] = useState("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  const handleOpenNewAddress = () => {
    setEditingAddressIndex(null);
    setAddrName(fullName || "");
    setAddrPhone(phone || "");
    setAddrValue("");
    setAddrIsDefault(addresses.length === 0);
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (index: number) => {
    const addr = addresses[index];
    setEditingAddressIndex(index);
    setAddrName(addr.name);
    setAddrPhone(addr.phone);
    setAddrValue(addr.address);
    setAddrIsDefault(!!addr.is_default);
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = () => {
    if (!addrName.trim() || !addrPhone.trim() || !addrValue.trim()) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    let updatedAddresses = [...addresses];

    const newAddr: UserAddress = {
      name: addrName.trim(),
      phone: addrPhone.trim(),
      address: addrValue.trim(),
      is_default: addrIsDefault,
    };

    if (addrIsDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, is_default: false }));
    }

    if (editingAddressIndex !== null) {
      updatedAddresses[editingAddressIndex] = newAddr;
    } else {
      updatedAddresses.push(newAddr);
    }

    if (updatedAddresses.length > 0 && !updatedAddresses.some((a) => a.is_default)) {
      updatedAddresses[0].is_default = true;
    }

    setAddresses(updatedAddresses);
    setIsAddressFormOpen(false);
  };

  const handleDeleteAddress = (index: number) => {
    const isDeletedDefault = addresses[index].is_default;
    let updatedAddresses = addresses.filter((_, i) => i !== index);

    if (isDeletedDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].is_default = true;
    }

    setAddresses(updatedAddresses);
  };

  return (
    <div className="border-t border-[#111111]/10 pt-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h4 className="text-[11px] font-extrabold uppercase text-[#111111] tracking-wider">
          🏠 Sổ Địa Chỉ Nhận Hàng ({addresses.length})
        </h4>
        {!isAddressFormOpen && (
          <button
            type="button"
            onClick={handleOpenNewAddress}
            className="px-2.5 py-1 bg-[#03AED2] text-white border border-[#111111] rounded-lg text-[9px] font-extrabold uppercase cursor-pointer hover:bg-[#0295b3] transition-colors"
          >
            + Thêm
          </button>
        )}
      </div>

      {isAddressFormOpen && (
        <div className="p-3.5 border border-[#111111] rounded-xl bg-[#f7f9fa] mb-3 space-y-3">
          <h5 className="text-[9px] font-black uppercase text-[#111111]">
            {editingAddressIndex !== null ? "✏️ Sửa địa chỉ" : "✨ Thêm địa chỉ mới"}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-extrabold uppercase text-[#555]">Họ tên người nhận</label>
              <input
                type="text"
                value={addrName}
                onChange={(e) => setAddrName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="border border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold bg-white outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-extrabold uppercase text-[#555]">Số điện thoại</label>
              <input
                type="tel"
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
                placeholder="09XXXXXXXX"
                className="border border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold bg-white outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-extrabold uppercase text-[#555]">Địa chỉ nhận hàng</label>
            <input
              type="text"
              value={addrValue}
              onChange={(e) => setAddrValue(e.target.value)}
              placeholder="Số nhà, tên đường, quận/huyện..."
              className="border border-[#111111] py-1.5 px-2 rounded-lg text-xs font-semibold bg-white outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="modal_is_default"
              checked={addrIsDefault}
              onChange={(e) => setAddrIsDefault(e.target.checked)}
              disabled={editingAddressIndex !== null && !!addresses[editingAddressIndex]?.is_default}
              className="w-3.5 h-3.5 border border-[#111111] rounded cursor-pointer"
            />
            <label
              htmlFor="modal_is_default"
              className="text-[9px] font-extrabold uppercase text-[#111111] cursor-pointer"
            >
              Mặc định
            </label>
          </div>
          <div className="flex gap-2 justify-end text-[9px] font-extrabold">
            <button
              type="button"
              onClick={() => setIsAddressFormOpen(false)}
              className="px-2.5 py-1 border border-[#111111] bg-white rounded-md hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveAddress}
              className="px-2.5 py-1 bg-[#F8DE22] border border-[#111111] rounded-md hover:bg-[#e6c51f] transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="text-[10px] font-semibold text-[#888] italic bg-neutral-50 p-3 border border-dashed border-gray-300 rounded-xl text-center">
          Chưa có địa chỉ nào được đăng ký.
        </p>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className="flex justify-between items-start gap-3 p-3 border border-gray-300 rounded-xl bg-[#f7f9fa]/50 hover:bg-[#f7f9fa] transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-extrabold text-[#111111]">{addr.name}</span>
                  <span className="text-[10px] font-semibold text-[#666]">({addr.phone})</span>
                  {addr.is_default && (
                    <span className="text-[7px] font-extrabold uppercase px-1 bg-green-50 text-green-700 border border-green-200 rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#333] font-medium leading-normal">{addr.address}</p>
              </div>

              <div className="flex gap-1 shrink-0 text-[8px] font-extrabold">
                <button
                  type="button"
                  onClick={() => handleOpenEditAddress(idx)}
                  className="px-2 py-0.5 bg-white border border-[#111111] rounded hover:bg-[#F8DE22] transition-colors"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(idx)}
                  className="px-2 py-0.5 bg-white text-[#D12052] border border-[#D12052] rounded hover:bg-[#D12052]/10 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
