interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div className="w-full bg-white border-2 border-[#111111] p-8 rounded-3xl shadow-[6px_6px_0px_#111111] text-left">
      <h3 className="text-[24px] font-extrabold uppercase relative inline-block mb-6">
        {title}
        <span className="absolute -z-10 bottom-0.5 -left-0.75 -right-0.75 h-2 bg-[#F8DE22]" />
      </h3>
      {children}
    </div>
  );
}
