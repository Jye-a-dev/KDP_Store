import React from "react";

interface ProductSecondHandFormProps {
  condition: string;
  setCondition: (val: string) => void;
  originalPrice: string;
  setOriginalPrice: (val: string) => void;
  importDate: string;
  setImportDate: (val: string) => void;
}

export default function ProductSecondHandForm({
  condition,
  setCondition,
  originalPrice,
  setOriginalPrice,
  importDate,
  setImportDate,
}: ProductSecondHandFormProps) {
  return (
    <div className="bg-neutral-50 p-4 border-2 border-dashed border-[#111111]/20 rounded-2xl flex flex-col gap-3">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
        Thông tin Second-hand
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            Tình trạng (Độ mới)
          </label>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="VD: Mới 95%, Likenew"
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
            Giá gốc của hãng (VNĐ)
          </label>
          <input
            type="text"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="VD: 1500000"
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111]">
          Ngày nhập hàng về kho
        </label>
        <input
          type="date"
          value={importDate}
          onChange={(e) => setImportDate(e.target.value)}
          className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white cursor-pointer"
        />
      </div>
    </div>
  );
}
