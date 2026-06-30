import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  Handshake,
  Layers3,
  Rocket,
  ShieldCheck,
  Trophy,
} from "lucide-react";

const values = [
  {
    title: "Build to win",
    text: "We design, develop, and deliver with a clear goal — create work that helps real businesses grow.",
    icon: Trophy,
  },
  {
    title: "Fast & right",
    text: "Speed matters, but quality matters too. We move quickly while keeping the product clean and scalable.",
    icon: Gauge,
  },
  {
    title: "Trustworthy",
    text: "We build trust through consistency, honest communication, clean execution, and ownership.",
    icon: ShieldCheck,
  },
  {
    title: "Compounding",
    text: "Every project improves our systems, process, design taste, and long-term product thinking.",
    icon: Layers3,
  },
  {
    title: "High agency",
    text: "We find solutions, take ownership, and finish what matters without waiting for perfect conditions.",
    icon: Rocket,
  },
  {
    title: "Client success",
    text: "Every decision should make the client experience clearer, faster, smoother, and more valuable.",
    icon: Handshake,
  },
  {
    title: "Frugal",
    text: "We use time, tools, and resources carefully. Simple solutions often create strong impact.",
    icon: CheckCircle2,
  },
];

export default function CareersValuesPage() {
  return (
    <main className="relative overflow-hidden bg-white px-6 py-16 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(6,182,212,0.09),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1),rgba(239,246,255,0.50),rgba(255,255,255,1))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <section className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-blue-100 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-blue-700 shadow-sm">
            Growblic values
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">
            Principles behind how we build.
          </h1>

          <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
            Simple principles that guide how Growblic designs, ships, supports clients, and grows as a digital team.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="group relative overflow-hidden rounded-[1.6rem] border border-blue-100 bg-white/78 p-5 shadow-[0_18px_55px_rgba(37,99,235,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_24px_70px_rgba(37,99,235,0.13)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-100/70 via-cyan-50/70 to-transparent" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/55 blur-3xl" />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="relative mt-7 text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {value.title}
                </h2>

                <p className="relative mt-4 text-sm font-semibold leading-7 text-slate-600">
                  {value.text}
                </p>

                <div className="relative mt-7 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 opacity-80" />
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-[1.6rem] border border-blue-100 bg-white/80 p-6 shadow-[0_20px_60px_rgba(37,99,235,0.09)] backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-700">
              Ready to work with ownership?
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-950">
              Join a team that ships real products.
            </h2>
          </div>

          <Link
            href="/careers/openings"
            className="mt-5 inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:mt-0"
          >
            View openings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
