import Image from "next/image";
import BackButton from "@/components/BackButton";

const features = [
  {
    title: "Admin dashboards",
    text: "Create powerful admin panels where teams can manage users, orders, leads, reports, payments, tasks, and business operations from one place.",
  },
  {
    title: "Internal business tools",
    text: "Replace scattered spreadsheets and manual processes with custom software built around your exact company workflow.",
  },
  {
    title: "Workflow automation",
    text: "Automate repetitive steps like approvals, notifications, status updates, data entry, and reporting to save time every day.",
  },
  {
    title: "Role-based access",
    text: "Give different access to admins, managers, employees, clients, and partners so every user sees only what they need.",
  },
  {
    title: "Reports and analytics",
    text: "Track business performance with clean charts, summaries, exports, filters, and decision-ready dashboards.",
  },
  {
    title: "Scalable frontend system",
    text: "Build a clean, modern frontend foundation that can grow with new modules, users, and future product features.",
  },
];

export default function CustomSoftwarePage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.10),transparent_28%)]" />

        <div className="relative mx-auto grid max-w-[1800px] min-w-0 gap-8 lg:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <BackButton />

            <p className="mt-8 break-words text-xs font-black uppercase tracking-[0.18em] text-blue-600 sm:mt-10 sm:text-sm sm:tracking-[0.28em]">
              Custom Software
            </p>

            <h1 className="mt-5 break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
              Software built around your business.
            </h1>

            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              We build custom platforms for businesses that need more than a basic website.
              From internal dashboards to complete workflow systems, Growblic creates software
              that fits your process instead of forcing your team to adjust to random tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
              {features.slice(0, 4).map((item) => (
                <span key={item.title} className="min-w-0 break-words rounded-full border border-blue-100/70 bg-[#fbfdff] px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-black text-slate-600 shadow-sm">
                  {item.title}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-w-0 rounded-[2rem] sm:rounded-[3rem] border border-blue-100/70 bg-[#fbfdff] p-4 shadow-2xl shadow-blue-100/60">
            <div className="relative h-[340px] sm:h-[460px] lg:h-[560px] overflow-hidden rounded-[2.4rem]">
              <Image src="/images/business/web-1.jpg" alt="Custom software" fill className="will-change-transform object-cover" priority unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-[1.5rem] border border-white/20 bg-[#fbfdff]/15 p-4 text-white backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6 sm:rounded-[2rem] sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70 sm:tracking-[0.28em]">Growblic build</p>
                <h2 className="mt-3 break-words text-3xl font-black sm:text-5xl">Custom Systems</h2>
                <p className="mt-3 text-sm font-semibold text-white/75">
                  Designed for real teams, real workflows, and long-term business use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto mb-10 max-w-[1800px] min-w-0">
          <h2 className="break-words text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            What we include in custom software
          </h2>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Every project is planned according to your business needs. We focus on clean UI,
            easy management, security, automation, and future scalability.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1800px] min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <div key={item.title} className="min-w-0 rounded-[1.5rem] border border-blue-100/70 bg-[#fbfdff] p-5 shadow-xl shadow-blue-100/50 sm:rounded-[2rem] sm:p-7">
              <span className="text-sm font-black text-blue-600">0{index + 1}</span>
              <h3 className="mt-4 break-words text-xl font-black text-slate-950 sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
