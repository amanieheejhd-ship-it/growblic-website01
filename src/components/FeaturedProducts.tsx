"use client";

import Link from "next/link";
import { useState } from "react";
import { companyApps } from "../data/companyApps";

export default function FeaturedProducts() {
  const [isArrowHovered, setIsArrowHovered] = useState(false);
  const loopApps = [...companyApps, ...companyApps];

  const renderAppCard = (app: (typeof companyApps)[number], index: number) => (
    <Link
      href={`/apps/${app.slug}`}
      key={`${app.slug}-${index}`}
      className="live-app-card group"
    >
      <div className="live-app-card-shell relative flex h-full flex-col overflow-hidden rounded-[2.4rem] border border-blue-100/80 bg-white/90 p-7 shadow-xl shadow-blue-100/45 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-3 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-200/60">
        <div className="relative flex items-start justify-between gap-5">
          <span className="live-app-icon grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[1.8rem] bg-white shadow-xl shadow-blue-100/70">
            <img
              src={app.logo}
              alt={app.name}
              className="h-full w-full object-cover"
            />
          </span>

          <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 backdrop-blur-xl hover:-translate-y-0.5 hover:scale-105 hover:bg-slate-950 hover:text-white transition-all duration-300">
            Live
          </span>
        </div>

        <div className="live-app-content relative mt-8">
          <span className="live-app-category rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 backdrop-blur-xl hover:-translate-y-0.5 hover:scale-105 hover:bg-slate-950 hover:text-white transition-all duration-300">
            {app.category}
          </span>

          <h3 className="live-app-title mt-6 min-h-[92px] text-3xl font-black leading-tight tracking-tight text-slate-950">
            {app.name}
          </h3>

          <p className="live-app-description mt-5 line-clamp-4 text-base font-semibold leading-7 text-slate-600">
            {app.short}
          </p>
        </div>

        <div className="live-app-footer relative mt-auto flex items-center justify-between pt-8">
          <span className="text-sm font-black text-slate-950">
            View Product
          </span>

          <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-xl font-black text-white transition-all duration-500 group-hover:rotate-[-35deg] group-hover:bg-blue-700 backdrop-blur-xl hover:-translate-y-0.5 hover:scale-105 hover:bg-slate-950 hover:text-white transition-all duration-300">
            →
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <section
      id="products"
      className="live-apps-section relative overflow-hidden px-6 py-24"
    >
      <span id="apps" className="absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="live-apps-header mb-12 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Apps
            </p>

            <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
              Our live apps and digital products.
            </h2>
          </div>

          <p className="max-w-xl text-lg font-semibold leading-8 text-slate-600 lg:justify-self-end">
            Explore real apps built by Growblic. Each product card opens a
            dedicated app website page with details, features, and Play Store link.
          </p>
        </div>

        <div className="live-apps-marquee relative overflow-hidden py-8">
          <button
            type="button"
            className="app-slider-arrow app-slider-arrow-left group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-xl font-semibold text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-slate-950 hover:text-white active:scale-95"
            aria-label="Speed up live apps marquee"
            onMouseEnter={() => setIsArrowHovered(true)}
            onMouseLeave={() => setIsArrowHovered(false)}
            onFocus={() => setIsArrowHovered(true)}
            onBlur={() => setIsArrowHovered(false)}
          >
            <span className="app-slider-arrow-icon">←</span>
          </button>

          <button
            type="button"
            className="app-slider-arrow app-slider-arrow-right group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/85 text-xl font-semibold text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-slate-950 hover:text-white active:scale-95"
            aria-label="Speed up live apps marquee"
            onMouseEnter={() => setIsArrowHovered(true)}
            onMouseLeave={() => setIsArrowHovered(false)}
            onFocus={() => setIsArrowHovered(true)}
            onBlur={() => setIsArrowHovered(false)}
          >
            <span className="app-slider-arrow-icon">→</span>
          </button>

          <div className="live-apps-fade pointer-events-none absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-[#fbfdff] via-[#fbfdff]/80 to-transparent" />
          <div className="live-apps-fade pointer-events-none absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-[#fbfdff] via-[#fbfdff]/80 to-transparent" />

          <div
            className={`live-apps-track${isArrowHovered ? " live-apps-track-fast" : ""}`}
          >
            {loopApps.map(renderAppCard)}
          </div>
        </div>
      </div>
    </section>
  );
}
