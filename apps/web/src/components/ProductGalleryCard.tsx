import ProductCardSlider from "./ProductCardSlider";

type GallerySlide =
  | string
  | {
      title?: string;
      label?: string;
      image?: string;
      src?: string;
      url?: string;
    };

export default function ProductGalleryCard({
  title = "Product Preview",
  description = "A premium product interface preview built for modern teams.",
  slides = [],
  className = "",
}: {
  title?: string;
  description?: string;
  slides?: GallerySlide[];
  tone?: string;
  className?: string;
  image?: string;
  index?: number;
  productTitle?: string;
  shot?: GallerySlide;
  toneClass?: string;
}) {
  return (
    <article
      className={`rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-5 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl ${className}`}
    >
      <ProductCardSlider slides={slides} className="h-60" />
      <h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
