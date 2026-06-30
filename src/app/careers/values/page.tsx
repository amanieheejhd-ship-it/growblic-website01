import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gauge,
  Handshake,
  Layers3,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

const values = [
  {
    title: "Build to win",
    text: "We design, develop, and deliver with a clear goal — create work that helps real businesses grow.",
    icon: Trophy,
    accent: "from-blue-600 via-cyan-500 to-sky-400",
  },
  {
    title: "Fast & right",
    text: "Speed matters, but quality matters too. We move quickly while keeping the product clean, useful, and scalable.",
    icon: Gauge,
    accent: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    title: "Trustworthy",
    text: "We build trust through consistency, honest communication, clean execution, and ownership of outcomes.",
    icon: ShieldCheck,
    accent: "from-indigo-500 via-blue-500 to-cyan-400",
  },
  {
    title: "Compounding",
    text: "Every project improves our systems, design taste, development process, and long-term product thinking.",
    icon: Layers3,
    accent: "from-blue-500 via-sky-400 to-cyan-300",
  },
  {
    title: "High agency",
    text: "We do not wait for perfect conditions. We find solutions, take ownership, and finish what matters.",
    icon: Rocket,
    accent: "from-sky-500 via-blue-500 to-indigo-500",
  },
  {
    title: "Client success",
    text: "Every decision should make the client experience better — clearer, faster, smoother, and more valuable.",
    icon: Handshake,
    accent: "from-cyan-400 via-blue-500 to-slate-900",
  },
  {
    title: "Frugal",
    text: "We use time, tools, and resources carefully. Simple solutions often create the strongest business impact.",
    icon: CheckCircle2,
    accent: "from-blue-600 via-cyan-500 to-emerald-300",
  },
];

export default function CareersValuesPage() {
  return (
    <main className="relative overflow-hidden bg-white px-6 py-20 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(37,99,235,0.14),transparent_28%),radial-gradient(circle_at_88%_28%,rgba(6,182,212,0.13),transparent_30%),linear-gradient(180deg,rgba(255,255,255,1),rgba(239,246,255,0.58),rgba(255,255,255,1))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-xl shadow-blue-100/60 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Growblic values
          </div>

          <h1 className="mt-7 text-5xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
            Principles behind how we build.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            These values guide how we design products, ship software, support clients,
            and grow as a premium digital team.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="group relative min-h-[330px] overflow-hidden rounded-[2.25rem] border border-blue-100 bg-white/78 p-7 shadow-[0_30px_90px_rgba(37,99,235,0.11)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_42px_110px_rgba(37,99,235,0.18)]"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r ${value.accent} opacity-12 transition-opacity duration-500 group-hover:opacity-20`} />
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-cyan-100/70 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.055)_1px,transparent_1px)] bg-[size:34px_34px] opacity-70" />

                <div className="relative flex items-start justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl border border-blue-100 bg-white/90 text-blue-700 shadow-[0_18px_45px_rgba(37,99,235,0.15)] transition-transform duration-500 group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="rounded-full border border-blue-100 bg-white/85 px-4 py-2 text-xs font-black tracking-[0.20em] text-blue-700 shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <span className="rounded-full border border-blue-100 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.26em] text-slate-500 shadow-sm">
                    Value
                  </span>
                </div>

                <div className="relative mt-12">
                  <h2 className="text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
                    {value.title}
                  </h2>

                  <p className="mt-7 max-w-xl text-base font-semibold leading-8 text-slate-600">
                    {value.text}
                  </p>
                </div>

                <div className="relative mt-12 flex items-center justify-between border-t border-blue-100/70 pt-5">
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">
                    Growblic standard
                  </span>
                  <span className={`h-1.5 w-28 rounded-full bg-gradient-to-r ${value.accent} shadow-[0_0_30px_rgba(37,99,235,0.35)]`} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-blue-100 bg-slate-950 p-8 text-white shadow-[0_35px_100px_rgba(15,23,42,0.20)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.30em] text-cyan-300">
                Ready to work with ownership?
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Join a team that ships real products.
              </h2>
            </div>

            <Link
              href="/careers/openings"
              className="inline-flex w-fit items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white"
            >
              View openings <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
