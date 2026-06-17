import EditableText from "@/components/layouts/(public)/EditableText";
import { usePageContent } from "@/contexts/PageContentContext";

export default function Newsletter() {
  const { content } = usePageContent();
  return (
    <section className="w-full bg-[#F8DE22] py-20 px-5 text-center text-[#111111] border-y-3 border-[#111111]">
      <div className="max-w-137.5 mx-auto flex flex-col items-center">
        <EditableText
          contentKey="newsletter_title"
          element="h3"
          className="text-[22px] md:text-[26px] font-extrabold uppercase tracking-wide mb-2.5"
        />
        <EditableText
          contentKey="newsletter_description"
          element="p"
          className="text-[13px] md:text-[14px] mb-6 font-semibold leading-relaxed block"
          multiline
        />
        <div className="flex w-full max-w-md bg-white border-2 border-[#111111] p-1.5 shadow-[4px_4px_0px_#111111] mb-2">
          <input 
            type="email" 
            placeholder={content.newsletter_placeholder}
            className="flex-1 border-none py-3 px-3 text-[13px] md:text-[14px] font-semibold outline-none text-[#111111]"
            disabled
          />
          <button 
            type="submit"
            className="bg-[#F45B26] text-white border-none uppercase font-bold px-6 text-[12px] cursor-pointer hover:bg-[#111111] transition-all duration-300"
          >
            <EditableText contentKey="newsletter_btn" />
          </button>
        </div>
        <div className="text-[10px] text-black/50 font-bold uppercase tracking-wider">
          Gợi ý placeholder: <EditableText contentKey="newsletter_placeholder" element="span" />
        </div>
      </div>
    </section>
  );
}
