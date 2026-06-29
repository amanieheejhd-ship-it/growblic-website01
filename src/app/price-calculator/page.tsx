import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PriceCalculator from "@/components/PriceCalculator";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Price Calculator - Growblic Service Estimate",
  description:
    "Estimate Growblic pricing for websites, mobile apps, software, SaaS products, AI automation, SEO, ads management, and GMB reputation support.",
  path: "/price-calculator",
});

export default function PriceCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
        <section className="relative px-5 py-16 sm:px-6 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_84%_20%,rgba(6,182,212,0.11),transparent_30%),linear-gradient(180deg,rgba(239,246,255,0.75),rgba(255,255,255,0.96)_48%,rgba(239,246,255,0.45))]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-10 max-w-4xl">
              <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.26em] text-blue-700 shadow-lg shadow-blue-100/60">
                Growblic Price Calculator
              </p>
              <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Estimate your next digital product.
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-600">
                Choose a service, configure the scope, and generate a premium estimate preview for planning. Final pricing may vary after project discussion.
              </p>
            </div>

            <PriceCalculator />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
