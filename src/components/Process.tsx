"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Understand",
    text: "Business goals, users, workflows, and product direction.",
    image: "/growblic-website01/images/process/research-unique.jpg",
  },
  {
    number: "02",
    title: "Design",
    text: "Premium UI, clean screens, dashboards, and mobile flows.",
    image: "/growblic-website01/images/process/uiux-unique.jpg",
  },
  {
    number: "03",
    title: "Build",
    text: "Frontend systems, APIs, SaaS modules, and automation.",
    image: "/growblic-website01/images/process/code-unique.jpg",
  },
  {
    number: "04",
    title: "Launch",
    text: "Testing, polish, deployment, and real-user readiness.",
    image: "/growblic-website01/images/process/deploy-unique.jpg",
  },
  {
    number: "05",
    title: "Improve",
    text: "Analytics, upgrades, support, optimization, and growth.",
    image: "/growblic-website01/images/process/growth-unique.jpg",
  },
];

export default function Process() {
  return (
    <section className="how-build-section relative overflow-hidden bg-[#fbfdff] px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_85%_90%,rgba(6,182,212,0.08),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="how-build-header mb-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              How we build
            </p>

            <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-slate-950 md:text-6xl">
              A smooth path from idea to product.
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            We keep every step clean, focused, and production-ready — from first
            planning to launch and support.
          </p>
        </div>

        <div className="how-build-frame relative overflow-hidden rounded-[2.7rem] border border-blue-100/70 bg-[#fbfdff]/90 p-3 shadow-2xl shadow-slate-200/75 backdrop-blur-xl">
          <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="how-build-scroll relative grid grid-cols-5 gap-3">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="how-build-card group relative h-[360px] overflow-hidden rounded-[2rem] border border-blue-100/70 bg-slate-100 shadow-xl shadow-blue-100/50 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="240px"
                  className="will-change-transform object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={index === 0}
                  unoptimized
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/86 via-slate-950/25 to-transparent" />

                <div className="how-build-number absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/20 bg-[#fbfdff]/18 text-xs font-black text-white shadow-xl backdrop-blur-xl">
                  {step.number}
                </div>

                <div className="how-build-content absolute bottom-4 left-4 right-4">
                  <div className="how-build-copy rounded-[1.35rem] border border-white/20 bg-[#fbfdff]/16 p-3.5 text-white shadow-2xl backdrop-blur-xl">
                    <h3 className="how-build-title text-2xl font-black tracking-tight">
                      {step.title}
                    </h3>

                    <p className="how-build-text mt-2 text-xs font-semibold leading-5 text-white/78">
                      {step.text}
                    </p>

                    <div className="mt-4 h-1.5 w-12 rounded-full bg-[#fbfdff]/35 transition-all duration-500 ease-out group-hover:w-20 group-hover:bg-[#fbfdff]" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
