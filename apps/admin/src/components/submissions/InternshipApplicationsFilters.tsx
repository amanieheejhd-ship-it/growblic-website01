"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  updateInternshipApplicationsFilterQuery,
  type InternshipApplicationsFilterName,
} from "./internship-applications-filter-query";

const SEARCH_DEBOUNCE_MS = 400;

export default function InternshipApplicationsFilters({
  statuses,
}: {
  statuses: readonly string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(querySearch);
  const latestQueryRef = useRef(searchParams.toString());
  const statusValue = statuses.includes(searchParams.get("status") ?? "")
    ? searchParams.get("status") ?? ""
    : "";
  const enrollmentParameter = searchParams.get("enrolledInInstitute");
  const enrollmentValue =
    enrollmentParameter === "yes" || enrollmentParameter === "no"
      ? enrollmentParameter
      : "";

  useEffect(() => {
    latestQueryRef.current = searchParams.toString();
  }, [searchParams]);

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  const replaceParameter = useCallback(
    (name: InternshipApplicationsFilterName, value: string) => {
      latestQueryRef.current = updateInternshipApplicationsFilterQuery(
        latestQueryRef.current,
        name,
        value,
      );
      router.replace(
        latestQueryRef.current ? `${pathname}?${latestQueryRef.current}` : pathname,
        { scroll: false },
      );
    },
    [pathname, router],
  );

  useEffect(() => {
    if (search === querySearch) return;
    const timeout = window.setTimeout(
      () => replaceParameter("search", search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [querySearch, replaceParameter, search]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <label className="sr-only" htmlFor="submission-search">Search</label>
      <input
        id="submission-search"
        type="text"
        value={search}
        maxLength={120}
        placeholder="Search submissions"
        aria-label="Search submissions"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        onChange={(event) => setSearch(event.target.value)}
      />
      <label className="sr-only" htmlFor="submission-status">Status</label>
      <select
        id="submission-status"
        value={statusValue}
        aria-label="Status"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        onChange={(event) => replaceParameter("status", event.target.value)}
      >
        <option value="">All statuses</option>
        {statuses.map((value) => (
          <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="submission-enrolledInInstitute">
        Institute enrollment
      </label>
      <select
        id="submission-enrolledInInstitute"
        value={enrollmentValue}
        aria-label="Institute enrollment"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        onChange={(event) =>
          replaceParameter("enrolledInInstitute", event.target.value)
        }
      >
        <option value="">All institute types</option>
        <option value="yes">Enrolled: Yes</option>
        <option value="no">Enrolled: No</option>
      </select>
    </div>
  );
}
