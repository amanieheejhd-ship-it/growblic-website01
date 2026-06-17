import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCTA from "@/components/ProductCTA";
import ProductFeatures from "@/components/ProductFeatures";
import ProductGallery from "@/components/ProductGallery";
import ProductHero from "@/components/ProductHero";
import RelatedProducts from "@/components/RelatedProducts";
import SmoothScroll from "@/components/SmoothScroll";
import { getProductBySlug, products } from "@/data/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Growblic",
    };
  }

  return {
    title: `${product.title} | Growblic`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <ProductHero product={product} />
        <ProductGallery product={product} />
        <ProductFeatures product={product} />
        <section className="bg-[#f5f7fb] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Related Products</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[#050505] sm:text-6xl">
                Explore more Growblic systems.
              </h2>
            </div>
            <RelatedProducts currentSlug={product.slug} />
          </div>
        </section>
        <ProductCTA product={product} />
      </main>
      <Footer />
    </>
  );
}
