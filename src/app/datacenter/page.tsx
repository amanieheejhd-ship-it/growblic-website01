import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cloud,
  CloudCog,
  CloudUpload,
  Code2,
  Database,
  DatabaseBackup,
  GitBranch,
  Globe,
  HardDrive,
  LockKeyhole,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from "lucide-react";
import Footer from "@/components/Footer";
import BackButton from "../../components/BackButton";
import DatacenterCoverage from "@/components/DatacenterCoverage";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic Datacenter",
  description:
    "Cloud-ready hosting, deployment, backend API, database, monitoring, security, and backup planning support for modern digital products.",
  path: "/datacenter",
});

const consoleItems = [
  { label: "Hosting", status: "Frontend and domains", icon: Cloud },
  { label: "Backend APIs", status: "Node.js and integrations", icon: ServerCog },
  { label: "Databases", status: "Schema and backup planning", icon: Database },
  { label: "Monitoring", status: "Logs and launch checks", icon: Activity },
  { label: "Security", status: "HTTPS and secret handling", icon: ShieldCheck },
];

const capabilityCards = [
  {
    title: "Web Hosting Support",
    text: "Plan and prepare static websites, marketing pages, product sites, and frontend deployments for a clean public launch.",
    icon: CloudUpload,
  },
  {
    title: "Backend API Deployment",
    text: "Set up practical deployment paths for Node.js APIs, authentication flows, integrations, and service configuration.",
    icon: Code2,
  },
  {
    title: "Database Planning",
    text: "Choose database options, map data needs, structure connection settings, and plan safe backup workflows.",
    icon: Database,
  },
  {
    title: "Monitoring & Logs",
    text: "Add launch checks, error visibility, log review habits, and practical issue tracking for production handoff.",
    icon: Activity,
  },
  {
    title: "Security Setup",
    text: "Prepare HTTPS, environment variables, access-aware settings, domain guidance, and safer deployment practices.",
    icon: LockKeyhole,
  },
  {
    title: "Backup & Recovery Planning",
    text: "Define backup expectations, restore awareness, rollback steps, and sensible recovery planning for the stack.",
    icon: DatabaseBackup,
  },
];

const foundationItems = [
  "Static websites",
  "SaaS platforms",
  "Mobile app backends",
  "Admin dashboards",
  "Automation systems",
];

const workflowSteps = [
  {
    title: "Plan",
    text: "Review traffic needs, frontend/backend split, data flows, domain setup, and launch constraints.",
  },
  {
    title: "Configure",
    text: "Prepare environments, secrets, database connections, deployment settings, and provider-specific options.",
  },
  {
    title: "Deploy",
    text: "Ship the website, app, API, or dashboard through a clean deployment path with launch checks.",
  },
  {
    title: "Monitor",
    text: "Review logs, errors, uptime signals, feedback loops, and backup routines after launch.",
  },
];

const deploymentPaths = [
  { title: "GitHub Pages", text: "Static websites and export-ready frontend pages.", icon: GitBranch },
  { title: "Render", text: "Managed hosting paths for APIs and web services.", icon: CloudCog },
  { title: "Vercel", text: "Frontend deployments and modern web app hosting.", icon: Globe },
  { title: "Node.js APIs", text: "Backend runtimes, routes, environment setup, and deployment checks.", icon: TerminalSquare },
  { title: "PostgreSQL", text: "Relational data planning, connection settings, and backup awareness.", icon: Database },
  { title: "Cloud storage", text: "Media, document, and asset storage planning for product workflows.", icon: HardDrive },
];

const securityItems = [
  "Environment variables and secret handling",
  "HTTPS and domain setup guidance",
  "Database backup planning",
  "Error monitoring and launch checks",
  "Safe deployment process",
];

export default function DatacenterPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-5 py-14 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(6,182,212,0.10),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fbff_50%,#ffffff_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.032)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(180deg,black,transparent_82%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.26em] text-blue-700 shadow-[0_14px_34px_rgba(37,99,235,0.08)]">
                GROWBLIC DATACENTER
              </p>

              <h1 className="mt-7 max-w-4xl text-5xl font-extrabold leading-[1.04] tracking-tight text-slate-950 lg:text-6xl">
                Cloud-ready infrastructure for modern digital products.
              </h1>

              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
                Growblic helps businesses plan, deploy, and manage reliable hosting,
                backend APIs, databases, security workflows, and launch-ready cloud setups.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-slate-950"
                >
                  Start Project <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white/86 px-7 py-4 text-sm font-extrabold text-slate-800 shadow-xl shadow-blue-100/45 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                >
                  Explore Services <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/78 p-5 shadow-[0_28px_90px_rgba(37,99,235,0.13)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-6">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-100/75 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-4 h-56 w-56 rounded-full bg-cyan-100/60 blur-3xl" />

              <div className="relative rounded-[1.45rem] border border-blue-100 bg-slate-950/[0.03] p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-700">
                      Cloud Console
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Launch planning overview
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Ready
                  </span>
                </div>

                <div className="grid gap-3">
                  {consoleItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="group flex items-center gap-4 rounded-2xl border border-blue-100/80 bg-white/88 p-4 shadow-[0_12px_36px_rgba(37,99,235,0.07)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_48px_rgba(37,99,235,0.12)]"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                          <Icon className="h-5 w-5" strokeWidth={1.9} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-bold text-slate-900">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-sm font-medium text-slate-500">
                            {item.status}
                          </span>
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(37,99,235,0.55)]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-16 sm:mt-20">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-blue-700">
                Cloud capabilities
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 lg:text-5xl">
                Practical infrastructure services for launch-ready products.
              </h2>
              <p className="mt-4 text-base font-medium leading-8 text-slate-600">
                Growblic helps choose and configure the moving parts behind websites,
                apps, SaaS platforms, dashboards, and automation systems.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {capabilityCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="group flex h-full min-h-[17rem] flex-col rounded-[1.65rem] border border-blue-100/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,251,255,0.92)_52%,rgba(239,246,255,0.76))] p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)] ring-1 ring-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_82px_rgba(37,99,235,0.14)]"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-[linear-gradient(145deg,#ffffff,#eff6ff)] text-blue-700 shadow-[0_14px_34px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/80 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.85} />
                    </span>
                    <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-950">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm font-medium leading-7 text-slate-600">
                      {card.text}
                    </p>
                    <Link
                      href="/services"
                      className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-blue-700 transition hover:text-slate-950"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          <DatacenterCoverage />

          <section className="relative mt-16 grid overflow-hidden rounded-[2rem] border border-blue-100/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(248,251,255,0.92)_48%,rgba(236,254,255,0.72))] p-6 shadow-[0_24px_80px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
            <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-cyan-100/60 blur-3xl" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
                Product foundation
              </span>
              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-950 lg:text-5xl">
                Build on the right foundation.
              </h2>
              <p className="mt-5 text-base font-medium leading-8 text-slate-600">
                Different products need different hosting paths. Growblic keeps the
                infrastructure plan aligned with the product stage, budget, data needs,
                traffic expectations, and maintenance reality.
              </p>
            </div>

            <div className="relative mt-8 grid gap-3 lg:mt-0">
              {foundationItems.map((item, index) => (
                <div
                  key={item}
                  className="group flex items-center gap-4 rounded-2xl border border-blue-100/80 bg-white/86 p-4 shadow-[0_12px_34px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_48px_rgba(37,99,235,0.11)]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-700 ring-1 ring-blue-100">
                    0{index + 1}
                  </span>
                  <span className="text-base font-bold text-slate-900">{item}</span>
                  <CheckCircle2 className="ml-auto h-5 w-5 text-blue-600" strokeWidth={1.9} />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-blue-700">
                Infrastructure workflow
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 lg:text-5xl">
                From cloud plan to monitored launch.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="relative flex h-full min-h-[14rem] flex-col rounded-[1.5rem] border border-blue-100/80 bg-white/88 p-5 shadow-[0_18px_54px_rgba(37,99,235,0.08)] ring-1 ring-white/80 transition hover:-translate-y-1 hover:border-blue-200"
                >
                  <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-blue-700">
                  Deployment paths
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 lg:text-5xl">
                  Support for popular deployment paths.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-medium leading-7 text-slate-600">
                These are technologies Growblic can help integrate or use when they fit
                the project. This does not imply official partnership.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deploymentPaths.map((path) => {
                const Icon = path.icon;

                return (
                  <article
                    key={path.title}
                    className="group flex h-full gap-4 rounded-[1.45rem] border border-blue-100/80 bg-white/88 p-5 shadow-[0_16px_48px_rgba(37,99,235,0.07)] ring-1 ring-white/80 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.12)]"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <span>
                      <h3 className="text-lg font-bold text-slate-950">{path.title}</h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                        {path.text}
                      </p>
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="relative mt-16 overflow-hidden rounded-[2rem] border border-blue-100/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.86),rgba(236,254,255,0.72))] p-6 shadow-[0_24px_80px_rgba(37,99,235,0.11)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-blue-700">
                  Reliability planning
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 lg:text-5xl">
                  Security, backup, and reliability.
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-slate-600">
                  Growblic helps teams prepare safer launch routines without pretending
                  every project needs enterprise-scale infrastructure on day one.
                </p>
              </div>

              <div className="grid gap-3">
                {securityItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-blue-100/80 bg-white/86 p-4 text-sm font-bold text-slate-700 shadow-[0_12px_34px_rgba(37,99,235,0.06)]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                      <ShieldCheck className="h-4 w-4" strokeWidth={1.9} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-16 overflow-hidden rounded-[2rem] border border-blue-100/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.90),rgba(219,234,254,0.76))] p-8 shadow-[0_24px_80px_rgba(37,99,235,0.12)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <Workflow className="h-5 w-5" strokeWidth={1.9} />
                </div>
                <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-950 lg:text-5xl">
                  Ready to launch your product on a reliable setup?
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600">
                  Share your website, app, SaaS, or automation idea. Growblic can help
                  choose the right hosting path and prepare the product for launch.
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
