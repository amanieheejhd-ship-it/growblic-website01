"use client";

import { services } from "@/data/services";
import { motion } from "framer-motion";

const serviceBenefits: Record<string, string[]> = {
  "Custom Software Development": [
    "Business workflows",
    "Admin dashboards",
    "Scalable architecture",
  ],
  "Mobile App Development": [
    "Android & iOS apps",
    "Admin dashboard",
    "Play Store support",
  ],
  "SaaS Product Development": [
    "User onboarding",
    "Roles & permissions",
    "Subscription-ready flow",
  ],
  "AI Automation Solutions": [
    "Workflow automation",
    "Chatbots",
    "Business process tools",
  ],
  "CRM / ERP Development": [
    "Sales pipelines",
    "Inventory workflows",
    "Reporting systems",
  ],
  "Dashboard & Admin Panel Development": [
    "Operational dashboards",
    "Team controls",
    "Clean data views",
  ],
  "Website Development": [
    "Business websites",
    "Landing pages",
    "SEO-ready structure",
  ],
  "UI/UX Design": [
    "Product wireframes",
    "Premium interfaces",
    "Conversion-focused flows",
  ],
  "API Integration": [
    "Payment gateways",
    "CRM connections",
    "Messaging systems",
  ],
  "Cloud & Deployment": [
    "Production hosting",
    "Release setup",
    "Maintenance support",
  ],
};

export default function Services({ compact = false }: { compact?: boolean }) {
  const visible = compact ? services.slice(0, 6) : services;

  return (
    <section className="relative bg-[#fbfdff] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Services</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
            Premium software services for serious product work.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.035 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group flex h-full flex-col rounded-[1.75rem] border border-blue-100/70 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl shadow-slate-900/6 transition hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#050505] text-white shadow-lg shadow-slate-950/15 transition group-hover:bg-blue-600">
                  <Icon size={23} />
                </span>
                <h3 className="mt-7 text-xl font-semibold text-[#111827]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f6673]">{service.description}</p>
                <ul className="mt-6 grid gap-2 text-sm font-semibold text-slate-600">
                  {(serviceBenefits[service.title] ?? []).map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
