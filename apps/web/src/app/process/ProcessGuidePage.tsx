import Link from "next/link";
import type { ProcessGuide } from "./processGuideData";

function ProcessVisual({ guide }: { guide: ProcessGuide }) {
  const visualMap = {
    understand: <StrategyMap accent={guide.accent} />,
    design: <WireframeVisual accent={guide.accent} />,
    build: <BuildSystemVisual accent={guide.accent} />,
    launch: <LaunchChecklistVisual accent={guide.accent} />,
    improve: <GrowthVisual accent={guide.accent} />,
  };

  return visualMap[guide.visualType];
}

function StrategyMap({ accent }: { accent: string }) {
  const nodes = ["Goals", "Users", "Flow", "Scope"];

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-blue-100 bg-slate-950 p-4 shadow-2xl shadow-blue-950/15 sm:rounded-[2.25rem] sm:p-6 lg:min-h-[520px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(168,85,247,0.18),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
      <div className="relative grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/10 p-5 text-white shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
            Strategy map
          </p>
          <h2 className="mt-4 text-2xl font-black leading-tight sm:text-4xl">
            Align the idea before the first screen.
          </h2>
          <div className="mt-7 grid gap-3">
            {nodes.map((node, index) => (
              <div
                key={node}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 shadow-sm shadow-slate-950/20 backdrop-blur"
              >
                <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-xs font-black text-white`}>
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm font-black text-white">{node}</p>
                  <p className="text-xs font-semibold text-cyan-50/70">
                    Phase input 0{index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-h-[300px] place-items-center rounded-[1.6rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-6">
          <div className="relative h-72 w-full max-w-md sm:h-80">
            <div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 bg-cyan-100/30" />
            <div className="absolute left-1/2 top-1/2 h-full w-px -translate-y-1/2 bg-cyan-100/30" />
            <div className={`absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.75rem] bg-gradient-to-br ${accent} text-sm font-black text-white shadow-xl shadow-blue-500/25`}>
              Product
            </div>
            {["Business", "Audience", "Workflow", "Launch"].map((label, index) => {
              const positions = [
                "left-0 top-5",
                "right-0 top-8",
                "bottom-8 left-7",
                "bottom-5 right-8",
              ];

              return (
                <div
                  key={label}
                  className={`absolute ${positions[index]} rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-sm font-black text-slate-800 shadow-lg shadow-blue-950/10 backdrop-blur`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function WireframeVisual({ accent }: { accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-4 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-6">
      <div className={`absolute -left-16 top-8 h-56 w-56 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-3xl`} />
      <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-cyan-200/50 blur-3xl" />
      <div className="relative grid min-h-[360px] gap-5 lg:min-h-[520px] lg:grid-cols-[0.75fr_1fr_0.75fr] lg:items-center">
        {["Mobile", "Dashboard", "Product"].map((screen, index) => (
          <div
            key={screen}
            className={`rounded-[1.7rem] border border-slate-200 bg-[#fbfdff]/95 p-4 shadow-2xl shadow-blue-100/55 backdrop-blur ${
              index === 1 ? "lg:min-h-[410px]" : "lg:min-h-[330px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${accent}`} />
              <p className="text-xs font-bold uppercase text-slate-400">
                {screen}
              </p>
            </div>
            <div className="mt-5 h-24 rounded-[1.25rem] bg-gradient-to-br from-blue-100 via-white to-cyan-100 shadow-inner shadow-blue-100" />
            <div className="mt-4 grid gap-3">
              <div className="h-4 w-3/4 rounded-full bg-slate-200" />
              <div className="h-4 w-1/2 rounded-full bg-slate-100" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-24 rounded-2xl border border-slate-100 bg-white shadow-sm" />
              <div className="h-24 rounded-2xl border border-slate-100 bg-white shadow-sm" />
            </div>
            {index === 1 && (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-white p-3 shadow-lg shadow-blue-100/40">
                <div className="h-3 w-24 rounded-full bg-blue-200" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-12 rounded-xl bg-blue-50" />
                  <div className="h-12 rounded-xl bg-cyan-50" />
                  <div className="h-12 rounded-xl bg-violet-50" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BuildSystemVisual({ accent }: { accent: string }) {
  const blocks = ["Frontend", "API layer", "Database", "Automation"];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-blue-950/20 sm:rounded-[2.25rem] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.28),transparent_30%),radial-gradient(circle_at_82%_80%,rgba(6,182,212,0.20),transparent_32%)]" />
      <div className="relative rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
            Product architecture
          </p>
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-white">
            Build-ready
          </span>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-5 grid gap-3 font-mono text-xs font-bold text-cyan-50/80 sm:text-sm">
              <p><span className="text-blue-300">const</span> product = createGrowblicApp()</p>
              <p><span className="text-violet-300">await</span> connectApi(workflows)</p>
              <p><span className="text-emerald-300">return</span> launchReadyModules</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="h-20 rounded-2xl bg-white/10" />
                <div className="h-20 rounded-2xl bg-white/10" />
                <div className="h-20 rounded-2xl bg-white/10" />
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {["API", "Auth", "Data"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-lg shadow-slate-950/20">
                <div className={`h-2 rounded-full bg-gradient-to-r ${accent}`} />
                <p className="mt-4 text-lg font-black">{item}</p>
                <p className="mt-2 text-xs font-semibold text-cyan-50/65">
                  Connected layer 0{index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          {blocks.map((block, index) => (
            <div
              key={block}
              className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 shadow-lg shadow-slate-950/25"
            >
              <div className={`h-2 rounded-full bg-gradient-to-r ${accent}`} />
              <p className="mt-5 text-lg font-black text-white">{block}</p>
              <div className="mt-5 grid gap-2">
                <div className="h-3 rounded-full bg-white/20" />
                <div className="h-3 w-2/3 rounded-full bg-white/10" />
              </div>
              <div className="mt-8 grid h-20 place-items-center rounded-2xl bg-slate-900/70">
                <span className="text-3xl font-black text-white/20">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LaunchChecklistVisual({ accent }: { accent: string }) {
  const items = ["Responsive QA", "Performance pass", "Forms and flows", "Deployment"];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-4 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_82%_82%,rgba(6,182,212,0.16),transparent_32%)]" />
      <div className="relative grid gap-5 lg:min-h-[500px] lg:grid-cols-[1fr_0.85fr] lg:items-stretch">
        <div className="rounded-[1.75rem] border border-slate-200 bg-[#fbfdff]/92 p-5 shadow-xl shadow-blue-100/40 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Release board
          </p>
          <div className="mt-6 grid gap-3">
            {items.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-blue-100/45"
              >
                <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-xs font-black text-white`}>
                  0{index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-950">{item}</p>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                      style={{ width: `${88 - index * 8}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-xl shadow-blue-100/40">
          <div className={`absolute right-5 top-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${accent} text-2xl font-black text-white shadow-xl shadow-emerald-500/20`}>
            ↑
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Production handoff
          </p>
          <div className="mt-20 rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-xl shadow-blue-950/10">
            <div className="h-24 rounded-[1.25rem] bg-white shadow-inner shadow-blue-100" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="h-16 rounded-2xl bg-blue-100/70" />
              <div className="h-16 rounded-2xl bg-cyan-100/70" />
            </div>
            <div className={`mt-5 h-12 rounded-2xl bg-gradient-to-r ${accent}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowthVisual({ accent }: { accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-4 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-6">
      <div className={`absolute -right-20 top-0 h-64 w-64 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-3xl`} />
      <div className="relative grid gap-5 lg:min-h-[500px] lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="rounded-[1.75rem] border border-slate-200 bg-[#fbfdff]/92 p-5 shadow-xl shadow-blue-100/40 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Improvement loop
          </p>
          <div className="mt-7 grid gap-3">
            {["Measure", "Prioritize", "Upgrade"].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg shadow-blue-100/45"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-950">{item}</p>
                  <span className="text-xs font-black text-blue-700">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                    style={{ width: `${58 + index * 14}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-violet-50 p-5 shadow-xl shadow-blue-100/40">
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            {["Conversion", "Feedback", "Speed"].map((item) => (
              <div key={item} className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm">
                <p className="text-xs font-black text-slate-400">{item}</p>
                <p className="mt-2 text-lg font-black text-slate-950">Better</p>
              </div>
            ))}
          </div>
          <div className="flex h-full min-h-[280px] items-end gap-3 rounded-[1.35rem] border border-white bg-white/70 p-5">
            {[42, 58, 50, 72, 66, 88].map((height, index) => (
              <div key={`${height}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                <div
                  className={`w-full rounded-t-2xl bg-gradient-to-t ${accent} shadow-lg shadow-blue-500/15`}
                  style={{ height: `${height}%` }}
                />
                <span className="h-2 w-2 rounded-full bg-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>
      {body && <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{body}</p>}
    </div>
  );
}

function BackToProcessLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/#process"
      className={`inline-flex min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white/90 px-4 py-2.5 text-sm font-black text-slate-950 shadow-xl shadow-blue-950/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 ${className}`}
    >
      ← Back to Process
    </Link>
  );
}

function OutcomeCards({ guide }: { guide: ProcessGuide }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-cyan-50/80 p-6 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-8">
      <div className={`absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${guide.accent} opacity-10 blur-3xl`} />
      <SectionHeading
        eyebrow="What you get"
        title="What you get in this step"
        body="Each phase creates practical assets and decisions that help the next stage move with less friction."
      />
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {guide.outcomes.map((outcome, index) => (
          <div
            key={outcome.title}
            className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 p-5 shadow-xl shadow-blue-950/5 backdrop-blur"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${guide.accent}`} />
            <div className="flex items-center justify-between gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${guide.accent} text-xs font-black text-white shadow-lg shadow-blue-500/20`}>
                0{index + 1}
              </span>
              <span className="text-sm font-black text-slate-300">
                Guide
              </span>
            </div>
            <h3 className="mt-6 text-lg font-black leading-snug text-slate-950">
              {outcome.title}
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              {outcome.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSnapshot({ guide }: { guide: ProcessGuide }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-blue-950/5 sm:rounded-[2.25rem] sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Snapshot
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">
            Process snapshot
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {guide.snapshot.map((item, index) => (
            <div
              key={item.label}
              className="rounded-[1.35rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50/70 p-4 shadow-sm shadow-blue-950/5"
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${guide.accent} text-xs font-black text-white`}>
                  {index + 1}
                </span>
                <p className="text-xs font-black uppercase text-slate-400">
                  {item.label}
                </p>
              </div>
              <p className="mt-4 text-base font-black leading-snug text-slate-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ guide }: { guide: ProcessGuide }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:rounded-[2rem] sm:p-8">
      <SectionHeading
        eyebrow="Questions"
        title="Common questions in this phase"
      />
      <div className="mt-7 grid gap-3">
        {guide.faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-slate-100 bg-[#fbfdff] p-4 shadow-sm shadow-blue-950/5 open:border-blue-100 open:bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black leading-6 text-slate-950">
              <span>{faq.question}</span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${guide.accent} text-lg leading-none text-white transition group-open:rotate-45`}>
                +
              </span>
            </summary>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function RelatedSteps({ guide }: { guide: ProcessGuide }) {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <SectionHeading
        eyebrow="Next reading"
        title="Related process steps"
        body="Explore nearby phases when you want to move backward for clarity or forward toward delivery."
      />
      <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {guide.relatedSteps.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-blue-950/5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-950/10"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${guide.accent} opacity-70`} />
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-950">
                {step.title}
              </h3>
              <span className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${guide.accent} opacity-80 transition group-hover:opacity-100`} />
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
              {step.description}
            </p>
            <p className="mt-5 text-sm font-black text-blue-700">
              Read guide
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ProcessGuidePage({ guide }: { guide: ProcessGuide }) {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative overflow-hidden border-b border-slate-100 bg-[#fbfdff] px-5 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.10),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.10),transparent_34%)]" />
        <div className="relative mx-auto max-w-6xl">
          <BackToProcessLink />

          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_360px] lg:items-end">
            <div>
              <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
                <Link href="/" className="transition hover:text-blue-700">
                  Growblic
                </Link>
                <span>/</span>
                <Link href="/#process" className="transition hover:text-blue-700">
                  Process
                </Link>
                <span>/</span>
                <span className="text-slate-950">{guide.breadcrumb}</span>
              </nav>

              <div className="mt-8">
                <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-blue-100/60">
                  PROCESS GUIDE
                </p>
                <h1 className="mt-5 text-balance text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  {guide.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
                  {guide.subtitle}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase text-blue-700 shadow-sm shadow-blue-100/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-white/80 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${guide.accent} text-sm font-black text-white shadow-lg shadow-blue-500/25`}>
                  {guide.stepNumber}
                </span>
                <span className="rounded-full border border-slate-200 bg-[#fbfdff] px-3 py-1 text-xs font-black uppercase text-slate-500">
                  Growblic workflow
                </span>
              </div>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                Current step
              </p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950">
                {guide.breadcrumb}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {guide.snapshot.slice(0, 2).map((item) => (
                  <div key={item.label} className="rounded-2xl border border-blue-100 bg-[#fbfdff] p-3">
                    <p className="text-[0.65rem] font-black uppercase text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-black leading-snug text-slate-950">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-12">
            <ProcessVisual guide={guide} />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-5">
          <OutcomeCards guide={guide} />
          <ProcessSnapshot guide={guide} />
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article className="grid gap-5">
            {guide.sections.map((section) => (
              <section
                key={section.heading}
                className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:rounded-[2rem] sm:p-8"
              >
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${guide.accent}`} />
                <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                  {section.heading}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {section.body}
                </p>
                <ul className="mt-6 grid gap-3">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 rounded-2xl border border-slate-100 bg-[#fbfdff] p-4 text-sm font-semibold leading-6 text-slate-600 sm:text-base"
                    >
                      <span className={`mt-1 h-5 w-5 shrink-0 rounded-full bg-gradient-to-br ${guide.accent}`} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <FaqSection guide={guide} />
          </article>

          <aside className="lg:sticky lg:top-8">
            <div className="rounded-[2rem] border border-blue-100 bg-[#fbfdff] p-6 shadow-2xl shadow-blue-950/10">
              <div className="flex items-center justify-between gap-4">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${guide.accent} text-sm font-black text-white`}>
                  {guide.stepNumber}
                </span>
                <span className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-black uppercase text-blue-700">
                  Step
                </span>
              </div>
              <h2 className="mt-6 text-3xl font-black leading-tight text-slate-950">
                {guide.breadcrumb}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                {guide.subtitle}
              </p>
              <div className="mt-5 rounded-[1.35rem] border border-blue-100 bg-white p-4">
                <p className="text-sm font-black text-slate-950">
                  Phase output
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {guide.snapshot[3].value}
                </p>
              </div>
              <div className="mt-6 rounded-[1.35rem] border border-slate-200 bg-white p-4">
                <p className="text-sm font-black text-slate-950">Best for</p>
                <ul className="mt-4 grid gap-3">
                  {guide.bestFor.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm font-semibold leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 grid gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start a Project
                </Link>
                <Link
                  href="/#process"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                >
                  Back to Process
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <RelatedSteps guide={guide} />

        <div className="mx-auto mt-10 max-w-6xl rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-3xl font-black leading-tight text-slate-950">
              Ready to build your product?
            </p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Growblic can help you plan, design, build, launch, and improve
              your software product.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:mt-0">
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start a Project
            </Link>
            <Link
              href="/#process"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
            >
              Back to Process
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
