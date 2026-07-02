"use client";

import { useState } from "react";
import {
  ArrowRight,
  Clock3,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { submitLead } from "@/lib/api";

type FormStatus = "idle" | "loading" | "success" | "error";

const highlights = [
  {
    icon: Sparkles,
    title: "Free consultation",
    text: "Share your idea and get a clear first direction.",
  },
  {
    icon: Clock3,
    title: "Fast response",
    text: "Clear scope, timeline, and reply within 24 hours.",
  },
];


export default function ContactSection() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    try {
      setStatus("loading");
      setMessage("");

      await submitLead("/leads/contact", {
        name: String(formData.get("name") || "").trim(),
        email: email || undefined,
        phone: phone || undefined,
        service: String(formData.get("projectType") || "").trim() || undefined,
        budget: String(formData.get("budgetRange") || "").trim() || undefined,
        message: String(formData.get("message") || "").trim(),
        source: "contact-form",
      });

      setStatus("success");
      setMessage("Thanks, our team will contact you soon.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="contact"
      className="growblic-scroll-reveal relative overflow-hidden border-y border-blue-100/80 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.08),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(6,182,212,0.10),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-6 py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-blue-600 shadow-sm">
              <MessageSquare className="h-4 w-4" />
              Contact
            </div>

            <h2 className="max-w-xl text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">
              Start your project with Growblic
            </h2>

            <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-slate-600">
              Tell us what you want to build. We&apos;ll help you plan the right
              website, app, SaaS, or automation system with a clear next step.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-blue-100 bg-white/88 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[1.8rem] border border-blue-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-blue-600">
              Direct contact
            </p>

            <a
              href="mailto:hello@growblic.com"
              className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-slate-50/80 p-4 transition hover:border-blue-200 hover:bg-blue-50/70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-950">hello@growblic.com</p>
                <p className="text-sm font-medium text-slate-600">
                  For projects, partnerships, and support enquiries.
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-blue-200/35 via-cyan-200/20 to-transparent blur-2xl" />

          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/92 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.12)] sm:p-7"
          >
            <div className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.24em] text-blue-600">
                  <ShieldCheck className="h-4 w-4" />
                  Secure enquiry
                </div>

                <h3 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                  Project request
                </h3>

                <p className="mt-2 max-w-lg text-sm font-semibold leading-6 text-slate-600">
                  Tell us a few details and our team will reply with a clear next step.
                </p>
              </div>

              <div className="inline-flex w-fit rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-700">
                Free consultation
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-black text-slate-700">Name</span>
                <input
                  required
                  name="name"
                  className="h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-black text-slate-700">Phone</span>
                <input
                  name="phone"
                  type="tel"
                  className="h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-black text-slate-700">Email</span>
                <input
                  name="email"
                  type="email"
                  className="h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-black text-slate-700">Project Type</span>
                <select
                  name="projectType"
                  defaultValue=""
                  className="h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Select project type
                  </option>
                  <option>Website Development</option>
                  <option>Software Development</option>
                  <option>Mobile App</option>
                  <option>SaaS Product</option>
                  <option>AI Automation</option>
                  <option>Marketing / SEO</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-black text-slate-700">Budget Range</span>
                <select
                  name="budgetRange"
                  defaultValue=""
                  className="h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>
                    Select budget range
                  </option>
                  <option>Under ₹25,000</option>
                  <option>₹25,000 - ₹75,000</option>
                  <option>₹75,000 - ₹2,00,000</option>
                  <option>₹2,00,000+</option>
                  <option>Need guidance</option>
                </select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-black text-slate-700">Message</span>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full resize-y rounded-2xl border border-blue-100 bg-white px-4 py-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Tell us what you want to build..."
                />
              </label>
            </div>

            {message ? (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold ${
                  status === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-slate-950 px-8 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Sending..." : "Request Free Consultation"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <p className="text-sm font-bold text-slate-500">
                No spam. Your details are used only to respond to this enquiry.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
