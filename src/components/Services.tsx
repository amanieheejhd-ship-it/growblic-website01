"use client";

import { services } from "@/data/services";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TiltCard } from "./Scroll3DSection";

export default function Services({ compact = false }: { compact?: boolean }) {
  const visible = compact ? services.slice(0, 6) : services;

  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(37,99,235,0.11),transparent_30%),radial-gradient(circle_at_88%_24%,rgba(6,182,212,0.09),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
          <p className="inline-flex rounded-full border border-blue-100 bg-white/86 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 shadow-lg shadow-blue-100/45 backdrop-blur">Services</p>
          <h2 className="mt-5 text-balance text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Premium services for websites, software, apps, SaaS, and growth.
          </h2>
          </div>
          <p className="max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg lg:justify-self-end">
            Clear planning, polished interfaces, reliable engineering, and practical growth support for businesses that want serious digital products.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 38, rotateX: 7, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.035 }}
                className="h-full"
                style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
              >
                <TiltCard className="group relative flex h-full min-h-[390px] flex-col overflow-hidden rounded-[2rem] border border-blue-100/75 bg-white/88 p-7 shadow-[0_24px_85px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-xl transition hover:border-blue-200 hover:bg-white hover:shadow-[0_34px_110px_rgba(37,99,235,0.15)]">
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-cyan-100" />
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-200 opacity-65 transition group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition group-hover:bg-blue-600 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                      <Icon size={23} />
                    </span>
                    <span className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-blue-700 shadow-sm shadow-blue-100/40">
                      Service
                    </span>
                  </div>

                  <h3 className="relative mt-7 text-2xl font-black leading-tight text-slate-950">
                    {service.title}
                  </h3>
                  <p className="relative mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {service.description}
                  </p>

                  <ul className="relative mt-6 flex flex-wrap gap-2 text-sm font-bold text-slate-600">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs font-black text-slate-700">
                        <CheckCircle2 className="shrink-0 text-blue-600" size={15} />
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
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
