"use client";

import { services } from "@/data/services";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Services({ compact = false }: { compact?: boolean }) {
  const visible = compact ? services.slice(0, 6) : services;

  return (
    <section className="relative bg-[#fbfdff] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Services</p>
          <h2 className="mt-4 text-balance text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Premium services for websites, software, apps, SaaS, and growth.
          </h2>
          <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
            Clear planning, polished interfaces, reliable engineering, and practical growth support for businesses that want serious digital products.
          </p>
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
                className="group relative flex h-full min-h-[390px] flex-col overflow-hidden rounded-[1.9rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-slate-900/6 transition hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-cyan-100" />
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500 opacity-0 transition group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition group-hover:bg-blue-600">
                    <Icon size={23} />
                  </span>
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-blue-700">
                    Service
                  </span>
                </div>

                <h3 className="relative mt-7 text-2xl font-black leading-tight text-slate-950">
                  {service.title}
                </h3>
                <p className="relative mt-4 text-sm font-semibold leading-7 text-slate-600">
                  {service.description}
                </p>

                <ul className="relative mt-6 grid gap-3 text-sm font-bold text-slate-600">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-blue-600" size={17} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="relative mt-auto inline-flex items-center gap-2 pt-7 text-sm font-black text-blue-700 transition group-hover:gap-3 group-hover:text-slate-950"
                >
                  View service
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
