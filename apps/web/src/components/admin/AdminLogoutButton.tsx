"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleLogout() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setHasError(false);

    try {
      const response = await fetch("/api/admin/auth/logout/", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        setHasError(true);
        setIsSubmitting(false);
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setHasError(true);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isSubmitting}
        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing out…" : "Sign out"}
      </button>
      <p
        className={`text-xs font-medium ${hasError ? "text-red-700" : "sr-only"}`}
        role={hasError ? "alert" : undefined}
        aria-live="polite"
      >
        Unable to sign out. Please try again.
      </p>
    </div>
  );
}
