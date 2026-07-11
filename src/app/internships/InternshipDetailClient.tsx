"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import type { Internship } from "./internship-data";

type Props = {
  internship: Internship;
  internships: Internship[];
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function PremiumDetailCard({
  number,
  title,
  items,
}: {
  number: string;
  title: string;
  items: string[];
}) {
  return (
    <section className="group overflow-hidden rounded-[30px] border border-blue-100 bg-white/90 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(37,99,235,0.13)]">
      <div className="flex items-center gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-5 sm:px-8">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-black text-white shadow-lg shadow-blue-200">
          {number}
        </span>

        <h2 className="text-xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
      </div>

      <ul className="space-y-4 p-6 sm:p-8">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm font-semibold leading-7 text-slate-600 sm:text-[15px]"
          >
            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600 ring-1 ring-blue-200">
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
  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const value = (name: string) =>
      String(formData.get(name) || "").trim();

    const subject = encodeURIComponent(
      `Growblic Internship Application - ${internship.title}`,
    );

    const body = encodeURIComponent(
      [
        "GROWBLIC INTERNSHIP APPLICATION",
        "--------------------------------",
        `Selected role: ${internship.title}`,
        "",
        "PERSONAL DETAILS",
        `Full name: ${value("fullName")}`,
        `Email: ${value("email")}`,
        `Phone: ${value("phone")}`,
        `City: ${value("city") || "Not provided"}`,
        "",
        "EDUCATION",
        `College or institute: ${value("college") || "Not provided"}`,
        `Current course: ${value("course")}`,
        `Current year or semester: ${value("year") || "Not provided"}`,
        "",
        "SKILLS",
        value("skills") || "Not provided",
        "",
        "PROFILE LINKS",
        `Portfolio: ${value("portfolio") || "Not provided"}`,
        `GitHub: ${value("github") || "Not provided"}`,
        `LinkedIn: ${value("linkedin") || "Not provided"}`,
        `Other link: ${value("otherLink") || "Not provided"}`,
        "",
        "WHY I WANT THIS INTERNSHIP",
        value("reason"),
      ].join("\n"),
    );

    window.location.href =
      `mailto:hello@growblic.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_36%),linear-gradient(135deg,#f7f9ff_0%,#ffffff_55%,#eff9ff_100%)] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="w-fit rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-blue-700 shadow-sm">
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
                    ? "rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-xs font-black text-white shadow-lg shadow-blue-200"
                    : "rounded-full border border-blue-100 bg-white px-5 py-3 text-xs font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                }
              >
                {role.shortTitle}
              </Link>
            );
          })}
        </nav>

        <section className="relative mt-10 overflow-hidden rounded-[36px] border border-blue-100 bg-white/85 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.13)] backdrop-blur-sm sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="relative max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
              Learn • Build • Grow
            </p>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              {internship.title}
            </h1>

            <p className="mt-7 max-w-4xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              {internship.overview}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
                Real project exposure
              </span>

              <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">
                Guided learning
              </span>

              <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">
                Beginner focused
              </span>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <PremiumDetailCard
            number="01"
            title="What the intern will learn"
            items={internship.learn}
          />

          <PremiumDetailCard
            number="02"
            title="Basic responsibilities"
            items={internship.responsibilities}
          />

          <section className="group overflow-hidden rounded-[30px] border border-blue-100 bg-white/90 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(37,99,235,0.13)]">
            <div className="flex items-center gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-5 sm:px-8">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-black text-white shadow-lg shadow-blue-200">
                03
              </span>

              <h2 className="text-xl font-black tracking-tight text-slate-950">
                Education and eligibility
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold leading-8 text-slate-600 sm:text-[15px]">
                {internship.eligibility}
              </p>

              <div className="mt-6 rounded-2xl border border-cyan-100 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 p-4">
                <p className="text-sm font-bold leading-7 text-slate-700">
                  Professional experience is not compulsory. Interested
                  students and serious self-taught beginners may also apply.
                </p>
              </div>
            </div>
          </section>

          <PremiumDetailCard
            number="04"
            title="Skills you can bring"
            items={internship.skills}
          />
        </div>

        <section className="mt-10 overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-[0_30px_100px_rgba(37,99,235,0.14)]">
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-8 sm:px-10">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">
              Internship application
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Apply for {internship.title}
            </h2>

            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              Fill the important details below. Profile links and some
              education details are optional.
            </p>
          </div>

          <form
            onSubmit={submitApplication}
            className="space-y-7 p-5 sm:p-8 lg:p-10"
          >
            <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  01 • Personal details
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-black text-slate-800">
                  Full name *
                  <input
                    name="fullName"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  Email address *
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  Phone number *
                  <input
                    type="tel"
                    name="phone"
                    required
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  City
                  <input
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Your city"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  02 • Education and skills
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-black text-slate-800 md:col-span-2">
                  College or institute
                  <input
                    name="college"
                    placeholder="College, university or institute"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  Current course *
                  <select
                    name="course"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select your course
                    </option>
                    <option>BCA</option>
                    <option>MCA</option>
                    <option>B.Tech / B.E.</option>
                    <option>B.Sc Computer Science</option>
                    <option>BBA</option>
                    <option>B.Com</option>
                    <option>BA</option>
                    <option>MBA</option>
                    <option>Diploma</option>
                    <option>Certification course</option>
                    <option>Self-taught learner</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="text-sm font-black text-slate-800">
                  Current year or semester
                  <select
                    name="year"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="">Select year or semester</option>
                    <option>1st year</option>
                    <option>2nd year</option>
                    <option>3rd year</option>
                    <option>4th year</option>
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                    <option>Semester 5</option>
                    <option>Semester 6</option>
                    <option>Semester 7</option>
                    <option>Semester 8</option>
                    <option>Completed</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="text-sm font-black text-slate-800 md:col-span-2">
                  Skills
                  <input
                    name="skills"
                    placeholder="Example: React, Node.js, Figma, SEO, communication"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  03 • Profile links
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Ye saare fields optional hain.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-black text-slate-800">
                  Portfolio
                  <input
                    type="url"
                    name="portfolio"
                    placeholder="https://yourportfolio.com"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  GitHub
                  <input
                    type="url"
                    name="github"
                    placeholder="https://github.com/username"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  LinkedIn
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  Other useful link
                  <input
                    type="url"
                    name="otherLink"
                    placeholder="Behance, Dribbble or project link"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <label className="text-sm font-black text-slate-800">
                Why do you want this internship? *
                <textarea
                  name="reason"
                  required
                  rows={5}
                  placeholder="Write a few lines about what you want to learn and why this role interests you."
                  className={`${inputClass} resize-y`}
                />
              </label>
            </section>

            <div className="flex flex-col gap-5 rounded-[28px] bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black">
                  {internship.title}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Submit karne ke baad Growblic ko email application open hogi.
                </p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Submit application →
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
