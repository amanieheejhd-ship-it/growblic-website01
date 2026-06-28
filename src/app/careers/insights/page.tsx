import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | Growblic Careers",
  description:
    "Insights from Growblic on product building, software delivery, design, and digital execution.",
};

const insights = [
  "How Growblic builds premium websites",
  "How we think about app and SaaS product quality",
  "Why design, content, and performance matter",
  "How automation systems save business time",
];

export default function InsightsPage() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
          Culture / Insights
        </p>

        <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Insights from the way Growblic builds.
        </h1>

        <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
          A place for ideas, lessons, and thinking around software, design,
          product delivery, and business growth.
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {insights.map((item) => (
            <article
              key={item}
              className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/55"
            >
              <h2 className="text-2xl font-black text-slate-950">{item}</h2>
              <p className="mt-4 leading-8 text-slate-600">
                More detailed Growblic insights can be added here later.
              </p>
            </article>
          ))}
        </div>

        <Link
          href="/careers"
          className="mt-12 inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Back to Careers
        </Link>
      </div>
    </section>
  );
}
