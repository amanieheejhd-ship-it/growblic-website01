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
    features: ["Billing", "Inventory", "Reports"],
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
    features: ["Booking", "Schedule", "Dashboard"],
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
    summary:
      "A learning platform that keeps classes, notes, fees, and student data organized.",
    features: ["Classes", "Students", "Updates"],
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
    features: ["Leads", "Reports", "Automation"],
  },
];

const stripItems = [
  { label: "Problem", color: "bg-orange-400" },
  { label: "Solution", color: "bg-cyan-500" },
  { label: "Result", color: "bg-emerald-500" },
];

function FeaturePills({ features }: { features: string[] }) {
  return (
    <div className="relative flex flex-wrap gap-2">
      {features.map((feature) => (
        <span
          key={feature}
          className="rounded-full border border-blue-100 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700 shadow-sm shadow-blue-100/60"
        >
          {feature}
        </span>
      ))}
    </div>
  );
}

function InfoStrip({
  problem,
  solution,
  result,
  compact = false,
}: {
  problem: string;
  solution: string;
  result: string;
  compact?: boolean;
}) {
  const content = [problem, solution, result];

  return (
    <div
      className={`relative grid gap-3 ${
        compact ? "text-xs leading-5" : "text-sm leading-6 sm:grid-cols-3"
      }`}
    >
      {stripItems.map((item, index) => (
        <div
          key={item.label}
          className="rounded-2xl border border-blue-50 bg-white/86 p-4 shadow-sm shadow-blue-100/50"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <p className="font-black uppercase tracking-[0.14em] text-slate-950">
              {item.label}
            </p>
          </div>
          <p className="text-slate-600">{content[index]}</p>
        </div>
      ))}
    </div>
  );
}

export default function CaseStudies() {
  const [featuredCase, ...supportingCases] = caseStudies;

  return (
    <section className="case-studies-section relative overflow-hidden bg-[#f7f9fd] px-6 py-20 pb-28 sm:py-24 sm:pb-28">
      <div className="case-study-glow pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] top-1/3 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute left-[8%] top-[38%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),rgba(34,211,238,0.1)_42%,transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(37,99,235,0.13)_1px,transparent_0)] bg-[size:28px_28px] opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.2),transparent_62%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
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
              {["Apps", "Dashboards", "Automations"].map((badge) => (
                <p
                  key={badge}
                  className="inline-flex rounded-full border border-blue-100 bg-white/82 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-blue-100/50"
                >
                  {badge}
                </p>
              ))}
            </div>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              Four practical workflows, presented as clean product ideas your
              business can launch and scale.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="case-study-featured-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/88 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-blue-100/80 sm:p-8">
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-100/90 to-violet-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-12 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,255,255,0.48)_45%,rgba(224,242,254,0.3))]" />

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

            <div className="relative mt-7">
              <FeaturePills features={featuredCase.features} />
            </div>

            <div className="relative mt-8">
              <InfoStrip
                problem={featuredCase.problem}
                solution={featuredCase.solution}
                result={featuredCase.result}
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
                className="case-study-card group relative flex h-full min-h-[255px] flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/86 p-5 shadow-xl shadow-blue-950/8 backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70"
              >
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-100/70 blur-2xl transition duration-300 group-hover:bg-blue-100/80" />

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

                <div className="relative mt-5">
                  <FeaturePills features={study.features} />
                </div>

                <div className="case-study-timeline relative mt-5 flex flex-wrap gap-2">
                  {stripItems.map((item) => (
                    <span
                      key={item.label}
                      className="rounded-full bg-slate-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-600 ring-1 ring-blue-50"
                    >
                      {item.label}
                    </span>
                  ))}
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

        <div className="relative mt-8 overflow-hidden rounded-[1.8rem] border border-blue-100/80 bg-white/82 p-6 shadow-2xl shadow-blue-950/8 backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-100/80 blur-3xl" />
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
