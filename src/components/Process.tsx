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
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Understand",
    subtitle: "Requirement clarity",
    text: "We understand your idea, business goal, audience, required features, user journey, timeline, and the result you want from the product.",
    points: ["Business goal", "User journey", "Feature scope"],
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Design",
    subtitle: "Premium UI direction",
    text: "We plan the layout, product flow, screen structure, content direction, and premium visual style before development begins.",
    points: ["Clean layout", "Product flow", "Visual system"],
    icon: Layers3,
  },
  {
    number: "03",
    title: "Build",
    subtitle: "Development execution",
    text: "We develop websites, mobile apps, dashboards, SaaS products, admin panels, automation workflows, and custom software systems.",
    points: ["Frontend", "Backend", "Integrations"],
    icon: Code2,
  },
  {
    number: "04",
    title: "Launch",
    subtitle: "Ready for users",
    text: "We test responsiveness, performance, forms, deployment, tracking, basic SEO setup, and final launch readiness.",
    points: ["Testing", "Deploy", "Performance"],
    icon: Rocket,
  },
  {
    number: "05",
    title: "Improve",
    subtitle: "Long-term growth",
    text: "After launch, we help improve features, fix issues, optimize pages, check analytics, and support future product growth.",
    points: ["Updates", "Fixes", "Growth"],
    icon: Sparkles,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Process() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-28 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_92%_58%,rgba(6,182,212,0.13),transparent_34%),linear-gradient(180deg,#ffffff,rgba(239,246,255,0.72),#ffffff)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.8, ease }}
          className="max-w-5xl"
        >
          <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.34em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)]">
            Process
          </p>

          <h2 className="mt-6 max-w-5xl text-[clamp(3rem,7vw,6.6rem)] font-extrabold leading-[0.98] tracking-[-0.07em] text-slate-950">
            From idea to launched product.
          </h2>

          <p className="mt-7 max-w-3xl text-lg font-semibold leading-9 text-slate-600">
            Growblic follows a clean build process so your website, mobile app,
            SaaS product, dashboard, or automation system moves from idea to
            real launch with clarity.
          </p>
        </motion.div>

        <div className="relative mt-14 grid gap-6 lg:grid-cols-5">
          <div className="pointer-events-none absolute left-0 right-0 top-[4.4rem] hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 48, scale: 0.97, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.75, delay: index * 0.08, ease }}
                className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-blue-100 bg-white/88 p-6 shadow-[0_26px_85px_rgba(37,99,235,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_38px_120px_rgba(37,99,235,0.16)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-cyan-100" />

                <div className="relative flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black tracking-[0.24em] text-blue-700 shadow-sm ring-1 ring-blue-100">
                    {step.number}
                  </span>

                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-[0_14px_40px_rgba(37,99,235,0.14)] ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>

                <p className="relative mt-8 text-xs font-black uppercase tracking-[0.28em] text-blue-700">
                  {step.subtitle}
                </p>

                <h3 className="relative mt-3 text-2xl font-black tracking-[-0.05em] text-slate-950">
                  {step.title}
                </h3>

                <p className="relative mt-4 text-sm font-semibold leading-7 text-slate-600">
                  {step.text}
                </p>

                <div className="relative mt-6 grid gap-2">
                  {step.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/65 px-3 py-2 text-xs font-black text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      {point}
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-200 opacity-0 transition group-hover:opacity-100" />
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 46, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mt-10 overflow-hidden rounded-[2.2rem] border border-blue-100 bg-white/90 p-7 shadow-[0_30px_100px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-700">
                Growblic Process
              </p>
              <h3 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl">
                A smooth path from first idea to real launch.
              </h3>
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
                Every stage is structured to keep design clean, development
                focused, timelines realistic, and final delivery ready for real
                business use.
              </p>
            </div>

            <Link
              href="/process"
              className="inline-flex w-fit items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              View full process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
