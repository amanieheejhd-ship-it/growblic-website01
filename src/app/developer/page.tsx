import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  Bot,
  Braces,
  DatabaseZap,
  FileCode2,
  LayoutDashboard,
  PlugZap,
  TerminalSquare,
  Workflow,
} from "lucide-react";

const scopeLinks = [
  { label: "APIs", href: "#api-reference", icon: Braces },
  { label: "Integrations", href: "#integrations", icon: PlugZap },
  { label: "Dashboards", href: "#developer-docs", icon: LayoutDashboard },
  { label: "Automation", href: "#automation", icon: Bot },
];

const developerCards = [
  {
    id: "developer-docs",
    number: "01",
    title: "Developer Docs",
    text: "Technical planning notes for dashboards, portals, workflows, and software products built with Growblic.",
    icon: FileCode2,
    href: "/process",
  },
  {
    id: "api-reference",
    number: "02",
    title: "API Reference",
    text: "Plan API-ready dashboards, business systems, integrations, and automation workflows with Growblic.",
    icon: Braces,
    href: "/software",
  },
  {
    id: "code-components",
    number: "03",
    title: "Code Components",
    text: "Reusable UI patterns, admin panels, product modules, and scalable frontend components for real products.",
    icon: Blocks,
    href: "/saas-products",
  },
  {
    id: "integrations",
    number: "04",
    title: "Integrations",
    text: "Connect CRMs, payment gateways, analytics, forms, ads tools, email flows, and business operations.",
    icon: PlugZap,
    href: "/ai-automation",
  },
];

const capabilityCards = [
  {
    id: "automation",
    title: "Automation workflows",
    text: "Smart forms, CRM updates, notifications, reports, and internal workflows that reduce repeated work.",
    icon: Workflow,
  },
  {
    id: "dashboards",
    title: "Admin dashboards",
    text: "Clean dashboards with roles, analytics, team workflows, and business control panels.",
    icon: LayoutDashboard,
  },
  {
    id: "databases",
    title: "Data systems",
    text: "Secure records, customer profiles, inventory, orders, and scalable product data models.",
    icon: DatabaseZap,
  },
];

export default function DeveloperPage() {
  return (
    <main className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_88%_58%,rgba(6,182,212,0.11),transparent_32%),linear-gradient(180deg,#ffffff,rgba(239,246,255,0.56),#ffffff)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div className="min-w-0">
            <p className="inline-flex max-w-full break-words rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)] sm:px-5 sm:tracking-[0.32em]">
              Growblic Developer
            </p>

            <h1 className="mt-7 max-w-5xl break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl sm:leading-[0.96] lg:text-7xl">
              Build smarter software systems with Growblic.
            </h1>

            <p className="mt-7 max-w-3xl text-lg font-semibold leading-9 text-slate-600">
              Plan and build dashboards, APIs, integrations, admin tools, and automation workflows for real business operations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/start-project"
                className="inline-flex min-w-0 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-center text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Project <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/price-calculator"
                className="inline-flex min-w-0 items-center justify-center gap-3 rounded-full border border-blue-100 bg-white/86 px-7 py-4 text-center text-sm font-black text-slate-950 shadow-xl shadow-blue-100/55 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Estimate Project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative min-w-0 overflow-hidden rounded-[2rem] border border-blue-100 bg-white/82 p-5 shadow-[0_28px_85px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-6 h-52 w-52 rounded-full bg-cyan-100/70 blur-3xl" />

            <p className="relative break-words text-xs font-black uppercase tracking-[0.18em] text-blue-700 sm:tracking-[0.32em]">
              Developer Scope
            </p>

            <div className="relative mt-6 grid gap-3">
              {scopeLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/86 px-5 py-4 font-black text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-[0_18px_50px_rgba(37,99,235,0.12)]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 break-words">{item.label}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {developerCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.id}
                id={card.id}
                href={card.href}
                className="group relative min-h-[250px] min-w-0 overflow-hidden rounded-[1.7rem] border border-blue-100 bg-white/80 p-5 shadow-[0_20px_65px_rgba(37,99,235,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_30px_85px_rgba(37,99,235,0.14)] sm:p-6"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-50 via-cyan-50/70 to-transparent" />

                <div className="relative flex items-center justify-between">
                  <span className="text-sm font-black tracking-[0.24em] text-blue-700">
                    {card.number}
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <h2 className="relative mt-8 break-words text-2xl font-black tracking-tight text-slate-950">
                  {card.title}
                </h2>

                <p className="relative mt-4 break-words text-sm font-semibold leading-7 text-slate-600">
                  {card.text}
                </p>

                <div className="relative mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                  Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {capabilityCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                id={card.id}
                className="group min-w-0 rounded-[1.7rem] border border-blue-100 bg-white/82 p-5 shadow-[0_20px_65px_rgba(37,99,235,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_30px_85px_rgba(37,99,235,0.14)] sm:p-6"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/15 transition group-hover:bg-blue-700">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-7 break-words text-2xl font-black tracking-tight text-slate-950">
                  {card.title}
                </h3>

                <p className="mt-4 break-words text-sm font-semibold leading-7 text-slate-600">
                  {card.text}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-12 rounded-[2rem] border border-blue-100 bg-white/82 p-7 shadow-[0_25px_85px_rgba(37,99,235,0.10)] backdrop-blur-2xl sm:p-8">
          <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-700 sm:tracking-[0.32em]">
                Build with Growblic
              </p>
              <h2 className="mt-4 max-w-3xl break-words text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Need a dashboard, API, or automation workflow?
              </h2>
            </div>

            <Link
              href="/price-calculator"
              className="inline-flex w-fit items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Estimate Project <TerminalSquare className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
