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

export default function CaseStudies() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:py-20">

      <div className="relative mx-auto max-w-[1800px]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50/90 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Case Studies
          </span>

          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Real solutions Growblic can build
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Practical software ideas shaped into launch-ready digital products.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {trustPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-600 shadow-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article
              key={study.title}
              className="group relative overflow-hidden rounded-[28px] border border-blue-100/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_26px_70px_rgba(37,99,235,0.12)] sm:p-7"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[70px] bg-gradient-to-br from-blue-100/70 to-cyan-100/70" />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-950/15">
                      {study.number}
                    </span>

                    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-blue-700">
                      {study.category}
                    </span>
                  </div>

                  <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-cyan-800">
                    {study.result}
                  </span>
                </div>

                <h3 className="mt-6 max-w-md text-2xl font-semibold leading-tight text-slate-950">
                  {study.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                  {study.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Built for practical business use
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
