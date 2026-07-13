import Link from "next/link";
import { Metadata } from "next";
import {
  Briefcase,
  CalendarCheck,
  Clock3,
  Gem,
  Globe2,
  Laptop,
  Plane,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Scroll3DSection, { TiltCard } from "../../../components/Scroll3DSection";

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

const benefits = [
  {
    title: "Full-time",
    text: "Clear ownership paths for core roles as Growblic grows its delivery team.",
    icon: Briefcase,
  },
  {
    title: "Great gear",
    text: "Modern work setup support may be available for approved roles and teams.",
    icon: Laptop,
  },
  {
    title: "Equity plan",
    text: "Long-term contribution paths may include future upside where role structure allows.",
    icon: Gem,
  },
  {
    title: "Remote first",
    text: "Workflows are designed around focused communication, async updates, and outcomes.",
    icon: Globe2,
  },
  {
    title: "Team retreat",
    text: "Team gatherings may be planned as the company scales and schedules allow.",
    icon: Plane,
  },
  {
    title: "Modern tools",
    text: "Use practical tools for design, code, automation, dashboards, and product delivery.",
    icon: Wrench,
  },
  {
    title: "Flex schedule",
    text: "Flexible working rhythms are encouraged when project commitments stay clear.",
    icon: Clock3,
  },
  {
    title: "Unlimited PTO",
    text: "Flexible time-off practices may vary by role, location, and engagement type.",
    icon: CalendarCheck,
  },
  {
    title: "Growth budget",
    text: "Learning support may be available for courses, tools, and role-relevant growth.",
    icon: TrendingUp,
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

      <section className="px-6 pb-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/82 p-6 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
                Benefits
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Benefits built for focused product work.
              </h2>
            </div>
            <div>
              <p className="text-base font-semibold leading-8 text-slate-600">
                A modern, flexible work environment for people who like shipping polished
                websites, apps, automation systems, and SaaS products.
              </p>
              <p className="mt-4 inline-flex rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-700 shadow-lg shadow-blue-100/45">
                Perks may vary by role, location, and engagement type.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <Scroll3DSection key={item.title} delay={index * 0.035}>
                  <TiltCard className="h-full">
                    <article className="group relative flex h-full min-h-64 flex-col overflow-hidden rounded-[1.9rem] border border-white/80 bg-white/70 p-5 shadow-[0_22px_65px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl transition hover:border-blue-200 hover:shadow-[0_30px_85px_rgba(37,99,235,0.22)]">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-blue-500/18 via-cyan-300/12 to-transparent" />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:32px_32px] opacity-45" />
                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl transition group-hover:bg-cyan-200/55" />
                      <div className="relative flex items-start justify-between gap-4">
                        <span className="grid h-14 w-14 place-items-center rounded-[1.25rem] border border-white/85 bg-blue-50 text-blue-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_38px_rgba(37,99,235,0.18)]">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm shadow-blue-100/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="relative mt-6 text-2xl font-black tracking-tight text-slate-950">
                        {item.title}
                      </h3>
                      <p className="relative mt-3 flex-1 text-sm font-semibold leading-7 text-slate-600">
                        {item.text}
                      </p>
                      <span className="relative mt-5 w-fit rounded-full border border-white/80 bg-white/65 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
                        Benefit
                      </span>
                      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 opacity-75 transition group-hover:opacity-100" />
                    </article>
                  </TiltCard>
                </Scroll3DSection>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-blue-100 pt-6 sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-white px-6 py-3 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
            >
              Careers
            </Link>
            <Link
              href="/careers/openings"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Open roles →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-100/70 sm:p-12">
          <div className="grid gap-x-20 gap-y-20 lg:grid-cols-2">
            {perks.map((item, index) => (
              <Scroll3DSection key={item.title} delay={index * 0.04}>
                <TiltCard className="h-full">
                  <article className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-[0_24px_70px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl transition hover:border-blue-200 hover:shadow-[0_32px_90px_rgba(37,99,235,0.22)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-blue-500/18 via-sky-300/12 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
                    <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-200/35 blur-3xl transition group-hover:bg-cyan-200/45" />
                    <div className="relative flex items-start justify-between gap-4">
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm shadow-blue-100/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
                        Perk
                      </span>
                    </div>
                    <h2 className="relative mt-6 text-4xl font-black tracking-tight text-slate-950">
                      {item.title}
                    </h2>
                    <p className="relative mt-6 max-w-xl flex-1 text-base font-semibold leading-8 text-slate-600">
                      {item.text}
                    </p>
                    <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 opacity-75 transition group-hover:opacity-100" />
                  </article>
                </TiltCard>
              </Scroll3DSection>
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

      <section className="px-6 pb-24 sm:px-8 lg:px-10">
        <Scroll3DSection>
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-white via-blue-50/70 to-white p-7 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                  Ready to build
                </p>
                <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-slate-950">
                  Bring your craft to real Growblic projects.
                </h2>
                <p className="mt-4 max-w-2xl font-semibold leading-8 text-slate-600">
                  Browse open roles or send your profile so we can understand where you might fit.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/careers/openings"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Open roles →
                </Link>
                <Link
                  href="/careers/apply"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-white px-6 py-3 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
                >
                  Apply now
                </Link>
              </div>
            </div>
          </div>
        </Scroll3DSection>
      </section>
    </>
  );
}
