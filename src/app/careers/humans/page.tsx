import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humans of Growblic | Growblic Careers",
  description:
    "Stories and people behind Growblic culture. More content will be added soon.",
};

export default function HumansPage() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
          Culture / Humans of Growblic
        </p>

        <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Humans of Growblic.
        </h1>

        <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
          This page is ready. You can add team stories, photos, interviews,
          and culture content here later.
        </p>

        <Link
          href="/careers"
          className="mt-12 inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Back to Careers
        </Link>
      </div>
    </section>
  );
}
