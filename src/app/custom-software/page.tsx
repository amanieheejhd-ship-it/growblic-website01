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
    <main className="min-h-screen bg-[#fbfdff]">
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.10),transparent_28%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <BackButton />

            <p className="mt-10 text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Custom Software
            </p>

            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Software built around your business.
            </h1>

            <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
              We build custom platforms for businesses that need more than a basic website.
              From internal dashboards to complete workflow systems, Growblic creates software
              that fits your process instead of forcing your team to adjust to random tools.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {features.slice(0, 4).map((item) => (
                <span key={item.title} className="rounded-full border border-blue-100/70 bg-[#fbfdff] px-5 py-3 text-sm font-black text-slate-600 shadow-sm">
                  {item.title}
                </span>
              ))}
            </div>
          </div>

          <div className="relative rounded-[3rem] border border-blue-100/70 bg-[#fbfdff] p-4 shadow-2xl shadow-blue-100/60">
            <div className="relative h-[560px] overflow-hidden rounded-[2.4rem]">
              <Image src="/images/business/web-1.jpg" alt="Custom software" fill className="will-change-transform object-cover" priority unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] border border-white/20 bg-[#fbfdff]/15 p-6 text-white backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/70">Growblic build</p>
                <h2 className="mt-3 text-5xl font-black">Custom Systems</h2>
                <p className="mt-3 text-sm font-semibold text-white/75">
                  Designed for real teams, real workflows, and long-term business use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto mb-10 max-w-7xl">
          <h2 className="text-4xl font-black tracking-tight text-slate-950">
            What we include in custom software
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Every project is planned according to your business needs. We focus on clean UI,
            easy management, security, automation, and future scalability.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {features.map((item, index) => (
            <div key={item.title} className="rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-7 shadow-xl shadow-blue-100/50">
              <span className="text-sm font-black text-blue-600">0{index + 1}</span>
              <h3 className="mt-4 text-2xl font-black text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
