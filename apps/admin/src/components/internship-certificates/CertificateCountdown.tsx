"use client";

import { useEffect, useState } from "react";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

type Props = {
  completionDate: string | null;
  initialNow: string;
};

export default function CertificateCountdown({
  completionDate,
  initialNow,
}: Props) {
  const [now, setNow] = useState(() => new Date(initialNow).getTime());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (!completionDate) {
    return <span className="text-slate-500">Pending</span>;
  }

  const remaining = new Date(completionDate).getTime() - now;
  if (remaining <= 0) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        Completed
      </span>
    );
  }

  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((remaining % MINUTE_MS) / 1000);

  return (
    <time
      dateTime={completionDate}
      className="grid min-w-20 gap-0.5 text-xs leading-4 font-semibold tabular-nums text-slate-700"
    >
      <span className="whitespace-nowrap">{days}d {hours}h</span>
      <span className="whitespace-nowrap">{minutes}m {seconds}s</span>
    </time>
  );
}
