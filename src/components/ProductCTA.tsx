import type { Product } from "@/data/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProductCTA({ product }: { product: Product }) {
  return (
    <section className="bg-[#fbfdff] px-6 py-24">
      <div className="soft-gradient-border mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#f5f7fb] p-8 shadow-2xl shadow-slate-900/8 sm:p-12 lg:p-16">
        <div className="relative">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Launch With Growblic</p>
              <h2 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
                Want a {product.title} tailored for your business?
              </h2>
            </div>
            <Link
              href="/start-project"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#050505] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Contact Growblic
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
