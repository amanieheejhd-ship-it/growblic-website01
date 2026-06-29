import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic Brand",
  description:
    "Growblic brand guidelines for logo usage, colors, partnerships, and brand consistency.",
  path: "/brand",
});

const brandSections = [
  {
    id: "logo-usage",
    title: "Logo Usage",
    text: "Use the Growblic identity clearly, with enough spacing, proper contrast, and no distortion.",
  },
  {
    id: "colors",
    title: "Colors",
    text: "Growblic uses a clean white and blue visual language with subtle cyan accents and premium spacing.",
  },
  {
    id: "partnerships",
    title: "Partnerships",
    text: "For collaboration, co-marketing, or partner usage, contact Growblic before publishing brand material.",
  },
];

export default function BrandPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Brand
            </p>
            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Brand clarity for every Growblic touchpoint.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              Growblic brand materials should stay clean, consistent, and respectful.
              Do not misuse, imitate, distort, or falsely represent the Growblic identity.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {brandSections.map((section, index) => (
              <article
                id={section.id}
                key={section.id}
                className="scroll-mt-24 rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50"
              >
                <span className="text-sm font-black text-blue-600">0{index + 1}</span>
                <h2 className="mt-4 text-2xl font-black text-slate-950">{section.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  {section.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
