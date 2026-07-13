"use client";

import type { Product } from "@/data/products";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCardSlider from "./ProductCardSlider";

export default function ProductCard({
  product,
  active,
  dimmed,
  onHover = () => undefined,
}: {
  product: Product;
  active?: boolean;
  dimmed?: boolean;
  onHover?: (slug: string | null) => void;
}) {
  const Icon = product.icon;
  const slides = (product.imageSlides ?? []).map((image) => ({
    image,
    title: product.title,
  }));
  const featureChips = product.features.slice(0, 3);

  return (
    <motion.article
      onMouseEnter={() => onHover(product.slug)}
      onMouseLeave={() => onHover(null)}
      animate={{
        flexGrow: active ? 1.8 : dimmed ? 0.72 : 1,
        opacity: dimmed ? 0.58 : 1,
        scale: dimmed ? 0.96 : 1,
      }}
      transition={{ type: "spring", stiffness: 190, damping: 26 }}
      className="h-full min-w-0"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex h-full min-h-[460px] min-w-0 max-w-full flex-col overflow-hidden rounded-[1.6rem] border border-blue-100/80 bg-white p-3 shadow-xl shadow-slate-900/7 transition duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/12 sm:min-h-[540px] sm:rounded-[2rem] sm:p-4 lg:min-h-[560px]"
      >
        <span className="pointer-events-none absolute -left-1/2 top-0 z-10 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition duration-700 group-hover:left-full group-hover:opacity-100" />

        <div className="relative">
          <ProductCardSlider slides={slides} className="h-48 sm:h-60 lg:h-64" />
          <span className="absolute left-3 top-3 z-20 inline-flex max-w-[calc(100%-6rem)] items-center gap-2 rounded-full border border-white/70 bg-white/95 px-2.5 py-1.5 text-[11px] font-black text-blue-700 shadow-lg shadow-slate-950/10 backdrop-blur sm:left-5 sm:top-5 sm:px-3 sm:text-xs">
            <Icon size={14} />
            <span className="min-w-0 truncate break-words">{product.category}</span>
          </span>
          <span className="absolute right-3 top-3 z-20 rounded-full border border-emerald-100 bg-emerald-50/95 px-2.5 py-1.5 text-[11px] font-black text-emerald-700 shadow-lg shadow-slate-950/10 backdrop-blur sm:right-5 sm:top-5 sm:px-3 sm:text-xs">
            {product.status}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-2 pt-5 sm:pt-6">
          <h3 className="min-w-0 break-words text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-2xl">
            {product.title}
          </h3>
          <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-slate-600">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {featureChips.map((feature) => (
              <span
                key={feature}
                className="min-w-0 break-words rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-xs font-black text-blue-700"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-auto flex min-w-0 flex-wrap items-center justify-between gap-4 pt-8">
            <span className="inline-flex min-w-0 items-center gap-2 break-words text-sm font-black text-slate-950 transition group-hover:gap-3 group-hover:text-blue-700">
              View Product →
            </span>
            <span className="h-2 w-12 shrink-0 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500 opacity-70 transition group-hover:w-16 group-hover:opacity-100 sm:w-16 sm:group-hover:w-24" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
