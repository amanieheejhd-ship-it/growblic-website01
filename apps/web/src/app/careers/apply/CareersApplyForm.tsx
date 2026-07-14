"use client";

import type { CareerApplicationRequest } from "@growblic/contracts";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link as LinkIcon, X } from "lucide-react";
import { persistWebsiteForm } from "@/lib/api";

const roles = [
  { title: "Frontend Developer", slug: "frontend-developer" },
  { title: "Backend Developer", slug: "backend-developer" },
  { title: "UI/UX Designer", slug: "ui-ux-designer" },
  { title: "Digital Marketing Executive", slug: "digital-marketing-executive" },
  { title: "Frontend Developer Internship", slug: "frontend-developer-internship" },
  { title: "Backend Developer Internship", slug: "backend-developer-internship" },
  { title: "UI/UX Design Internship", slug: "ui-ux-design-internship" },
  { title: "Digital Marketing Internship", slug: "digital-marketing-internship" },
];

const experienceLevels = [
  "Student / Fresher",
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5+ years",
];

const inputClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-blue-100/40 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

const labelClass = "text-sm font-black text-slate-800";

type FormStatus =
  | { type: "idle"; message: "" }
  | { type: "success" | "error"; message: string };

const web3FormsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

function getRoleTitle(slug?: string) {
  return roles.find((role) => role.slug === slug)?.title ?? "";
}

function normalizeLinkToken(token: string) {
  const trimmed = token.trim().replace(/^[,;]+|[,;]+$/g, "");

  if (!trimmed) return "";

  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed) || trimmed.startsWith("mailto:")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function parseLinkTokens(text: string) {
  return text.split(/[\s,]+/).map(normalizeLinkToken).filter(Boolean);
}

export default function CareersApplyForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linkError, setLinkError] = useState("");
  const submittingRef = useRef(false);
  const submissionKeyRef = useRef("");

  useEffect(() => {
    const roleSlug = new URLSearchParams(window.location.search).get("role");
    // The initial role is intentionally derived from the browser query string.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedRole(getRoleTitle(roleSlug ?? undefined));
  }, []);

  function addLinksFromText(text: string) {
    const nextLinks = parseLinkTokens(text);

    if (nextLinks.length === 0) return false;

    setLinks((currentLinks) => {
      const seenLinks = new Set(currentLinks);
      const uniqueNextLinks = nextLinks.filter((link) => {
        if (seenLinks.has(link)) return false;
        seenLinks.add(link);
        return true;
      });

      return [...currentLinks, ...uniqueNextLinks];
    });
    setLinkInput("");
    setLinkError("");
    return true;
  }

  function removeLink(linkToRemove: string) {
    setLinks((currentLinks) => currentLinks.filter((link) => link !== linkToRemove));
  }

  function handleLinkKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (["Enter", ",", " "].includes(event.key)) {
      event.preventDefault();
      addLinksFromText(linkInput);
    }
  }

  function handleLinkPaste(event: ClipboardEvent<HTMLInputElement>) {
    const pastedText = event.clipboardData.getData("text");

    if (/[\s,]+/.test(pastedText.trim())) {
      event.preventDefault();
      addLinksFromText(pastedText);
    }
  }

  function handleLinkBlur(event: FocusEvent<HTMLInputElement>) {
    addLinksFromText(event.currentTarget.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const website = String(form.get("website") ?? "").trim();
    const submittedLinks = Array.from(new Set([...links, ...parseLinkTokens(linkInput)]));

    if (submittedLinks.length === 0) {
      setLinkError(
        "Please add at least one portfolio, GitHub, LinkedIn, resume, or project link.",
      );
      return;
    }

    setLinkError("");
    setLinks(submittedLinks);
    setLinkInput("");

    if (!fullName || !email || !phone || !selectedRole || !selectedExperience || !message) {
      setStatus({
        type: "error",
        message: "Please complete every required field before submitting.",
      });
      return;
    }

    const timestamp = new Date().toISOString();

    submittingRef.current = true;
    setSubmittedAt(timestamp);
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      if (web3FormsAccessKey) {
        form.set("access_key", web3FormsAccessKey);
        form.set("subject", "New careers application from Growblic Website");
        form.set("from_name", "Growblic Careers");
        form.set("source", "Growblic Website");
        form.set("page", "Careers Apply");
        form.set("submittedAt", timestamp);
        form.set(
          "workLinks",
          [
            "Portfolio / GitHub / Resume links:",
            ...submittedLinks.map((link) => `- ${link}`),
          ].join("\n"),
        );
      }

      submissionKeyRef.current ||= crypto.randomUUID();

      await persistWebsiteForm("/api/careers/applications/", {
          submissionKey: submissionKeyRef.current,
          fullName,
          email,
          phone,
          role: selectedRole,
          experience: selectedExperience,
          workLinks: submittedLinks,
          message,
          website,
        } satisfies CareerApplicationRequest);

      if (web3FormsAccessKey && !website) {
        void fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: form,
        })
          .then(async (response) => {
            const result = (await response.json().catch(() => null)) as {
              success?: boolean;
            } | null;

            if (!response.ok || !result?.success) {
              throw new Error("External careers delivery failed.");
            }
          })
          .catch(() => undefined);
      }

      formElement.reset();
      setLinks([]);
      setLinkInput("");
      setLinkError("");
      setSelectedRole("");
      setSelectedExperience("");
      setSubmittedAt("");
      submissionKeyRef.current = "";
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
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2.35rem] border border-blue-100 bg-white/92 p-6 shadow-2xl shadow-blue-100/70 backdrop-blur sm:p-8">
      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="source" value="Growblic Website" />
        <input type="hidden" name="page" value="Careers Apply" />
        <input type="hidden" name="submittedAt" value={submittedAt} />
        <input type="hidden" name="workLinks" value={links.join("\n")} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
        >
          <label htmlFor="careers-website">Website</label>
          <input
            id="careers-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

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
            <select
              className={inputClass}
              name="role"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              required
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role.slug} value={role.title}>
                  {role.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Experience level
            <select
              className={inputClass}
              name="experience"
              value={selectedExperience}
              onChange={(event) => setSelectedExperience(event.target.value)}
              required
            >
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
        </div>

        <label className={labelClass}>
          Portfolio / GitHub / Resume links
          <div
            className={`mt-2 flex min-h-14 w-full flex-wrap items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm outline-none transition ${
              linkError
                ? "border-rose-200 shadow-rose-100/60"
                : "border-blue-100 shadow-blue-100/40 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100"
            }`}
          >
            {links.map((link) => (
              <span
                key={link}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs font-black text-blue-800 shadow-sm shadow-blue-100/50"
              >
                <LinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="max-w-48 truncate sm:max-w-64">{link}</span>
                <button
                  type="button"
                  aria-label={`Remove ${link}`}
                  onClick={() => removeLink(link)}
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-blue-700 transition hover:bg-blue-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </span>
            ))}
            <input
              className="min-h-9 min-w-48 flex-1 border-0 bg-transparent px-1 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              value={linkInput}
              onChange={(event) => {
                setLinkInput(event.target.value);
                if (linkError) setLinkError("");
              }}
              onKeyDown={handleLinkKeyDown}
              onPaste={handleLinkPaste}
              onBlur={handleLinkBlur}
              placeholder={
                links.length === 0
                  ? "Paste portfolio, GitHub, LinkedIn, resume, or project link"
                  : "Add another link"
              }
            />
          </div>
          <span className="mt-2 block text-xs font-bold leading-5 text-slate-500">
            Add multiple links. Press Enter after each link.
          </span>
          {linkError && (
            <span className="mt-2 block rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-black leading-5 text-rose-700">
              {linkError}
            </span>
          )}
        </label>

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
            aria-live="polite"
            role={status.type === "error" ? "alert" : "status"}
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
