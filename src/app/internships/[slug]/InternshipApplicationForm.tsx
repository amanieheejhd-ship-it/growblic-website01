"use client";

import { useState, type FormEvent } from "react";

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "info" | "error"; message: string };

const fieldClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-blue-100/40 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

const labelClass = "text-sm font-black text-slate-800";

export default function InternshipApplicationForm({
  internshipTitle,
}: {
  internshipTitle: string;
}) {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "college",
      "course",
      "year",
      "city",
      "skills",
      "profileUrl",
      "why",
    ];
    const hasMissingField = requiredFields.some(
      (field) => !String(form.get(field) ?? "").trim(),
    );

    if (hasMissingField) {
      setStatus({
        type: "error",
        message: "Please complete every required field before submitting.",
      });
      return;
    }

    const lines = [
      `Internship: ${internshipTitle}`,
      `Full name: ${form.get("fullName")}`,
      `Email: ${form.get("email")}`,
      `Phone: ${form.get("phone")}`,
      `College or institute: ${form.get("college")}`,
      `Current course: ${form.get("course")}`,
      `Current year or semester: ${form.get("year")}`,
      `City: ${form.get("city")}`,
      "",
      "Skills:",
      String(form.get("skills")),
      "",
      `Portfolio/GitHub/LinkedIn URL: ${form.get("profileUrl")}`,
      "",
      "Why do you want this internship?",
      String(form.get("why")),
    ];
    const subject = `Growblic Internship Application - ${internshipTitle}`;
    const mailtoUrl = `mailto:hello@growblic.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;

    setStatus({
      type: "info",
      message:
        "No server application endpoint is connected here, so your email app will open with the application details filled in.",
    });
    window.location.href = mailtoUrl;
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Full name
          <input
            className={fieldClass}
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            required
          />
        </label>

        <label className={labelClass}>
          Email address
          <input
            className={fieldClass}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Phone number
          <input
            className={fieldClass}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            required
          />
        </label>

        <label className={labelClass}>
          City
          <input
            className={fieldClass}
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="Your city"
            required
          />
        </label>
      </div>

      <label className={labelClass}>
        College or institute name
        <input
          className={fieldClass}
          name="college"
          type="text"
          placeholder="College or institute"
          required
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Current course
          <input
            className={fieldClass}
            name="course"
            type="text"
            placeholder="BCA, B.Tech, BBA, diploma..."
            required
          />
        </label>

        <label className={labelClass}>
          Current year or semester
          <input
            className={fieldClass}
            name="year"
            type="text"
            placeholder="2nd year, semester 4..."
            required
          />
        </label>
      </div>

      <label className={labelClass}>
        Skills
        <textarea
          className={`${fieldClass} min-h-28 resize-y leading-7`}
          name="skills"
          placeholder="List your relevant skills, tools, or beginner-level experience."
          required
        />
      </label>

      <label className={labelClass}>
        Portfolio/GitHub/LinkedIn URL
        <input
          className={fieldClass}
          name="profileUrl"
          type="text"
          inputMode="url"
          placeholder="https://..."
          required
        />
      </label>

      <label className={labelClass}>
        Why do you want this internship?
        <textarea
          className={`${fieldClass} min-h-36 resize-y leading-7`}
          name="why"
          placeholder="Tell us what you want to learn and why this internship fits you."
          required
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
      >
        Submit application
      </button>

      {status.message && (
        <p
          className={`rounded-2xl border px-5 py-4 text-sm font-semibold leading-6 ${
            status.type === "error"
              ? "border-rose-100 bg-rose-50 text-rose-700"
              : "border-blue-100 bg-blue-50/70 text-blue-700"
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
