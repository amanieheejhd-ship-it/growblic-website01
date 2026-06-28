import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Culture | Growblic Careers",
  description: "A focused product culture built around execution, learning, trust, and premium work.",
};

export default function CulturePage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
            Growblic Careers / Culture
          </p>

          <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Inside Growblic culture.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            A focused product culture built around execution, learning, trust, and premium work.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/55 transition hover:-translate-y-1 hover:shadow-2xl">
              <h3 className="text-2xl font-black text-slate-950">Insights</h3>
              <p className="mt-4 leading-8 text-slate-600">How we think about products, design, and software delivery.</p>
            </article>
            <article className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/55 transition hover:-translate-y-1 hover:shadow-2xl">
              <h3 className="text-2xl font-black text-slate-950">Humans of Growblic</h3>
              <p className="mt-4 leading-8 text-slate-600">The people, mindset, and work style behind Growblic.</p>
            </article>
            <article className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/55 transition hover:-translate-y-1 hover:shadow-2xl">
              <h3 className="text-2xl font-black text-slate-950">Learning mindset</h3>
              <p className="mt-4 leading-8 text-slate-600">We improve every project, every screen, every system.</p>
            </article>
            <article className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/55 transition hover:-translate-y-1 hover:shadow-2xl">
              <h3 className="text-2xl font-black text-slate-950">Premium execution</h3>
              <p className="mt-4 leading-8 text-slate-600">We care about details because details build trust.</p>
            </article>
          </div>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
            >
              Back to Careers
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Contact Growblic →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
