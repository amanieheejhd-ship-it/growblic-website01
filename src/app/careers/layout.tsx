import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const logoUrl =
  "https://play-lh.googleusercontent.com/g0grr8jGzVcS1_uUzh05Ht2a7w7PcavodUBDgK7XOel8DwYKNSVtNZaF6HmqUFPK37xlr4WafEddfvWeyeDSKA=w240-h480-rw";

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
            <Link href="/careers/openings" className="transition hover:text-blue-700">
              Openings
            </Link>
            <span className="text-slate-300">|</span>

            <Link href="/careers/perks" className="transition hover:text-blue-700">
              Perks
            </Link>
            <span className="text-slate-300">|</span>

            <Link href="/careers/values" className="transition hover:text-blue-700">
              Values
            </Link>
            <span className="text-slate-300">|</span>

            <details className="group relative">
              <summary className="list-none cursor-pointer transition hover:text-blue-700">
                Culture <span className="inline-block transition group-open:rotate-180">⌄</span>
              </summary>

              <div className="absolute right-0 top-7 z-50 w-52 rounded-2xl border border-blue-100 bg-white p-2 text-left shadow-xl shadow-blue-100/60">
                <Link
                  href="/careers/insights"
                  className="block rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-slate-800 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Insights
                </Link>

                <Link
                  href="/careers/humans"
                  className="mt-1 block rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-slate-800 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Humans
                </Link>
              </div>
            </details>
          </nav>
        </div>
      </header>

      {children}
    </main>
  );
}
