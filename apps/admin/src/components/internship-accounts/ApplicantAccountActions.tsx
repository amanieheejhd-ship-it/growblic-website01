"use client";

import { useState } from "react";

export default function ApplicantAccountActions({
  accountId,
  status,
}: {
  accountId: string;
  status: string;
}) {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function run(action: "enable" | "disable" | "revoke-sessions") {
    if (
      (action === "disable" && !window.confirm("Disable this applicant account and revoke active sessions?")) ||
      (action === "revoke-sessions" && !window.confirm("Revoke all active sessions for this applicant account?"))
    ) {
      return;
    }
    setBusy(action);
    setMessage("");
    try {
      const response = await fetch(`/api/internship-accounts/${encodeURIComponent(accountId)}/`, {
        method: "PATCH",
        headers: { "content-type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(data?.message || "Action failed.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="flex min-w-44 flex-col gap-2">
      {status === "ACTIVE" ? (
        <button type="button" disabled={Boolean(busy)} onClick={() => void run("disable")} className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">
          {busy === "disable" ? "Disabling..." : "Disable account"}
        </button>
      ) : (
        <button type="button" disabled={Boolean(busy)} onClick={() => void run("enable")} className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 disabled:opacity-50">
          {busy === "enable" ? "Enabling..." : "Enable account"}
        </button>
      )}
      <button type="button" disabled={Boolean(busy)} onClick={() => void run("revoke-sessions")} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50">
        {busy === "revoke-sessions" ? "Revoking..." : "Revoke sessions"}
      </button>
      {message ? <p className="text-xs font-semibold text-rose-700">{message}</p> : null}
    </div>
  );
}
