const metrics = [
  {
    value: "3.4x",
    label: "Faster workflows",
    detail: "Cleaner product systems reduce daily friction for internal teams.",
  },
  {
    value: "42%",
    label: "Less manual work",
    detail: "Automation removes repetitive work from operations and support.",
  },
  {
    value: "99.9%",
    label: "Scale-ready",
    detail: "Reliable frontend foundations built for long-term growth.",
  },
];

const workflowHighlights = [
  {
    title: "Built for real business workflows",
    detail:
      "Clear user journeys, practical dashboards, and tools shaped around day-to-day operations.",
    badge: "Workflow fit",
    marker: "01",
  },
  {
    title: "Clean UI systems",
    detail:
      "Reusable interface patterns, polished interactions, and layouts that stay easy to scan.",
    badge: "UI quality",
    marker: "02",
  },
  {
    title: "Automation-ready launch support",
    detail:
      "Frontend foundations, handoff details, and support flows prepared for ongoing iteration.",
    badge: "Launch ready",
    marker: "03",
  },
];

const capabilities = [
  "Strategy",
  "UI/UX",
  "Frontend",
  "Automation",
  "Support",
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-6 py-18">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(6,182,212,0.09),transparent_25%),radial-gradient(circle_at_50%_95%,rgba(168,85,247,0.07),transparent_28%)]" />

      <div className="relative mx-auto max-w-[1800px]">
        <div className="growblic-card-reveal mb-9 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Client results
            </p>

            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              Software that feels premium and performs in real business.
            </h2>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
            From idea to launch, Growblic builds clean interfaces, scalable
            frontend systems, automation flows, and support-ready software.
          </p>
        </div>

        <div className="growblic-card-reveal relative overflow-hidden rounded-[2.8rem] border border-blue-100/70 bg-[#fbfdff]/85 p-5 shadow-2xl shadow-slate-200/75 backdrop-blur-xl">
          <div className="absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          <div className="absolute -left-20 top-4 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="relative grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="rounded-[2.2rem] border border-blue-100/70 bg-gradient-to-br from-white via-blue-50/45 to-white p-6 shadow-xl shadow-blue-100/50">
              <div className="flex flex-wrap gap-2">
                {capabilities.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-blue-100/70 bg-[#fbfdff] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-slate-500 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 rounded-[1.8rem] border border-blue-100/70 bg-[#fbfdff] p-6 shadow-lg shadow-blue-100/50">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                  Growblic standard
                </p>
                <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Premium build quality with practical business value.
                </h3>

                <div className="mt-6 h-2 w-28 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
              </div>
            </div>

            <div className="growblic-reveal-grid grid gap-4 md:grid-cols-3">
              {metrics.map((metric, index) => (
                <article
                  key={metric.label}
                  className="group relative overflow-hidden rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-6 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                >
                  <div className="absolute right-[-42px] top-[-42px] h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 transition-transform duration-500 group-hover:scale-125" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />

                  <div className="relative">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-4xl font-black tracking-tight text-slate-950">
                        {metric.value}
                      </h3>
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-xs font-black text-white shadow-lg">
                        0{index + 1}
                      </div>
                    </div>

                    <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">
                      {metric.label}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      {metric.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="growblic-reveal-grid relative -mt-5 grid gap-4 px-2 md:grid-cols-3 lg:px-8">
          {workflowHighlights.map((item, index) => (
            <article
              key={item.title}
              className={[
                "group relative overflow-hidden rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-6 shadow-xl shadow-slate-200/75 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl",
                index === 1 ? "md:translate-y-4" : "",
              ].join(" ")}
            >
              <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[3.5rem] bg-gradient-to-br from-blue-50 to-cyan-50" />
              <div className="absolute -left-10 bottom-[-52px] h-36 w-36 rounded-full bg-blue-50/80 transition-transform duration-500 group-hover:scale-125" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-xs font-black text-white shadow-lg">
                  {item.marker}
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  {item.badge}
                </span>
              </div>

              <h4 className="relative mt-6 text-xl font-black tracking-tight text-slate-950">
                {item.title}
              </h4>
              <p className="relative mt-3 text-sm font-semibold leading-6 text-slate-500">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
