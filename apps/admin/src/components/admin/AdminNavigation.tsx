"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const activeLinks = [
  ["Dashboard", "/"],
  ["Contact Messages", "/contact-messages/"],
  ["Project Requests", "/project-requests/"],
  ["Price Calculator Leads", "/price-calculator-leads/"],
  ["Meetup Requests", "/meetup-requests/"],
  ["Career Applications", "/career-applications/"],
  ["Internship Applications", "/internship-applications/"],
] as const;
const futureLinks = ["Products", "Services", "Portfolio", "Settings"];

export default function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin modules" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {activeLinks.map(([label, href]) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${active ? "bg-indigo-700 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}>
            {label}
          </Link>
        );
      })}
      {futureLinks.map((label) => <span key={label} aria-disabled="true" className="whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-400">{label}</span>)}
    </nav>
  );
}
