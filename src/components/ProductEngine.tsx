"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Compass, PenTool, Rocket, Scale, TerminalSquare } from "lucide-react";
import { useRef, useState } from "react";

const steps = [
  {
    title: "Discover",
    copy: "We understand your business, users, workflow, and growth goal.",
    icon: Compass,
  },
  {
    title: "Design",
    copy: "We craft clean interfaces that feel simple, premium, and fast.",
    icon: PenTool,
  },
  {
    title: "Build",
    copy: "We develop scalable web apps, mobile apps, dashboards, and SaaS systems.",
    icon: TerminalSquare,
  },
  {
    title: "Launch",
    copy: "We deploy your product with performance, security, and stability.",
    icon: Rocket,
  },
  {
    title: "Scale",
    copy: "We help your software grow with automation, analytics, and support.",
    icon: Scale,
  },
];

const orbitCards = [
  { label: "CRM", className: "left-1/2 top-[4%] -translate-x-1/2" },
  { label: "ERP", className: "right-[12%] top-[20%]" },
  { label: "SaaS", className: "right-[8%] bottom-[24%]" },
  { label: "AI", className: "bottom-[4%] left-1/2 -translate-x-1/2" },
  { label: "Mobile", className: "bottom-[24%] left-[8%]" },
  { label: "Dashboard", className: "left-[12%] top-[20%]" },
];

export default function ProductEngine() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 250]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(steps.length - 1, Math.floor(latest * steps.length));
    setActive(next);
  });

  const current = steps[active];
  const Icon = current.icon;

  return (
    <section ref={ref} className="relative min-h-[320vh] bg-[#fbfdff] px-6">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-28">
        <div className="aurora absolute inset-0 opacity-70" />
        <div className="subtle-grid absolute inset-0 opacity-45" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">The Growblic Product Engine</p>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
              One operating system for turning ideas into software products.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f6673]">
              From discovery to design, development, launch, and support — Growblic keeps every software product moving
              in one connected system.
            </p>
            <div className="mt-8 grid gap-3">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    active === index
                      ? "border-blue-200 bg-[#fbfdff] shadow-lg shadow-blue-900/8"
                      : "border-transparent bg-[#fbfdff]/30 text-slate-500"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      active === index ? "bg-[#050505] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    0{index + 1}
                  </span>
                  <span className="font-semibold text-[#111827]">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[620px]">
            <div className="absolute inset-0 rounded-[3rem] border border-blue-100/70 bg-[#fbfdff]/60 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl" />
            <div className="absolute inset-10 rounded-full bg-gradient-to-br from-blue-100 via-violet-100 to-cyan-100 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/90" />
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/90" />
            <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/90" />
            {[
              "left-[18%] top-[42%]",
              "right-[18%] top-[42%]",
              "left-[28%] bottom-[18%]",
              "right-[28%] bottom-[18%]",
            ].map((node) => (
              <span
                key={node}
                className={`absolute h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(37,99,235,0.45)] ${node}`}
              />
            ))}
            <motion.div
              style={{ rotate: orbitRotate }}
              className="absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-200"
            >
              {orbitCards.map((card) => (
                <motion.div
                  key={card.label}
                  whileHover={{ y: -6, scale: 1.08 }}
                  className={`absolute flex h-20 w-28 items-center justify-center rounded-3xl border border-blue-100/70 bg-[#fbfdff]/90 text-sm font-semibold text-slate-800 shadow-xl shadow-slate-900/8 backdrop-blur-xl transition hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/14 ${card.className}`}
                >
                  {card.label}
                </motion.div>
              ))}
            </motion.div>

            <div className="absolute left-1/2 top-1/2 flex h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100/70 bg-[#fbfdff] shadow-2xl shadow-slate-900/14">
              <motion.div
                aria-hidden="true"
                animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-6 rounded-full bg-gradient-to-br from-blue-300/25 via-violet-300/20 to-cyan-300/25 blur-xl"
              />
              <div className="absolute inset-10 rounded-full border border-blue-100/70 bg-[#fbfdff]/70" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, scale: 0.94, filter: "blur(8px)" }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="relative px-8 text-center"
                >
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-violet-500 to-cyan-500 text-white shadow-xl shadow-blue-900/20">
                    <Icon size={28} />
                  </span>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                    The Growblic Product Engine
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[#050505]">{current.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#5f6673]">{current.copy}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
