import Link from "next/link";
import {
  ArrowRight,
  CloudCog,
  DatabaseBackup,
  Gauge,
  HardDrive,
  LockKeyhole,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import Footer from "@/components/Footer";
import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic Datacenter",
  description:
    "Reliable infrastructure for secure, scalable digital products with practical hosting, monitoring, backup, and deployment support from Growblic.",
  path: "/datacenter",
});

const overviewCards = [
  {
    title: "Infrastructure Overview",
    text: "Growblic plans hosting, storage, domains, application runtime, and database choices around the actual needs of each website, app, SaaS platform, or internal system.",
    icon: ServerCog,
  },
  {
    title: "Security & Monitoring",
    text: "Production systems should use HTTPS, environment-based secrets, access-aware workflows, practical logging, and monitoring that helps teams spot issues early.",
    icon: ShieldCheck,
  },
  {
    title: "Backup & Reliability",
    text: "Projects can be prepared with sensible backup planning, recovery awareness, deployment checks, and provider choices that match business risk and budget.",
    icon: DatabaseBackup,
  },
  {
    title: "Deployment & Hosting Support",
    text: "Growblic helps set up deploy-ready environments, static hosting, backend services, databases, DNS, and launch checklists without overcomplicating the stack.",
    icon: CloudCog,
  },
];

const reliabilityPoints = [
  "Hosting recommendations based on product scope and traffic expectations.",
  "Environment variables for secrets, API keys, databases, and deployment settings.",
  "Practical monitoring and issue-review workflows for production launches.",
  "Backup and restore planning appropriate to the project and provider.",
  "Static frontend, backend API, database, and domain setup support.",
];

export default function DatacenterPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(37,99,235,0.08),transparent_30%),radial-gradient(circle_at_88%_32%,rgba(6,182,212,0.08),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.028)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.74fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700 shadow-[0_12px_30px_rgba(37,99,235,0.08)]">
                Growblic Datacenter
              </p>

              <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-5xl">
                Growblic Datacenter
              </h1>

              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
                Reliable infrastructure for secure, scalable digital products.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-slate-950/12 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Project <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/security"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white/86 px-7 py-4 text-sm font-extrabold text-slate-800 shadow-xl shadow-blue-100/45 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                >
                  Security Overview <LockKeyhole className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/78 p-5 shadow-[0_24px_75px_rgba(37,99,235,0.10)] backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-100/65 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-6 h-52 w-52 rounded-full bg-cyan-100/55 blur-3xl" />

              <div className="relative grid gap-4">
                {[
                  { label: "Hosting", detail: "Static sites, APIs, databases", icon: HardDrive },
                  { label: "Performance", detail: "Launch checks and tuning", icon: Gauge },
                  { label: "Operations", detail: "Monitoring and recovery planning", icon: ServerCog },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-2xl border border-blue-100/80 bg-white/88 p-4 shadow-[0_12px_36px_rgba(37,99,235,0.06)]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-base font-bold text-slate-900">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm font-medium text-slate-500">
                          {item.detail}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <section className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group relative flex h-full min-h-[19rem] flex-col overflow-hidden rounded-[1.7rem] border border-blue-100/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,251,255,0.92)_48%,rgba(239,246,255,0.78))] p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-300 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-300/70 before:to-transparent after:pointer-events-none after:absolute after:-right-16 after:-top-16 after:h-36 after:w-36 after:rounded-full after:bg-blue-100/70 after:blur-3xl hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_30px_82px_rgba(37,99,235,0.14)]"
                >
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-[linear-gradient(145deg,#ffffff,#eff6ff)] text-blue-700 shadow-[0_14px_34px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/80 transition group-hover:-translate-y-0.5 group-hover:text-blue-600 group-hover:shadow-[0_18px_42px_rgba(37,99,235,0.18)]">
                    <Icon className="h-5 w-5" strokeWidth={1.85} />
                  </span>
                  <span className="relative mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-blue-500/70 via-cyan-400/70 to-transparent" />
                  <h2 className="relative mt-5 text-xl font-bold tracking-[-0.025em] text-slate-900">
                    {card.title}
                  </h2>
                  <p className="relative mt-4 text-sm font-medium leading-7 text-slate-600">
                    {card.text}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="relative mt-16 grid overflow-hidden rounded-[2.1rem] border border-blue-100/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(248,251,255,0.90)_48%,rgba(239,246,255,0.74))] p-7 shadow-[0_24px_80px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-10">
            <div className="pointer-events-none absolute -left-20 top-8 h-52 w-52 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-cyan-100/55 blur-3xl" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
                Launch-ready systems
              </span>
              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700">
                Why Growblic Datacenter Matters
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.12] tracking-[-0.035em] text-slate-900 lg:text-4xl xl:text-5xl">
                Infrastructure should support the product, not distract from it.
              </h2>
              <p className="mt-5 text-base font-medium leading-8 text-slate-600">
                Growblic keeps hosting and deployment practical: clear enough for first launch,
                structured enough to grow, and honest about the tradeoffs between temporary
                testing setups and long-term production systems.
              </p>
            </div>

            <div className="relative mt-8 grid gap-3 lg:mt-0">
              {reliabilityPoints.map((point) => (
                <div
                  key={point}
                  className="group flex gap-3 rounded-2xl border border-blue-100/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,251,255,0.86))] p-4 text-sm font-medium leading-6 text-slate-600 shadow-[0_12px_34px_rgba(37,99,235,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_48px_rgba(37,99,235,0.11)]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/80 bg-[linear-gradient(145deg,#ffffff,#eff6ff)] text-blue-600 shadow-sm ring-1 ring-blue-100/80 transition group-hover:text-blue-700">
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                  <span className="pt-1">{point}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 overflow-hidden rounded-[2rem] border border-blue-100/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.88),rgba(236,254,255,0.72))] p-8 shadow-[0_24px_80px_rgba(37,99,235,0.12)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-blue-700">
                  Deployment & Hosting Support
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.035em] text-slate-900 sm:text-4xl">
                  Planning a reliable launch for your next digital product?
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600">
                  Share your website, app, SaaS, or automation idea. Growblic can help choose
                  the right hosting path and prepare the product for a clean launch.
                </p>
              </div>

              <Link
                href="/start-project"
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
