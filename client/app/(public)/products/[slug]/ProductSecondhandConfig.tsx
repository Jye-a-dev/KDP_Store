"use client";

interface ProductSecondhandConfigProps {
  editCondition: string;
  setEditCondition: (val: string) => void;
  editOriginalPrice: string;
  setEditOriginalPrice: (val: string) => void;
  editImportDate: string;
  setEditImportDate: (val: string) => void;
}

export default function ProductSecondhandConfig({
  editCondition,
  setEditCondition,
  editOriginalPrice,
  setEditOriginalPrice,
  editImportDate,
  setEditImportDate,
}: ProductSecondhandConfigProps) {
  return (
    <div className="bg-neutral-50 p-4 border-2 border-dashed border-[#111111]/20 rounded-2xl flex flex-col gap-3">
      <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Thông tin Second-hand</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            Tình trạng (Độ mới)
          </label>
          <input
            type="text"
            value={editCondition}
            onChange={(e) => setEditCondition(e.target.value)}
            placeholder="VD: Mới 95%"
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
            Giá gốc hãng (đ)
          </label>
          <input
            type="text"
            value={editOriginalPrice}
            onChange={(e) => setEditOriginalPrice(e.target.value)}
            placeholder="VD: 1500000"
            className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
          Ngày nhập hàng về kho
        </label>
        <input
          type="date"
          value={editImportDate}
          onChange={(e) => setEditImportDate(e.target.value)}
          className="border-2 border-[#111111] py-2 px-3 rounded-xl text-xs font-semibold outline-none focus:bg-white bg-white cursor-pointer"
        />
      </div>
    </div>
  );
}
