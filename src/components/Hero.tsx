"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Layers3, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const previewTiles = [
  {
    title: "SaaS Dashboard",
    detail: "Roles, metrics, workflows",
    icon: Layers3,
  },
  {
    title: "Mobile App",
    detail: "Clean customer flows",
    icon: Sparkles,
  },
  {
    title: "Automation",
    detail: "Less repeated work",
    icon: Rocket,
  },
  {
    title: "Security Ready",
    detail: "Practical review paths",
    icon: ShieldCheck,
  },
];

const buildSteps = ["Plan", "Design", "Build", "Launch"];

export default function Hero() {
  return (
    <section className="home-hero-section relative min-h-screen overflow-hidden bg-[#fbfcff] px-6 pb-20 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(37,99,235,0.16),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(6,182,212,0.14),transparent_28%),radial-gradient(circle_at_52%_100%,rgba(99,102,241,0.10),transparent_32%),linear-gradient(180deg,#fbfcff,#eef6ff_48%,#ffffff)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:84px_84px] opacity-55 [mask-image:radial-gradient(circle_at_50%_12%,black,transparent_72%)]" />

      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[18%] h-44 w-44 rounded-full bg-blue-200/35 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 16, 0], x: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] bottom-[18%] h-52 w-52 rounded-full bg-cyan-200/35 blur-3xl"
      />

      <div className="home-hero-layout relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-[#fbfdff]/90 px-4 py-2 text-sm font-black text-slate-700 shadow-lg shadow-blue-100/70 backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.8)]" />
            Premium digital products for modern businesses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-7 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 sm:text-6xl md:text-7xl"
          >
            We turn ideas into{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              polished software
            </span>{" "}
            products.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mt-7 max-w-2xl text-xl leading-9 text-slate-600"
          >
            Growblic designs and develops websites, mobile apps, SaaS platforms,
            dashboards, and automation systems with premium UI and reliable engineering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:bg-blue-700 hover:shadow-2xl"
            >
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/start-project"
              className="inline-flex min-h-12 items-center rounded-full border border-blue-100/70 bg-[#fbfdff] px-7 py-4 text-sm font-black text-slate-800 shadow-lg shadow-blue-100/60 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-xl"
            >
              Start Project
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {buildSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 text-sm font-black text-slate-700 shadow-sm shadow-blue-100/45 backdrop-blur"
              >
                <span className="block text-xs text-blue-600">0{index + 1}</span>
                {step}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18 }}
          className="relative"
        >
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-200/35 via-cyan-200/25 to-indigo-200/30 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.75rem] border border-blue-100/80 bg-white/78 p-4 shadow-[0_34px_120px_rgba(37,99,235,0.16)] ring-1 ring-white/80 backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(37,99,235,0.13),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(6,182,212,0.13),transparent_30%)]" />

            <div className="relative overflow-hidden rounded-[2.25rem] border border-blue-100 bg-[#fbfdff] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60">
                    <Image
                      src="/growblic-website01/images/brand/growblic-logo.png"
                      alt="Growblic"
                      fill
                      sizes="48px"
                      priority
                      className="object-cover p-1"
                    />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                      Product Launch Dashboard
                    </p>
                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Growblic delivery system
                    </h2>
                  </div>
                </div>
                <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                  Ready for build
                </span>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/45">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                        Build pipeline
                      </p>
                      <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        Website, app, SaaS, automation.
                      </h3>
                    </div>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                      <Rocket className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {buildSteps.map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-black text-slate-700">{step}</span>
                        <span className="ml-auto rounded-full bg-white px-3 py-1 text-[0.65rem] font-black text-blue-700 ring-1 ring-blue-100">
                          0{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white shadow-xl shadow-blue-500/20">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                      Current focus
                    </p>
                    <h3 className="mt-3 text-3xl font-black tracking-tight">
                      Premium software experiences
                    </h3>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/25">
                      <motion.div
                        animate={{ x: ["-100%", "0%", "100%"] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-1/2 rounded-full bg-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/45">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                      Launch quality
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {["UI", "Speed", "Forms", "Support"].map((item) => (
                        <span
                          key={item}
                          className="rounded-2xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-center text-xs font-black text-slate-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {previewTiles.map((tile) => {
                  const Icon = tile.icon;

                  return (
                    <div
                      key={tile.title}
                      className="rounded-[1.4rem] border border-blue-100 bg-white/90 p-4 shadow-sm shadow-blue-100/45"
                    >
                      <Icon className="h-5 w-5 text-blue-600" />
                      <h4 className="mt-3 text-sm font-black text-slate-950">
                        {tile.title}
                      </h4>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                        {tile.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
