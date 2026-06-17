import type { Product } from "@/data/products";
import ProductGalleryCard from "./ProductGalleryCard";

const toneMap = {
  blue: "from-blue-500/18 to-cyan-100",
  violet: "from-violet-500/18 to-blue-100",
  cyan: "from-cyan-500/18 to-blue-50",
  emerald: "from-emerald-500/18 to-cyan-50",
  slate: "from-slate-500/18 to-blue-50",
};

export default function ProductGallery({ product }: { product: Product }) {
  return (
    <section className="bg-[#f5f7fb] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Product Preview</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[#050505] sm:text-6xl">
            A polished interface system ready for real screens.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {product.screenshots.map((shot, index) => {
            const image = product.imageSlides[index % product.imageSlides.length];

            return (
              <ProductGalleryCard
                key={shot.label}
                image={image}
                index={index}
                productTitle={product.title}
                shot={shot}
                toneClass={toneMap[shot.tone]}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
