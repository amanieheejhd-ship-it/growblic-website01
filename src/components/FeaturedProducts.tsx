"use client";

import { products } from "@/data/products";
import { motion } from "framer-motion";
import { useState } from "react";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({ limit = 9 }: { limit?: number }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const visible = products.slice(0, limit);

  return (
    <section className="relative bg-[#f5f7fb] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Featured Products</p>
            <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
              Interactive product systems built for real business workflows.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#5f6673]">
            Hover a product to bring it forward. Each card previews multiple product mockups and opens a full mini-site.
          </p>
        </div>

        <motion.div
          className="mt-12 hidden gap-5 lg:flex"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.15 }}
          transition={{ duration: 0.55 }}
        >
          {visible.slice(0, 5).map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              active={activeSlug === product.slug}
              dimmed={Boolean(activeSlug && activeSlug !== product.slug)}
              onHover={setActiveSlug}
            />
          ))}
        </motion.div>

        <div className="mt-5 hidden gap-5 lg:flex">
          {visible.slice(5).map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              active={activeSlug === product.slug}
              dimmed={Boolean(activeSlug && activeSlug !== product.slug)}
              onHover={setActiveSlug}
            />
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:hidden">
          {visible.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              active={false}
              dimmed={false}
              onHover={() => undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
