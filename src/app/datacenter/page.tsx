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
      <section className="relative px-6 py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(37,99,235,0.11),transparent_30%),radial-gradient(circle_at_88%_32%,rgba(6,182,212,0.10),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.32em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)]">
                Growblic Datacenter
              </p>

              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.07em] text-slate-950 sm:text-6xl lg:text-7xl">
                Growblic Datacenter
              </h1>

              <p className="mt-7 max-w-3xl text-lg font-semibold leading-9 text-slate-600">
                Reliable infrastructure for secure, scalable digital products.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Project <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/security"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white/86 px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/55 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                >
                  Security Overview <LockKeyhole className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/82 p-6 shadow-[0_28px_85px_rgba(37,99,235,0.12)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-6 h-52 w-52 rounded-full bg-cyan-100/70 blur-3xl" />

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
                      className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-sm"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-base font-black text-slate-950">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm font-bold text-slate-500">
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
                  className="group rounded-[1.7rem] border border-blue-100 bg-white/82 p-6 shadow-[0_20px_65px_rgba(37,99,235,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_30px_85px_rgba(37,99,235,0.14)]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/15 transition group-hover:bg-blue-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-7 text-2xl font-black tracking-[-0.04em] text-slate-950">
                    {card.title}
                  </h2>
                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {card.text}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="mt-16 grid gap-8 rounded-[2rem] border border-blue-100 bg-white/86 p-7 shadow-[0_25px_85px_rgba(37,99,235,0.10)] backdrop-blur-2xl lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-700">
                Why Growblic Datacenter Matters
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
                Infrastructure should support the product, not distract from it.
              </h2>
              <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
                Growblic keeps hosting and deployment practical: clear enough for first launch,
                structured enough to grow, and honest about the tradeoffs between temporary
                testing setups and long-term production systems.
              </p>
            </div>

            <div className="grid gap-3">
              {reliabilityPoints.map((point) => (
                <div
                  key={point}
                  className="flex gap-3 rounded-2xl border border-blue-100 bg-white/90 p-4 text-sm font-bold leading-6 text-slate-600 shadow-sm"
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  {point}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 overflow-hidden rounded-[2rem] border border-blue-100 bg-slate-950 p-8 text-white shadow-[0_30px_95px_rgba(15,23,42,0.24)] sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-200">
                  Deployment & Hosting Support
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                  Planning a reliable launch for your next digital product?
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-300">
                  Share your website, app, SaaS, or automation idea. Growblic can help choose
                  the right hosting path and prepare the product for a clean launch.
                </p>
              </div>

              <Link
                href="/start-project"
                className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:text-blue-700"
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
