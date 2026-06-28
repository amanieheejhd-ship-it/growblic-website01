import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perks | Growblic Careers",
  description:
    "Growblic perks help people learn faster, build real products, and grow with modern digital work.",
};

const perks = [
  {
    title: "real product work",
    text: "work on websites, apps, dashboards, SaaS products, automation systems, and business tools that actually get shipped.",
  },
  {
    title: "remote friendly",
    text: "collaborate from anywhere with focused communication, clear tasks, and outcome-based execution.",
  },
  {
    title: "modern stack",
    text: "learn and work with modern tools like Next.js, React, APIs, dashboards, automation, and product design systems.",
  },
  {
    title: "fast learning",
    text: "every project teaches design, code, product thinking, client handling, and better execution.",
  },
  {
    title: "premium work culture",
    text: "we care about clean UI, strong UX, performance, copy, branding, and small details that build trust.",
  },
  {
    title: "growth path",
    text: "as Growblic grows, you get opportunities to take ownership of bigger products, clients, and systems.",
  },
];

export default function PerksPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
            Growblic Careers / Perks
          </p>

          <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Perks that help you do your best work.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            Growblic gives you the space to learn, build, improve, and work on real
            business projects with a serious product mindset.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-100/70 sm:p-12">
          <div className="grid gap-x-20 gap-y-20 lg:grid-cols-2">
            {perks.map((item) => (
              <article key={item.title}>
                <h2 className="text-4xl font-black tracking-tight text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-blue-100 pt-8 sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
            >
              Back to Careers
            </Link>
            <Link
              href="/careers/values"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              See Values →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
