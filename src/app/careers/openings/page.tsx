import Link from "next/link";
import { Metadata } from "next";
import { Briefcase, GraduationCap } from "lucide-react";
import Scroll3DSection from "../../../components/Scroll3DSection";

export const metadata: Metadata = {
  title: "Openings | Growblic Careers",
  description:
    "Explore current jobs and internship opportunities at Growblic for developers, designers, and digital growth roles.",
};

const openings = [
  {
    title: "Frontend Developer",
    type: "Job",
    area: "Engineering",
    location: "Remote / India",
    experience: "1+ years",
    desc: "Build premium Next.js and React interfaces for websites, dashboards, and SaaS products.",
  },
  {
    title: "Backend Developer",
    type: "Job",
    area: "Engineering",
    location: "Remote / India",
    experience: "1+ years",
    desc: "Create APIs, dashboards, authentication systems, databases, and scalable backend workflows.",
  },
  {
    title: "UI/UX Designer",
    type: "Job",
    area: "Design",
    location: "Remote / India",
    experience: "Portfolio-led",
    desc: "Design clean product screens, landing pages, app flows, dashboards, and design systems.",
  },
  {
    title: "Digital Marketing Executive",
    type: "Job",
    area: "Marketing",
    location: "Remote / India",
    experience: "Growth-minded",
    desc: "Work on SEO, Google Ads, Meta Ads, content, lead generation, and growth campaigns.",
  },
  {
    title: "Frontend Developer Internship",
    type: "Internship",
    area: "Engineering",
    location: "Remote / India",
    experience: "Beginner friendly",
    desc: "Learn React, Next.js, Tailwind CSS, responsive design, and premium website development on real projects.",
  },
  {
    title: "Backend Developer Internship",
    type: "Internship",
    area: "Engineering",
    location: "Remote / India",
    experience: "Beginner friendly",
    desc: "Learn APIs, databases, authentication, admin panels, dashboards, and backend systems.",
  },
  {
    title: "UI/UX Design Internship",
    type: "Internship",
    area: "Design",
    location: "Remote / India",
    experience: "Beginner friendly",
    desc: "Learn Figma, wireframes, landing pages, mobile app screens, and clean design systems.",
  },
  {
    title: "Digital Marketing Internship",
    type: "Internship",
    area: "Marketing",
    location: "Remote / India",
    experience: "Beginner friendly",
    desc: "Learn SEO basics, content planning, Google Ads, Meta Ads, and lead-generation strategy.",
  },
];

const filterPills = ["All roles", "Jobs", "Internships", "Remote", "Design", "Engineering", "Marketing"];

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
            Choose your next role or internship at Growblic.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            Explore current jobs and internship opportunities for developers,
            designers, and growth-focused people.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {filterPills.map((item, index) => (
              <span
                key={item}
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-100/35 ${
                  index === 0
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-blue-100 bg-white/78 text-slate-600"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {openings.map((item, index) => {
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
