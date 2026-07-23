/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Code2,
  Layers3,
  Smartphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const trustPoints = [
  "Clean UI that feels premium and easy to use.",
  "Scalable development choices that leave room to grow.",
  "Product-first thinking from idea to launch.",
];

const storySteps = ["Plan", "Build", "Launch"];

const missionVision = [
  {
    label: "Mission",
    title: "Help businesses launch useful software with less confusion.",
    text: "Our mission is to turn requirements into clean, practical digital products: websites that build trust, apps that simplify journeys, dashboards that clarify operations, and automation that saves time.",
    icon: Sparkles,
    glow: "from-blue-500/16 via-sky-200/20 to-transparent",
  },
  {
    label: "Vision",
    title: "Become a trusted product partner for growing businesses.",
    text: "We want Growblic to be known for premium UI, reliable engineering, scalable systems, and a calm process that helps founders and teams move confidently from first idea to live product.",
    icon: TrendingUp,
    glow: "from-cyan-500/16 via-blue-100/20 to-transparent",
  },
];

const buildCards = [
  {
    title: "Website Development",
    text: "Premium websites and landing pages that explain your offer clearly and convert visitors into leads.",
    icon: Code2,
  },
  {
    title: "Mobile Apps",
    text: "Polished mobile app experiences for booking, ordering, tracking, payments, and customer engagement.",
    icon: Smartphone,
  },
  {
    title: "SaaS Platforms",
    text: "Scalable product systems with users, roles, dashboards, onboarding, and admin controls.",
    icon: Layers3,
  },
  {
    title: "Business Dashboards",
    text: "Clean reporting and operations dashboards that turn scattered data into confident decisions.",
    icon: BarChart3,
  },
  {
    title: "AI Automation",
    text: "Practical automation systems that reduce repeated work and help teams move faster.",
    icon: Bot,
  },
  {
    title: "Growth Systems",
    text: "SEO-ready pages, conversion flows, ads support, and digital systems built for business growth.",
    icon: TrendingUp,
  },
];

const process = ["Understand", "Design", "Build", "Launch", "Improve"];

export default function AboutPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_6%,rgba(37,99,235,0.13),transparent_30%),radial-gradient(circle_at_94%_60%,rgba(6,182,212,0.12),transparent_30%),linear-gradient(180deg,#ffffff,rgba(239,246,255,0.55),#ffffff)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative mx-auto max-w-[1800px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div className="min-w-0">
            <p className="inline-flex max-w-full break-words rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)] sm:px-5 sm:tracking-[0.32em]">
              About Growblic
            </p>

            <h1 className="mt-7 max-w-4xl break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
              Building software products that help businesses grow.
            </h1>

            <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg sm:leading-9">
              Growblic is a software development company that builds websites, mobile apps, SaaS products, dashboards, automation systems, and business software for teams that want to move from idea to launch with clarity.
            </p>

            <div className="mt-8 grid gap-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="group flex min-w-0 items-start gap-3 rounded-2xl border border-blue-100 bg-white/80 px-4 py-4 text-sm font-black text-slate-700 shadow-[0_16px_45px_rgba(37,99,235,0.07)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white sm:items-center sm:gap-4 sm:px-5"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 break-words">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-blue-200/45 via-cyan-100/35 to-transparent blur-2xl sm:-inset-4" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-blue-100 bg-white/80 p-4 shadow-[0_35px_110px_rgba(37,99,235,0.16)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[1.85rem] bg-slate-950 p-8 text-white shadow-2xl sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.35),transparent_36%),radial-gradient(circle_at_8%_90%,rgba(6,182,212,0.22),transparent_34%),linear-gradient(135deg,#020617,#13295f,#062f43)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:34px_34px]" />

                <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-black shadow-xl ring-1 ring-white/12">
                  <img src="https://play-lh.googleusercontent.com/g0grr8jGzVcS1_uUzh05Ht2a7w7PcavodUBDgK7XOel8DwYKNSVtNZaF6HmqUFPK37xlr4WafEddfvWeyeDSKA=w240-h480-rw" alt="Growblic" className="h-11 w-11 rounded-xl object-contain" />
                </div>

                <p className="relative mt-10 break-words text-xs font-black uppercase tracking-[0.18em] text-cyan-200 sm:tracking-[0.34em]">
                  Company Story
                </p>

                <h2 className="relative mt-6 max-w-xl break-words text-3xl font-black leading-tight sm:text-5xl">
                  From business idea to digital product.
                </h2>

                <p className="relative mt-6 max-w-xl text-base font-semibold leading-8 text-white/75">
                  Growblic brings product thinking, UI design, frontend craft, scalable development, and launch support into one focused build process.
                </p>

                <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
                  {storySteps.map((step) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-black text-white shadow-inner backdrop-blur-xl"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {missionVision.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                  className="group relative min-w-0 overflow-hidden rounded-[1.6rem] border border-blue-100 bg-white/78 p-5 shadow-[0_24px_75px_rgba(37,99,235,0.10)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_35px_95px_rgba(37,99,235,0.15)] sm:rounded-[2rem] sm:p-8"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r ${item.glow}`} />
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>

                <p className="relative mt-7 break-words text-xs font-black uppercase tracking-[0.2em] text-blue-700 sm:tracking-[0.32em]">
                  {item.label}
                </p>

                <h2 className="relative mt-4 break-words text-2xl font-black leading-tight text-slate-950 sm:text-4xl">
                  {item.title}
                </h2>

                <p className="relative mt-5 text-base font-semibold leading-8 text-slate-600">
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>

        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700 sm:tracking-[0.34em]">
            What we build
          </p>

          <h2 className="mt-5 max-w-4xl break-words text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
            Digital products for real business workflows.
          </h2>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buildCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group relative min-h-[220px] min-w-0 overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white/76 p-5 shadow-[0_18px_60px_rgba(37,99,235,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_28px_80px_rgba(37,99,235,0.14)] sm:rounded-[1.75rem] sm:p-6"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-50 via-cyan-50/70 to-transparent opacity-80" />
                  <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/15 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="relative mt-7 break-words text-xl font-black text-slate-950 sm:text-2xl">
                    {card.title}
                  </h3>

                  <p className="relative mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {card.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-blue-100 bg-white/82 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.10)] backdrop-blur-2xl sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-700 sm:tracking-[0.32em]">
                Growblic Process
              </p>
              <h2 className="mt-3 break-words text-3xl font-black tracking-tight text-slate-950">
                A smooth path from idea to product.
              </h2>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-5">
              {process.map((step, index) => (
                <div
                  key={step}
                  className="min-w-0 rounded-2xl border border-blue-100 bg-white px-5 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <p className="text-xs font-black text-blue-700">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-black text-slate-800">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-7 shadow-[0_25px_85px_rgba(37,99,235,0.10)] sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-700 sm:tracking-[0.32em]">
                Start with Growblic
              </p>
              <h2 className="mt-4 max-w-3xl break-words text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Ready to build your next digital product?
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/start-project"
                className="inline-flex min-w-0 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-center text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Project <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/services"
                className="inline-flex min-w-0 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-center text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
              >
                Explore Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
