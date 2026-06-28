import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Growblic",
  description:
    "Join Growblic and build premium websites, apps, SaaS products, automation systems, and business software.",
};

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.10),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
              Careers at Growblic
            </p>
            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Grow your career by building real digital products.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
              Join Growblic and work on premium websites, mobile apps, SaaS products,
              dashboards, automation systems, and real business software.
            </p>

            <div className="mt-10 grid max-w-4xl gap-5 md:grid-cols-[1fr_1fr]">
              <div className="flex h-16 items-center rounded-2xl border border-blue-100 bg-white px-5 text-sm font-bold tracking-[0.10em] text-slate-500 shadow-xl shadow-blue-100/50">
                seek and you shall find
              </div>
              <Link
                href="/careers/openings"
                className="flex h-16 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black uppercase tracking-[0.18em] text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Discover roles <span className="ml-4 text-xl">→</span>
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-100/70">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-700">
              Build with us
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
              Software. Apps. SaaS. Automation.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Explore openings, perks, values, and culture on separate career pages.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
