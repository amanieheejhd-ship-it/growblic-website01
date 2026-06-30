import {
  ArrowRight,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  Globe2,
  Layers3,
  Smartphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "About Growblic - Software Development Company",
  description:
    "Learn how Growblic helps businesses move from idea to launch with premium websites, mobile apps, SaaS products, dashboards, automation systems, and business software.",
  path: "/about",
});

const buildAreas = [
  {
    title: "Website Development",
    text: "Premium websites and landing pages that explain your offer clearly and convert visitors into leads.",
    icon: Globe2,
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
    icon: ChartNoAxesCombined,
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

const processSteps = ["Understand", "Design", "Build", "Launch", "Improve"];

const trustPoints = [
  "Clean UI that feels premium and easy to use.",
  "Scalable development choices that leave room to grow.",
  "Product-first thinking from idea to launch.",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-16 sm:py-18 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.11),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(239,246,255,0.34))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_50%_22%,black,transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-9 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700 shadow-sm shadow-blue-100/60 backdrop-blur-xl">
                About Growblic
              </p>

              <h1 className="mt-6 max-w-5xl text-balance text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                Building software products that help businesses grow.
              </h1>

              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                Growblic is a software development company that builds websites,
                mobile apps, SaaS products, dashboards, automation systems, and
                business software for teams that want to move from idea to launch with clarity.
              </p>

              <div className="mt-7 grid gap-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-blue-100/80 bg-white/82 p-4 text-sm font-bold leading-6 text-slate-700 shadow-lg shadow-blue-100/35 backdrop-blur-xl transition duration-300 hover:border-blue-200 hover:bg-white hover:shadow-blue-100/55"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-blue-600" size={19} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.25rem] border border-blue-100/70 bg-white/82 p-3 shadow-2xl shadow-blue-100/45 backdrop-blur-2xl sm:p-4">
              <div className="relative overflow-hidden rounded-[1.85rem] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-7 text-white shadow-xl shadow-slate-950/15 sm:p-8">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30 [mask-image:radial-gradient(circle_at_50%_20%,black,transparent_72%)]" />
                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-cyan-400/16 blur-3xl" />

                <div className="relative">
                  <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-xl shadow-black/20">
                    <Image
                      src="/growblic-website01/images/brand/growblic-logo.png"
                      alt="Growblic"
                      fill
                      sizes="80px"
                      className="rounded-full object-cover"
                    />
                  </span>

                  <p className="mt-9 text-xs font-black uppercase tracking-[0.26em] text-cyan-200">
                    Company story
                  </p>

                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                    From business idea to digital product.
                  </h2>

                  <p className="mt-5 max-w-md text-base font-semibold leading-8 text-white/74">
                    Growblic brings product thinking, UI design, frontend craft,
                    scalable development, and launch support into one focused build process.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {["Plan", "Build", "Launch"].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center text-sm font-black shadow-sm shadow-black/10 backdrop-blur"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="group rounded-[1.75rem] border border-blue-100/80 bg-white/82 p-6 shadow-xl shadow-blue-100/35 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-blue-100/55 sm:p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/60">
                <Sparkles size={22} />
              </span>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Mission
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                Help businesses launch useful software with less confusion.
              </h2>
              <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
                Our mission is to turn requirements into clean, practical digital products:
                websites that build trust, apps that simplify journeys, dashboards that
                clarify operations, and automation that saves time.
              </p>
            </article>

            <article className="group rounded-[1.75rem] border border-blue-100/80 bg-white/82 p-6 shadow-xl shadow-blue-100/35 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-blue-100/55 sm:p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-100 bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-100/60">
                <TrendingUp size={22} />
              </span>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Vision
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                Become a trusted product partner for growing businesses.
              </h2>
              <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
                We want Growblic to be known for premium UI, reliable engineering,
                scalable systems, and a calm process that helps founders and teams
                move confidently from first idea to live product.
              </p>
            </article>
          </div>

          <div className="mt-14">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                What we build
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Digital products for real business workflows.
              </h2>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {buildAreas.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group relative overflow-hidden rounded-[1.6rem] border border-blue-100/75 bg-white/82 p-5 shadow-lg shadow-blue-100/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-100/55"
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100/55 blur-2xl transition group-hover:bg-cyan-100/70" />
                    <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/60">
                      <Icon size={21} />
                    </span>
                    <h3 className="relative mt-5 text-xl font-black leading-tight text-slate-950">
                      {item.title}
                    </h3>
                    <p className="relative mt-3 text-sm font-semibold leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-14 rounded-[2rem] border border-blue-100/80 bg-white/82 p-5 shadow-2xl shadow-blue-100/40 backdrop-blur-xl sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                  Growblic process
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                  A smooth path from idea to product.
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-5 lg:min-w-[620px]">
                {processSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-blue-100 bg-[#fbfdff]/90 px-4 py-4 text-center shadow-sm shadow-blue-100/35 transition duration-300 hover:border-blue-200 hover:bg-white"
                  >
                    <p className="text-xs font-black text-blue-600">0{index + 1}</p>
                    <p className="mt-2 text-sm font-black text-slate-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 overflow-hidden rounded-[2.25rem] border border-blue-100/80 bg-white/86 shadow-2xl shadow-blue-100/45 backdrop-blur-xl">
            <div className="relative p-7 sm:p-9 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_92%_20%,rgba(6,182,212,0.09),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0),rgba(239,246,255,0.68))]" />
              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                    Start with Growblic
                  </p>
                  <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                    Ready to build your next digital product?
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/start-project"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Start Project →
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blue-100/70 bg-white px-7 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
                  >
                    Explore Services
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
