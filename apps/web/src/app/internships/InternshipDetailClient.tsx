"use client";

import type { InternshipApplicationRequest } from "@growblic/contracts";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { persistWebsiteForm } from "@/lib/api";
import {
  bridgeIntoInternshipPortal,
  getSession,
  logoutUser,
  type PublicUser,
} from "@/lib/accounts";
import {
  clearInternshipSwitch,
  normalizeEmailForCompare,
  readInternshipSwitch,
  saveInternshipSwitch,
  type InternshipSwitchForm,
} from "@/lib/internship-switch";
import type { Internship } from "./internship-data";
import { shouldRevealInternshipPlans } from "./internship-application-flow";
import InternshipFeePanel from "./InternshipFeePanel";

type Props = {
  internship: Internship;
  internships: Internship[];
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function PremiumDetailCard({
  number,
  title,
  items,
}: {
  number: string;
  title: string;
  items: string[];
}) {
  return (
    <section className="group overflow-hidden rounded-[30px] border border-blue-100 bg-white/90 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(37,99,235,0.13)]">
      <div className="flex items-center gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-5 sm:px-8">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-black text-white shadow-lg shadow-blue-200">
          {number}
        </span>

        <h2 className="text-xl font-black tracking-tight text-slate-950">
          {title}
        </h2>
      </div>

      <ul className="space-y-4 p-6 sm:p-8">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm font-semibold leading-7 text-slate-600 sm:text-[15px]"
          >
            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600 ring-1 ring-blue-200">
              ✓
            </span>

            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function InternshipDetailClient({
  internship,
}: Props) {
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState("");
  const [showFeePanel, setShowFeePanel] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationReference, setApplicationReference] = useState("");

  // Email is auth-aware. When a public user is signed in we prefill + lock the
  // field to their account email; "Use a different email" unlocks it, and a
  // mismatch at submit opens the continue/switch choice (never a silent orphan).
  const [account, setAccount] = useState<PublicUser | null>(null);
  const [email, setEmail] = useState("");
  const [emailLocked, setEmailLocked] = useState(false);
  const [mismatch, setMismatch] = useState<string | null>(null);
  // Set when returning from a completed account switch: the saved answers to
  // restore (via a keyed remount) and a flag to land on the portal dashboard
  // after this submit instead of revealing the fee panel.
  const [restored, setRestored] = useState<InternshipSwitchForm | null>(null);
  const [switchReturn, setSwitchReturn] = useState(false);

  const submittingRef = useRef(false);
  const submissionKeyRef = useRef("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let active = true;
    // Returning from a switch? Restore the in-progress answers for a single
    // confirm-and-submit. The email is re-derived from the authenticated
    // session — never trusted from storage.
    const pending = readInternshipSwitch();
    const isReturn = Boolean(
      pending &&
        pending.stage === "authenticated" &&
        pending.slug === internship.slug,
    );

    // All state is set inside the async callback (never synchronously in the
    // effect body), matching the app's hydration-safe on-mount session pattern.
    const apply = (user: PublicUser | null) => {
      if (!active) return;
      if (isReturn && pending) {
        setRestored(pending.form);
        setIsEnrolled(pending.form.instituteEnrollment ?? "");
        setSwitchReturn(true);
        clearInternshipSwitch();
      }
      setAccount(user);
      if (user) {
        // Signed in → applications must use THIS account's email.
        setEmail(user.email);
        setEmailLocked(true);
      } else if (isReturn && pending) {
        setEmail(pending.email);
      }
    };

    getSession()
      .then(apply)
      .catch(() => apply(null));
    return () => {
      active = false;
    };
  }, [internship.slug]);

  async function submitApplication(form: HTMLFormElement, emailToUse: string) {
    if (submittingRef.current) return;

    const formData = new FormData(form);
    if (showFeePanel) {
      setShowFeePanel(false);
      setApplicationReference("");
      submissionKeyRef.current = crypto.randomUUID();
    } else {
      submissionKeyRef.current ||= crypto.randomUUID();
    }
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await persistWebsiteForm("/api/internships/applications/", {
        submissionKey: submissionKeyRef.current,
        internshipSlug: internship.slug,
        fullName: String(formData.get("fullName") || "").trim(),
        email: emailToUse.trim(),
        phone: String(formData.get("phone") || "").trim(),
        state: String(formData.get("state") || "").trim(),
        instituteEnrollment: String(
          formData.get("instituteEnrollment") || "",
        ).trim(),
        instituteName: String(formData.get("instituteName") || "").trim(),
        course: String(formData.get("course") || "").trim(),
        enrollmentNumber: String(formData.get("enrollmentNo") || "").trim(),
        highestQualification: String(
          formData.get("highestQualification") || "",
        ).trim(),
        passingYear: String(formData.get("passingYear") || "").trim(),
        message: String(formData.get("query") || "").trim(),
        website: String(formData.get("website") || "").trim(),
      } satisfies InternshipApplicationRequest);

      if (!shouldRevealInternshipPlans(result.status)) {
        throw new Error("The application was not created.");
      }

      window.localStorage.setItem(
        `growblic-internship-application:${internship.slug}`,
        submissionKeyRef.current,
      );

      // Switch flow: the application is now under the authenticated account —
      // send them to their portal dashboard (email-matched SSO mints the
      // applicant session; empty state if they have no applicant account yet).
      if (switchReturn) {
        try {
          await bridgeIntoInternshipPortal();
        } catch {
          /* navigate regardless — the portal decides dashboard vs login */
        }
        router.push("/internship-portal");
        return;
      }

      setShowFeePanel(true);
      setApplicationReference(submissionKeyRef.current);
      window.setTimeout(() => {
        document.getElementById("internship-fee-panel")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function openFeePanel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Mismatch guard: a signed-in user whose typed email differs from their
    // account email must explicitly choose — never submit an orphan silently.
    if (
      account &&
      normalizeEmailForCompare(email) !== normalizeEmailForCompare(account.email)
    ) {
      setMismatch(email.trim());
      return;
    }

    void submitApplication(form, email);
  }

  function continueAsAccount() {
    if (!account) return;
    setEmail(account.email);
    setEmailLocked(true);
    setMismatch(null);
    const form = formRef.current;
    if (form) void submitApplication(form, account.email);
  }

  function switchToTypedEmail(typedEmail: string) {
    const form = formRef.current;
    const data = form ? new FormData(form) : new FormData();
    const read = (name: string) => String(data.get(name) || "").trim();
    saveInternshipSwitch({
      stage: "pending-auth",
      email: normalizeEmailForCompare(typedEmail),
      slug: internship.slug,
      returnTo: `/internships/${internship.slug}`,
      form: {
        fullName: read("fullName"),
        phone: read("phone"),
        state: read("state"),
        instituteEnrollment: read("instituteEnrollment"),
        instituteName: read("instituteName"),
        course: read("course"),
        enrollmentNumber: read("enrollmentNo"),
        highestQualification: read("highestQualification"),
        passingYear: read("passingYear"),
        message: read("query"),
      },
    });
    setMismatch(null);
    // Revoke the OLD public session server-side BEFORE the new sign-in, so there
    // is never a lingering session or two identities in play.
    void logoutUser()
      .catch(() => {
        /* best-effort revoke; the new login replaces the cookie regardless */
      })
      .finally(() => {
        router.push("/login");
      });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_36%),linear-gradient(135deg,#f7f9ff_0%,#ffffff_55%,#eff9ff_100%)] px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
                return;
              }

              window.location.href = `${process.env.NEXT_PUBLIC_SITE_BASE_PATH || ""}/`;
            }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-md"
            aria-label="Go back"
          >
            <span aria-hidden="true">←</span>
            Back
          </button>

          <p className="w-fit rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-blue-700 shadow-sm">
            Growblic Internships
          </p>
        </div>

        <section className="relative mt-10 overflow-hidden rounded-[36px] border border-blue-100 bg-white/85 p-7 shadow-[0_28px_90px_rgba(37,99,235,0.13)] backdrop-blur-sm sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="relative max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
              Learn • Build • Grow
            </p>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Start Internship with Growblic
            </h1>

            <p className="mt-7 max-w-4xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              {internship.overview}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">
                Real project exposure
              </span>

              <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">
                Guided learning
              </span>

              <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">
                Beginner focused
              </span>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <PremiumDetailCard
            number="01"
            title="What the intern will learn"
            items={internship.learn}
          />

          <PremiumDetailCard
            number="02"
            title="Basic responsibilities"
            items={internship.responsibilities}
          />

          <section className="group overflow-hidden rounded-[30px] border border-blue-100 bg-white/90 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(37,99,235,0.13)]">
            <div className="flex items-center gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-5 sm:px-8">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-black text-white shadow-lg shadow-blue-200">
                03
              </span>

              <h2 className="text-xl font-black tracking-tight text-slate-950">
                Education and eligibility
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold leading-8 text-slate-600 sm:text-[15px]">
                {internship.eligibility}
              </p>

              <div className="mt-6 rounded-2xl border border-cyan-100 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 p-4">
                <p className="text-sm font-bold leading-7 text-slate-700">
                  Professional experience is not compulsory. Interested
                  students and serious self-taught beginners may also apply.
                </p>
              </div>
            </div>
          </section>

          <PremiumDetailCard
            number="04"
            title="Skills you will learn"
            items={internship.skills}
          />
        </div>

        <section className="mt-10 overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-[0_30px_100px_rgba(37,99,235,0.14)]">
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-8 sm:px-10">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">
              Internship application
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Apply for Internship
            </h2>

            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              Fill the basic personal and education details below. The form
              is short, simple, and easy to complete.
            </p>
          </div>

          <form
            ref={formRef}
            key={restored ? "restored" : "fresh"}
            onSubmit={openFeePanel}
            className="space-y-7 p-5 sm:p-8 lg:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
            >
              <label htmlFor="internship-website">Website</label>
              <input
                id="internship-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {switchReturn ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-800">
                Signed in as{" "}
                <span className="font-black">{email || account?.email}</span>.
                Your answers were kept — review and submit to finish your
                application.
              </div>
            ) : null}
            <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  01 • Personal details
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-black text-slate-800">
                  Full name *
                  <input
                    name="fullName"
                    required
                    autoComplete="name"
                    defaultValue={restored?.fullName ?? ""}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  Email address *
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    readOnly={emailLocked}
                    aria-describedby="internship-email-help"
                    className={`${inputClass} ${
                      emailLocked ? "cursor-not-allowed bg-slate-100 text-slate-600" : ""
                    }`}
                  />
                  {account ? (
                    <span
                      id="internship-email-help"
                      className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold"
                    >
                      <span className="font-semibold text-slate-500">
                        Applying as{" "}
                        <span className="font-black text-slate-700">
                          {account.email}
                        </span>
                      </span>
                      {emailLocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEmailLocked(false);
                            setMismatch(null);
                          }}
                          className="font-black text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
                        >
                          Use a different email
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(account.email);
                            setEmailLocked(true);
                            setMismatch(null);
                          }}
                          className="font-black text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
                        >
                          Use my account email
                        </button>
                      )}
                    </span>
                  ) : null}
                </label>

                <label className="text-sm font-black text-slate-800">
                  Phone number *
                  <input
                    type="tel"
                    name="phone"
                    required
                    autoComplete="tel"
                    defaultValue={restored?.phone ?? ""}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </label>

                <label className="text-sm font-black text-slate-800">
                  State *
                  <input
                    name="state"
                    required
                    autoComplete="address-level1"
                    defaultValue={restored?.state ?? ""}
                    placeholder="Enter your state"
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  02 • Education details
                </p>

                
              </div>

              <label className="block text-sm font-black text-slate-800">
                Are you enrolled in any institute? *
                <select
                  name="instituteEnrollment"
                  required
                  value={isEnrolled}
                  onChange={(event) => setIsEnrolled(event.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select Yes or No
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>

              {isEnrolled === "Yes" && (
                <div className="mt-6 rounded-[24px] border border-blue-100 bg-white p-5 sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-lg font-black text-slate-950">
                      Current institute details
                    </h3>

                    
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-black text-slate-800 md:col-span-2">
                      College name *
                      <input
                        name="instituteName"
                        required
                        defaultValue={restored?.instituteName ?? ""}
                        placeholder="Enter your college name"
                        className={inputClass}
                      />
                    </label>

                    <label className="text-sm font-black text-slate-800">
                      Current course *
                      <select
                        name="course"
                        required
                        defaultValue={restored?.course ?? ""}
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select your course
                        </option>
                        <option>BCA</option>
                        <option>MCA</option>
                        <option>B.Tech / B.E.</option>
                        <option>B.Sc Computer Science</option>
                        <option>BBA</option>
                        <option>B.Com</option>
                        <option>BA</option>
                        <option>MBA</option>
                        <option>Diploma</option>
                        <option>Certification course</option>
                        <option>M.Tech / M.E.</option>
                        <option>M.Com</option>
                        <option>M.Sc.</option>
                        <option>MA</option>
                        <option>ITI</option>
                        <option>Polytechnic</option>
                        <option>Other</option>
                      </select>
                    </label>

                    <label className="text-sm font-black text-slate-800">
                      Enrollment number *
                      <input
                        name="enrollmentNo"
                        required
                        defaultValue={restored?.enrollmentNumber ?? ""}
                        placeholder="Enter your enrollment number"
                        className={inputClass}
                      />
                    </label>
                  </div>
                </div>
              )}

              {isEnrolled === "No" && (
                <div className="mt-6 rounded-[24px] border border-blue-100 bg-white p-5 sm:p-6">
                  <div className="mb-5">
                    <h3 className="text-lg font-black text-slate-950">
                      Previous education details
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-black text-slate-800">
                      Highest qualification *
                      <select
                        name="highestQualification"
                        required
                        defaultValue={restored?.highestQualification ?? ""}
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select qualification
                        </option>
                        <option>10th passed</option>
                        <option>12th passed</option>
                        <option>Diploma completed</option>
                        <option>Graduate</option>
                        <option>Postgraduate</option>
                        <option>Certification course</option>
                        <option>Other</option>
                      </select>
                    </label>

                    <label className="text-sm font-black text-slate-800">
                      Passing year *
                      <select
                        name="passingYear"
                        required
                        defaultValue={restored?.passingYear ?? ""}
                        className={inputClass}
                      >
                        <option value="" disabled>
                          Select passing year
                        </option>

                        {Array.from(
                          { length: 22 },
                          (_, index) => 2026 - index,
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )}
            </section>



            <section className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <label className="text-sm font-black text-slate-800">
                Any query
                <textarea
                  name="query"
                  rows={4}
                  defaultValue={restored?.message ?? ""}
                  placeholder="Write your question or message for Growblic."
                  className={`${inputClass} resize-y`}
                />
              </label>
            </section>

            {mismatch && account ? (
              <div
                role="group"
                aria-label="Email does not match your account"
                className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900"
              >
                <p className="font-black">
                  This application uses a different email than your account.
                </p>
                <p className="mt-1 leading-6">
                  You’re signed in as{" "}
                  <span className="font-black">{account.email}</span>, but you
                  entered <span className="font-black">{mismatch}</span>.
                  Applications are linked to your signed-in account’s email —
                  otherwise they won’t appear on your dashboard.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={continueAsAccount}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Continue as {account.email}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchToTypedEmail(mismatch)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                  >
                    Switch to {mismatch}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                {isSubmitting
                  ? "Submitting..."
                  : showFeePanel
                    ? "Fee plans opened"
                    : switchReturn
                      ? "Confirm & submit →"
                      : "Apply now →"}
              </button>
            </div>
            {submitError ? (
              <p
                aria-live="polite"
                role="alert"
                className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700"
              >
                {submitError}
              </p>
            ) : null}
          </form>
        </section>

        {showFeePanel && (
          <InternshipFeePanel
            internshipTitle={internship.title}
            applicationReference={applicationReference}
          />
        )}
      </div>
    </main>
  );
}
