"use client";

import Link from "next/link";
import {
  FormEvent,
  useRef,
  useState,
} from "react";
import type { Internship } from "./internship-data";

type Props = {
  internship: Internship;
  internships: Internship[];
};

function DetailList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-[28px] border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      <h2 className="text-xl font-black tracking-tight text-slate-950">
        {title}
      </h2>

      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-600 sm:text-base"
          >
            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-500 text-xs font-black text-blue-600">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function InternshipDetailClient({
  internship,
  internships,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef<HTMLElement | null>(null);

  function openApplicationForm() {
    setFormOpen(true);

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const subject = encodeURIComponent(
      `Growblic Internship Application - ${internship.title}`,
    );

    const body = encodeURIComponent(
      [
        `Internship role: ${internship.title}`,
        "",
        `Full name: ${String(formData.get("fullName") || "")}`,
        `Email: ${String(formData.get("email") || "")}`,
        `Phone: ${String(formData.get("phone") || "")}`,
        `City: ${String(formData.get("city") || "")}`,
        `College or institute: ${String(formData.get("college") || "")}`,
        `Current course: ${String(formData.get("course") || "")}`,
        `Current year or semester: ${String(formData.get("year") || "")}`,
        "",
        `Skills:`,
        String(formData.get("skills") || ""),
        "",
        `Portfolio/GitHub/LinkedIn: ${String(formData.get("portfolio") || "")}`,
        "",
        `Why I want this internship:`,
        String(formData.get("reason") || ""),
      ].join("\n"),
    );

    window.location.href =
      `mailto:hello@growblic.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.13),transparent_38%),linear-gradient(135deg,#f7f9ff_0%,#ffffff_55%,#eef8ff_100%)] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-blue-700 shadow-sm">
          Growblic Careers / Internships
        </p>

        <nav
          aria-label="Internship roles"
          className="mt-6 flex flex-wrap gap-2"
        >
          {internships.map((role) => {
            const active = role.slug === internship.slug;
            const href =
              role.slug === "frontend-developer"
                ? "/internships"
                : `/internships/${role.slug}`;

            return (
              <Link
                key={role.slug}
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-200 transition"
                    : "rounded-full border border-blue-100 bg-white/90 px-4 py-2.5 text-xs font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                }
              >
                {role.shortTitle}
              </Link>
            );
          })}
        </nav>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              {[
                internship.category,
                "Internship",
                "Remote / India",
                "Beginner friendly",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-black text-slate-600 shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              {internship.title}
            </h1>

            <p className="mt-7 max-w-3xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              {internship.overview}
            </p>
          </div>

          <aside className="overflow-hidden rounded-[30px] border border-blue-100 bg-white/80 shadow-[0_24px_70px_rgba(37,99,235,0.12)] backdrop-blur-sm">
            <div className="bg-[linear-gradient(135deg,rgba(219,234,254,0.95),rgba(207,250,254,0.7))] p-7">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                🎓
              </span>
            </div>

            <div className="p-7">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Internship mode
              </h2>

              <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
                {internship.mode}
              </p>
            </div>
          </aside>
        </section>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <DetailList
            title="What the intern will learn"
            items={internship.learn}
          />

          <DetailList
            title="Basic responsibilities"
            items={internship.responsibilities}
          />

          <section className="rounded-[28px] border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              Suitable education/course eligibility
            </h2>

            <p className="mt-6 text-sm font-semibold leading-8 text-slate-600 sm:text-base">
              {internship.eligibility}
            </p>
          </section>

          <DetailList
            title="Skills required"
            items={internship.skills}
          />
        </div>

        <section className="mt-6 rounded-[28px] border border-cyan-100 bg-cyan-50/70 p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">
            Beginners are welcome
          </h2>

          <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
            Professional experience is not compulsory. Students from related
            fields and serious self-taught beginners may apply. Basic knowledge,
            willingness to learn, and consistent participation are important.
          </p>
        </section>

        <section className="mt-10 rounded-[28px] border border-blue-100 bg-white/70 p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Ready to apply?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
            Read the role details carefully, then open the application form.
          </p>

          <button
            type="button"
            onClick={openApplicationForm}
            disabled={formOpen}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-default disabled:bg-slate-500"
          >
            {formOpen ? "Application form opened" : "Apply now →"}
          </button>
        </section>

        {formOpen && (
          <section
            ref={formRef}
            className="scroll-mt-8 mt-8 rounded-[30px] border border-blue-100 bg-white p-6 shadow-[0_24px_80px_rgba(37,99,235,0.12)] sm:p-9"
          >
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Apply for {internship.title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              This static website will prepare an email to Growblic containing
              your application details. It will not show a fake successful
              submission.
            </p>

            <form
              onSubmit={submitApplication}
              className="mt-8 grid gap-6 md:grid-cols-2"
            >
              <label className="space-y-2 text-sm font-black text-slate-800">
                Full name
                <input
                  name="fullName"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800">
                Email address
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800">
                Phone number
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800">
                City
                <input
                  name="city"
                  required
                  placeholder="Your city"
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800 md:col-span-2">
                College or institute name
                <input
                  name="college"
                  required
                  placeholder="College or institute"
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800">
                Current course
                <input
                  name="course"
                  required
                  placeholder="BCA, B.Tech, BBA, diploma..."
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800">
                Current year or semester
                <input
                  name="year"
                  required
                  placeholder="2nd year, semester 4..."
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800 md:col-span-2">
                Skills
                <textarea
                  name="skills"
                  required
                  rows={4}
                  placeholder="List your relevant skills, tools, or beginner-level experience."
                  className="w-full resize-y rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800 md:col-span-2">
                Portfolio/GitHub/LinkedIn URL
                <input
                  type="url"
                  name="portfolio"
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 text-sm font-black text-slate-800 md:col-span-2">
                Why do you want this internship?
                <textarea
                  name="reason"
                  required
                  rows={5}
                  placeholder="Tell us what you want to learn and why this internship fits you."
                  className="w-full resize-y rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
                >
                  Submit application →
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
