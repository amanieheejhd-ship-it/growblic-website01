"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

const industries = [
  {
    title: "Financial Services",
    text: "Secure websites, dashboards, payment-ready workflows, lead systems, and data-aware product planning.",
    href: "/fintech-app",
    visual:
      "radial-gradient(circle at 30% 30%, #67e8f9 0 10%, transparent 24%), radial-gradient(circle at 70% 40%, #8b5cf6 0 9%, transparent 26%), linear-gradient(135deg,#0f172a,#1d4ed8 48%,#22d3ee)",
  },
  {
    title: "Healthcare & Clinics",
    text: "Appointment flows, patient enquiry forms, service pages, admin panels, and secure deployment planning.",
    href: "/services",
    visual:
      "radial-gradient(circle at 25% 35%, #ffffff 0 8%, transparent 22%), radial-gradient(circle at 70% 45%, #bae6fd 0 12%, transparent 28%), linear-gradient(135deg,#eff6ff,#dff7ff 45%,#93c5fd)",
  },
  {
    title: "Government & Public Services",
    text: "Information portals, citizen enquiry workflows, document pages, dashboards, and reliable hosting paths.",
    href: "/custom-software",
    visual:
      "repeating-linear-gradient(90deg,rgba(15,23,42,.12) 0 6px,transparent 6px 18px), linear-gradient(135deg,#f8fafc,#dbeafe,#bfdbfe)",
  },
  {
    title: "Telecommunications",
    text: "Customer portals, plan pages, support workflows, admin dashboards, and monitoring-ready deployments.",
    href: "/software",
    visual:
      "radial-gradient(circle at 35% 30%, #a855f7 0 10%, transparent 28%), radial-gradient(circle at 70% 55%, #2563eb 0 9%, transparent 26%), linear-gradient(135deg,#1e1b4b,#312e81,#06b6d4)",
  },
  {
    title: "Advertising & Marketing",
    text: "Campaign pages, lead funnels, analytics dashboards, CRM flows, and conversion-focused websites.",
    href: "/google-ads-management",
    visual:
      "radial-gradient(circle at 30% 45%, #facc15 0 10%, transparent 24%), radial-gradient(circle at 65% 35%, #ec4899 0 12%, transparent 28%), linear-gradient(135deg,#22c55e,#67e8f9,#a855f7)",
  },
  {
    title: "Manufacturing",
    text: "Product catalogues, vendor dashboards, inventory flows, operations portals, and backend planning.",
    href: "/custom-software",
    visual:
      "radial-gradient(circle at 70% 25%, #7dd3fc 0 10%, transparent 24%), linear-gradient(135deg,#0f172a,#1d4ed8 45%,#93c5fd)",
  },
  {
    title: "Media & Entertainment",
    text: "Creator platforms, event pages, content systems, media workflows, and scalable launch architecture.",
    href: "/mobile-apps",
    visual:
      "radial-gradient(circle at 20% 35%, #f472b6 0 8%, transparent 24%), radial-gradient(circle at 70% 45%, #22d3ee 0 8%, transparent 24%), linear-gradient(135deg,#020617,#4c1d95,#1d4ed8)",
  },
  {
    title: "Games & Community",
    text: "Game landing pages, community products, profile systems, leaderboards, and mobile backend support.",
    href: "/mobile-apps",
    visual:
      "radial-gradient(circle at 25% 40%, #60a5fa 0 9%, transparent 23%), radial-gradient(circle at 70% 35%, #f59e0b 0 11%, transparent 28%), linear-gradient(135deg,#0f172a,#7c3aed,#22d3ee)",
  },
  {
    title: "Education Platforms",
    text: "Course websites, class dashboards, mentor panels, assignments, notes, and student progress workflows.",
    href: "/apps/classta",
    visual:
      "radial-gradient(circle at 30% 30%, #bfdbfe 0 12%, transparent 26%), linear-gradient(135deg,#ffffff,#dbeafe,#93c5fd)",
  },
  {
    title: "Retail & Ecommerce",
    text: "Product pages, order flows, enquiry systems, vendor panels, and customer support dashboards.",
    href: "/products",
    visual:
      "radial-gradient(circle at 35% 35%, #fbbf24 0 10%, transparent 24%), radial-gradient(circle at 72% 42%, #22d3ee 0 11%, transparent 28%), linear-gradient(135deg,#f8fafc,#dbeafe,#60a5fa)",
  },
  {
    title: "Real Estate",
    text: "Property listing platforms, enquiry workflows, saved properties, verification flows, and admin panels.",
    href: "/apps/property-dost",
    visual:
      "radial-gradient(circle at 70% 30%, #38bdf8 0 9%, transparent 24%), linear-gradient(135deg,#f8fafc,#bfdbfe,#2563eb)",
  },
  {
    title: "Local Services",
    text: "Booking apps, profile pages, appointment systems, calls, chat flows, and service management dashboards.",
    href: "/apps/fresh-fade",
    visual:
      "radial-gradient(circle at 35% 30%, #22d3ee 0 10%, transparent 26%), radial-gradient(circle at 70% 55%, #8b5cf6 0 10%, transparent 28%), linear-gradient(135deg,#eff6ff,#bfdbfe,#06b6d4)",
  },
  {
    title: "SaaS Startups",
    text: "MVP launches, tenant-ready dashboards, authentication flows, APIs, databases, and deployment setup.",
    href: "/saas-products",
    visual:
      "radial-gradient(circle at 35% 45%, #60a5fa 0 10%, transparent 26%), linear-gradient(135deg,#0f172a,#2563eb,#67e8f9)",
  },
  {
    title: "Travel & Hospitality",
    text: "Booking pages, hotel/service listings, enquiry forms, customer portals, and admin workflows.",
    href: "/services",
    visual:
      "radial-gradient(circle at 28% 35%, #fde68a 0 10%, transparent 25%), linear-gradient(135deg,#eff6ff,#7dd3fc,#3b82f6)",
  },
  {
    title: "Logistics & Delivery",
    text: "Order tracking, delivery dashboards, vendor panels, route planning screens, and backend support.",
    href: "/custom-software",
    visual:
      "radial-gradient(circle at 75% 35%, #22d3ee 0 10%, transparent 25%), linear-gradient(135deg,#f8fafc,#bfdbfe,#1d4ed8)",
  },
  {
    title: "HR & Payroll",
    text: "Employee profiles, attendance, payslips, reports, approval flows, and business admin dashboards.",
    href: "/apps/payroll-hr",
    visual:
      "radial-gradient(circle at 30% 40%, #a78bfa 0 10%, transparent 25%), linear-gradient(135deg,#ffffff,#dbeafe,#8b5cf6)",
  },
  {
    title: "Security Products",
    text: "Credential tools, authentication flows, 2FA/TOTP products, encrypted notes, and secure setup planning.",
    href: "/apps/true-auth",
    visual:
      "radial-gradient(circle at 30% 35%, #22d3ee 0 9%, transparent 25%), linear-gradient(135deg,#020617,#1e3a8a,#06b6d4)",
  },
  {
    title: "Automation Systems",
    text: "Internal tools, AI automation flows, dashboards, integrations, alerts, and practical business workflows.",
    href: "/ai-automation",
    visual:
      "radial-gradient(circle at 32% 38%, #60a5fa 0 9%, transparent 25%), radial-gradient(circle at 70% 42%, #f472b6 0 10%, transparent 26%), linear-gradient(135deg,#111827,#2563eb,#22d3ee)",
  },
];

export default function DatacenterIndustries() {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredIndustries = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return industries;

    return industries.filter((industry) =>
      `${industry.title} ${industry.text}`.toLowerCase().includes(value)
    );
  }, [query]);

  const visibleIndustries = filteredIndustries.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredIndustries.length;

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2.25rem] border border-blue-100 bg-white/72 p-5 shadow-[0_30px_100px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.42em] text-blue-600">
              Industries
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">
              Infrastructure support for every business category.
            </h2>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              Explore how Growblic plans websites, apps, SaaS products, dashboards,
              backend APIs, and cloud-ready workflows for different industries.
            </p>
          </div>

          <Link
            href="/start-project"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-blue-100 bg-white/85 px-5 py-3 text-sm font-extrabold text-blue-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Explore your industry <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-3 border-b border-blue-100 pb-4">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(8);
            }}
            placeholder="Search industry"
            className="w-full bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        <p className="mt-6 text-sm font-mono text-slate-700">
          Displaying {visibleIndustries.length ? 1 : 0}-{visibleIndustries.length} ({filteredIndustries.length})
        </p>

        <div className="mt-7 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {visibleIndustries.map((industry) => (
            <article
              key={industry.title}
              className="group overflow-hidden rounded-[1.55rem] border border-blue-100/80 bg-white/78 shadow-[0_24px_80px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-[0_38px_110px_rgba(37,99,235,0.18)]"
            >
              <div
                className="relative h-44 overflow-hidden rounded-b-[1.25rem]"
                style={{ backgroundImage: industry.visual }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_45%,rgba(255,255,255,0.2))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.45),transparent_30%)]" />
                <div className="absolute -bottom-10 left-8 h-28 w-28 rounded-full border border-white/35 bg-white/10 backdrop-blur-sm transition duration-300 group-hover:scale-110" />
              </div>

              <div className="p-7">
                <h3 className="text-xl font-extrabold tracking-tight text-slate-950">
                  {industry.title}
                </h3>
                <p className="mt-3 min-h-[4.5rem] text-sm font-semibold leading-7 text-slate-600">
                  {industry.text}
                </p>

                <Link
                  href={industry.href}
                  className="mt-7 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-white/85 px-4 py-2.5 text-sm font-extrabold text-slate-900 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  View industry <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {canShowMore ? (
          <div className="mt-9 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 8)}
              className="rounded-full border border-blue-100 bg-white/90 px-7 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Show 8 more
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
