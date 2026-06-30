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
    text: "Reduce repeated work with smart forms, notifications, CRM updates, reporting flows, and internal tools.",
    icon: Workflow,
  },
  {
    id: "dashboards",
    title: "Admin dashboards",
    text: "Role-based dashboards, clean analytics, team workflows, and business control panels.",
    icon: LayoutDashboard,
  },
  {
    id: "databases",
    title: "Data systems",
    text: "Structured data, secure records, customer profiles, inventory, orders, and scalable product models.",
    icon: DatabaseZap,
  },
];

export default function DeveloperPage() {
  return (
    <main className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_8%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_92%_70%,rgba(6,182,212,0.14),transparent_32%),linear-gradient(180deg,#ffffff,rgba(239,246,255,0.58),#ffffff)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.32em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)]">
              Growblic Developer
            </p>

            <h1 className="mt-7 max-w-5xl text-6xl font-black leading-[0.90] tracking-[-0.08em] text-slate-950 sm:text-7xl lg:text-8xl">
              APIs, integrations, dashboards, and automation systems.
            </h1>

            <p className="mt-7 max-w-3xl text-lg font-semibold leading-9 text-slate-600">
              Growblic helps teams design and build developer-friendly software foundations:
              admin systems, integrations, internal tools, APIs, and automated workflows.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/start-project"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Project <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white/86 px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/55 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Contact Growblic <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/80 p-6 shadow-[0_30px_90px_rgba(37,99,235,0.13)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-200/45 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-6 h-52 w-52 rounded-full bg-cyan-100/70 blur-3xl" />

            <p className="relative text-xs font-black uppercase tracking-[0.32em] text-blue-700">
              Developer Scope
            </p>

            <div className="relative mt-6 grid gap-3">
              {scopeLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between rounded-2xl border border-blue-100 bg-white/80 px-5 py-4 font-black text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 hover:shadow-[0_18px_50px_rgba(37,99,235,0.12)]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
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
                className="group relative min-h-[280px] overflow-hidden rounded-[1.8rem] border border-blue-100 bg-white/78 p-7 shadow-[0_24px_75px_rgba(37,99,235,0.09)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_34px_95px_rgba(37,99,235,0.15)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-50 via-cyan-50/70 to-transparent" />
                <div className="relative flex items-center justify-between">
                  <span className="text-sm font-black tracking-[0.24em] text-blue-700">
                    {card.number}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/15 transition group-hover:scale-105 group-hover:bg-blue-700">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <h2 className="relative mt-10 text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {card.title}
                </h2>

                <p className="relative mt-5 text-sm font-semibold leading-7 text-slate-600">
                  {card.text}
                </p>

                <div className="relative mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                  Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-12 overflow-hidden rounded-[2.2rem] border border-blue-100 bg-slate-950 p-8 text-white shadow-[0_35px_110px_rgba(15,23,42,0.20)] sm:p-10">
          <div className="pointer-events-none absolute inset-0" />
          <div className="grid gap-5 lg:grid-cols-3">
            {capabilityCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.id}
                  id={card.id}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition hover:bg-white/[0.09]"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-2xl font-black tracking-[-0.04em]">
                    {card.title}
                  </h3>

                  <p className="mt-4 text-sm font-semibold leading-7 text-white/70">
                    {card.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-blue-100 bg-white/82 p-7 shadow-[0_25px_85px_rgba(37,99,235,0.10)] backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-700">
                Build with Growblic
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.06em] text-slate-950">
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
