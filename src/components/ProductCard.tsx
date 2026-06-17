"use client";

import type { Product } from "@/data/products";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getProductSlides } from "../data/imageSlides";
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

  return (
    <motion.article
      onMouseEnter={() => onHover(product.slug)}
      onMouseLeave={() => onHover(null)}
      animate={{
        flexGrow: active ? 1.8 : dimmed ? 0.72 : 1,        opacity: dimmed ? 0.58 : 1,
        scale: dimmed ? 0.96 : 1,
      }}
      transition={{ type: "spring", stiffness: 190, damping: 26 }}
      className="min-w-[280px] lg:min-w-0"
    >
      <Link
        href={`/products/${product.slug}`}
        className="soft-gradient-border group relative flex h-full min-h-[510px] flex-col overflow-hidden rounded-[2rem] bg-[#fbfdff] p-4 shadow-xl shadow-slate-900/7 transition hover:shadow-2xl hover:shadow-blue-900/12"
      >
        <span className="pointer-events-none absolute -left-1/2 top-0 z-10 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition duration-700 group-hover:left-full group-hover:opacity-100" />
        <ProductCardSlider screenshots={product.screenshots} imageSlides={product.imageSlides} paused={active}  slides={getProductSlides(product.name || product.title)} />
        <div className="flex flex-1 flex-col p-2 pt-5">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Icon size={14} />
              {product.category}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {product.status}
            </span>
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[#111827]">{product.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5f6673]">{product.shortDescription}</p>
          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="text-sm font-semibold text-[#050505]">View Product</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#050505] text-white transition group-hover:rotate-12 group-hover:bg-blue-600">
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
