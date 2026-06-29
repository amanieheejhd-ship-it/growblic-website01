import Link from "next/link";
import { Metadata } from "next";
import {
  Briefcase,
  Gem,
  HeartHandshake,
  Lightbulb,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Scroll3DSection, { TiltCard } from "../../components/Scroll3DSection";

export const metadata: Metadata = {
  title: "Careers | Growblic",
  description:
    "Join Growblic and build premium websites, apps, SaaS products, automation systems, and business software.",
};

const careerOptions = [
  {
    title: "Openings",
    text: "Explore jobs and internships for developers, designers, and digital growth roles.",
    href: "/careers/openings",
    icon: Briefcase,
    accent: "Roles / Jobs",
    glow: "from-blue-500/24 via-sky-300/14 to-transparent",
    iconSurface: "bg-blue-50 text-blue-700",
    numberSurface: "border-blue-100 bg-blue-50 text-blue-700",
    bar: "from-blue-600 via-sky-400 to-cyan-300",
  },
  {
    title: "Perks",
    text: "See the benefits, tools, and flexible work practices that support focused product work.",
    href: "/careers/perks",
    icon: Gem,
    accent: "Benefits",
    glow: "from-cyan-400/24 via-blue-300/14 to-transparent",
    iconSurface: "bg-cyan-50 text-cyan-700",
    numberSurface: "border-cyan-100 bg-cyan-50 text-cyan-700",
    bar: "from-cyan-500 via-blue-400 to-sky-300",
  },
  {
    title: "Values",
    text: "Understand how Growblic thinks about speed, quality, ownership, and client success.",
    href: "/careers/values",
    icon: Sparkles,
    accent: "Quality",
    glow: "from-indigo-400/22 via-blue-300/14 to-transparent",
    iconSurface: "bg-indigo-50 text-indigo-700",
    numberSurface: "border-indigo-100 bg-indigo-50 text-indigo-700",
    bar: "from-indigo-500 via-blue-500 to-sky-300",
  },
  {
    title: "Culture",
    text: "Learn how our team works, communicates, learns, and ships premium digital products.",
    href: "/careers/culture",
    icon: HeartHandshake,
    accent: "Team",
    glow: "from-sky-400/24 via-blue-200/16 to-transparent",
    iconSurface: "bg-sky-50 text-sky-700",
    numberSurface: "border-sky-100 bg-sky-50 text-sky-700",
    bar: "from-sky-500 via-blue-400 to-cyan-300",
  },
  {
    title: "Insights",
    text: "Read how we approach design, software delivery, automation, and product quality.",
    href: "/careers/insights",
    icon: Lightbulb,
    accent: "Knowledge",
    glow: "from-blue-400/22 via-cyan-200/16 to-transparent",
    iconSurface: "bg-blue-50 text-blue-700",
    numberSurface: "border-blue-100 bg-blue-50 text-blue-700",
    bar: "from-blue-500 via-cyan-400 to-blue-200",
  },
  {
    title: "Humans",
    text: "Meet the people, stories, and mindset behind the Growblic careers experience.",
    href: "/careers/humans",
    icon: Users,
    accent: "Stories",
    glow: "from-cyan-500/22 via-sky-200/16 to-transparent",
    iconSurface: "bg-cyan-50 text-cyan-700",
    numberSurface: "border-cyan-100 bg-cyan-50 text-cyan-700",
    bar: "from-cyan-500 via-sky-400 to-blue-300",
  },
];

const heroStats = [
  "Open roles",
  "Remote-first",
  "Growth culture",
  "Build with Growblic",
];

const whyJoin = [
  {
    title: "Build real products",
    text: "Work on websites, apps, SaaS platforms, dashboards, and automation systems that are designed to ship.",
    icon: Briefcase,
  },
  {
    title: "Learn fast with modern tools",
    text: "Grow through practical design, code, AI workflow, product, and digital delivery experience.",
    icon: Sparkles,
  },
  {
    title: "Grow with ownership",
    text: "Take responsibility for clearer execution, better systems, and stronger client outcomes.",
    icon: Target,
  },
];

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.15),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(239,246,255,0.72))]" />
        <div className="absolute left-[12%] top-20 h-48 w-48 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute bottom-10 right-[12%] h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
              Careers at Growblic
            </p>
            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Build real products with a premium digital team.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
              Join Growblic and work on premium websites, mobile apps, SaaS products,
              dashboards, automation systems, and real business software.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/careers/openings"
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                View openings <span className="ml-3">→</span>
              </Link>
              <Link
                href="/careers/perks"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-blue-100 bg-white/82 px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/55 backdrop-blur transition hover:-translate-y-0.5 hover:text-blue-700"
              >
                Explore perks
              </Link>
            </div>
          </div>

          <Scroll3DSection>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/82 p-8 shadow-[0_28px_90px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/70 backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/45 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-cyan-100/70 blur-3xl" />
              <p className="relative text-sm font-black uppercase tracking-[0.28em] text-blue-700">
                Build with us
              </p>
              <h2 className="relative mt-5 text-4xl font-black tracking-tight text-slate-950">
                Software. Apps. SaaS. Automation.
              </h2>
              <p className="relative mt-5 leading-8 text-slate-600">
                Explore openings, perks, values, culture, insights, and team stories
                through premium career pages built for people who like shipping real work.
              </p>
              <div className="relative mt-7 grid gap-3">
                {heroStats.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-blue-100/80 bg-white/72 px-4 py-3 shadow-lg shadow-blue-100/45 backdrop-blur"
                  >
                    <span className="text-sm font-black text-slate-800">{item}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-xs font-black text-blue-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Scroll3DSection>
        </div>
      </section>

      <section className="px-6 pb-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Scroll3DSection>
            <div className="grid gap-8 rounded-[2.5rem] border border-white/80 bg-white/82 p-6 shadow-[0_24px_80px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-8 lg:grid-cols-[0.75fr_1.25fr] lg:p-10">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
                  Why join Growblic
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  Work where craft meets ownership.
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {whyJoin.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Scroll3DSection key={item.title} delay={index * 0.05}>
                      <article className="relative h-full overflow-hidden rounded-[1.75rem] border border-blue-100/80 bg-gradient-to-br from-white via-blue-50/45 to-white p-5 shadow-xl shadow-blue-100/45">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/80 bg-white/75 text-blue-700 shadow-lg shadow-blue-100/65">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
                        <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                          {item.text}
                        </p>
                      </article>
                    </Scroll3DSection>
                  );
                })}
              </div>
            </div>
          </Scroll3DSection>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Scroll3DSection>
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
                Career paths
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Choose where you want to grow.
              </h2>
            </div>
          </Scroll3DSection>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {careerOptions.map((item, index) => {
              const Icon = item.icon;
              const number = String(index + 1).padStart(2, "0");

              return (
                <Scroll3DSection key={item.title} delay={index * 0.04}>
                  <TiltCard className="h-full">
                    <Link
                      href={item.href}
                      className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/68 p-6 shadow-[0_24px_70px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl transition hover:border-blue-200 hover:shadow-[0_32px_90px_rgba(37,99,235,0.22)]"
                    >
                      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${item.glow}`} />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-50" />
                      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl transition group-hover:bg-cyan-200/45" />

                      <div className="relative flex items-start justify-between gap-5">
                        <div className={`grid h-16 w-16 place-items-center rounded-[1.45rem] border border-white/85 ${item.iconSurface} shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_42px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/70 transition group-hover:-translate-y-0.5`}>
                          <Icon className="h-7 w-7" aria-hidden="true" />
                        </div>
                        <div className="grid justify-items-end gap-2">
                          <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${item.numberSurface} shadow-sm shadow-blue-100/50`}>
                            {number}
                          </span>
                          <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
                            {item.accent}
                          </span>
                        </div>
                      </div>

                      <h3 className="relative mt-7 text-3xl font-black tracking-tight text-slate-950">
                        {item.title}
                      </h3>
                      <p className="relative mt-4 flex-1 text-sm font-semibold leading-7 text-slate-600">
                        {item.text}
                      </p>
                      <span className="relative mt-7 inline-flex w-fit items-center overflow-hidden rounded-full bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-900/20 transition group-hover:-translate-y-0.5 group-hover:shadow-blue-700/25">
                        <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                        Explore
                        <span className="ml-2 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                          →
                        </span>
                      </span>

                      <div className={`pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r ${item.bar} opacity-70 blur-[0.2px] transition group-hover:opacity-100`} />
                    </Link>
                  </TiltCard>
                </Scroll3DSection>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
