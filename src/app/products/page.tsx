"use client";

import BackButton from "@/components/BackButton";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#fbfdff]">
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_82%_80%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                Products
              </p>
              <h1 className="mt-5 max-w-5xl text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
                Premium product systems Growblic can build for you.
              </h1>
            </div>
            <p className="max-w-2xl text-lg font-semibold leading-8 text-slate-600 lg:justify-self-end">
              Explore portfolio-style product examples for CRM, school management,
              HR, fintech, SaaS, portals, analytics, automation, and operational platforms.
            </p>
          </div>

          <div className="mt-14 grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
