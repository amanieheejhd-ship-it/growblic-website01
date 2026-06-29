import Link from "next/link";
import { Metadata } from "next";
import { MessageCircle, Sparkles, Users } from "lucide-react";
import Scroll3DSection, { TiltCard } from "../../../components/Scroll3DSection";

export const metadata: Metadata = {
  title: "Humans of Growblic | Growblic Careers",
  description:
    "Stories and people behind Growblic culture. More content will be added soon.",
};

const storyCards = [
  {
    title: "Team stories",
    text: "Space for future interviews, builder notes, and day-in-the-life stories.",
    icon: Users,
  },
  {
    title: "Work mindset",
    text: "How Growblic people think about ownership, craft, communication, and delivery.",
    icon: Sparkles,
  },
  {
    title: "Open conversations",
    text: "A future home for lessons, reflections, and practical product-building moments.",
    icon: MessageCircle,
  },
];

export default function HumansPage() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
          Culture / Humans of Growblic
        </p>

        <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Humans of Growblic.
        </h1>

        <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
          This page is ready. You can add team stories, photos, interviews,
          and culture content here later.
        </p>

        <Scroll3DSection className="mt-14">
          <article className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/78 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-cyan-500/18 via-sky-200/12 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/45 blur-3xl" />
            <p className="relative text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              People behind the work
            </p>
            <h2 className="relative mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950">
              A future home for builders, stories, and practical lessons.
            </h2>
            <p className="relative mt-5 max-w-3xl font-semibold leading-8 text-slate-600">
              Team stories and culture notes will be published as Growblic grows.
              This page is structured for interviews, craft notes, and honest reflections.
            </p>
          </article>
        </Scroll3DSection>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {storyCards.map((item, index) => {
              const Icon = item.icon;

            return (
              <Scroll3DSection key={item.title} delay={index * 0.05}>
                <TiltCard className="h-full">
                  <article className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-[0_24px_70px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl transition hover:border-blue-200 hover:shadow-[0_32px_90px_rgba(37,99,235,0.22)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-cyan-500/18 via-sky-200/12 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
                    <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl transition group-hover:bg-cyan-200/45" />
                    <div className="relative flex items-start justify-between gap-4">
                      <span className="grid h-16 w-16 place-items-center rounded-[1.45rem] border border-white/85 bg-cyan-50 text-cyan-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_42px_rgba(37,99,235,0.18)]">
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </span>
                      <div className="grid justify-items-end gap-2">
                        <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700 shadow-sm shadow-blue-100/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
                          Stories
                        </span>
                      </div>
                    </div>
                    <h2 className="relative mt-7 text-3xl font-black text-slate-950">
                      {item.title}
                    </h2>
                    <p className="relative mt-4 flex-1 leading-8 text-slate-600">
                      {item.text}
                    </p>
                    <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-300 opacity-75 transition group-hover:opacity-100" />
                  </article>
                </TiltCard>
              </Scroll3DSection>
            );
          })}
        </div>

        <Scroll3DSection className="mt-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/76 p-7 shadow-xl shadow-blue-100/45 ring-1 ring-blue-100/70 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-cyan-500/14 via-sky-300/10 to-transparent" />
            <p className="relative text-xl font-black text-slate-950">
              No fake employee claims here: this area is ready for real Growblic stories when they are available.
            </p>
            <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-300 opacity-75" />
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
