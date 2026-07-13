"use client";

import { useState } from "react";

export default function SubmissionStatusSelect({ endpoint, initialStatus, statuses }: { endpoint: string; initialStatus: string; statuses: readonly string[] }) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  async function update(nextStatus: string) {
    const previous = status; setStatus(nextStatus); setSaving(true); setError(false);
    try {
      const response = await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
      if (!response.ok) throw new Error("Status update failed");
    } catch { setStatus(previous); setError(true); } finally { setSaving(false); }
  }
  return <div><select aria-label="Submission status" className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 disabled:opacity-60" disabled={saving} value={status} onChange={(event) => void update(event.target.value)}>{statuses.map((value) => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select>{error ? <p className="mt-1 text-xs text-red-700">Update failed.</p> : null}</div>;
}
