"use client";

import BackButton from "@/components/BackButton";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_82%_80%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end lg:gap-8">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600 sm:tracking-[0.34em]">
                Products
              </p>
              <h1 className="mt-5 max-w-5xl break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Premium product systems Growblic can build for you.
              </h1>
            </div>
            <p className="max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:justify-self-end">
              Explore portfolio-style product examples for CRM, school management,
              HR, fintech, SaaS, portals, analytics, automation, and operational platforms.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 auto-rows-fr gap-5 sm:mt-14 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
