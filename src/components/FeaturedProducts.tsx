"use client";

import Image from "next/image";
import Link from "next/link";
import { companyApps } from "../data/companyApps";
import { TiltCard } from "./Scroll3DSection";

export default function FeaturedProducts() {
  const featuredApps = companyApps.slice(0, 8);

  const renderAppCard = (app: (typeof companyApps)[number], index: number) => (
    <TiltCard
      key={`${app.slug}-${index}`}
      className="group h-full"
    >
      <Link
        href={`/apps/${app.slug}`}
        className="block h-full"
      >
        <div className="relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/90 p-6 shadow-xl shadow-blue-100/45 backdrop-blur-xl transition-all duration-500 ease-out hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-200/60">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-50 via-cyan-50 to-white" />
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-cyan-100" />
        <div className="relative flex items-start justify-between gap-5">
          <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-blue-100/70 ring-1 ring-blue-100">
            <Image
              src={app.logo}
              alt={app.name}
              fill
              sizes="96px"
              className="object-cover"
              unoptimized
            />
          </span>

          <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 transition-all duration-300 group-hover:bg-slate-950 group-hover:text-white">
            Live
          </span>
        </div>

        <div className="relative mt-7">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 ring-1 ring-blue-100">
            {app.category}
          </span>

          <h3 className="mt-6 min-h-[68px] text-2xl font-black leading-tight tracking-tight text-slate-950">
            {app.name}
          </h3>

          <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-slate-600">
            {app.short}
          </p>
        </div>

        <div className="relative mt-auto flex items-center justify-between pt-7">
          <span className="text-sm font-black text-slate-950">
            View Product
          </span>

          <span className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-xl font-black text-white transition-all duration-500 group-hover:rotate-[-35deg] group-hover:bg-blue-700">
            →
          </span>
        </div>
      </div>
      </Link>
    </TiltCard>
  );

  return (
    <section
      id="products"
      className="live-apps-section relative overflow-hidden px-6 py-24"
    >
      <span id="apps" className="absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="growblic-card-reveal live-apps-header mb-12 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Apps
            </p>

            <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
              Our live apps and digital products.
            </h2>
          </div>

          <p className="max-w-xl text-lg font-semibold leading-8 text-slate-600 lg:justify-self-end">
            Explore a curated set of real apps built by Growblic. Each product card opens
            a dedicated app website page with details, features, and Play Store link.
          </p>
        </div>

        <div className="growblic-card-reveal relative overflow-hidden rounded-[2.75rem] border border-blue-100/80 bg-white/70 p-4 shadow-[0_28px_100px_rgba(37,99,235,0.12)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-5">
          <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="growblic-reveal-grid relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredApps.map(renderAppCard)}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/downloads"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            View all apps →
          </Link>
        </div>
      </div>
    </section>
  );
}
