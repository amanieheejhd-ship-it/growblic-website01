import Link from "next/link";
import { Metadata } from "next";
import {
  Briefcase,
  Gem,
  HeartHandshake,
  Lightbulb,
  Sparkles,
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
  { label: "Open roles", href: "/careers/openings" },
  { label: "Remote-first", href: "/careers/perks" },
  { label: "Growth culture", href: "/careers/culture" },
  { label: "Build with Growblic", href: "/careers/values" },
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
            <Link
              href="/#footer"
              aria-label="Back to website footer"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-5 py-3 text-xs font-black uppercase tracking-[0.20em] text-slate-700 shadow-xl shadow-blue-100/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              <span>←</span>
              <span>Website footer</span>
            </Link>

            <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
              Careers at Growblic
            </p>
            <h1 className="mt-7 max-w-4xl break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
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
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group/stat flex items-center justify-between rounded-2xl border border-blue-100/80 bg-white/75 px-4 py-3 shadow-lg shadow-blue-100/45 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-[0_22px_55px_rgba(37,99,235,0.16)]"
                  >
                    <span className="text-sm font-black text-slate-800 transition group-hover/stat:text-blue-700">
                      {item.label}
                    </span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-xs font-black text-blue-700 transition group-hover/stat:bg-blue-600 group-hover/stat:text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Scroll3DSection>
        </div>
      </section>

      
      <section className="relative overflow-hidden rounded-[2.25rem] border border-blue-100 bg-white/80 px-6 py-10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.055)_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.55fr] lg:items-stretch">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-blue-100 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.34em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)]">
              Why join Growblic
            </div>

            <h2 className="max-w-xl break-words text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Work where craft meets ownership.
            </h2>

            <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              Build real websites, apps, SaaS platforms, dashboards, and automation systems with a team focused on quality, speed, and client outcomes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Real products", "Modern tools", "Ownership culture"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Build real products",
                copy: "Work on websites, apps, SaaS platforms, dashboards, and automation systems designed to ship.",
                accent: "from-blue-500 to-cyan-400",
                icon: "▣",
              },
              {
                number: "02",
                title: "Learn fast with modern tools",
                copy: "Grow through practical design, code, AI workflow, product, and digital delivery experience.",
                accent: "from-cyan-500 to-sky-400",
                icon: "✦",
              },
              {
                number: "03",
                title: "Grow with ownership",
                copy: "Take responsibility for clearer execution, better systems, and stronger client outcomes.",
                accent: "from-indigo-500 to-blue-500",
                icon: "◎",
              },
            ].map((card) => (
              <article
                key={card.title}
                className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white/75 p-6 shadow-[0_24px_70px_rgba(37,99,235,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_34px_90px_rgba(37,99,235,0.18)]"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${card.accent} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-300/20 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:28px_28px]" />

                <div className="relative mb-8 flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-white/90 text-2xl font-black text-blue-600 shadow-[0_18px_45px_rgba(37,99,235,0.14)] transition-transform duration-300 group-hover:scale-105">
                    {card.icon}
                  </div>
                  <span className="rounded-full border border-blue-100 bg-white/85 px-3 py-1 text-xs font-black tracking-[0.18em] text-blue-700 shadow-sm">
                    {card.number}
                  </span>
                </div>

                <h3 className="relative text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {card.title}
                </h3>

                <p className="relative mt-5 text-sm font-semibold leading-7 text-slate-600">
                  {card.copy}
                </p>

                <div className={`relative mt-auto h-1 w-full rounded-full bg-gradient-to-r ${card.accent} opacity-80 shadow-[0_0_28px_rgba(37,99,235,0.35)]`} />
              </article>
            ))}
          </div>
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
