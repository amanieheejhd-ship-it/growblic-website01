"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

const industries = [
  {
    title: "Financial Services",
    text: "Secure websites, dashboards, payment-ready workflows, lead systems, and data-aware product planning.",
    href: "/fintech-app",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Healthcare & Clinics",
    text: "Appointment flows, patient enquiry forms, service pages, admin panels, and secure deployment planning.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Government & Public Services",
    text: "Information portals, citizen enquiry workflows, document pages, dashboards, and reliable hosting paths.",
    href: "/custom-software",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Telecommunications",
    text: "Customer portals, plan pages, support workflows, admin dashboards, and monitoring-ready deployments.",
    href: "/software",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Advertising & Marketing",
    text: "Campaign pages, lead funnels, analytics dashboards, CRM flows, and conversion-focused websites.",
    href: "/google-ads-management",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Manufacturing",
    text: "Product catalogues, vendor dashboards, inventory flows, operations portals, and backend planning.",
    href: "/custom-software",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Media & Entertainment",
    text: "Creator platforms, event pages, content systems, media workflows, and scalable launch architecture.",
    href: "/mobile-apps",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Games & Community",
    text: "Game landing pages, community products, profile systems, leaderboards, and mobile backend support.",
    href: "/mobile-apps",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Education Platforms",
    text: "Course websites, class dashboards, mentor panels, assignments, notes, and student progress workflows.",
    href: "/apps/classta",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Retail & Ecommerce",
    text: "Product pages, order flows, enquiry systems, vendor panels, and customer support dashboards.",
    href: "/products",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Real Estate",
    text: "Property listing platforms, enquiry workflows, saved properties, verification flows, and admin panels.",
    href: "/apps/property-dost",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Local Services",
    text: "Booking apps, profile pages, appointment systems, calls, chat flows, and service management dashboards.",
    href: "/apps/fresh-fade",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "SaaS Startups",
    text: "MVP launches, tenant-ready dashboards, authentication flows, APIs, databases, and deployment setup.",
    href: "/saas-products",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Travel & Hospitality",
    text: "Booking pages, hotel/service listings, enquiry forms, customer portals, and admin workflows.",
    href: "/services",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Logistics & Delivery",
    text: "Order tracking, delivery dashboards, vendor panels, route planning screens, and backend support.",
    href: "/custom-software",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "HR & Payroll",
    text: "Employee profiles, attendance, payslips, reports, approval flows, and business admin dashboards.",
    href: "/apps/payroll-hr",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Security Products",
    text: "Credential tools, authentication flows, 2FA/TOTP products, encrypted notes, and secure setup planning.",
    href: "/apps/true-auth",
    image: "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Automation Systems",
    text: "Internal tools, AI automation flows, dashboards, integrations, alerts, and practical business workflows.",
    href: "/ai-automation",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function DatacenterIndustries() {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

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
      <div className="min-w-0 rounded-[2.25rem] border border-blue-100 bg-white/72 p-4 shadow-[0_30px_100px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-8">
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
              setVisibleCount(6);
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
              <div className="relative h-44 overflow-hidden rounded-b-[1.25rem] bg-slate-100">
                <img
                  src={industry.image}
                  alt={`${industry.title} industry`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/5 to-white/10" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
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
              onClick={() => setVisibleCount((count) => count + 6)}
              className="rounded-full border border-blue-100 bg-white/90 px-7 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Show 6 more
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
