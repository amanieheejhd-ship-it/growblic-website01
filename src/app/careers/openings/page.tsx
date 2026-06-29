import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Openings | Growblic Careers",
  description:
    "Explore current jobs and internship opportunities at Growblic for developers, designers, and digital growth roles.",
};

const openings = [
  {
    title: "Frontend Developer",
    type: "Job",
    desc: "Build premium Next.js and React interfaces for websites, dashboards, and SaaS products.",
  },
  {
    title: "Backend Developer",
    type: "Job",
    desc: "Create APIs, dashboards, authentication systems, databases, and scalable backend workflows.",
  },
  {
    title: "UI/UX Designer",
    type: "Job",
    desc: "Design clean product screens, landing pages, app flows, dashboards, and design systems.",
  },
  {
    title: "Digital Marketing Executive",
    type: "Job",
    desc: "Work on SEO, Google Ads, Meta Ads, content, lead generation, and growth campaigns.",
  },
  {
    title: "Frontend Developer Internship",
    type: "Internship",
    desc: "Learn React, Next.js, Tailwind CSS, responsive design, and premium website development on real projects.",
  },
  {
    title: "Backend Developer Internship",
    type: "Internship",
    desc: "Learn APIs, databases, authentication, admin panels, dashboards, and backend systems.",
  },
  {
    title: "UI/UX Design Internship",
    type: "Internship",
    desc: "Learn Figma, wireframes, landing pages, mobile app screens, and clean design systems.",
  },
  {
    title: "Digital Marketing Internship",
    type: "Internship",
    desc: "Learn SEO basics, content planning, Google Ads, Meta Ads, and lead-generation strategy.",
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
            Choose your next role or internship at Growblic.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            Explore current jobs and internship opportunities for developers,
            designers, and growth-focused people.
          </p>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {openings.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/55 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-black text-slate-950">
                    {item.title}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      item.type === "Internship"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <p className="mt-4 leading-8 text-slate-600">{item.desc}</p>

                <Link
                  href="/careers/apply"
                  className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Apply now →
                </Link>
              </article>
            ))}
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
        </div>
      </section>
    </>
  );
}
