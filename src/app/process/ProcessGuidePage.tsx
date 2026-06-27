import Link from "next/link";
import type { ProcessGuide } from "./processGuideData";

export default function ProcessGuidePage({ guide }: { guide: ProcessGuide }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.14),transparent_34%),radial-gradient(circle_at_88%_72%,rgba(6,182,212,0.11),transparent_32%)]" />
        <div className="absolute left-[-10rem] top-28 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="absolute right-[-12rem] bottom-16 h-96 w-96 rounded-full bg-cyan-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
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
            <p className="text-sm font-black uppercase tracking-[0.32em] text-blue-600">
              PROCESS GUIDE
            </p>
            <h1 className="mt-5 text-balance text-4xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              {guide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              {guide.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {guide.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-100 bg-white/86 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm shadow-blue-100/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/78 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur-xl sm:p-6">
            <div className={`h-2 rounded-full bg-gradient-to-r ${guide.accent}`} />
            <div className="grid gap-5 py-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div className="rounded-[1.7rem] border border-blue-100/70 bg-[#fbfdff] p-5 shadow-inner shadow-blue-100/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Product phase
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    {guide.breadcrumb}
                  </span>
                </div>
                <div className="mt-8 grid gap-3">
                  {guide.tags.map((tag, index) => (
                    <div
                      key={tag}
                      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm shadow-blue-100/50"
                    >
                      <span
                        className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${guide.accent} ${
                          index === 0 ? "opacity-100" : "opacity-80"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-950">
                          {tag}
                        </p>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${guide.accent}`}
                            style={{ width: `${82 - index * 14}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-blue-100/70 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/70 p-6">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">
                  Growblic workflow
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                  Clear planning. Premium execution. Reliable release.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Each process step keeps the product focused on business use,
                  practical workflows, and a launch-ready digital experience.
                </p>
              </div>
            </div>
          </div>

          <article className="mx-auto mt-14 max-w-4xl">
            <div className="grid gap-5">
              {guide.sections.map((section) => (
                <section
                  key={section.heading}
                  className="rounded-[1.8rem] border border-blue-100/70 bg-white p-6 shadow-xl shadow-blue-950/6 sm:p-8"
                >
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    {section.heading}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-slate-600">
                    {section.body}
                  </p>
                  <ul className="mt-6 grid gap-3">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm font-semibold leading-6 text-slate-600 sm:text-base"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>

          <div className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-blue-100 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div>
              <p className="text-2xl font-black tracking-tight">
                Ready to build your product?
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Share your idea and Growblic can help turn it into a website,
                app, SaaS product, dashboard, or automation system.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5"
              >
                Start a Project
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
