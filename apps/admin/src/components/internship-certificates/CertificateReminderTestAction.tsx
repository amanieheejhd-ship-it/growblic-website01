"use client";

import { useState } from "react";

export default function CertificateReminderTestAction({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function schedule() {
    setBusy(true);
    setMessage("");
    setError(false);
    try {
      const response = await fetch(
        `/api/internship-certificates/${id}/reminder-test/`,
        { method: "POST" },
      );
      const result = await response.json() as {
        success: boolean;
        message?: string;
        scheduledFor?: string;
      };
      if (!response.ok || !result.success || !result.scheduledFor) {
        throw new Error(result.message || "Unable to schedule the reminder test.");
      }
      const time = new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: "Asia/Kolkata",
      }).format(new Date(result.scheduledFor));
      setMessage(`Skills reminder test scheduled for ${time}.`);
    } catch (caught) {
      setError(true);
      setMessage(
        caught instanceof Error
          ? caught.message
          : "Unable to schedule the reminder test.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <h2 className="font-bold text-amber-950">Development reminder test</h2>
      <p className="mt-1 text-sm text-amber-900">
        Schedules the existing skills reminder through the database-backed job.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void schedule()}
        className="mt-3 rounded-lg bg-amber-700 px-3 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Scheduling…" : "Send skills reminder test in 1 minute"}
      </button>
      {message ? (
        <p
          role={error ? "alert" : "status"}
          className={`mt-3 text-sm font-semibold ${error ? "text-rose-700" : "text-emerald-800"}`}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
