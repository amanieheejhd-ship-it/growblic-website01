"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PasswordInput from "@/components/PasswordInput";
import SmoothScroll from "@/components/SmoothScroll";
import { loginUser } from "@/lib/accounts";
import {
  readInternshipSwitch,
  saveInternshipSwitch,
  type InternshipSwitchPayload,
} from "@/lib/internship-switch";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inputClass =
  "h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
const labelClass = "text-sm font-black text-slate-700";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  // Set (client-side only) when the user arrived here to switch accounts and
  // continue an internship application. Prefills the email, shows a message, and
  // redirects back into the internship flow after a successful sign-in.
  const [switchFlow, setSwitchFlow] = useState<InternshipSwitchPayload | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    const pendingSwitch = readInternshipSwitch();
    if (!pendingSwitch || pendingSwitch.stage !== "pending-auth") return;
    // Defer the state update to a microtask so it happens after mount (not
    // synchronously in the effect body) — hydration-safe.
    void Promise.resolve().then(() => {
      if (!active) return;
      setSwitchFlow(pendingSwitch);
      setEmail(pendingSwitch.email);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const user = await loginUser({ email: trimmedEmail, password });
      if (switchFlow) {
        // Hand identity back to the internship flow using the AUTHENTICATED
        // email (never the typed one), then return to the form.
        saveInternshipSwitch({
          ...switchFlow,
          stage: "authenticated",
          email: user.email,
        });
        router.push(switchFlow.returnTo);
      } else {
        router.push("/account");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in. Try again.",
      );
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
              <LockKeyhole size={22} />
            </span>
            <h1 className="mt-6 text-3xl font-black text-slate-950 sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              Sign in to your Growblic account to manage your profile.
            </p>

            {switchFlow ? (
              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold leading-6 text-blue-800">
                Sign in as{" "}
                <span className="font-black">{switchFlow.email}</span> to
                continue your internship application. Your answers are saved.
              </div>
            ) : null}

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
                  placeholder="Email"
                />
              </label>

              <label className="space-y-2">
                <span className={labelClass}>Password</span>
                {/* autoComplete="new-password" (not "current-password") so the
                    browser does not inject a saved credential on load — the
                    field renders empty and the user types their own. */}
                <PasswordInput
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Password"
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
                {pending ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2 text-sm font-bold text-slate-500">
              <Link href="/forgot-password" className="transition hover:text-blue-700">
                Forgot your password?
              </Link>
              <p>
                {switchFlow ? "No account for this email? " : "New to Growblic? "}
                <Link href="/register" className="text-blue-700 transition hover:text-blue-800">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
