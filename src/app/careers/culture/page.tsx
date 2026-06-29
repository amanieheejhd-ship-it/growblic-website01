import Link from "next/link";
import { Metadata } from "next";
import { Lightbulb, Sparkles, TrendingUp, Users } from "lucide-react";
import Scroll3DSection from "../../../components/Scroll3DSection";

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
            <article className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/82 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-10">
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
                  <article className="group relative h-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-xl shadow-blue-100/55 ring-1 ring-blue-100/70 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/80">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-200/45 blur-3xl transition group-hover:bg-cyan-200/55" />
                    <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-blue-50/80 text-blue-700 shadow-lg shadow-blue-100/70">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="relative mt-5 text-2xl font-black text-slate-950">
                      {item.title}
                    </h3>
                    <p className="relative mt-4 leading-8 text-slate-600">
                      {item.text}
                    </p>
                  </article>
                </Scroll3DSection>
              );
            })}
          </div>

          <Scroll3DSection className="mt-12">
            <div className="rounded-[2rem] border border-blue-100 bg-white/80 p-7 text-center shadow-xl shadow-blue-100/55">
              <p className="text-2xl font-black leading-9 text-slate-950">
                “Team stories and culture notes will be published as Growblic grows.”
              </p>
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
