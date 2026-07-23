"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { forgotPassword } from "@/lib/accounts";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const inputClass =
  "h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
const labelClass = "text-sm font-black text-slate-700";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter the email linked to your account.");
      return;
    }

    setPending(true);
    setError("");
    setMessage("");
    try {
      // The service always returns a generic success message — never reveal
      // whether the address exists. Show exactly what it returns.
      const result = await forgotPassword({ email: trimmedEmail });
      setMessage(
        result ||
          "If an account exists for that email, a reset link is on its way.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send the reset email.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="flex min-h-screen items-center px-4 py-28 sm:px-6">
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-blue-100 bg-white/92 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.12)] sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <KeyRound size={22} />
            </span>
            <h1 className="mt-6 text-3xl font-black text-slate-950 sm:text-4xl">
              Reset your password
            </h1>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              Enter your email and we&apos;ll send you a link to set a new
              password.
            </p>

            {message ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
              >
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 grid gap-5" noValidate>
                <label className="space-y-2">
                  <span className={labelClass}>Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
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
                  disabled={pending}
                  className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {pending ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}

            <p className="mt-6 text-sm font-bold text-slate-500">
              <Link href="/login" className="text-blue-700 transition hover:text-blue-800">
                Back to sign in
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
