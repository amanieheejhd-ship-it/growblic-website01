"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import Scroll3DSection from "../../../components/Scroll3DSection";

type Opening = {
  title: string;
  type: string;
  area: string;
  location: string;
  experience: string;
  desc: string;
};

type FilterKey =
  | "All Roles"
  | "Jobs"
  | "Internships"
  | "Remote"
  | "Design"
  | "Engineering"
  | "Marketing";

const filters: FilterKey[] = [
  "All Roles",
  "Jobs",
  "Internships",
  "Remote",
  "Design",
  "Engineering",
  "Marketing",
];

function searchableText(opening: Opening) {
  return [
    opening.title,
    opening.type,
    opening.area,
    opening.location,
    opening.experience,
    opening.desc,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesFilter(opening: Opening, filter: FilterKey) {
  const text = searchableText(opening);

  if (filter === "All Roles") return true;
  if (filter === "Jobs") return opening.type.toLowerCase() === "job";
  if (filter === "Internships") return opening.type.toLowerCase() === "internship";
  if (filter === "Remote") {
    return text.includes("remote") || text.includes("hybrid") || text.includes("remote-first");
  }
  if (filter === "Design") {
    return text.includes("design") || text.includes("ui/ux");
  }
  if (filter === "Engineering") {
    return (
      text.includes("engineering") ||
      text.includes("frontend") ||
      text.includes("backend") ||
      text.includes("software") ||
      text.includes("developer")
    );
  }
  if (filter === "Marketing") {
    return text.includes("marketing") || text.includes("growth");
  }

  return true;
}

export default function CareersOpeningsList({ openings }: { openings: Opening[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All Roles");

  const filteredOpenings = useMemo(
    () => openings.filter((opening) => matchesFilter(opening, activeFilter)),
    [activeFilter, openings],
  );

  return (
    <div className="mt-10">
      <div className="-mx-6 overflow-x-auto px-6 pb-3 sm:mx-0 sm:px-0">
        <div
          className="flex min-w-max gap-3"
          role="tablist"
          aria-label="Filter career openings"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={`group inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  isActive
                    ? "border-blue-500 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white shadow-blue-500/30"
                    : "border-white/80 bg-white/72 text-slate-600 shadow-blue-100/45 backdrop-blur-xl hover:border-blue-200 hover:bg-white hover:text-blue-700"
                }`}
              >
                <span>{filter}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
        Showing {filteredOpenings.length} {filteredOpenings.length === 1 ? "role" : "roles"}
      </p>

      {filteredOpenings.length > 0 ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filteredOpenings.map((item, index) => {
            const isInternship = item.type === "Internship";
            const Icon = isInternship ? GraduationCap : Briefcase;

            return (
              <Scroll3DSection key={item.title} delay={index * 0.035}>
                <article className="group relative flex h-full min-h-96 flex-col overflow-hidden rounded-[2rem] border border-white/85 bg-white/74 shadow-[0_24px_80px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/75 backdrop-blur-2xl transition duration-200 ease-out hover:border-blue-200 hover:shadow-[0_32px_100px_rgba(37,99,235,0.2)] focus-within:border-blue-300 focus-within:shadow-[0_32px_100px_rgba(37,99,235,0.2)] motion-reduce:transition-none">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-blue-500/16 via-cyan-300/12 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/45 blur-3xl transition duration-300 group-hover:bg-cyan-200/60 group-focus-within:bg-cyan-200/60 motion-reduce:transition-none" />
                  <div className="pointer-events-none absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-cyan-200/25 blur-3xl transition duration-300 group-hover:bg-blue-200/40 group-focus-within:bg-blue-200/40 motion-reduce:transition-none" />
                  <div className="pointer-events-none absolute inset-px rounded-[1.95rem] border border-white/70" />

                  <div className="relative flex h-full flex-col p-7">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/90 bg-white/78 text-blue-700 shadow-[0_18px_45px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/80 backdrop-blur-xl transition duration-200 group-hover:bg-blue-50 group-focus-within:bg-blue-50 motion-reduce:transition-none">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="flex flex-wrap justify-end gap-2">
                        <span className="rounded-full border border-blue-100/90 bg-white/68 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm shadow-blue-100/50 backdrop-blur-xl">
                          {item.area}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-black shadow-sm backdrop-blur-xl ${
                            isInternship
                              ? "border-cyan-100/90 bg-cyan-50/72 text-cyan-700 shadow-cyan-100/50"
                              : "border-slate-200/80 bg-white/68 text-slate-700 shadow-blue-100/40"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <h2 className="relative mt-6 text-2xl font-black tracking-tight text-slate-950">
                      {item.title}
                    </h2>
                    <div className="relative mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-blue-100/90 bg-white/68 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm shadow-blue-100/40 backdrop-blur-xl">
                        {item.location}
                      </span>
                      <span className="rounded-full border border-blue-100/90 bg-white/68 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm shadow-blue-100/40 backdrop-blur-xl">
                        {item.experience}
                      </span>
                    </div>
                    <p className="relative mt-5 flex-1 leading-8 text-slate-600">
                      {item.desc}
                    </p>

                    <div className="relative mt-auto pt-6">
                      <Link
                        href="/careers/apply"
                        className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.14)] transition-all duration-200 ease-out hover:border-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-700 active:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 motion-reduce:transition-none motion-reduce:md:translate-y-0"
                      >
                        Apply now →
                      </Link>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-x-8 bottom-0 h-1 rounded-t-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-200 opacity-70 transition duration-300 group-hover:inset-x-5 group-hover:opacity-100 group-focus-within:inset-x-5 group-focus-within:opacity-100 motion-reduce:transition-none" />
                </article>
              </Scroll3DSection>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-blue-100 bg-white/82 p-8 text-center shadow-xl shadow-blue-100/55 ring-1 ring-blue-100/70 backdrop-blur-xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            No roles found for this filter.
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-semibold leading-7 text-slate-600">
            Try another category or view every current Growblic opening.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("All Roles")}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            View all roles
          </button>
        </div>
      )}
    </div>
  );
}
