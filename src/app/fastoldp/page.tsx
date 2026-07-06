import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Bug,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  CreditCard,
  Gauge,
  Globe2,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  PackageCheck,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Fastoldp by Growblic | Quick Access",
  description:
    "Fastoldp is Growblic's premium quick access page for services, pricing direction, products, support, and project guidance.",
  path: "/fastoldp",
});

type LinkCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
};

type DirectionOption = {
  label: string;
  href: string;
  text: string;
  icon: LucideIcon;
};

const heroActions = [
  { label: "Start Project", href: "/start-project" },
  { label: "Estimate Price", href: "/price-calculator" },
  { label: "Talk to Support", href: "/support" },
];

const trustBadges = ["35+ Live Apps", "50+ Projects Delivered", "24/7 Support Ready"];

const quickActions: LinkCard[] = [
  {
    title: "I want a Website",
    description: "Reach a premium business, landing page, or service website path.",
    href: "/website-development",
    cta: "Open website direction",
    icon: Globe2,
  },
  {
    title: "I want a Mobile App",
    description: "Plan iOS, Android, dashboard, login, API, and launch needs.",
    href: "/mobile-apps",
    cta: "Open app direction",
    icon: Smartphone,
  },
  {
    title: "I want Custom Software",
    description: "Turn internal workflows into useful tools, portals, and dashboards.",
    href: "/custom-software",
    cta: "Open software direction",
    icon: Code2,
  },
  {
    title: "I want a SaaS Product",
    description: "Shape subscriptions, user roles, modules, billing, and admin panels.",
    href: "/saas",
    cta: "Open SaaS direction",
    icon: LayoutDashboard,
  },
  {
    title: "I want AI Automation",
    description: "Automate support, content, lead handling, workflows, and reporting.",
    href: "/ai-automation",
    cta: "Open AI direction",
    icon: Bot,
  },
  {
    title: "I want SEO / Marketing",
    description: "Move toward discoverability, ranking, campaigns, and growth support.",
    href: "/seo-services",
    cta: "Open marketing direction",
    icon: Megaphone,
  },
  {
    title: "I want App Support / Bug Fix",
    description: "Report problems, request updates, and get deployment help.",
    href: "/support",
    cta: "Open support",
    icon: LifeBuoy,
  },
  {
    title: "I want to Check Pricing",
    description: "Get budget direction before you share the full project scope.",
    href: "/price-calculator",
    cta: "Open calculator",
    icon: Calculator,
  },
];

const directionOptions: DirectionOption[] = [
  {
    label: "Website",
    href: "/website-development",
    text: "Best for a brand website, landing page, service pages, or SEO-ready company presence.",
    icon: Globe2,
  },
  {
    label: "App",
    href: "/mobile-apps",
    text: "Best for a customer app, vendor app, booking flow, login system, or mobile-first product.",
    icon: Smartphone,
  },
  {
    label: "SaaS",
    href: "/saas",
    text: "Best for a product with users, plans, dashboards, roles, subscriptions, and repeat workflows.",
    icon: LayoutDashboard,
  },
  {
    label: "Software",
    href: "/custom-software",
    text: "Best for operations, admin panels, CRM flows, internal tools, and workflow automation.",
    icon: BriefcaseBusiness,
  },
  {
    label: "AI Automation",
    href: "/ai-automation",
    text: "Best for automating repetitive tasks, support replies, data handling, and team workflows.",
    icon: BrainCircuit,
  },
  {
    label: "SEO",
    href: "/seo-services",
    text: "Best for search visibility, content structure, local discovery, and growth campaigns.",
    icon: SearchCheck,
  },
];

const pricingCards = [
  {
    title: "Website",
    label: "Starting direction",
    text: "Depends on pages, content, forms, SEO structure, and required features.",
  },
  {
    title: "Mobile App",
    label: "Estimate range",
    text: "Depends on platform, screens, login, dashboard, APIs, and release needs.",
  },
  {
    title: "Software",
    label: "Custom estimate",
    text: "Scoped around workflow complexity, automation, roles, reports, and integrations.",
  },
  {
    title: "SaaS",
    label: "Custom estimate",
    text: "Based on modules, users, dashboard, billing, permissions, and scale needs.",
  },
  {
    title: "SEO",
    label: "Monthly plan",
    text: "Planned around goals, competition, content needs, and ranking priorities.",
  },
];

const popularServices: LinkCard[] = [
  {
    title: "Website Development",
    description: "Premium responsive websites for trust, clarity, and enquiries.",
    href: "/website-development",
    cta: "View service",
    icon: Globe2,
  },
  {
    title: "Software Development",
    description: "Custom systems, dashboards, portals, and workflow tools.",
    href: "/software",
    cta: "View service",
    icon: Code2,
  },
  {
    title: "Mobile App Development",
    description: "Mobile product planning, screens, backend flows, and launch support.",
    href: "/mobile-apps",
    cta: "View service",
    icon: Smartphone,
  },
  {
    title: "SaaS Product Development",
    description: "Subscription-ready platforms with users, modules, and dashboards.",
    href: "/saas",
    cta: "View service",
    icon: LayoutDashboard,
  },
  {
    title: "AI Automation",
    description: "Smarter workflows for support, data, operations, and content.",
    href: "/ai-automation",
    cta: "View service",
    icon: Bot,
  },
  {
    title: "SEO Services",
    description: "Search structure, local discovery, content direction, and growth.",
    href: "/seo-services",
    cta: "View service",
    icon: SearchCheck,
  },
  {
    title: "Google Ads",
    description: "Campaign direction for demand capture and lead generation.",
    href: "/google-ads-management",
    cta: "View service",
    icon: MousePointerClick,
  },
  {
    title: "Meta Ads",
    description: "Ad direction for Facebook, Instagram, retargeting, and offers.",
    href: "/meta-ads-management",
    cta: "View service",
    icon: Megaphone,
  },
  {
    title: "GMB Rating & Reviews",
    description: "Business profile growth support for visibility and trust signals.",
    href: "/gmb-rating-reviews",
    cta: "View service",
    icon: BadgeCheck,
  },
  {
    title: "Cloud Deployment",
    description: "Hosting, deployment, uptime direction, and cloud setup support.",
    href: "/datacenter",
    cta: "View service",
    icon: Cloud,
  },
];

const productShortcuts = [
  { title: "Business Apps", icon: BriefcaseBusiness },
  { title: "Education Apps", icon: GraduationCap },
  { title: "Booking Apps", icon: CheckCircle2 },
  { title: "Billing Apps", icon: CreditCard },
  { title: "Productivity Tools", icon: Gauge },
  { title: "Security Tools", icon: ShieldCheck },
];

const supportCards = [
  { title: "Report a bug", icon: Bug },
  { title: "Request update", icon: PackageCheck },
  { title: "Need deployment help", icon: Cloud },
  { title: "Need website change", icon: Wrench },
  { title: "Need app support", icon: Smartphone },
  { title: "Talk to Growblic", icon: MessageCircle },
];

const processSteps = [
  {
    title: "Share idea",
    text: "Tell Growblic what you want to build, improve, automate, or fix.",
  },
  {
    title: "Get scope",
    text: "Turn the idea into pages, modules, features, users, and priorities.",
  },
  {
    title: "Estimate budget",
    text: "Get a practical direction before committing to the full build.",
  },
  {
    title: "Start build",
    text: "Move into design, development, testing, deployment, and support.",
  },
];

const faqs = [
  {
    question: "Which service is right for me?",
    answer:
      "Start with the project type selector. If you need a public presence, choose Website. If users need to log in, transact, or use workflows, choose App, SaaS, or Software.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Website pricing depends on pages, content, design depth, SEO needs, forms, integrations, and custom features. Use the calculator for direction.",
  },
  {
    question: "Can Growblic build mobile apps?",
    answer:
      "Yes. Growblic can guide mobile app builds with screens, login flows, dashboards, APIs, deployment, and support planning.",
  },
  {
    question: "Do you provide support after delivery?",
    answer:
      "Yes. Support can include fixes, updates, deployment help, improvements, and guidance based on the project scope.",
  },
  {
    question: "Can I get SEO with website?",
    answer:
      "Yes. Growblic can plan SEO-ready page structure, metadata direction, content sections, and growth support with a website build.",
  },
  {
    question: "How fast can a project start?",
    answer:
      "Start time depends on scope clarity, content readiness, features, and priority. Sharing the idea first helps Growblic guide the fastest next step.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-[0_18px_48px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-[0_24px_60px_rgba(37,99,235,0.22)]"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blue-100 bg-white/90 px-6 py-3 text-sm font-black text-slate-700 shadow-[0_14px_38px_rgba(37,99,235,0.10)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:text-blue-700"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function ActionCard({ item }: { item: LinkCard }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="group relative flex min-h-64 flex-col overflow-hidden rounded-[1.75rem] border border-blue-100/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:bg-white hover:shadow-[0_28px_76px_rgba(37,99,235,0.16)] sm:p-6"
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-100/50 blur-3xl transition duration-300 group-hover:bg-blue-100/70" />
      <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 shadow-lg shadow-blue-100/70 ring-1 ring-blue-100 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="relative mt-6 text-xl font-black leading-tight text-slate-950">
        {item.title}
      </h3>
      <p className="relative mt-3 flex-1 text-sm font-semibold leading-6 text-slate-600">
        {item.description}
      </p>
      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-black text-blue-700">
        {item.cta}
        <ChevronRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function FastoldpPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#fbfdff] pt-24 text-slate-950">
        <section className="relative px-5 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_4%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_86%_10%,rgba(6,182,212,0.13),transparent_28%),linear-gradient(180deg,rgba(239,246,255,0.88),rgba(255,255,255,0.98)_42%,rgba(248,252,255,0.96))]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.86fr] lg:items-center">
              <div>
                <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-700 shadow-lg shadow-blue-100/60">
                  Fastoldp by Growblic
                </p>
                <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
                  Find the right Growblic service in seconds.
                </h1>
                <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
                  Choose what you want to build and quickly reach pricing,
                  support, services, products, or project guidance.
                </p>
                <p className="mt-4 inline-flex rounded-full border border-cyan-100 bg-white/86 px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
                  Fastoldp — Fast Online Direction Page
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {heroActions.map((action, index) =>
                    index === 0 ? (
                      <PrimaryButton key={action.label} href={action.href}>
                        {action.label}
                      </PrimaryButton>
                    ) : (
                      <SecondaryButton key={action.label} href={action.href}>
                        {action.label}
                      </SecondaryButton>
                    ),
                  )}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {trustBadges.map((badge) => (
                    <div
                      key={badge}
                      className="rounded-2xl border border-blue-100 bg-white/88 px-4 py-3 text-sm font-black text-slate-700 shadow-md shadow-blue-100/40"
                    >
                      <span className="mr-2 text-blue-600">•</span>
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-blue-200/45 via-cyan-200/35 to-transparent blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white/82 p-5 shadow-[0_32px_100px_rgba(37,99,235,0.15)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-6">
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-100/70 blur-3xl" />
                  <div className="flex items-start gap-4">
                    <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-200/80">
                      <Zap className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                        Growblic Quick Access
                      </p>
                      <h2 className="mt-1 text-2xl font-black leading-tight text-slate-950">
                        One clean page for the next right click.
                      </h2>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {["Plan", "Price", "Support"].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-blue-100/80 bg-[#fbfdff]/90 p-4 text-center shadow-lg shadow-blue-100/35"
                      >
                        <p className="text-sm font-black text-slate-950">{item}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                          Fast access
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-cyan-100/80 bg-gradient-to-r from-blue-50/90 to-cyan-50/80 p-4">
                    <p className="text-sm font-bold leading-6 text-slate-600">
                      Fastoldp — Growblic Quick Access for service direction,
                      pricing guidance, products, and support without slowing
                      visitors down.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader title="What do you want to do?" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((item) => (
                <ActionCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white via-blue-50/55 to-white px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Project direction"
              title="What do you need?"
              text="Open a project type to see the clearest Growblic path, then jump straight to the right page."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {directionOptions.map((option, index) => {
                const Icon = option.icon;

                return (
                  <details
                    key={option.label}
                    open={index === 0}
                    className="group rounded-[1.5rem] border border-blue-100/80 bg-white/90 p-4 shadow-[0_18px_55px_rgba(37,99,235,0.10)] ring-1 ring-white/80 transition duration-300 open:border-blue-200 open:shadow-[0_26px_72px_rgba(37,99,235,0.15)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 rounded-[1.15rem] px-1 py-1">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition group-open:bg-blue-600 group-open:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 text-lg font-black text-slate-950">
                        {option.label}
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-blue-500 transition group-open:rotate-90" />
                    </summary>
                    <div className="mt-4 rounded-2xl border border-blue-100 bg-[#fbfdff] p-4">
                      <p className="text-sm font-semibold leading-6 text-slate-600">
                        {option.text}
                      </p>
                      <Link
                        href={option.href}
                        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                      >
                        Get project direction
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Pricing shortcut"
              title="Get pricing direction before you start"
              text="Use estimate language first, then refine the project after Growblic understands the scope."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {pricingCards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-blue-100/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.10)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white"
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                    {item.label}
                  </p>
                  <h3 className="mt-3 text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-9 text-center">
              <PrimaryButton href="/price-calculator">Open Price Calculator</PrimaryButton>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-blue-50/60 via-white to-white px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Popular services" title="Popular Growblic Services" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {popularServices.map((item) => (
                <ActionCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">
                Products
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
                Explore Growblic Products
              </h2>
              <p className="mt-5 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                Discover Growblic apps, tools, dashboards, and product ideas
                built for different business categories.
              </p>
              <div className="mt-7">
                <PrimaryButton href="/#products">View all apps</PrimaryButton>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {productShortcuts.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-blue-100/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.10)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white via-cyan-50/45 to-white px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Support"
              title="Need help with an existing project?"
              text="Choose the closest support need and reach the Growblic support route without searching around."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {supportCards.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href="/support"
                    className="group flex min-h-24 items-center gap-4 rounded-[1.5rem] border border-blue-100/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.10)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-base font-black text-slate-800">
                      {item.title}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-blue-500 transition group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
            <div className="mt-9 text-center">
              <PrimaryButton href="/support">Contact Support</PrimaryButton>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Process"
              title="How Growblic guides your project"
            />
            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-blue-100/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.10)] ring-1 ring-white/80"
                >
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-blue-50/55 via-white to-white px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <SectionHeader eyebrow="FAQ" title="Fast answers before you start" />
            <div className="mt-10 grid gap-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[1.5rem] border border-blue-100/80 bg-white/92 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.09)] ring-1 ring-white/80"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <HelpCircle className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 text-base font-black leading-6 text-slate-950 sm:text-lg">
                      {item.question}
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-blue-500 transition group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 border-t border-blue-100 pt-4 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 sm:pb-20">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/90 p-7 text-center shadow-[0_32px_100px_rgba(37,99,235,0.16)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_88%_100%,rgba(6,182,212,0.16),transparent_32%)]" />
            <div className="relative mx-auto max-w-4xl">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-200/80">
                <Rocket className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
                Ready to build with Growblic?
              </h2>
              <p className="mt-5 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                Share your idea and Growblic will guide you with the right
                service, timeline, and budget direction.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <PrimaryButton href="/start-project">Start Project</PrimaryButton>
                <SecondaryButton href="/price-calculator">
                  Open Price Calculator
                </SecondaryButton>
                <SecondaryButton href="/support">Contact Support</SecondaryButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
