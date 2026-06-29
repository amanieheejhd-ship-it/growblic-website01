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

  const counts = useMemo(() => {
    return filters.reduce<Record<FilterKey, number>>(
      (acc, filter) => {
        acc[filter] = openings.filter((opening) => matchesFilter(opening, filter)).length;
        return acc;
      },
      {
        "All Roles": 0,
        Jobs: 0,
        Internships: 0,
        Remote: 0,
        Design: 0,
        Engineering: 0,
        Marketing: 0,
      },
    );
  }, [openings]);

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
                className={`group inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  isActive
                    ? "border-blue-500 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white shadow-blue-500/30"
                    : "border-white/80 bg-white/72 text-slate-600 shadow-blue-100/45 backdrop-blur-xl hover:border-blue-200 hover:bg-white hover:text-blue-700"
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[0.68rem] ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
                  }`}
                >
                  {counts[filter]}
                </span>
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
                <article className="group relative flex h-full min-h-80 flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-7 shadow-xl shadow-blue-100/55 ring-1 ring-blue-100/70 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/80">
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-200/45 blur-3xl transition group-hover:bg-cyan-200/55" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/80 bg-blue-50/80 text-blue-700 shadow-lg shadow-blue-100/70">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-wrap justify-end gap-2">
                      <span className="rounded-full border border-blue-100 bg-blue-50/85 px-3 py-1.5 text-xs font-black text-blue-700">
                        {item.area}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                          isInternship
                            ? "border-blue-100 bg-blue-50/85 text-blue-700"
                            : "border-slate-200 bg-white/85 text-slate-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <h2 className="relative mt-5 text-2xl font-black tracking-tight text-slate-950">
                    {item.title}
                  </h2>
                  <div className="relative mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-blue-100 bg-white/75 px-3 py-1.5 text-xs font-black text-slate-600">
                      {item.location}
                    </span>
                    <span className="rounded-full border border-blue-100 bg-white/75 px-3 py-1.5 text-xs font-black text-slate-600">
                      {item.experience}
                    </span>
                  </div>
                  <p className="relative mt-4 flex-1 leading-8 text-slate-600">
                    {item.desc}
                  </p>

                  <Link
                    href="/careers/apply"
                    className="relative mt-6 inline-flex w-fit rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Apply now →
                  </Link>
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
