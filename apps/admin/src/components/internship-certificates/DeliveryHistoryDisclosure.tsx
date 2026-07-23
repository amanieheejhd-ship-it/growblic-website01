"use client";

import { useId, useState } from "react";

type DeliveryAttempt = {
  id: string;
  kind: string;
  successful: boolean;
  attemptedAt: string;
};

export default function DeliveryHistoryDisclosure({
  attempts,
}: {
  attempts: readonly DeliveryAttempt[];
}) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setExpanded((current) => !current)}
      >
        <span className="font-bold">
          Delivery history <span className="text-slate-500">({attempts.length})</span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      </button>
      <div id={contentId} hidden={!expanded}>
        {expanded ? (
          <ul className="mt-3 grid max-h-[480px] gap-3 overflow-y-auto pr-1 text-sm">
            {attempts.map((attempt) => (
              <li key={attempt.id}>
                <b>{attempt.kind.replaceAll("_", " ")}</b>
                <span className="block text-slate-600">
                  {attempt.successful ? "Successful" : "Failed"} — {attempt.attemptedAt}
                </span>
              </li>
            ))}
            {!attempts.length ? (
              <li className="text-slate-500">No delivery attempts.</li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
