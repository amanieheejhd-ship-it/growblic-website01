"use client";

import { useState, type FormEvent } from "react";

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

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success" | "error"; message: string };

const web3FormsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export default function CareersApplyForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!web3FormsAccessKey) {
      setStatus({
        type: "error",
        message:
          "Careers application form is not configured yet. Please email hello@growblic.com.",
      });
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const timestamp = new Date().toISOString();

    setSubmittedAt(timestamp);
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    form.set("access_key", web3FormsAccessKey);
    form.set("subject", "New careers application from Growblic Website");
    form.set("from_name", "Growblic Careers");
    form.set("source", "Growblic Website");
    form.set("page", "Careers Apply");
    form.set("submittedAt", timestamp);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit the application right now.");
      }

      formElement.reset();
      setSubmittedAt("");
      setStatus({
        type: "success",
        message:
          "Thanks! Your application has been sent. Growblic will review it and get back to you soon.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please email hello@growblic.com.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2.35rem] border border-blue-100 bg-white/92 p-6 shadow-2xl shadow-blue-100/70 backdrop-blur sm:p-8">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <input type="hidden" name="source" value="Growblic Website" />
        <input type="hidden" name="page" value="Careers Apply" />
        <input type="hidden" name="submittedAt" value={submittedAt} />

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Full name
            <input
              className={inputClass}
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              required
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
              required
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
              required
            />
          </label>

          <label className={labelClass}>
            Role applying for
            <select className={inputClass} name="role" defaultValue="" required>
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
            <select className={inputClass} name="experience" defaultValue="" required>
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
              required
            />
          </label>
        </div>

        <label className={labelClass}>
          Message
          <textarea
            className={`${inputClass} min-h-36 resize-y leading-7`}
            name="message"
            placeholder="Tell us about your skills, work, availability, or why this role fits you."
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-950"
        >
          {isSubmitting ? "Submitting..." : "Submit Application →"}
        </button>

        {status.message && (
          <p
            className={`rounded-2xl border px-5 py-4 text-sm font-semibold leading-6 ${
              status.type === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                : "border-blue-100 bg-blue-50/70 text-blue-700"
            }`}
          >
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
