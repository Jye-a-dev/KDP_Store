import React from "react";

interface ProductColorManagerProps {
  colors: string[];
  setColors: (colors: string[]) => void;
  colorInput: string;
  setColorInput: (val: string) => void;
}

export default function ProductColorManager({
  colors,
  setColors,
  colorInput,
  setColorInput,
}: ProductColorManagerProps) {
  const handleAddColor = () => {
    const cleaned = colorInput.trim().toLowerCase();
    if (/^#[0-9a-f]{6}$/i.test(cleaned)) {
      if (!colors.map((c) => c.toLowerCase()).includes(cleaned)) {
        setColors([...colors, cleaned]);
      }
    } else {
      alert("Mã màu hex không hợp lệ! Ví dụ: #03AED2");
    }
  };

  return (
    <div className="flex flex-col gap-1.5 border-2 border-[#111111] p-4 rounded-2xl bg-white shadow-[3px_3px_0px_#111111]">
      <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
        🎨 Danh sách màu sắc sản phẩm
      </label>

      {/* List of active colors */}
      <div className="flex flex-wrap gap-2.5 my-2">
        {colors.length === 0 ? (
          <span className="text-[11px] text-gray-400 font-semibold italic">
            Chưa chọn màu nào (Sẽ hiển thị màu mặc định)
          </span>
        ) : (
          colors.map((color, idx) => (
            <div
              key={`${color}-${idx}`}
              className="flex items-center gap-1.5 border-2 border-[#111111] bg-neutral-50 px-2 py-1 rounded-xl shadow-[1.5px_1.5px_0px_#111111]"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20"
                style={{ backgroundColor: color }}
              />
              <code className="text-[10px] font-bold font-mono">
                {color.toUpperCase()}
              </code>
              <button
                type="button"
                onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                className="text-gray-400 hover:text-[#D12052] font-black text-xs cursor-pointer ml-1 select-none transition-colors"
                title="Xóa màu này"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add new color picker + input */}
      <div className="flex gap-2 items-center mt-1">
        <input
          type="color"
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
          className="w-8 h-8 rounded-lg border-2 border-[#111111] cursor-pointer bg-white shrink-0 p-0.5"
        />
        <input
          type="text"
          value={colorInput.toUpperCase()}
          onChange={(e) => {
            let val = e.target.value;
            if (!val.startsWith("#")) val = "#" + val;
            setColorInput(val.slice(0, 7));
          }}
          maxLength={7}
          placeholder="#000000"
          className="border-2 border-[#111111] py-1.5 px-3 rounded-xl text-xs font-mono outline-none focus:bg-[#f7f9fa] w-24 text-center"
        />
        <button
          type="button"
          onClick={handleAddColor}
          className="px-4 py-1.5 bg-[#F8DE22] border-2 border-[#111111] rounded-xl text-[10px] font-extrabold uppercase cursor-pointer shadow-[1.5px_1.5px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_#111111]"
        >
          Thêm màu
        </button>
      </div>
    </div>
  );
}
