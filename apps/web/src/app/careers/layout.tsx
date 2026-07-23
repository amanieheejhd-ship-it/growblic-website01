import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import CareersSubnav from "./CareersSubnav";

const logoUrl =
  "https://play-lh.googleusercontent.com/g0grr8jGzVcS1_uUzh05Ht2a7w7PcavodUBDgK7XOel8DwYKNSVtNZaF6HmqUFPK37xlr4WafEddfvWeyeDSKA=w240-h480-rw";

export default function CareersLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen text-slate-950">
      {/* Background-free like the site-wide header: nav text floats over the
          page; readability comes from the text halo, never a band. */}
      <header className="sticky top-0 z-40 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link href="/careers" className="flex items-center gap-4">
            <Image
              src={logoUrl}
              alt="Growblic logo"
              width={44}
              height={44}
              className="h-10 w-10 rounded-2xl object-cover shadow-lg shadow-blue-100/70"
              unoptimized
            />
            <span className="text-lg font-black uppercase tracking-[0.14em] text-slate-950 [text-shadow:0_1px_2px_rgba(251,253,255,0.9),0_0_12px_rgba(251,253,255,0.8)]">
              Growblic Careers
            </span>
          </Link>

          <CareersSubnav />
        </div>
      </header>

      {children}
    </main>
  );
}
