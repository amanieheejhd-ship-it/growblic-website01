import { ArrowRight, CheckCircle2 } from "lucide-react";

const milestones = [
  {
    title: "Foundation",
    description: "Started with modern websites and digital product design.",
  },
  {
    title: "Product Growth",
    description:
      "Expanded into mobile apps, dashboards, and business software.",
  },
  {
    title: "Live Apps",
    description:
      "Built 35+ live software and app experiences across different categories.",
  },
  {
    title: "Automation Future",
    description:
      "Growing into SaaS platforms, AI automation, and scalable business systems.",
  },
];

export default function Journey() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(239,246,255,0.62),rgba(255,255,255,0)_34%),radial-gradient(circle_at_50%_12%,rgba(6,182,212,0.10),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="growblic-card-reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-600 sm:text-sm">
            Growblic Journey
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Building digital products step by step
          </h2>
          <p className="mt-5 text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
            From business websites to mobile apps and automation systems,
            Growblic keeps expanding its software ecosystem.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-blue-500 via-cyan-400 to-violet-500 md:left-0 md:right-0 md:top-9 md:mx-auto md:h-px md:w-[calc(100%-7rem)] md:bg-gradient-to-r" />

          <div className="growblic-reveal-grid grid gap-5 md:grid-cols-4">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.title}
                className="relative pl-16 md:pl-0 md:pt-20"
              >
                <div className="absolute left-[0.85rem] top-6 z-10 grid h-10 w-10 place-items-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-xl shadow-blue-100/80 md:left-1/2 md:top-4 md:-translate-x-1/2">
                  <CheckCircle2 size={20} />
                </div>

                {index < milestones.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="absolute right-[-0.55rem] top-[1.8rem] z-10 hidden text-cyan-500 md:block"
                  />
                )}

                <article className="h-full rounded-[1.75rem] border border-blue-100/80 bg-white p-6 shadow-xl shadow-slate-900/6 transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70">
                  <span className="text-sm font-black text-blue-600">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                    {milestone.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
