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
  const nodes = ["Goal", "Users", "Flows", "Scope"];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-8">
      <div className="absolute inset-x-8 top-1/2 h-px bg-blue-100" />
      <div className="relative grid gap-4 md:grid-cols-[1fr_1.15fr] md:items-center">
        <div className="rounded-[1.5rem] border border-slate-200 bg-[#fbfdff] p-5">
          <p className="text-xs font-bold uppercase text-slate-400">
            Strategy map
          </p>
          <h2 className="mt-4 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
            Align the idea before the first screen.
          </h2>
          <div className="mt-7 grid gap-3">
            {nodes.map((node, index) => (
              <div
                key={node}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm shadow-blue-100/50"
              >
                <span className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${accent}`} />
                <div>
                  <p className="text-sm font-black text-slate-950">{node}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    Phase input 0{index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-h-[320px] place-items-center rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5">
          <div className="relative h-64 w-full max-w-md">
            <div className={`absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.75rem] bg-gradient-to-br ${accent} text-sm font-black text-white shadow-xl shadow-blue-500/20`}>
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
                  className={`absolute ${positions[index]} rounded-2xl border border-white bg-white/90 px-4 py-3 text-sm font-black text-slate-700 shadow-lg shadow-blue-950/10`}
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
    <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1fr_0.75fr] lg:items-center">
        {["Mobile", "Dashboard", "Product"].map((screen, index) => (
          <div
            key={screen}
            className={`rounded-[1.7rem] border border-slate-200 bg-[#fbfdff] p-4 shadow-lg shadow-blue-100/45 ${
              index === 1 ? "lg:min-h-[380px]" : "lg:min-h-[310px]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${accent}`} />
              <p className="text-xs font-bold uppercase text-slate-400">
                {screen}
              </p>
            </div>
            <div className="mt-5 h-20 rounded-[1.25rem] bg-gradient-to-br from-blue-100 via-white to-cyan-100" />
            <div className="mt-4 grid gap-3">
              <div className="h-4 w-3/4 rounded-full bg-slate-200" />
              <div className="h-4 w-1/2 rounded-full bg-slate-100" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-24 rounded-2xl border border-slate-100 bg-white" />
              <div className="h-24 rounded-2xl border border-slate-100 bg-white" />
            </div>
            {index === 1 && (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-white p-3">
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
    <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-8">
      <div className="rounded-[1.75rem] border border-slate-200 bg-[#fbfdff] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase text-slate-400">
            Product architecture
          </p>
          <span className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-black text-blue-700">
            Build-ready
          </span>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-4">
          {blocks.map((block, index) => (
            <div
              key={block}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-lg shadow-blue-100/40"
            >
              <div className={`h-2 rounded-full bg-gradient-to-r ${accent}`} />
              <p className="mt-5 text-lg font-black text-slate-950">{block}</p>
              <div className="mt-5 grid gap-2">
                <div className="h-3 rounded-full bg-slate-200" />
                <div className="h-3 w-2/3 rounded-full bg-slate-100" />
              </div>
              <div className="mt-8 grid h-24 place-items-center rounded-2xl bg-slate-50">
                <span className="text-3xl font-black text-slate-200">
                  0{index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {["Auth", "Roles", "Integrations"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 text-sm font-black text-slate-700"
            >
              {item}
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
    <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-stretch">
        <div className="rounded-[1.75rem] border border-slate-200 bg-[#fbfdff] p-5">
          <p className="text-xs font-bold uppercase text-slate-400">
            Release board
          </p>
          <div className="mt-6 grid gap-3">
            {items.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-blue-100/50"
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
        <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5">
          <p className="text-xs font-bold uppercase text-blue-700">
            Production handoff
          </p>
          <div className="mt-8 rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-xl shadow-blue-950/10">
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
    <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-5 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="rounded-[1.75rem] border border-slate-200 bg-[#fbfdff] p-5">
          <p className="text-xs font-bold uppercase text-slate-400">
            Improvement loop
          </p>
          <div className="mt-7 grid gap-3">
            {["Measure", "Prioritize", "Upgrade"].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-blue-100/50"
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
        <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-violet-50 p-5">
          <div className="flex h-full min-h-[320px] items-end gap-3 rounded-[1.35rem] border border-white bg-white/70 p-5">
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

export default function ProcessGuidePage({ guide }: { guide: ProcessGuide }) {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <section className="relative border-b border-slate-100 bg-[#fbfdff] px-5 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-6xl">
          <nav className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold text-slate-500 sm:justify-start">
            <Link href="/" className="transition hover:text-blue-700">
              Growblic
            </Link>
            <span>/</span>
            <Link href="/process" className="transition hover:text-blue-700">
              Process
            </Link>
            <span>/</span>
            <span className="text-slate-950">{guide.breadcrumb}</span>
          </nav>

          <div className="mx-auto mt-12 max-w-4xl text-center">
            <p className="text-sm font-black uppercase text-blue-600">
              PROCESS GUIDE
            </p>
            <h1 className="mt-5 text-balance text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {guide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              {guide.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {guide.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase text-blue-700 shadow-sm shadow-blue-100/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm font-bold text-slate-500">
              Growblic workflow guide
            </p>
          </div>

          <div className="mt-12">
            <ProcessVisual guide={guide} />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article className="grid gap-5">
            {guide.sections.map((section) => (
              <section
                key={section.heading}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:rounded-[2rem] sm:p-8"
              >
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
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                >
                  Back to Process
                </Link>
              </div>
            </div>
          </aside>
        </div>

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
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
