"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    title: "Custom Software",
    badge: "Core systems",
    text: "Powerful internal platforms, dashboards, admin panels, and business tools built around your workflow.",
    image: "/images/business/web-1.jpg",
    size: "large",
    stat: "01",
    href: "/custom-software",
  },
  {
    title: "Mobile Apps",
    badge: "iOS + Android",
    text: "Fast mobile experiences with clean flows, modern UI, and production-ready patterns.",
    image: "/images/business/mobile-1.jpg",
    size: "small",
    stat: "02",
    href: "/mobile-apps",
  },
  {
    title: "SaaS Products",
    badge: "Recurring growth",
    text: "Subscription-ready software with roles, dashboards, billing flows, and scalable modules.",
    image: "/images/business/saas-1.jpg",
    size: "small",
    stat: "03",
    href: "/saas-products",
  },
  {
    title: "AI Automation",
    badge: "Less manual work",
    text: "Automation systems that reduce repeated work and help teams move faster.",
    image: "/images/business/ai-1.jpg",
    size: "wide",
    stat: "04",
    href: "/ai-automation",
  },
];

export default function Capabilities() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 py-14 sm:px-6 sm:py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_0%,rgba(37,99,235,0.11),transparent_30%),radial-gradient(circle_at_90%_70%,rgba(6,182,212,0.09),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid min-w-0 gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-blue-100 bg-[#fbfdff] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-lg shadow-blue-100/60 sm:tracking-[0.24em]">
              <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.75)]" />
              What we create
            </div>

            <h2 className="mt-5 max-w-4xl break-words text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
              Premium software experiences for ambitious businesses.
            </h2>

            <div className="mt-6 h-2 w-32 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
          </div>

          <div className="max-w-2xl min-w-0 lg:justify-self-end">
            <div className="relative overflow-hidden rounded-[1.8rem] border border-blue-100/70 bg-[#fbfdff]/85 p-4 shadow-2xl shadow-blue-100/50 backdrop-blur-xl sm:rounded-[2.2rem] sm:p-5">
              <div className="absolute -right-12 -top-12 hidden h-36 w-36 rounded-full bg-blue-100/80 blur-2xl sm:block" />
              <div className="absolute -bottom-12 -left-12 hidden h-36 w-36 rounded-full bg-cyan-100/80 blur-2xl sm:block" />

              <div className="relative">
                <p className="text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Growblic creates websites, apps, SaaS products, dashboards, and automation
                  systems with a clean premium interface and scalable foundation.
                </p>

                <div className="mt-5 grid gap-3 min-[420px]:grid-cols-2">
                  {[
                    ["Fast", "Delivery"],
                    ["Premium", "UI"],
                    ["Scalable", "Code"],
                    ["Business", "Ready"],
                  ].map(([top, bottom]) => (
                    <div
                      key={top}
                      className="min-w-0 rounded-2xl border border-blue-100/70 bg-[#fbfdff] p-4 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-lg"
                    >
                      <p className="break-words text-2xl font-black tracking-tight text-slate-950">
                        {top}
                      </p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                        {bottom}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-blue-100/70 bg-blue-50/45 px-4 py-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                  <span className="min-w-0 break-words text-sm font-black text-slate-700">
                    Built for launch-ready products
                  </span>
                  <span className="h-2 w-20 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-blue-100/70 bg-[#fbfdff]/75 p-3 shadow-2xl shadow-blue-100/50 backdrop-blur-xl sm:rounded-[3rem] sm:p-4">
          <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          <div className="absolute -left-24 top-10 hidden h-64 w-64 rounded-full bg-blue-100/70 blur-3xl sm:block" />
          <div className="absolute -right-24 bottom-0 hidden h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl sm:block" />

          <div className="relative grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className={[
                "group relative min-w-0 overflow-hidden rounded-[1.8rem] border border-blue-100/70 bg-[#fbfdff] p-3 shadow-2xl shadow-blue-100/50 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-blue-100 sm:rounded-[2.6rem] sm:p-4",
                  item.size === "large" ? "lg:col-span-2 lg:row-span-2" : "",
                item.size === "wide" ? "sm:col-span-2 lg:col-span-2" : "",
              ].join(" ")}
            >
              <Link href={item.href} className="absolute inset-0 z-30" aria-label={`Open ${item.title}`} />
              <div
                className={[
                  "relative overflow-hidden rounded-[2.1rem] bg-slate-100",
                  item.size === "large" ? "h-[300px] sm:h-[420px] lg:h-[500px]" : item.size === "wide" ? "h-[245px]" : "h-[245px]",
                ].join(" ")}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 620px"
                  className="will-change-transform object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={index === 0}
                  unoptimized
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/18 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute right-5 top-5 rounded-full border border-white/25 bg-[#fbfdff]/18 px-4 py-2 text-xs font-black text-white shadow-xl backdrop-blur-xl">
                  {item.badge}
                </div>

                <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div


                  className={[


                    "absolute left-5 right-5",


                    item.size === "small" ? "inset-y-5" : "bottom-5",


                  ].join(" ")}


                >


                  <div


                    className={[


                      "min-w-0 rounded-[1.8rem] border border-white/20 bg-[#fbfdff]/16 text-white shadow-2xl backdrop-blur-xl",


                      item.size === "small" ? "flex h-full flex-col justify-center p-5" : "p-5",


                    ].join(" ")}


                  >
                    <h3
                      className={[
                        "break-words font-black tracking-tight",

                        item.size === "large"

                          ? "text-3xl leading-tight sm:text-4xl lg:text-5xl lg:leading-[0.98]"

                          : item.size === "small"

                            ? "text-2xl leading-tight sm:text-[1.85rem] sm:leading-[1.05]"

                            : "text-3xl leading-tight",
                      ].join(" ")}
                    >
                      {item.title}
                    </h3>

                    <p


                      className={[


                        "mt-3 max-w-xl font-semibold text-white/78",


                        item.size === "small" ? "text-[13px] leading-[1.65]" : "text-sm leading-6",


                      ].join(" ")}


                    >
                      {item.text}
                    </p>

                    <div className={["flex min-w-0 items-center justify-between gap-4", item.size === "small" ? "mt-4" : "mt-5"].join(" ")}>
                      <div className="h-1.5 w-14 rounded-full bg-[#fbfdff]/35 transition-all duration-500 ease-out group-hover:w-24 group-hover:bg-[#fbfdff]" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Open
                      </span>
                    </div>
                  </div>
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
