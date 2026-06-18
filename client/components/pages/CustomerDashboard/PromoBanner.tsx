import EditableText from "@/components/layouts/(public)/EditableText";

export default function PromoBanner() {
  return (
    <div className="bg-[#D12052] border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] p-4 mb-8 flex items-center justify-between gap-4">
      <div>
        <EditableText
          contentKey="customer_promo_title"
          element="p"
          className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 mb-0.5 block"
        />
        <div className="text-white font-extrabold uppercase text-sm flex items-center gap-1.5">
          Nhập{" "}
          <mark className="bg-[#F8DE22] text-[#111111] px-1 inline-block">
            <EditableText contentKey="customer_promo_code" />
          </mark>{" "}
          <EditableText contentKey="customer_promo_desc" />
        </div>
      </div>
      <button type="button" className="shrink-0 bg-white text-[#D12052] text-[11px] font-extrabold uppercase tracking-wider px-4 py-2 rounded-full border-2 border-white shadow-[2px_2px_0px_#111111] hover:bg-[#F8DE22] hover:text-[#111111] transition-all cursor-pointer">
        <EditableText contentKey="customer_promo_btn" />
      </button>
    </div>
  );
}
