"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PasswordInput from "@/components/PasswordInput";
import SmoothScroll from "@/components/SmoothScroll";
import { resetPassword } from "@/lib/accounts";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const inputClass =
  "h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
const labelClass = "text-sm font-black text-slate-700";
const MIN_PASSWORD_LENGTH = 12;

// Reading ?token= via useSearchParams makes this component client-rendered, so
// it MUST live inside a <Suspense> boundary or the static export build fails.
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = (searchParams.get("token") || "").trim();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setPending(true);
    setError("");
    try {
      const result = await resetPassword({ token, password });
      setMessage(result || "Your password has been reset.");
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reset your password.",
      );
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <>
        <div
          role="status"
          aria-live="polite"
          className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
        >
          {message}
        </div>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Continue to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      {!token ? (
        <div
          role="alert"
          className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700"
        >
          This reset link is missing or incomplete. Please{" "}
          <Link href="/forgot-password" className="underline">
            request a new reset link
          </Link>
          .
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-7 grid gap-5" noValidate>
        <label className="space-y-2">
          <span className={labelClass}>New password</span>
          <PasswordInput
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="New password"
            disabled={!token}
          />
          <span className="block text-xs font-bold text-slate-500">
            Use at least {MIN_PASSWORD_LENGTH} characters.
          </span>
        </label>

        {error ? (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
          >
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending || !token}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Set new password"}
        </button>
      </form>

      <p className="mt-6 text-sm font-bold text-slate-500">
        <Link href="/login" className="text-blue-700 transition hover:text-blue-800">
          Back to sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="flex min-h-screen items-center px-4 py-28 sm:px-6">
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-blue-100 bg-white/92 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.12)] sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <ShieldCheck size={22} />
            </span>
            <h1 className="mt-6 text-3xl font-black text-slate-950 sm:text-4xl">
              Choose a new password
            </h1>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              Set a new password for your Growblic account below.
            </p>

            <Suspense
              fallback={
                <p className="mt-7 text-sm font-bold text-slate-500">
                  Loading reset form...
                </p>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
