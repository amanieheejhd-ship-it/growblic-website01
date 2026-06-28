import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Why Growblic - Premium Software Development Partner",
  description:
    "See why businesses choose Growblic for premium UI, modern development, product-first planning, scalable software, and long-term support.",
  path: "/why-growblic",
});

const reasons = [
  "Premium UI design",
  "Modern development",
  "Business-focused planning",
  "Fast delivery process",
  "Scalable structure",
  "Long-term support",
];

export default function WhyGrowblicPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Why Growblic
            </p>

            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Why businesses choose Growblic.
            </h1>

            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              Growblic focuses on premium design, clean development, smooth user
              experience, and business-ready software that looks modern and works properly.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {reasons.map((item, index) => (
              <div
                key={item}
                className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>
                <h2 className="mt-4 text-2xl font-black text-slate-950">
                  {item}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Every project is built with clean structure, premium look, and real business use.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
