"use client";

import type { AdminLoginRequest } from "@growblic/contracts";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SubmitState = "idle" | "submitting" | "error" | "success";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const isSubmitting = submitState === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password } satisfies AdminLoginRequest),
      });

      if (!response.ok) {
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
      router.replace("/");
      router.refresh();
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-slate-700"
          htmlFor="admin-email"
        >
          Email address
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="admin@example.com"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-slate-700"
          htmlFor="admin-password"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
      </div>

      <p
        className={`min-h-6 text-sm font-medium ${
          submitState === "error" ? "text-red-700" : "text-transparent"
        }`}
        role={submitState === "error" ? "alert" : undefined}
        aria-live="polite"
      >
        {submitState === "error"
          ? "Invalid email or password."
          : "Sign-in status"}
      </p>

      <button
        type="submit"
        disabled={isSubmitting || submitState === "success"}
        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {submitState === "submitting"
          ? "Signing in…"
          : submitState === "success"
            ? "Signed in"
            : "Sign in"}
      </button>
    </form>
  );
}
