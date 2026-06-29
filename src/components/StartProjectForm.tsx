"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

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

const web3FormsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export default function StartProjectForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!web3FormsAccessKey) {
      setStatus({
        type: "error",
        message:
          "Start Project form is not configured yet. Please email hello@growblic.com.",
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
    form.set("subject", "New Start Project request from Growblic Website");
    form.set("from_name", "Growblic Website");
    form.set("source", "Growblic Website");
    form.set("page", "Start Project");
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
        throw new Error(result.message || "Unable to submit the form right now.");
      }

      formElement.reset();
      setSubmittedAt("");
      setStatus({
        type: "success",
        message:
          "Thanks! Your project request has been sent. Growblic will review it and get back to you soon.",
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
    <form
      onSubmit={handleSubmit}
      className="rounded-[3rem] border border-blue-100/70 bg-white/90 p-6 shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-8"
    >
      <input type="hidden" name="source" value="Growblic Website" />
      <input type="hidden" name="page" value="Start Project" />
      <input type="hidden" name="submittedAt" value={submittedAt} />

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
            required
            className={fieldClass}
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Phone
          <input name="phone" type="tel" required className={fieldClass} placeholder="+91..." />
        </label>

        <label className="grid gap-2 text-sm font-black text-slate-700">
          Project type
          <select name="projectType" required className={fieldClass} defaultValue="">
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
          <select name="budgetRange" required className={fieldClass} defaultValue="">
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
