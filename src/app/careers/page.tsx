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
import Scroll3DSection from "../../components/Scroll3DSection";

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
  },
  {
    title: "Perks",
    text: "See the benefits, tools, and flexible work practices that support focused product work.",
    href: "/careers/perks",
    icon: Gem,
  },
  {
    title: "Values",
    text: "Understand how Growblic thinks about speed, quality, ownership, and client success.",
    href: "/careers/values",
    icon: Sparkles,
  },
  {
    title: "Culture",
    text: "Learn how our team works, communicates, learns, and ships premium digital products.",
    href: "/careers/culture",
    icon: HeartHandshake,
  },
  {
    title: "Insights",
    text: "Read how we approach design, software delivery, automation, and product quality.",
    href: "/careers/insights",
    icon: Lightbulb,
  },
  {
    title: "Humans",
    text: "Meet the people, stories, and mindset behind the Growblic careers experience.",
    href: "/careers/humans",
    icon: Users,
  },
];

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.12),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.10),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
              Careers at Growblic
            </p>
            <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Grow your career by building real digital products.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
              Join Growblic and work on premium websites, mobile apps, SaaS products,
              dashboards, automation systems, and real business software.
            </p>

            <div className="mt-10 grid max-w-4xl gap-5 md:grid-cols-[1fr_1fr]">
              <div className="flex h-16 items-center rounded-2xl border border-blue-100 bg-white px-5 text-sm font-bold tracking-[0.10em] text-slate-500 shadow-xl shadow-blue-100/50">
                seek and you shall find
              </div>
              <Link
                href="/careers/openings"
                className="flex h-16 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black uppercase tracking-[0.18em] text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Discover roles <span className="ml-4 text-xl">→</span>
              </Link>
            </div>
          </div>

          <Scroll3DSection>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/82 p-8 shadow-[0_28px_90px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/70 backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/45 blur-3xl" />
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

              return (
                <Scroll3DSection key={item.title} delay={index * 0.04}>
                  <Link
                    href={item.href}
                    className="group relative flex h-full min-h-64 flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-xl shadow-blue-100/55 ring-1 ring-blue-100/70 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/75"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-200/45 blur-3xl transition group-hover:bg-cyan-200/55" />
                    <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-blue-50/80 text-blue-700 shadow-lg shadow-blue-100/70">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="relative mt-6 text-2xl font-black tracking-tight text-slate-950">
                      {item.title}
                    </h3>
                    <p className="relative mt-4 flex-1 text-sm font-semibold leading-7 text-slate-600">
                      {item.text}
                    </p>
                    <span className="relative mt-6 inline-flex w-fit items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition group-hover:bg-blue-700">
                      Explore <span className="ml-2">→</span>
                    </span>
                  </Link>
                </Scroll3DSection>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
