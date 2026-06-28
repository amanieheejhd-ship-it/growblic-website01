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

export default function StartProjectForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");
    const projectType = String(form.get("projectType") || "");
    const budgetRange = String(form.get("budgetRange") || "");
    const message = String(form.get("message") || "");

    const subject = encodeURIComponent(`New project request from ${name || "Growblic website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject Type: ${projectType}\nBudget Range: ${budgetRange}\n\nProject Details:\n${message}`
    );

    window.location.href = `mailto:hello@growblic.com?subject=${subject}&body=${body}`;
    setStatus("Your email app is opening with the project details. Please press send to complete the request.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[3rem] border border-blue-100/70 bg-white/90 p-6 shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-8"
    >
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
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:col-span-2 sm:w-auto"
        >
          Submit Project Request
          <ArrowRight size={17} />
        </button>

        {status && (
          <p className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm font-bold leading-6 text-blue-700 sm:col-span-2">
            {status}
          </p>
        )}
      </div>
    </form>
  );
}
