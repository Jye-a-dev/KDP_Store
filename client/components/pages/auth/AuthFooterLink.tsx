import Link from "next/link";

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooterLink({ text, linkText, href }: AuthFooterLinkProps) {
  return (
    <p className="mt-6 text-xs font-bold uppercase tracking-wide text-[#555555]">
      {text}{" "}
      <Link href={href} className="text-[#D12052] underline hover:text-[#F45B26]">
        {linkText}
      </Link>
    </p>
  );
}
