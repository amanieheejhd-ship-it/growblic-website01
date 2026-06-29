"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Understand",
    text: "We clarify goals, users, workflows, and the product direction before anything is built.",
    href: "/process/understand",
  },
  {
    number: "02",
    title: "Design",
    text: "We shape clean screens, user flows, dashboards, and interactions that feel simple.",
    href: "/process/design",
  },
  {
    number: "03",
    title: "Build",
    text: "We develop reliable websites, apps, SaaS modules, APIs, and automation systems.",
    href: "/process/build",
  },
  {
    number: "04",
    title: "Launch",
    text: "We test, polish, deploy, and prepare the product for real customers and teams.",
    href: "/process/launch",
  },
  {
    number: "05",
    title: "Improve",
    text: "We keep improving performance, features, support, analytics, and growth opportunities.",
    href: "/process/improve",
  },
];

export default function Process() {
  return (
    <section id="process" className="how-build-section relative overflow-hidden bg-[#fbfdff] px-6 py-16 sm:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(239,246,255,0.72),rgba(255,255,255,0.96)_44%,rgba(239,246,255,0.58))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="how-build-header mb-9 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
              How we build
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              A smooth path from idea to product.
            </h2>
          </div>

          <p className="max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg lg:justify-self-end">
            We keep every step clean, focused, and production-ready, from first
            planning to launch and support.
          </p>
        </div>

        <div className="rounded-[2rem] border border-blue-100/80 bg-white/70 p-3 shadow-2xl shadow-blue-100/45 backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => {
              const isLastCard = index === steps.length - 1;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.36, delay: index * 0.04 }}
                  className={isLastCard ? "h-full sm:col-span-2 lg:col-span-1" : "h-full"}
                >
                  <Link
                    href={step.href}
                    aria-label={`Open ${step.title} process guide`}
                    className="group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-[1.45rem] border border-blue-100/80 bg-white p-5 shadow-lg shadow-blue-100/35 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:p-6"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,246,255,0.82),rgba(255,255,255,0)_62%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative flex items-center justify-between gap-4">
                      <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-black tracking-[0.16em] text-blue-700 shadow-sm shadow-blue-100/70">
                        {step.number}
                      </span>
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-blue-100 bg-white text-blue-600 transition duration-300 group-hover:translate-x-0.5 group-hover:bg-blue-600 group-hover:text-white">
                        <ArrowRight size={15} strokeWidth={2.5} />
                      </span>
                    </div>

                    <div className="relative mt-8 flex flex-1 flex-col">
                      <h3 className="text-xl font-black tracking-tight text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                        {step.text}
                      </p>
                      <div className="mt-auto pt-6">
                        <div className="h-1 w-10 rounded-full bg-blue-100 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-600" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.36, delay: 0.08 }}
          className="mt-5 rounded-[1.35rem] border border-blue-100/80 bg-white/80 px-5 py-4 shadow-lg shadow-blue-100/35 backdrop-blur sm:mt-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-black tracking-tight text-slate-950">
              Have an idea?
            </h3>

            <Link
              href="/start-project"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Start Project →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
