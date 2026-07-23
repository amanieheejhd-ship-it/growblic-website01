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
    <main className="min-h-screen overflow-hidden">
      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-[1800px] min-w-0">
          <BackButton />

          <div className="mt-8 max-w-4xl min-w-0 sm:mt-10">
            <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.28em]">
              Why Growblic
            </p>

            <h1 className="mt-5 break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
              Why businesses choose Growblic.
            </h1>

            <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              Growblic focuses on premium design, clean development, smooth user
              experience, and business-ready software that looks modern and works properly.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((item, index) => (
              <div
                key={item}
                className="min-w-0 rounded-[1.5rem] border border-blue-100/70 bg-white p-5 sm:rounded-[2rem] sm:p-7 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>
                <h2 className="mt-4 break-words text-xl font-black text-slate-950 sm:text-2xl">
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
