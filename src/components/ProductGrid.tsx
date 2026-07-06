"use client";

import { productCategories, products } from "@/data/products";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [category, setCategory] = useState("All");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const filtered = useMemo(
    () => (category === "All" ? products : products.filter((product) => product.category === category)),
    [category],
  );

  return (
    <section className="overflow-hidden bg-[#f5f7fb] px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl min-w-0">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
          {productCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                category === item
                  ? "border-[#050505] bg-[#050505] text-white"
                  : "border-blue-100/70 bg-[#fbfdff] text-slate-600 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <motion.div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.slug}
                className="min-w-0"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
              >
                <ProductCard
                  product={product}
                  active={activeSlug === product.slug}
                  dimmed={Boolean(activeSlug && activeSlug !== product.slug)}
                  onHover={setActiveSlug}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
