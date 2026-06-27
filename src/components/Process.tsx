"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Understand",
    text: "Business goals, users, workflows, and product direction.",
    image: "/growblic-website01/images/process/research-unique.jpg",
    href: "/process/understand",
  },
  {
    number: "02",
    title: "Design",
    text: "Premium UI, clean screens, dashboards, and mobile flows.",
    image: "/growblic-website01/images/process/uiux-unique.jpg",
    href: "/process/design",
  },
  {
    number: "03",
    title: "Build",
    text: "Frontend systems, APIs, SaaS modules, and automation.",
    image: "/growblic-website01/images/process/code-unique.jpg",
    href: "/process/build",
  },
  {
    number: "04",
    title: "Launch",
    text: "Testing, polish, deployment, and real-user readiness.",
    image: "/growblic-website01/images/process/deploy-unique.jpg",
    href: "/process/launch",
  },
  {
    number: "05",
    title: "Improve",
    text: "Analytics, upgrades, support, optimization, and growth.",
    image: "/growblic-website01/images/process/growth-unique.jpg",
    href: "/process/improve",
  },
];

export default function Process() {
  const mobileStepsLoop = [...steps, ...steps];

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

        <div className="how-build-frame relative hidden overflow-hidden rounded-[2.7rem] border border-blue-100/70 bg-[#fbfdff]/90 p-3 shadow-2xl shadow-slate-200/75 backdrop-blur-xl md:block">
          <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="relative grid grid-cols-5 gap-3">
            {steps.map((step, index) => (
              <Link
                key={step.title}
                href={step.href}
                aria-label={`Open ${step.title} process guide`}
                className="block cursor-pointer rounded-[2rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <motion.article
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative h-[360px] overflow-hidden rounded-[2rem] border border-blue-100/70 bg-slate-100 shadow-xl shadow-blue-100/50 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
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

                  <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/20 bg-[#fbfdff]/18 text-xs font-black text-white shadow-xl backdrop-blur-xl">
                    {step.number}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-[1.35rem] border border-white/20 bg-[#fbfdff]/16 p-3.5 text-white shadow-2xl backdrop-blur-xl">
                      <h3 className="text-2xl font-black tracking-tight">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-xs font-semibold leading-5 text-white/78">
                        {step.text}
                      </p>

                      <div className="mt-4 h-1.5 w-12 rounded-full bg-[#fbfdff]/35 transition-all duration-500 ease-out group-hover:w-20 group-hover:bg-[#fbfdff]" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>

        <div className="process-mobile-marquee md:hidden">
          <div className="process-mobile-track">
            {mobileStepsLoop.map((step, index) => (
              <Link
                key={`process-mobile-${step.title}-${index}`}
                href={step.href}
                aria-label={`Open ${step.title} process guide`}
                className="process-mobile-card block cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: (index % steps.length) * 0.04 }}
                  className="h-full"
                >
                  <div className="process-mobile-image">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="260px"
                      className="object-cover"
                      priority={index === 0 || index === steps.length}
                      unoptimized
                    />
                    <div className="process-mobile-badge">
                      {step.number}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="process-mobile-title">
                      {step.title}
                    </h3>

                    <p className="process-mobile-description">
                      {step.text}
                    </p>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
