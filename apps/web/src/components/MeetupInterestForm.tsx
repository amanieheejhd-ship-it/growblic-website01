"use client";

import { ArrowRight } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { persistWebsiteForm, submitLead } from "@/lib/api";

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success" | "error"; message: string };

const fieldClass =
  "w-full rounded-2xl border border-blue-100 bg-white px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export default function MeetupInterestForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const submissionKeyRef = useRef("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const website = String(formData.get("website") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();

    submittingRef.current = true;
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      submissionKeyRef.current ||= crypto.randomUUID();

      await persistWebsiteForm("/api/meeting-requests/", {
        submissionKey: submissionKeyRef.current,
        name,
        email: email || undefined,
        phone: phone || undefined,
        message,
        source: "meetup-page",
        website,
      });

      if (!website) {
        void submitLead("/leads/meetup", {
          name,
          email: email || undefined,
          phone: phone || undefined,
          message,
          source: "meetup-page",
        }).catch(() => undefined);
      }

      form.reset();
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
      id="meetup-interest"
      onSubmit={handleSubmit}
      className="scroll-mt-24 rounded-[2rem] border border-blue-100 bg-white/92 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.10)] backdrop-blur-xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="meetup-website">Website</label>
        <input
          id="meetup-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
          Register interest
        </p>
        <h3 className="mt-2 text-2xl font-black tracking-[-0.045em] text-slate-950">
          Tell us where to reach you.
        </h3>
      </div>

      <div className="grid gap-3">
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
          Message
          <textarea
            name="message"
            required
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="Tell us your city, audience, or meetup interest."
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-950"
        >
          {isSubmitting ? "Submitting..." : "Submit Interest"}
          <ArrowRight className="h-4 w-4" />
        </button>

        {status.message && (
          <p
            aria-live="polite"
            role={status.type === "error" ? "alert" : "status"}
            className={`rounded-2xl border px-4 py-3 text-sm font-bold leading-6 ${
              status.type === "success"
                ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </form>
  );
}
