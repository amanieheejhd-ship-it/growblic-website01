import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Boxes,
  Calculator,
  Headphones,
  Layers3,
  LifeBuoy,
  Rocket,
  SearchCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Fastoldp | Growblic",
  description:
    "Fast access to Growblic support, services, pricing guidance, project help, and resources.",
  path: "/fastoldp",
});

const heroActions = [
  { label: "Start Project", href: "/start-project" },
  { label: "Price Calculator", href: "/price-calculator" },
];

const quickActions = [
  {
    title: "Start a project",
    description: "Share your idea and get guided toward the right build plan.",
    href: "/start-project",
    icon: Rocket,
  },
  {
    title: "Estimate pricing",
    description: "Use the calculator to shape budget direction before a call.",
    href: "/price-calculator",
    icon: Calculator,
  },
  {
    title: "Explore services",
    description: "Find website, software, SaaS, app, SEO, and automation help.",
    href: "/services",
    icon: Layers3,
  },
  {
    title: "View apps/products",
    description: "Browse Growblic products, tools, and app experiences.",
    href: "/products",
    icon: Boxes,
  },
  {
    title: "Get support",
    description: "Reach support for updates, fixes, improvements, and guidance.",
    href: "/support",
    icon: LifeBuoy,
  },
];

const helpTopics = [
  { label: "Website Development", href: "/website-development" },
  { label: "Mobile Apps", href: "/mobile-apps" },
  { label: "SaaS Products", href: "/saas-products" },
  { label: "AI Automation", href: "/ai-automation" },
  { label: "SEO Services", href: "/seo-services" },
  { label: "Cloud Deployment", href: "/datacenter" },
];

export default function FastoldpPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#fbfdff] pt-24">
        <section className="relative px-5 py-14 sm:px-6 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_6%,rgba(37,99,235,0.13),transparent_28%),radial-gradient(circle_at_84%_14%,rgba(6,182,212,0.11),transparent_26%),linear-gradient(180deg,rgba(239,246,255,0.78),rgba(255,255,255,0.98)_42%,rgba(248,252,255,0.96))]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.86fr] lg:items-center">
              <div>
                <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-700 shadow-lg shadow-blue-100/60">
                  Premium Quick Access
                </p>
                <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  Fastoldp
                </h1>
                <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
                  Fast access to Growblic support, project guidance, pricing
                  help, and service information.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {heroActions.map((action, index) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={
                        index === 0
                          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
                          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blue-100 bg-white/92 px-6 py-3 text-sm font-black text-slate-700 shadow-lg shadow-blue-100/45 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:text-blue-700"
                      }
                    >
                      {action.label}
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white/80 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.13)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-6">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-100/70 blur-3xl" />
                <div className="flex items-center gap-4">
                  <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-200/80">
                    <Zap size={24} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                      Growblic help hub
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                      Move from question to next step.
                    </h2>
                  </div>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {["Plan", "Price", "Support"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-blue-100/80 bg-[#fbfdff]/90 p-4 text-center shadow-lg shadow-blue-100/35"
                    >
                      <p className="text-sm font-black text-slate-950">
                        {item}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        Fast access
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-cyan-100/80 bg-gradient-to-r from-blue-50/90 to-cyan-50/80 p-4">
                  <p className="text-sm font-bold leading-6 text-slate-600">
                    One page for service direction, pricing guidance, and
                    support routes without slowing the visitor down.
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-14 rounded-[2rem] border border-blue-100/80 bg-white/92 p-7 shadow-xl shadow-blue-100/45 backdrop-blur sm:p-9">
              <div className="max-w-4xl">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                  What is Fastoldp?
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  A focused shortcut for getting useful Growblic direction.
                </h2>
                <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">
                  Fastoldp is a quick-access Growblic help page where visitors
                  can quickly find the right service, project guidance, pricing
                  direction, support, and Growblic resources.
                </p>
              </div>
            </section>

            <section className="mt-14">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                    Quick actions
                  </p>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Choose your fastest path.
                  </h2>
                </div>
                <Sparkles className="hidden text-cyan-500 sm:block" size={34} />
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      className={`group relative overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-100/40 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/65 sm:min-h-72 lg:min-h-0 ${
                        index === 0
                          ? "sm:col-span-2 lg:col-span-2"
                          : "lg:col-span-1"
                      }`}
                    >
                      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 shadow-lg shadow-blue-100/60 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon size={23} />
                      </span>
                      <h3 className="mt-7 text-xl font-black leading-tight text-slate-950">
                        {action.title}
                      </h3>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                        {action.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                        Open
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="mt-14 rounded-[2rem] border border-blue-100/80 bg-white/88 p-7 shadow-xl shadow-blue-100/40 backdrop-blur-xl sm:p-9">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
                    Popular help topics
                  </p>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Find service guidance quickly.
                  </h2>
                </div>
                <SearchCheck className="hidden text-blue-500 sm:block" size={34} />
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {helpTopics.map((topic) => (
                  <Link
                    key={topic.label}
                    href={topic.href}
                    className="group flex min-h-16 items-center justify-between rounded-2xl border border-blue-100 bg-[#fbfdff]/95 px-5 py-4 text-sm font-black text-slate-700 shadow-md shadow-blue-100/35 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:text-blue-700 hover:shadow-lg hover:shadow-blue-100/60"
                  >
                    {topic.label}
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>
            </section>

            <section className="relative mt-14 overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/88 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.16)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_92%_90%,rgba(6,182,212,0.13),transparent_30%)]" />
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="relative">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 shadow-lg shadow-blue-100/60 ring-1 ring-blue-100">
                    <Headphones size={24} />
                  </span>
                  <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Ready to move faster with Growblic?
                  </h2>
                  <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600">
                    Share your idea, required features, timeline, and budget
                    range. Growblic can guide you with the right next step.
                  </p>
                </div>
                <Link
                  href="/start-project"
                  className="relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
                >
                  Start Project
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
