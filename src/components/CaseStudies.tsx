const caseStudies = [
  {
    number: "01",
    symbol: "PKG",
    title: "Retail Billing & Inventory App",
    problem: "Manual billing and stock tracking takes time.",
    solution: "Billing, inventory, customer records, and reports in one app.",
    result: "Faster daily operations and better business visibility.",
    badge: "Faster operations",
    summary: "A connected billing and stock control system for daily retail work.",
  },
  {
    number: "02",
    symbol: "CAL",
    title: "Barber / Salon Booking App",
    problem:
      "Customers struggle to book services and businesses miss appointments.",
    solution: "Booking system, service list, staff schedule, and admin dashboard.",
    result: "Smooth bookings and better customer experience.",
    badge: "Smooth bookings",
    summary: "Service booking, staff schedules, and admin control in one flow.",
  },
  {
    number: "03",
    symbol: "EDU",
    title: "Learning / School Management Platform",
    problem: "Notes, classes, fees, and student data are scattered.",
    solution:
      "Student dashboard, admin panel, attendance, notes, and notifications.",
    result: "Organized digital learning workflow.",
    badge: "Organized workflow",
    summary: "A learning platform that keeps classes, notes, fees, and student data organized.",
  },
  {
    number: "04",
    symbol: "CRM",
    title: "Business Dashboard & CRM",
    problem: "Leads, sales, and client data are hard to manage.",
    solution: "CRM dashboard, lead tracking, reports, and automation.",
    result: "Better follow-up and smarter business decisions.",
    badge: "Smarter follow-up",
    summary: "Lead tracking, reporting, and CRM automation for better decisions.",
  },
];

function TimelineItem({
  label,
  text,
  color,
}: {
  label: string;
  text: string;
  color: string;
}) {
  return (
    <div className="flex gap-3">
      <span
        className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_0_5px_rgba(59,130,246,0.12)] ${color}`}
      />
      <div>
        <p className="font-black text-slate-950">{label}</p>
        <p className="mt-1">{text}</p>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="case-study-preview relative mt-7 overflow-hidden rounded-[1.7rem] border border-blue-100/80 bg-white/88 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_24px_60px_rgba(37,99,235,0.12)] backdrop-blur">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-100/80 blur-2xl" />
      <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-violet-100/70 blur-2xl" />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-slate-100 bg-[#f8fbff]">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/85 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-emerald-700">
            Live workflow
          </span>
        </div>

        <div className="grid gap-3 p-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {["Sales", "Stock", "Due"].map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-blue-50 bg-white p-3 shadow-sm shadow-blue-100/50"
                >
                  <p className="text-[0.58rem] font-black uppercase tracking-[0.14em] text-slate-400">
                    {item}
                  </p>
                  <p className="mt-2 text-sm font-black text-slate-950">
                    {index === 0 ? "12.8k" : index === 1 ? "248" : "18"}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-blue-50 bg-white p-4 shadow-sm shadow-blue-100/50">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-black text-slate-950">
                  Invoice queue
                </span>
                <span className="text-[0.65rem] font-black text-blue-600">
                  Today
                </span>
              </div>
              {[92, 68, 84, 56].map((width, index) => (
                <div
                  key={`${width}-${index}`}
                  className="mb-3 flex items-center gap-3 last:mb-0"
                >
                  <span className="h-7 w-7 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50" />
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-slate-300 to-blue-200"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-50 bg-white p-4 shadow-sm shadow-blue-100/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-950">
                Reports
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[0.65rem] font-black text-blue-700">
                Synced
              </span>
            </div>
            <div className="mt-5 flex h-32 items-end gap-2">
              {[54, 86, 68, 108, 78, 118, 92].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-300 shadow-sm shadow-blue-200"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <span className="rounded-xl bg-slate-50 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-500">
                GST ready
              </span>
              <span className="rounded-xl bg-cyan-50 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.12em] text-cyan-700">
                Auto stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportingPreview({ type }: { type: string }) {
  if (type === "CAL") {
    return (
      <div className="relative mt-5 rounded-[1.25rem] border border-blue-50 bg-[#f8fbff] p-3">
        <div className="grid grid-cols-4 gap-2">
          {["09", "10", "11", "12"].map((time, index) => (
            <span
              key={time}
              className={`rounded-xl px-2 py-3 text-center text-[0.65rem] font-black ${
                index === 1
                  ? "bg-gradient-to-br from-blue-600 to-cyan-400 text-white"
                  : "bg-white text-slate-500"
              }`}
            >
              {time}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white p-2">
          <span className="h-8 w-8 rounded-full bg-cyan-100" />
          <div className="flex-1 space-y-1.5">
            <span className="block h-2 rounded-full bg-slate-200" />
            <span className="block h-2 w-2/3 rounded-full bg-blue-100" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "EDU") {
    return (
      <div className="relative mt-5 rounded-[1.25rem] border border-blue-50 bg-[#f8fbff] p-3">
        {["Class notes", "Attendance", "Fee update"].map((item, index) => (
          <div
            key={item}
            className="mb-2 flex items-center gap-3 rounded-xl bg-white p-2 last:mb-0"
          >
            <span
              className={`h-8 w-8 rounded-xl ${
                index === 0
                  ? "bg-blue-100"
                  : index === 1
                    ? "bg-cyan-100"
                    : "bg-violet-100"
              }`}
            />
            <div className="flex-1">
              <p className="text-[0.68rem] font-black text-slate-700">
                {item}
              </p>
              <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative mt-5 rounded-[1.25rem] border border-blue-50 bg-[#f8fbff] p-3">
      {["Lead", "Proposal", "Closed"].map((item, index) => (
        <div key={item} className="mb-3 last:mb-0">
          <div className="mb-1.5 flex justify-between text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-400">
            <span>{item}</span>
            <span>{index === 0 ? "64%" : index === 1 ? "48%" : "32%"}</span>
          </div>
          <div className="h-2 rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-300"
              style={{ width: `${64 - index * 16}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CaseStudies() {
  const [featuredCase, ...supportingCases] = caseStudies;

  return (
    <section className="case-studies-section relative overflow-hidden bg-[#f7f9fd] px-6 py-20 sm:py-24">
      <div className="case-study-glow pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] top-1/3 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute left-[8%] top-[34%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),rgba(34,211,238,0.12)_42%,transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(37,99,235,0.14)_1px,transparent_0)] bg-[size:28px_28px] opacity-25" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.2),transparent_62%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-blue-100/80 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 shadow-lg shadow-blue-100/45 backdrop-blur">
              Case Studies
            </span>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-5xl">
              Real solutions Growblic can build
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Practical software ideas shaped into launch-ready digital
              products.
            </p>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <div className="flex flex-wrap gap-2">
              <p className="inline-flex rounded-full border border-cyan-100 bg-cyan-50/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
                4 business workflows
              </p>
              <p className="inline-flex rounded-full border border-violet-100 bg-violet-50/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                Portfolio-ready systems
              </p>
              {["Apps", "Dashboards", "Automations"].map((badge) => (
                <p
                  key={badge}
                  className="inline-flex rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-blue-100/50"
                >
                  {badge}
                </p>
              ))}
            </div>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              From business websites to full apps and dashboards, Growblic builds
              products that solve real business problems.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="case-study-featured-card group relative flex min-h-[560px] flex-col overflow-hidden rounded-[2.1rem] border border-white/80 bg-white/86 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-blue-100/80 sm:p-8">
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.16),rgba(168,85,247,0.08)_45%,transparent_70%)] blur-2xl" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-100/80 blur-3xl transition duration-300 group-hover:bg-blue-100/90" />
            <div className="absolute -bottom-20 left-10 h-52 w-52 rounded-full bg-violet-100/70 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,255,255,0.42)_35%,rgba(224,242,254,0.34))]" />
            <div className="pointer-events-none absolute right-6 top-20 hidden flex-wrap gap-2 sm:flex">
              {["Billing", "Reports", "Inventory", "Customers"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.14em] text-slate-500 shadow-lg shadow-blue-950/5 backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 text-sm font-black tracking-[0.14em] text-white shadow-xl shadow-blue-100/70">
                {featuredCase.symbol}
              </span>
              <span className="rounded-full border border-blue-100 bg-blue-50/90 px-5 py-2 text-sm font-black text-blue-700">
                {featuredCase.number}
              </span>
            </div>

            <div className="relative mt-8 max-w-2xl">
              <h3 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                {featuredCase.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-600">
                {featuredCase.summary}
              </p>
            </div>

            <DashboardPreview />

            <div className="case-study-timeline relative mt-7 grid gap-4 text-sm leading-6 text-slate-600 sm:grid-cols-3">
              <TimelineItem
                label="Problem"
                text={featuredCase.problem}
                color="bg-orange-400"
              />
              <TimelineItem
                label="Solution"
                text={featuredCase.solution}
                color="bg-cyan-500"
              />
              <TimelineItem
                label="Result"
                text={featuredCase.result}
                color="bg-emerald-500"
              />
            </div>

            <div className="relative mt-auto pt-7">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
              <span className="mt-4 inline-flex rounded-full bg-gradient-to-r from-blue-50 via-cyan-50 to-violet-50 px-5 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                {featuredCase.badge}
              </span>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
            {supportingCases.map((study) => (
              <div
                key={study.title}
                className="case-study-card group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-[1.85rem] border border-white/80 bg-white/84 p-5 shadow-xl shadow-blue-950/8 backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70"
              >
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition duration-300 group-hover:bg-cyan-100/80" />

                <SupportingPreview type={study.symbol} />

                <div className="relative flex items-center justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 text-[0.65rem] font-black tracking-[0.14em] text-white shadow-xl shadow-blue-100/70">
                    {study.symbol}
                  </span>
                  <span className="rounded-full border border-blue-100 bg-blue-50/85 px-3 py-1 text-xs font-black text-blue-700">
                    {study.number}
                  </span>
                </div>

                <h3 className="relative mt-5 text-xl font-semibold leading-tight text-slate-950">
                  {study.title}
                </h3>
                <p className="relative mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {study.summary}
                </p>

                <div className="case-study-timeline relative mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-orange-700">
                    Problem
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-cyan-700">
                    Solution
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-emerald-700">
                    Result
                  </span>
                </div>

                <div className="relative mt-auto pt-6">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
                  <span className="mt-4 inline-flex rounded-full bg-gradient-to-r from-blue-50 via-cyan-50 to-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                    {study.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[1.9rem] border border-blue-100/80 bg-white/80 p-6 shadow-2xl shadow-blue-950/8 backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-100/80 blur-3xl" />
          <div className="relative">
            <p className="text-xl font-semibold text-slate-950">
              Have a similar business idea?
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Growblic can plan, design, and build it into a real product.
            </p>
          </div>
          <a
            href="#contact"
            className="relative mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:mt-0"
          >
            Start a Project
          </a>
        </div>
      </div>
    </section>
  );
}
