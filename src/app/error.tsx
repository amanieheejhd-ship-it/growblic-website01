"use client";

import Link from "next/link";

export default function Error() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_8%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_82%_28%,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.10),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-30" />

        <div className="relative mx-auto max-w-3xl rounded-[2.5rem] border border-blue-100/80 bg-white/92 p-8 text-center shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 text-2xl font-black text-white shadow-xl shadow-blue-100/80">
            G
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.28em] text-blue-600">
            Something went wrong
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            Website abhi nahi chal rahi hai
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
            The page you are trying to open is not available right now. Please
            go back to the Growblic homepage.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
