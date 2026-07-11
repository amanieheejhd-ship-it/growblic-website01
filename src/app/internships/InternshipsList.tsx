"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import Scroll3DSection from "../../components/Scroll3DSection";
import { internships, type Internship } from "./internshipData";

type FilterKey = "ALL INTERNSHIPS" | "ENGINEERING" | "DESIGN" | "MARKETING" | "REMOTE";

const filters: FilterKey[] = [
  "ALL INTERNSHIPS",
  "ENGINEERING",
  "DESIGN",
  "MARKETING",
  "REMOTE",
];

function matchesFilter(internship: Internship, filter: FilterKey) {
  if (filter === "ALL INTERNSHIPS") return true;
  if (filter === "REMOTE") return internship.location.toLowerCase().includes("remote");
  return internship.category.toUpperCase() === filter;
}

export default function InternshipsList() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL INTERNSHIPS");

  const visibleInternships = useMemo(
    () => internships.filter((internship) => matchesFilter(internship, activeFilter)),
    [activeFilter],
  );

  return (
    <div className="mt-10">
      <div className="-mx-6 overflow-x-auto px-6 pb-3 sm:mx-0 sm:px-0">
        <div
          className="flex min-w-max gap-3"
          role="tablist"
          aria-label="Filter internship opportunities"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  isActive
                    ? "border-blue-500 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white shadow-blue-500/30"
                    : "border-white/80 bg-white/72 text-slate-600 shadow-blue-100/45 backdrop-blur-xl hover:border-blue-200 hover:bg-white hover:text-blue-700"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
        Showing {visibleInternships.length}{" "}
        {visibleInternships.length === 1 ? "internship" : "internships"}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {visibleInternships.map((internship, index) => (
          <Scroll3DSection key={internship.slug} delay={index * 0.035}>
            <article className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[2rem] border border-white/85 bg-white/78 shadow-[0_24px_80px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/75 backdrop-blur-2xl transition duration-200 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_32px_100px_rgba(37,99,235,0.2)] focus-within:-translate-y-1 focus-within:border-blue-300 focus-within:shadow-[0_32px_100px_rgba(37,99,235,0.2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-blue-500/16 via-cyan-300/12 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/45 blur-3xl transition duration-300 group-hover:bg-cyan-200/60 group-focus-within:bg-cyan-200/60 motion-reduce:transition-none" />
              <div className="pointer-events-none absolute inset-px rounded-[1.95rem] border border-white/70" />

              <div className="relative flex h-full flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/90 bg-white/78 text-blue-700 shadow-[0_18px_45px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/80 backdrop-blur-xl transition duration-200 group-hover:bg-blue-50 group-focus-within:bg-blue-50 motion-reduce:transition-none">
                    <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    <span className="rounded-full border border-blue-100/90 bg-white/72 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm shadow-blue-100/50 backdrop-blur-xl">
                      {internship.category}
                    </span>
                    <span className="rounded-full border border-cyan-100/90 bg-cyan-50/72 px-3 py-1.5 text-xs font-black text-cyan-700 shadow-sm shadow-cyan-100/50 backdrop-blur-xl">
                      {internship.type}
                    </span>
                  </div>
                </div>

                <h2 className="relative mt-6 text-2xl font-black tracking-tight text-slate-950">
                  {internship.title}
                </h2>
                <div className="relative mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-100/90 bg-white/68 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm shadow-blue-100/40 backdrop-blur-xl">
                    {internship.location}
                  </span>
                  <span className="rounded-full border border-blue-100/90 bg-white/68 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm shadow-blue-100/40 backdrop-blur-xl">
                    {internship.experience}
                  </span>
                </div>
                <p className="relative mt-5 flex-1 leading-8 text-slate-600">
                  {internship.description}
                </p>

                <Link
                  href={`/internships/${internship.slug}`}
                  className="relative mt-6 inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  View internship →
                </Link>
              </div>

              <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-200 opacity-70 transition duration-300 group-hover:inset-x-5 group-hover:opacity-100 group-focus-within:inset-x-5 group-focus-within:opacity-100 motion-reduce:transition-none" />
            </article>
          </Scroll3DSection>
        ))}
      </div>
    </div>
  );
}
