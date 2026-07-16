"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Code2,
  Layers3,
  Rocket,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Understand",
    subtitle: "Requirement clarity",
    text: "We understand your idea, business goal, audience, user journey, required features, timeline, and launch expectations.",
    points: ["Business goal", "User journey", "Feature scope"],
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Design",
    subtitle: "Premium UI direction",
    text: "We plan clean layouts, product flow, screen structure, content direction, and a polished visual system before development begins.",
    points: ["UI layout", "Product flow", "Visual system"],
    icon: Layers3,
  },
  {
    number: "03",
    title: "Build",
    subtitle: "Development execution",
    text: "We develop the website, mobile app, SaaS product, dashboard, automation workflow, or custom software with scalable structure.",
    points: ["Frontend", "Backend", "Integrations"],
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch",
    subtitle: "Ready for users",
    text: "We test responsiveness, performance, forms, deployment, tracking, SEO basics, and final launch readiness.",
    points: ["Testing", "Deployment", "Performance"],
    icon: Rocket,
  },
  {
    number: "05",
    title: "Improve",
    subtitle: "Long-term growth",
    text: "After launch, we support improvements, fixes, new features, analytics, conversion changes, and product growth.",
    points: ["Updates", "Optimization", "Support"],
    icon: Sparkles,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Process() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-32 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_92%_56%,rgba(6,182,212,0.13),transparent_34%),linear-gradient(180deg,#ffffff,rgba(239,246,255,0.72),#ffffff)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:56px_56px] opacity-70 [mask-image:radial-gradient(circle_at_50%_32%,black,transparent_78%)]" />
      <div className="pointer-events-none absolute left-[8%] top-28 h-52 w-52 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 right-[10%] h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.32em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)] backdrop-blur-xl">
            Process
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            From idea to launched product.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
            Growblic follows a clean step-by-step process so your website, mobile app,
            SaaS product, dashboard, or automation system moves from idea to
            real launch with clarity.
          </p>
        </motion.div>

        <div className="relative mt-10 grid min-w-0 gap-5 sm:mt-16 sm:grid-cols-2 xl:grid-cols-5">
          <div className="pointer-events-none absolute left-0 right-0 top-[5.25rem] hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent xl:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 48, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.78, delay: index * 0.1, ease }}
                className="group relative flex min-h-[430px] overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/84 p-6 shadow-[0_26px_85px_rgba(37,99,235,0.10)] ring-1 ring-white/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_38px_120px_rgba(37,99,235,0.16)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-0 transition group-hover:opacity-80" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-cyan-100" />

                <div className="relative flex w-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black tracking-[0.24em] text-blue-700 shadow-sm ring-1 ring-blue-100">
                      {step.number}
                    </span>

                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-[0_14px_40px_rgba(37,99,235,0.14)] ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                    {step.subtitle}
                  </p>

                  <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {step.text}
                  </p>

                  <div className="mt-auto grid gap-2 pt-6">
                    {step.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs font-black text-slate-700 shadow-sm shadow-blue-100/35"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        {point}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-1 rounded-t-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-200 opacity-65 transition group-hover:left-4 group-hover:right-4 group-hover:opacity-100" />
              </motion.article>
            );
          })}
        </div>


      </div>
    </section>
  );
}
