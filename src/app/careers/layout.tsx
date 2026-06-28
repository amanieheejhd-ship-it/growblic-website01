import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const logoUrl =
  "https://play-lh.googleusercontent.com/g0grr8jGzVcS1_uUzh05Ht2a7w7PcavodUBDgK7XOel8DwYKNSVtNZaF6HmqUFPK37xlr4WafEddfvWeyeDSKA=w240-h480-rw";

const navLinks = [
  { label: "Openings", href: "/careers/openings" },
  { label: "Perks", href: "/careers/perks" },
  { label: "Values", href: "/careers/values" },
  { label: "Culture", href: "/careers/culture" },
];

export default function CareersLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f6f8ff] text-slate-950">
      <header className="border-b border-blue-100/80 bg-white/90 px-5 py-5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <Link href="/careers" className="flex items-center gap-4">
            <Image
              src={logoUrl}
              alt="Growblic logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl object-cover"
              unoptimized
            />
            <span className="text-xl font-black uppercase tracking-[0.18em] text-slate-950">
              Growblic Careers
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.18em] text-slate-700 sm:gap-6">
            {navLinks.map((item, index) => (
              <div key={item.href} className="flex items-center gap-4 sm:gap-6">
                <Link href={item.href} className="transition hover:text-blue-700">
                  {item.label}
                </Link>
                {index !== navLinks.length - 1 ? (
                  <span className="text-slate-300">|</span>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {children}
    </main>
  );
}
