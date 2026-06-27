"use client";

import { motion } from "framer-motion";

const orbitItems = [
  {
    title: "Websites",
    desc: "Premium UI",
    position: "top-[3%] left-1/2 -translate-x-1/2",
    glow: "from-blue-500 to-cyan-400",
    bg: "from-blue-50 to-cyan-50",
  },
  {
    title: "Mobile Apps",
    desc: "iOS + Android",
    position: "right-[1%] top-1/2 -translate-y-1/2",
    glow: "from-violet-500 to-blue-500",
    bg: "from-violet-50 to-blue-50",
  },
  {
    title: "SaaS",
    desc: "Dashboards",
    position: "bottom-[3%] left-1/2 -translate-x-1/2",
    glow: "from-emerald-400 to-cyan-500",
    bg: "from-emerald-50 to-cyan-50",
  },
  {
    title: "AI Flow",
    desc: "Automation",
    position: "left-[1%] top-1/2 -translate-y-1/2",
    glow: "from-fuchsia-500 to-violet-500",
    bg: "from-fuchsia-50 to-violet-50",
  },
];

const stats: [string, string][] = [];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fbfcff] px-6 pb-20 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_8%,rgba(37,99,235,0.15),transparent_32%),radial-gradient(circle_at_82%_28%,rgba(6,182,212,0.13),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.11),transparent_30%),radial-gradient(circle_at_8%_80%,rgba(16,185,129,0.08),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-35" />

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

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
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
            className="mt-7 max-w-4xl text-6xl font-black leading-[0.92] tracking-tight text-slate-950 md:text-8xl"
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
            <a
              href="/products"
              className="rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
            >
              Explore Products →
            </a>
            <a
              href="/start-project"
              className="rounded-full border border-blue-100/70 bg-[#fbfdff] px-7 py-4 text-sm font-black text-slate-800 shadow-lg transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl"
            >
              Start a Project
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3"
          >
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-blue-100/70 bg-[#fbfdff]/88 p-4 shadow-lg shadow-slate-200/60 backdrop-blur transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl"
              >
                <p className="text-3xl font-black tracking-tight text-slate-950">
                  {value}
                </p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18 }}
          className="relative min-h-[650px]"
        >
          <div className="absolute left-1/2 top-1/2 h-[610px] w-[610px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-200/30 via-cyan-200/25 to-violet-200/30 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100 bg-[#fbfdff]/55 shadow-2xl shadow-blue-100/80 backdrop-blur-xl" />
          <div className="absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/70/90" />
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/70/90" />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          >
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-600 shadow-[0_0_24px_rgba(37,99,235,0.9)]" />
            <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-500 shadow-[0_0_24px_rgba(6,182,212,0.9)]" />
          </motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          >
            <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-violet-500 shadow-[0_0_22px_rgba(168,85,247,0.8)]" />
            <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_22px_rgba(59,130,246,0.8)]" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 z-20 w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] border border-blue-100/70 bg-[#fbfdff]/92 p-5 shadow-2xl shadow-slate-300/80 backdrop-blur-xl"
          >
            <div className="relative overflow-hidden rounded-[2.35rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/80 to-violet-50/70 p-6 text-center">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-200/60 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-violet-200/60 blur-2xl" />

              <div className="relative">
                <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-blue-100/70 bg-[#fbfdff] p-2 shadow-xl shadow-slate-200">
                <img src="/growblic-website01/images/brand/growblic-logo.png" alt="Growblic" className="h-full w-full rounded-full object-cover" />
              </div>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-blue-700">
                  Growblic Engine
                </p>
                <h3 className="mt-3 text-5xl font-black leading-none tracking-tight text-slate-950">
                  Design Build Launch
                </h3>

                <div className="mx-auto mt-7 h-2 w-36 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    animate={{ x: ["-100%", "0%", "100%"] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {orbitItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1, y: [0, index % 2 === 0 ? -8 : 8, 0] }}
              transition={{
                opacity: { duration: 0.55, delay: 0.35 + index * 0.08 },
                scale: { duration: 0.55, delay: 0.35 + index * 0.08 },
                y: { duration: 4.2 + index * 0.45, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`absolute z-30 ${item.position} w-[178px] overflow-hidden rounded-[1.8rem] border border-blue-100/70 bg-gradient-to-br ${item.bg} p-4 shadow-2xl shadow-slate-200/75 backdrop-blur-xl`}
            >
              <div className={`absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${item.glow} opacity-25 blur-xl`} />
              <div className="relative flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${item.glow} shadow-[0_0_18px_rgba(37,99,235,0.8)]`} />
                <h4 className="text-base font-black text-slate-950">
                  {item.title}
                </h4>
              </div>
              <p className="relative mt-3 text-sm font-semibold leading-6 text-slate-500">
                {item.desc}
              </p>
            </motion.div>
          ))}

          <motion.div
            animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.06, 1] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[8%] left-1/2 h-3 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500 blur-sm"
          />
        </motion.div>
      </div>
    </section>
  );
}
