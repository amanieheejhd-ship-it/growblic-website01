"use client";

import { useState } from "react";

const projectTypes = [
  "Website Development",
  "Mobile App Development",
  "SaaS Platform",
  "AI Automation",
  "SEO / Digital Marketing",
  "Other",
];

const budgetRanges = [
  "Under Rs 25,000",
  "Rs 25,000 - Rs 50,000",
  "Rs 50,000 - Rs 1,00,000",
  "Rs 1,00,000+",
];

const fieldClass =
  "w-full rounded-2xl border border-blue-100 bg-white px-5 py-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-300 focus:shadow-lg focus:shadow-blue-100/60";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="growblic-contact-section bg-[#fbfdff] px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Contact
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
            Start your project with Growblic
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Tell us what you want to build. We&apos;ll help you plan the right
            website, app, SaaS, or automation system.
          </p>

          <div className="mt-8 rounded-[1.75rem] border border-blue-100/80 bg-white p-6 shadow-xl shadow-slate-900/6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
              Direct contact
            </p>
            <a
              href="mailto:hello@growblic.com"
              className="mt-3 block text-lg font-semibold text-slate-950 transition hover:text-blue-600"
            >
              hello@growblic.com
            </a>
          </div>
        </div>

        <form
          className="growblic-contact-form rounded-[2rem] border border-blue-100/80 bg-white p-6 shadow-2xl shadow-slate-900/8 sm:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Name
              <input className={fieldClass} name="name" required />
            </label>

            <label className="grid gap-2 text-sm font-black text-slate-700">
              Phone
              <input className={fieldClass} name="phone" type="tel" required />
            </label>

            <label className="grid gap-2 text-sm font-black text-slate-700 sm:col-span-2">
              Email
              <input className={fieldClass} name="email" type="email" required />
            </label>

            <label className="grid gap-2 text-sm font-black text-slate-700">
              Project Type
              <select className={fieldClass} name="projectType" required>
                <option value="">Select project type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-black text-slate-700">
              Budget Range
              <select className={fieldClass} name="budgetRange" required>
                <option value="">Select budget range</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-black text-slate-700 sm:col-span-2">
              Message
              <textarea
                className={`${fieldClass} min-h-36 resize-y`}
                name="message"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
          >
            Request Free Consultation
          </button>

          {submitted && (
            <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold leading-6 text-emerald-800">
              Thanks! Your project request is ready. Please contact Growblic to
              continue.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
