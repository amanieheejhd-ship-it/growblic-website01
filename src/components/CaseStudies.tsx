const caseStudies = [
  {
    number: "01",
    category: "Retail System",
    title: "Retail Billing & Inventory App",
    description:
      "Billing, inventory, customer records, and reports in one connected workflow.",
    result: "Faster operations",
  },
  {
    number: "02",
    category: "Booking Platform",
    title: "Barber / Salon Booking App",
    description:
      "Service booking, staff schedules, and admin control for smooth appointments.",
    result: "Smooth bookings",
  },
  {
    number: "03",
    category: "Education Platform",
    title: "Learning / School Management Platform",
    description:
      "Classes, notes, student records, fees, and notifications organized in one place.",
    result: "Organized workflow",
  },
  {
    number: "04",
    category: "CRM Dashboard",
    title: "Business Dashboard & CRM",
    description:
      "Lead tracking, reporting, follow-ups, and client management for growing teams.",
    result: "Smarter follow-up",
  },
];

const trustPills = ["Business Apps", "Admin Dashboards", "Automation Systems"];
const rowLabels = ["Problem", "Solution", "Result"];

export default function CaseStudies() {
  return (
    <section className="case-studies-section relative overflow-hidden bg-white px-6 py-20 pb-28 sm:py-24 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(239,246,255,0.9),rgba(255,255,255,0.72)_38%,rgba(236,254,255,0.7))]" />
      <div className="pointer-events-none absolute left-[-10rem] top-24 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] bottom-16 h-96 w-96 rounded-full bg-cyan-100/55 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.055)_1px,transparent_0)] bg-[size:32px_32px] opacity-45" />

      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <aside className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-2xl shadow-blue-950/8 backdrop-blur-xl lg:sticky lg:top-28 lg:p-8">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            CASE STUDIES
          </span>

          <h2 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Real solutions Growblic can build
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Practical software ideas shaped into launch-ready digital products.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {trustPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-600 shadow-sm shadow-blue-100/40"
              >
                {pill}
              </span>
            ))}
          </div>

          <a
            href="#contact"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Start a Project
          </a>
        </aside>

        <div className="space-y-4">
          {caseStudies.map((study) => (
            <article
              key={study.title}
              className="group rounded-[1.6rem] border border-white/80 bg-white/88 p-5 shadow-xl shadow-blue-950/6 backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1 hover:border-cyan-200 hover:shadow-2xl hover:shadow-blue-950/10 sm:p-6"
            >
              <div className="grid gap-5 xl:grid-cols-[auto_1fr_auto] xl:items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black tracking-[0.2em] text-slate-400">
                    {study.number}
                  </span>
                  <span className="rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-blue-700">
                    {study.category}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                    {study.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                    {study.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {rowLabels.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-slate-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-slate-500 ring-1 ring-slate-200/80"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex xl:justify-end">
                  <span className="rounded-full border border-cyan-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-800">
                    {study.result}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
