import Link from "next/link";
import { Metadata } from "next";
import Scroll3DSection from "../../../components/Scroll3DSection";

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

        <Scroll3DSection className="mt-14">
          <article className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/82 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/45 blur-3xl" />
            <p className="relative text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Editorial hub
            </p>
            <h2 className="relative mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950">
              Practical notes from building websites, apps, SaaS products, and automation.
            </h2>
            <p className="relative mt-5 max-w-3xl font-semibold leading-8 text-slate-600">
              Growblic insights will focus on useful lessons, not noise: design decisions,
              engineering choices, automation workflows, and better product execution.
            </p>
          </article>
        </Scroll3DSection>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {insights.map((item, index) => (
            <Scroll3DSection key={item} delay={index * 0.05}>
              <article className="group relative h-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-xl shadow-blue-100/55 ring-1 ring-blue-100/70 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/80">
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-200/45 blur-3xl transition group-hover:bg-cyan-200/55" />
                <h2 className="relative text-2xl font-black text-slate-950">
                  {item}
                </h2>
                <p className="relative mt-4 leading-8 text-slate-600">
                  More detailed Growblic insights can be added here later.
                </p>
              </article>
            </Scroll3DSection>
          ))}
        </div>

        <Scroll3DSection className="mt-12">
          <div className="rounded-[2rem] border border-blue-100 bg-blue-50/70 p-7 shadow-xl shadow-blue-100/45">
            <p className="text-xl font-black text-slate-950">
              Team stories and culture notes will be published as Growblic grows.
            </p>
          </div>
        </Scroll3DSection>

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
