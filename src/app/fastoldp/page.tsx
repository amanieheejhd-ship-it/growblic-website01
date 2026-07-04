import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Boxes,
  Calculator,
  Headphones,
  Layers3,
  LifeBuoy,
  MessageCircle,
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
  { label: "Contact Support", href: "/support" },
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
  {
    title: "Contact Growblic",
    description: "Send project details and connect with the Growblic team.",
    href: "/start-project",
    icon: MessageCircle,
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
        <section className="relative px-5 py-16 sm:px-6 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(6,182,212,0.12),transparent_28%),linear-gradient(180deg,rgba(239,246,255,0.86),rgba(255,255,255,0.98)_46%,rgba(239,246,255,0.42))]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.26em] text-blue-700 shadow-lg shadow-blue-100/60">
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
                          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-1 hover:bg-blue-700"
                          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blue-100 bg-white/90 px-6 py-3 text-sm font-black text-slate-700 shadow-lg shadow-blue-100/50 transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700"
                      }
                    >
                      {action.label}
                      <ArrowRight size={16} />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/90 bg-white/82 p-6 shadow-[0_24px_90px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-200/80">
                    <Zap size={28} />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                      Growblic help hub
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Move from question to next step.
                    </h2>
                  </div>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {["Plan", "Price", "Support"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-blue-100/80 bg-[#fbfdff] p-4 text-center shadow-lg shadow-blue-100/40"
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
              </div>
            </div>

            <section className="mt-16 rounded-[2rem] border border-blue-100/80 bg-white p-7 shadow-xl shadow-blue-100/50 sm:p-9">
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

            <section className="mt-16">
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

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      className="group rounded-[2rem] border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-100/45 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70"
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 shadow-lg shadow-blue-100/60 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon size={23} />
                      </span>
                      <h3 className="mt-8 text-2xl font-black text-slate-950">
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

            <section className="mt-16 rounded-[2rem] border border-blue-100/80 bg-white/88 p-7 shadow-xl shadow-blue-100/45 backdrop-blur-xl sm:p-9">
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
                    className="group flex min-h-16 items-center justify-between rounded-2xl border border-blue-100 bg-[#fbfdff] px-5 py-4 text-sm font-black text-slate-700 shadow-md shadow-blue-100/40 transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700"
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

            <section className="mt-16 rounded-[2rem] border border-slate-900/10 bg-gradient-to-r from-slate-950 to-blue-950 p-7 text-white shadow-[0_28px_90px_rgba(15,23,42,0.28)] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-cyan-200 ring-1 ring-white/15">
                    <Headphones size={24} />
                  </span>
                  <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                    Ready to move faster with Growblic?
                  </h2>
                  <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-blue-100">
                    Share your idea, required features, timeline, and budget
                    range. Growblic can guide you with the right next step.
                  </p>
                </div>
                <Link
                  href="/start-project"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-black text-slate-950 shadow-xl shadow-black/15 transition hover:-translate-y-1 hover:text-blue-700"
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
