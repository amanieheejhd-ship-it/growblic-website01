import Link from "next/link";
import { Metadata } from "next";
import { Lightbulb, Sparkles, TrendingUp, Users } from "lucide-react";
import Scroll3DSection, { TiltCard } from "../../../components/Scroll3DSection";

export const metadata: Metadata = {
  title: "Culture | Growblic Careers",
  description: "A focused product culture built around execution, learning, trust, and premium work.",
};

const cultureCards = [
  {
    title: "Insights",
    text: "How we think about products, design, and software delivery.",
    icon: Lightbulb,
  },
  {
    title: "Humans of Growblic",
    text: "The people, mindset, and work style behind Growblic.",
    icon: Users,
  },
  {
    title: "Learning mindset",
    text: "We improve every project, every screen, every system.",
    icon: TrendingUp,
  },
  {
    title: "Premium execution",
    text: "We care about details because details build trust.",
    icon: Sparkles,
  },
];

export default function CulturePage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
            Growblic Careers / Culture
          </p>

          <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Inside Growblic culture.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            A focused product culture built around execution, learning, trust, and premium work.
          </p>

          <Scroll3DSection className="mt-14">
            <article className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/78 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-10">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-blue-500/18 via-cyan-300/12 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/45 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                    Culture note
                  </p>
                  <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                    Serious work, calm systems, clear ownership.
                  </h2>
                </div>
                <p className="font-semibold leading-8 text-slate-600">
                  Growblic culture is shaped around practical delivery: clear tasks,
                  useful feedback, clean UI, stable systems, and steady improvement.
                </p>
              </div>
            </article>
          </Scroll3DSection>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {cultureCards.map((item, index) => {
              const Icon = item.icon;

              return (
                <Scroll3DSection key={item.title} delay={index * 0.05}>
                  <TiltCard className="h-full">
                    <article className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-[0_24px_70px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl transition hover:border-blue-200 hover:shadow-[0_32px_90px_rgba(37,99,235,0.22)]">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-sky-400/18 via-blue-200/12 to-transparent" />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
                      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl transition group-hover:bg-cyan-200/45" />
                      <div className="relative flex items-start justify-between gap-4">
                        <span className="grid h-16 w-16 place-items-center rounded-[1.45rem] border border-white/85 bg-sky-50 text-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_42px_rgba(37,99,235,0.18)]">
                          <Icon className="h-7 w-7" aria-hidden="true" />
                        </span>
                        <div className="grid justify-items-end gap-2">
                          <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700 shadow-sm shadow-blue-100/50">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
                            Culture
                          </span>
                        </div>
                      </div>
                      <h3 className="relative mt-7 text-3xl font-black text-slate-950">
                        {item.title}
                      </h3>
                      <p className="relative mt-4 flex-1 leading-8 text-slate-600">
                        {item.text}
                      </p>
                      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-sky-500 via-blue-400 to-cyan-300 opacity-75 transition group-hover:opacity-100" />
                    </article>
                  </TiltCard>
                </Scroll3DSection>
              );
            })}
          </div>

          <Scroll3DSection className="mt-12">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/76 p-7 text-center shadow-xl shadow-blue-100/55 ring-1 ring-blue-100/70 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-blue-500/14 via-cyan-300/10 to-transparent" />
              <p className="relative text-2xl font-black leading-9 text-slate-950">
                “Team stories and culture notes will be published as Growblic grows.”
              </p>
              <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 opacity-75" />
            </div>
          </Scroll3DSection>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
            >
              Back to Careers
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Contact Growblic →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
