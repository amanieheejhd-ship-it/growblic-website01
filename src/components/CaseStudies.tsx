const caseStudies = [
  {
    title: "Retail Billing & Inventory App",
    problem: "Manual billing and stock tracking takes time.",
    solution: "Billing, inventory, customer records, and reports in one app.",
    result: "Faster daily operations and better business visibility.",
  },
  {
    title: "Barber / Salon Booking App",
    problem:
      "Customers struggle to book services and businesses miss appointments.",
    solution: "Booking system, service list, staff schedule, and admin dashboard.",
    result: "Smooth bookings and better customer experience.",
  },
  {
    title: "Learning / School Management Platform",
    problem: "Notes, classes, fees, and student data are scattered.",
    solution:
      "Student dashboard, admin panel, attendance, notes, and notifications.",
    result: "Organized digital learning workflow.",
  },
  {
    title: "Business Dashboard & CRM",
    problem: "Leads, sales, and client data are hard to manage.",
    solution: "CRM dashboard, lead tracking, reports, and automation.",
    result: "Better follow-up and smarter business decisions.",
  },
];

export default function CaseStudies() {
  return (
    <section className="growblic-case-studies bg-[#f7f9fd] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Case Studies
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
            Real solutions Growblic can build
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            From business websites to full apps and dashboards, Growblic builds
            products that solve real business problems.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {caseStudies.map((study) => (
            <div
              key={study.title}
              className="growblic-case-card flex h-full flex-col rounded-[1.75rem] border border-blue-100/80 bg-white p-6 shadow-xl shadow-slate-900/6"
            >
              <div className="mb-6 h-2 w-16 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
              <h3 className="text-xl font-semibold leading-tight text-slate-950">
                {study.title}
              </h3>

              <div className="mt-6 grid gap-4 text-sm leading-6 text-slate-600">
                <div>
                  <p className="font-black text-slate-950">Problem</p>
                  <p className="mt-1">{study.problem}</p>
                </div>
                <div>
                  <p className="font-black text-slate-950">Solution</p>
                  <p className="mt-1">{study.solution}</p>
                </div>
                <div>
                  <p className="font-black text-slate-950">Result</p>
                  <p className="mt-1">{study.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
