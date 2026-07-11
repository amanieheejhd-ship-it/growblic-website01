import Link from "next/link";
import { Metadata } from "next";
import Scroll3DSection from "../../../components/Scroll3DSection";
import CareersOpeningsList from "./CareersOpeningsList";

export const metadata: Metadata = {
  title: "Openings | Growblic Careers",
  description:
    "Explore current job opportunities at Growblic for developers, designers, and digital growth roles.",
};

const openings = [
  {
    title: "Frontend Developer",
    slug: "frontend-developer",
    type: "Job",
    area: "Engineering",
    location: "Remote / India",
    experience: "1+ years",
    desc: "Build premium Next.js and React interfaces for websites, dashboards, and SaaS products.",
  },
  {
    title: "Backend Developer",
    slug: "backend-developer",
    type: "Job",
    area: "Engineering",
    location: "Remote / India",
    experience: "1+ years",
    desc: "Create APIs, dashboards, authentication systems, databases, and scalable backend workflows.",
  },
  {
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    type: "Job",
    area: "Design",
    location: "Remote / India",
    experience: "Portfolio-led",
    desc: "Design clean product screens, landing pages, app flows, dashboards, and design systems.",
  },
  {
    title: "Digital Marketing Executive",
    slug: "digital-marketing-executive",
    type: "Job",
    area: "Marketing",
    location: "Remote / India",
    experience: "Growth-minded",
    desc: "Work on SEO, Google Ads, Meta Ads, content, lead generation, and growth campaigns.",
  },
];

export default function OpeningsPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
            Growblic Careers / Openings
          </p>

          <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Choose your next role at Growblic.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            Explore current job opportunities for developers, designers, and
            growth-focused people who want to build real products with Growblic.
          </p>

          <CareersOpeningsList openings={openings} />

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
            >
              Back to Careers
            </Link>
            <Link
              href="/careers/perks"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              See Perks →
            </Link>
          </div>

          <Scroll3DSection className="mt-14">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/82 p-7 shadow-[0_24px_80px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/45 blur-3xl" />
              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-950">
                    Don’t see the right role?
                  </h2>
                  <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-600">
                    Send your profile anyway. If your work fits Growblic’s product standards,
                    we can explore future openings or project-based collaboration.
                  </p>
                </div>
                <Link
                  href="/careers/apply"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Apply anyway →
                </Link>
              </div>
            </div>
          </Scroll3DSection>
        </div>
      </section>
    </>
  );
}
