import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const consultationCards = [
  "Free project discussion",
  "Product-first planning",
  "Website, app, SaaS & automation support",
];

export default function CTA() {
  return (
    <section className="growblic-consultation-cta bg-[#fbfdff] px-6 py-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-blue-100/80 bg-white shadow-2xl shadow-slate-900/8">
        <div className="relative p-8 sm:p-12 lg:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_92%_22%,rgba(6,182,212,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0),rgba(239,246,255,0.68))]" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700 shadow-sm shadow-blue-100/70 backdrop-blur">
                Start with Growblic
              </p>
              <h2 className="mt-6 max-w-4xl text-balance text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
                Have an idea? Let&apos;s build it into a real product.
              </h2>
              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg sm:leading-9">
                Share your website, mobile app, SaaS, dashboard, automation, or software
                requirement. Growblic helps you plan, design, build, and launch with a
                clean product-first approach.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/start-project"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Project →
                </Link>
                <Link
                  href="/services"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100/70 bg-white/90 px-7 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-slate-900/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {consultationCards.map((card) => (
                <div
                  key={card}
                  className="flex min-h-24 items-start gap-4 rounded-[1.4rem] border border-blue-100/80 bg-white/90 p-5 text-sm font-black leading-6 text-slate-700 shadow-xl shadow-blue-100/50 backdrop-blur"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <CheckCircle2 size={19} />
                  </span>
                  <span>{card}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
