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
    <section id="process" className="how-build-section relative overflow-hidden bg-[#fbfdff] px-6 py-20 sm:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(239,246,255,0.84),rgba(255,255,255,0.96)_42%,rgba(239,246,255,0.68)),radial-gradient(circle_at_15%_12%,rgba(37,99,235,0.13),transparent_30%),radial-gradient(circle_at_86%_76%,rgba(14,165,233,0.12),transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="how-build-header mb-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
              How we build
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              A smooth path from idea to product.
            </h2>
          </div>

          <p className="max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg lg:justify-self-end">
            We keep every step focused, premium, and production-ready, with a
            clear path from first planning to launch and long-term improvement.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 right-8 top-12 hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.42, delay: index * 0.05 }}
              >
                <Link
                  href={step.href}
                  aria-label={`Open ${step.title} process guide`}
                  className="group relative flex min-h-[250px] h-full flex-col overflow-hidden rounded-[1.65rem] border border-blue-100/80 bg-white/88 p-5 shadow-xl shadow-blue-100/45 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-100/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:p-6"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,246,255,0.92),rgba(255,255,255,0)_58%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute -right-12 -top-14 h-32 w-32 rounded-full bg-blue-100/75 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative flex items-center justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-sm font-black text-blue-700 shadow-sm shadow-blue-100">
                      {step.number}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-sm shadow-blue-100 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </span>
                  </div>

                  <div className="relative mt-10 flex flex-1 flex-col">
                    <h3 className="text-2xl font-black tracking-tight text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                      {step.text}
                    </p>
                    <div className="mt-auto pt-7">
                      <div className="h-1.5 w-12 rounded-full bg-blue-100 transition-all duration-300 group-hover:w-20 group-hover:bg-blue-600" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.42, delay: 0.1 }}
          className="mt-8 overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/88 p-6 shadow-2xl shadow-blue-100/55 backdrop-blur sm:mt-10 sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Have an idea?
              </h3>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                Let Growblic turn it into a real product.
              </p>
            </div>

            <Link
              href="/start-project"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Start Project →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
