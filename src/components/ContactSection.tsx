"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

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

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success" | "error"; message: string };

const web3FormsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const previewCards = [
  {
    title: "CRM Workspace",
    detail: "Pipeline dashboard",
    src: "/images/products/crm-1.jpg",
    className:
      "left-4 top-12 hidden w-44 animate-[growblicContactDriftA_16s_ease-in-out_infinite] sm:left-8 sm:block lg:left-10 lg:top-16",
  },
  {
    title: "Analytics Suite",
    detail: "Business insights",
    src: "/images/products/analytics-1.jpg",
    className:
      "right-4 top-16 w-48 animate-[growblicContactDriftB_18s_ease-in-out_infinite] sm:right-10 lg:right-16 lg:top-12",
  },
  {
    title: "Mobile Product",
    detail: "App experience",
    src: "/images/business/mobile-1.jpg",
    className:
      "bottom-12 left-6 w-40 animate-[growblicContactDriftC_17s_ease-in-out_infinite] sm:left-16 lg:bottom-20 lg:left-20",
  },
  {
    title: "SaaS Platform",
    detail: "Product modules",
    src: "/images/business/saas-1.jpg",
    className:
      "bottom-16 right-6 hidden w-44 animate-[growblicContactDriftA_19s_ease-in-out_infinite] sm:right-16 sm:block lg:bottom-24 lg:right-20",
  },
  {
    title: "Automation Flow",
    detail: "AI workflow",
    src: "/images/business/ai-1.jpg",
    className:
      "left-[34%] top-6 hidden w-36 animate-[growblicContactDriftC_20s_ease-in-out_infinite] lg:block",
  },
  {
    title: "Web System",
    detail: "Conversion pages",
    src: "/images/business/web-1.jpg",
    className:
      "bottom-7 left-[42%] hidden w-40 animate-[growblicContactDriftB_21s_ease-in-out_infinite] xl:block",
  },
];

export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!web3FormsAccessKey) {
      setStatus({
        type: "error",
        message:
          "Contact form is not configured yet. Please email hello@growblic.com.",
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
    form.set("subject", "New homepage contact request from Growblic Website");
    form.set("from_name", "Growblic Website");
    form.set("source", "Growblic Website");
    form.set("page", "Homepage Contact");
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
          "Thanks! Your project request has been sent. Growblic will get back to you soon.",
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
    <section id="contact" className="growblic-contact-section bg-[#fbfdff] px-6 py-24 relative overflow-hidden">
      <div className="growblic-contact-motion-layer pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(37,99,235,0.13),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(6,182,212,0.12),transparent_26%),radial-gradient(circle_at_50%_92%,rgba(59,130,246,0.10),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_78%)]" />
        <div className="absolute left-10 top-1/2 h-44 w-44 rounded-full bg-blue-200/25 blur-3xl animate-[growblicContactFloat_10s_ease-in-out_infinite]" />
        <div className="absolute right-14 top-24 h-52 w-52 rounded-full bg-cyan-200/25 blur-3xl animate-[growblicContactFloat_12s_ease-in-out_infinite]" />

        <div className="absolute inset-0 opacity-55 sm:opacity-70 lg:opacity-85">
          {previewCards.map((card) => (
            <div
              key={card.title}
              className={`absolute overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/72 p-2 shadow-[0_24px_70px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/60 backdrop-blur-2xl ${card.className}`}
            >
              <div className="overflow-hidden rounded-[1rem] border border-blue-50/80 bg-blue-50/45">
                <Image
                  src={card.src}
                  alt=""
                  width={320}
                  height={214}
                  className="h-24 w-full object-cover"
                  sizes="(max-width: 768px) 160px, 220px"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-1 pt-2">
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-950">
                    {card.title}
                  </p>
                  <p className="mt-0.5 text-[0.6rem] font-bold text-blue-600">
                    {card.detail}
                  </p>
                </div>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.65)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
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
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="source" value="Growblic Website" />
          <input type="hidden" name="page" value="Homepage Contact" />
          <input type="hidden" name="submittedAt" value={submittedAt} />

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
            disabled={isSubmitting}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-950 sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Request Free Consultation"}
          </button>

          {status.message && (
            <p
              className={`mt-5 rounded-2xl border px-5 py-4 text-sm font-semibold leading-6 ${
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
    </section>
  );
}
