"use client";

import { ArrowRight } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { persistWebsiteForm, submitLead } from "@/lib/api";

const projectTypes = [
  "Website Development",
  "Mobile App Development",
  "SaaS Platform",
  "Dashboard / Admin Panel",
  "AI Automation",
  "Custom Software",
];

const budgetRanges = [
  "Under Rs 25,000",
  "Rs 25,000 - Rs 50,000",
  "Rs 50,000 - Rs 1,00,000",
  "Rs 1,00,000+",
  "Not sure yet",
];

const fieldClass =
  "w-full rounded-2xl border border-blue-100 bg-white px-5 py-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:shadow-lg focus:shadow-blue-100/60";

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success" | "error"; message: string };

export default function StartProjectForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const submissionKeyRef = useRef("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const website = String(form.get("website") || "").trim();
    const name = String(form.get("name") || "").trim();
    const service = String(form.get("projectType") || "").trim() || undefined;
    const budget = String(form.get("budgetRange") || "").trim() || undefined;
    const message = String(form.get("message") || "").trim();

    submittingRef.current = true;
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      submissionKeyRef.current ||= crypto.randomUUID();

      await persistWebsiteForm("/api/quote-requests/", {
        submissionKey: submissionKeyRef.current,
        name,
        email: email || undefined,
        phone: phone || undefined,
        service,
        budget,
        requirements: message,
        source: "start-project-page",
        website,
      });

      if (!website) {
        await submitLead("/leads/start-project", {
          name,
          email: email || undefined,
          phone: phone || undefined,
          service,
          budget,
          message,
          source: "start-project-page",
        });
      }

      formElement.reset();
      submissionKeyRef.current = "";
      setStatus({
        type: "success",
        message: "Thanks, our team will contact you soon.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[3rem] border border-blue-100/70 bg-white/90 p-6 shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-8"
    >
      <input type="hidden" name="source" value="Growblic Website" />
      <input type="hidden" name="page" value="Start Project" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="start-project-website">Website</label>
        <input
          id="start-project-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
          Project intake
        </p>
        <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
          Share the essentials. We&apos;ll shape the plan.
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Name
          <input name="name" required className={fieldClass} placeholder="Your name" />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Email
          <input
            name="email"
            type="email"
            className={fieldClass}
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Phone
          <input name="phone" type="tel" className={fieldClass} placeholder="+91..." />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Project type
          <select name="projectType" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select project type
            </option>
            {projectTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700 sm:col-span-2">
          Budget range
          <select name="budgetRange" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select budget range
            </option>
            {budgetRanges.map((range) => (
              <option key={range}>{range}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700 sm:col-span-2">
          Message
          <textarea
            name="message"
            required
            className={`${fieldClass} min-h-40 resize-y`}
            placeholder="Tell us about your goals, features, timeline, or current challenge"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-950 sm:col-span-2 sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit Project Request"}
          <ArrowRight size={17} />
        </button>

        {status.message && (
          <p
            aria-live="polite"
            role={status.type === "error" ? "alert" : "status"}
            className={`rounded-2xl border p-4 text-sm font-bold leading-6 sm:col-span-2 ${
              status.type === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                : "border-blue-100 bg-blue-50/70 text-blue-700"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
