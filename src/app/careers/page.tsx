import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Growblic",
  description:
    "Join Growblic and build premium websites, apps, SaaS products, and automation systems for modern businesses.",
};

const openings = [
  {
    role: "Frontend Developer",
    type: "Full-time / Internship",
    location: "Remote / India",
    description:
      "Build premium web interfaces using Next.js, React, Tailwind CSS, and modern UI patterns.",
    skills: ["Next.js", "React", "Tailwind", "UI polish"],
  },
  {
    role: "Backend Developer",
    type: "Full-time / Internship",
    location: "Remote / India",
    description:
      "Work on APIs, dashboards, business tools, and scalable backend systems for real products.",
    skills: ["Node.js", "NestJS", "APIs", "Database"],
  },
  {
    role: "UI/UX Designer",
    type: "Part-time / Internship",
    location: "Remote / India",
    description:
      "Design clean, premium, conversion-focused screens for websites, apps, and SaaS dashboards.",
    skills: ["Figma", "Wireframes", "Design systems", "Prototyping"],
  },
  {
    role: "Digital Marketing Executive",
    type: "Part-time / Internship",
    location: "Remote / India",
    description:
      "Help Growblic and clients grow through SEO, Google Ads, Meta Ads, content, and lead generation.",
    skills: ["SEO", "Google Ads", "Meta Ads", "Content"],
  },
];

const benefits = [
  "Work on real software products",
  "Learn modern web and app development",
  "Remote-friendly workflow",
  "Premium design and product culture",
  "Growth-focused team environment",
  "Opportunity to work with business clients",
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#f6f8ff] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.35),transparent_35%),linear-gradient(120deg,rgba(15,23,42,0.75),rgba(2,6,23,0.95))]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative mx-auto flex min-h-[640px] max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-blue-100">
              Careers at Growblic
            </p>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Ready to grow your career?
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Join Growblic and work on premium websites, mobile apps, SaaS products,
              automation systems, dashboards, and real business software.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#open-positions"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-black/30 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                See open positions
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Contact Growblic
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10" id="open-positions">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-700">
              Open positions
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Build real products with us.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            We are building a focused team of developers, designers, and growth people
            who want to learn fast and create high-quality digital products.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {openings.map((job) => (
            <article
              key={job.role}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-950">{job.role}</h3>
                  <p className="mt-2 text-sm font-bold text-blue-700">{job.type}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                  {job.location}
                </span>
              </div>

              <p className="mt-5 leading-7 text-slate-600">{job.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-7 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Apply now →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.20)] sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-300">
                Why join Growblic
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Learn, build, improve, and grow.
              </h2>
              <p className="mt-5 leading-8 text-slate-300">
                Growblic is focused on real execution: clean design, strong development,
                business results, and continuous improvement.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                >
                  <p className="font-bold text-white">✓ {benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-10">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-700">
            Join our team
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
            Want to work with Growblic?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600">
            Send your details, portfolio, GitHub, resume, or work samples. Our team will
            review and contact you when there is a matching opportunity.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Apply through contact →
          </Link>
        </div>
      </section>
    </main>
  );
}
