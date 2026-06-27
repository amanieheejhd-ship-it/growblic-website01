import { ArrowRight } from "lucide-react";
import Link from "next/link";

const consultationCards = [
  "Free project consultation",
  "Clear development roadmap",
  "Fast launch support",
];

export default function CTA() {
  return (
    <section className="growblic-consultation-cta bg-[#fbfdff] px-6 py-24">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-blue-100/80 bg-white p-8 shadow-2xl shadow-slate-900/8 sm:p-12 lg:p-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
              Start Now
            </p>
            <h2 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
              Have an idea? Let&apos;s build your product.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              Share your project idea and Growblic will help you turn it into a
              real website, app, SaaS platform, or automation system.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {consultationCards.map((card) => (
              <div
                key={card}
                className="rounded-2xl border border-blue-100/80 bg-[#f8fbff] px-5 py-4 text-sm font-semibold text-slate-700"
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#050505] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Get Free Consultation
            <ArrowRight size={17} />
          </Link>
          <Link
            href="#apps"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100/70 bg-[#fbfdff] px-7 py-3.5 text-sm font-semibold text-[#050505] shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            View Live Apps
          </Link>
        </div>
      </div>
    </section>
  );
}
