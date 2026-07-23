import type { Product } from "@/data/products";
import { CheckCircle2, Layers3, Sparkles, Target } from "lucide-react";

export default function ProductFeatures({ product }: { product: Product }) {
  const sections = [
    { title: "Key Features", items: product.features, icon: Sparkles },
    { title: "Modules", items: product.modules, icon: Layers3 },
    { title: "Benefits", items: product.benefits, icon: CheckCircle2 },
    { title: "Use Cases", items: product.useCases, icon: Target },
  ];

  return (
    <section className="bg-[#fbfdff] px-6 py-24">
      <div className="mx-auto grid max-w-[1800px] gap-5 lg:grid-cols-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <article key={section.title} className="rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-6 shadow-xl shadow-slate-900/6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#050505] text-white">
                <Icon size={21} />
              </span>
              <h2 className="mt-6 text-2xl font-semibold text-[#111827]">{section.title}</h2>
              <div className="mt-5 grid gap-3">
                {section.items.map((item) => (
                  <div key={item} className="rounded-2xl bg-[#f5f7fb] p-4 text-sm leading-6 text-[#5f6673]">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
