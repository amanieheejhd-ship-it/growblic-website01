const caseStudies = [
  {
    number: "01",
    symbol: "PKG",
    title: "Retail Billing & Inventory App",
    problem: "Manual billing and stock tracking takes time.",
    solution: "Billing, inventory, customer records, and reports in one app.",
    result: "Faster daily operations and better business visibility.",
    badge: "Faster operations",
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
  },
  {
    number: "04",
    symbol: "CRM",
    title: "Business Dashboard & CRM",
    problem: "Leads, sales, and client data are hard to manage.",
    solution: "CRM dashboard, lead tracking, reports, and automation.",
    result: "Better follow-up and smarter business decisions.",
    badge: "Smarter follow-up",
  },
];

export default function CaseStudies() {
  return (
    <section className="case-studies-section relative overflow-hidden bg-[#f7f9fd] px-6 py-20 sm:py-24">
      <div className="case-study-glow pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] top-1/3 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-blue-100/80 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 shadow-lg shadow-blue-100/45 backdrop-blur">
              Case Studies
            </span>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-5xl">
              Real solutions Growblic can build
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="inline-flex rounded-full border border-cyan-100 bg-cyan-50/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
              Built for real business workflows
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              From business websites to full apps and dashboards, Growblic builds
              products that solve real business problems.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {caseStudies.map((study) => (
            <div
              key={study.title}
              className="case-study-card group relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[1.85rem] border border-white/80 bg-white/84 p-6 shadow-xl shadow-blue-950/8 backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70"
            >
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition duration-300 group-hover:bg-cyan-100/80" />

              <div className="relative flex items-center justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 text-xs font-black tracking-[0.14em] text-white shadow-xl shadow-blue-100/70">
                  {study.symbol}
                </span>
                <span className="rounded-full border border-blue-100 bg-blue-50/85 px-3 py-1 text-xs font-black text-blue-700">
                  {study.number}
                </span>
              </div>

              <h3 className="relative mt-7 text-xl font-semibold leading-tight text-slate-950">
                {study.title}
              </h3>

              <div className="case-study-timeline relative mt-6 grid gap-4 text-sm leading-6 text-slate-600">
                <div className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-400 shadow-[0_0_0_5px_rgba(251,146,60,0.14)]" />
                  <div>
                    <p className="font-black text-slate-950">Problem</p>
                    <p className="mt-1">{study.problem}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500 shadow-[0_0_0_5px_rgba(6,182,212,0.14)]" />
                  <div>
                    <p className="font-black text-slate-950">Solution</p>
                    <p className="mt-1">{study.solution}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.14)]" />
                  <div>
                    <p className="font-black text-slate-950">Result</p>
                    <p className="mt-1">{study.result}</p>
                  </div>
                </div>
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
    </section>
  );
}
