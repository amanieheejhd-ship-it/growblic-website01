import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply | Growblic Careers",
  description:
    "Apply for jobs and internships at Growblic across development, design, and digital growth roles.",
};

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Digital Marketing Executive",
  "Frontend Developer Internship",
  "Backend Developer Internship",
  "UI/UX Design Internship",
  "Digital Marketing Internship",
];

const experienceLevels = [
  "Student / Fresher",
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5+ years",
];

const inputClass =
  "mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-blue-100/40 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

const labelClass = "text-sm font-black text-slate-800";

export default function CareersApplyPage() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_84%,rgba(6,182,212,0.10),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
            Growblic Careers / Apply
          </p>

          <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Apply to build real products with Growblic.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            Share your details, preferred role, and best work link. We review
            every application with care and reach out when there is a strong fit.
          </p>

          <Link
            href="/careers/openings"
            className="mt-9 inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
          >
            View Openings
          </Link>
        </div>

        <div className="rounded-[2.35rem] border border-blue-100 bg-white/92 p-6 shadow-2xl shadow-blue-100/70 backdrop-blur sm:p-8">
          <form className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Full name
                <input
                  className={inputClass}
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                />
              </label>

              <label className={labelClass}>
                Email
                <input
                  className={inputClass}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Phone
                <input
                  className={inputClass}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                />
              </label>

              <label className={labelClass}>
                Role applying for
                <select className={inputClass} name="role" defaultValue="">
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Experience level
                <select className={inputClass} name="experience" defaultValue="">
                  <option value="" disabled>
                    Select experience
                  </option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Portfolio / GitHub / Resume link
                <input
                  className={inputClass}
                  name="workLink"
                  type="url"
                  placeholder="https://..."
                />
              </label>
            </div>

            <label className={labelClass}>
              Message
              <textarea
                className={`${inputClass} min-h-36 resize-y leading-7`}
                name="message"
                placeholder="Tell us about your skills, work, availability, or why this role fits you."
              />
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Submit Application →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
