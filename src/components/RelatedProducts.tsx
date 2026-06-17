"use client";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ currentSlug }: { currentSlug: string }) {
  const related = products.filter((item) => item.slug !== currentSlug).slice(0, 3);

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-3">
      {related.map((item) => (
        <ProductCard key={item.slug} product={item} />
      ))}
    </div>
  );
}
