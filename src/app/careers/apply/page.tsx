import Link from "next/link";
import { Metadata } from "next";
import CareersApplyForm from "./CareersApplyForm";

export const metadata: Metadata = {
  title: "Apply | Growblic Careers",
  description:
    "Apply for jobs and internships at Growblic across development, design, and digital growth roles.",
};

export default function CareersApplyPage() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_84%,rgba(6,182,212,0.10),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
            Growblic Careers / Apply
          </p>

          <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Apply to build real products with Growblic.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            Share your details, preferred role, and best work link. We review
            every application with care and reach out when there is a strong fit.
          </p>

          <Link
            href="/careers/openings"
            className="mt-9 inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
          >
            View Openings
          </Link>
        </div>

        <CareersApplyForm />
      </div>
    </section>
  );
}
