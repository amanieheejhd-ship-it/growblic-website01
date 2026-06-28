import type { Product } from "@/data/products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCardSlider from "./ProductCardSlider";

export default function ProductHero({ product }: { product: Product }) {
  const Icon = product.icon;
  const slides = (product.imageSlides ?? []).map((image) => ({
    image,
    title: product.title,
  }));


  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-6 pb-20 pt-36">
      <div className="aurora absolute inset-0 opacity-70" />
      <div className="subtle-grid absolute inset-0 opacity-45" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100/70 bg-[#fbfdff]/74 px-4 py-2 text-sm font-semibold text-blue-700 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <Icon size={16} />
            {product.category} · {product.status}
          </div>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-7xl">
            {product.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f6673]">{product.longDescription}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="mailto:hello@growblic.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#050505] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Start with this product
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-blue-100/70 bg-[#fbfdff]/80 px-6 py-3.5 text-sm font-semibold text-[#050505] shadow-lg shadow-slate-900/5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              View all products
            </Link>
          </div>
        </div>
        <div className="soft-gradient-border rounded-[2.25rem] bg-[#fbfdff] p-5 shadow-2xl shadow-slate-900/10">
          <ProductCardSlider slides={slides} />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {product.modules.slice(0, 3).map((module) => (
              <div key={module} className="rounded-2xl bg-[#f5f7fb] p-4 text-sm font-semibold text-slate-700">
                {module}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
