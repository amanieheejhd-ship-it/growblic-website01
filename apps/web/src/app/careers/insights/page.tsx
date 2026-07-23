import Link from "next/link";
import { Metadata } from "next";
import Scroll3DSection, { TiltCard } from "../../../components/Scroll3DSection";

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
      <div className="relative mx-auto max-w-[1800px]">
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
          <article className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/78 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-blue-500/18 via-cyan-300/12 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40" />
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
              <TiltCard className="h-full">
                <article className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-[0_24px_70px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl transition hover:border-blue-200 hover:shadow-[0_32px_90px_rgba(37,99,235,0.22)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-blue-400/18 via-cyan-200/12 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
                  <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl transition group-hover:bg-cyan-200/45" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm shadow-blue-100/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
                      Insight
                    </span>
                  </div>
                  <h2 className="relative mt-6 text-3xl font-black text-slate-950">
                    {item}
                  </h2>
                  <p className="relative mt-4 flex-1 leading-8 text-slate-600">
                    More detailed Growblic insights can be added here later.
                  </p>
                  <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-200 opacity-75 transition group-hover:opacity-100" />
                </article>
              </TiltCard>
            </Scroll3DSection>
          ))}
        </div>

        <Scroll3DSection className="mt-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/76 p-7 shadow-xl shadow-blue-100/45 ring-1 ring-blue-100/70 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-blue-500/14 via-cyan-300/10 to-transparent" />
            <p className="relative text-xl font-black text-slate-950">
              Team stories and culture notes will be published as Growblic grows.
            </p>
            <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 opacity-75" />
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
