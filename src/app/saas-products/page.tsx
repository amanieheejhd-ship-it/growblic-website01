import Image from "next/image";
import BackButton from "@/components/BackButton";

const features = [
  {
    title: "Multi-role dashboards",
    text: "Dashboards for admins, teams, customers, partners, and managers with clear access separation.",
  },
  {
    title: "Tenant-ready structure",
    text: "Plan SaaS foundations that can support multiple companies, teams, users, and product modules.",
  },
  {
    title: "Billing flow planning",
    text: "Prepare subscription journeys, pricing pages, plan selection, invoices, and upgrade/downgrade flows.",
  },
  {
    title: "Subscription modules",
    text: "Create recurring product experiences with usage limits, plans, permissions, and customer accounts.",
  },
  {
    title: "Admin controls",
    text: "Give product owners control over users, plans, content, settings, reports, and platform activity.",
  },
  {
    title: "Scalable SaaS frontend",
    text: "Build a frontend system that can grow as your SaaS adds more modules and customers.",
  },
];

export default function SaasProductsPage() {
  return (
    <main className="min-h-screen bg-[#fbfdff]">
      <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(168,85,247,0.13),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.10),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl min-w-0">
          <BackButton />

          <div className="mt-8 min-w-0 rounded-[2rem] border border-blue-100/70 bg-[#fbfdff]/88 p-3 shadow-2xl shadow-blue-100/60 backdrop-blur-xl sm:mt-10 sm:rounded-[3.4rem] sm:p-5">
            <div className="grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="min-w-0 p-3 sm:p-5 lg:p-10">
                <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.28em]">
                  SaaS Products
                </p>

                <h1 className="mt-5 break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
                  Subscription-ready software for growth.
                </h1>

                <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                  We help businesses build SaaS products with dashboards, roles,
                  subscription flows, admin controls, and scalable frontend foundations.
                  The goal is to make your product clean for users and manageable for your team.
                </p>
              </div>

              <div className="relative h-[320px] overflow-hidden rounded-[1.6rem] sm:h-[460px] sm:rounded-[2.8rem] lg:h-[560px]">
                <Image src="/growblic-website01/images/business/saas-1.jpg" alt="SaaS products" fill className="will-change-transform object-cover" priority unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/12 to-transparent" />
              </div>
            </div>
          </div>

          <div className="mb-8 mt-10 min-w-0">
            <h2 className="break-words text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              SaaS product foundations we can build
            </h2>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
              From early MVP to scalable product, we structure the frontend and user
              journeys so your SaaS can support teams, plans, roles, and growth.
            </p>
          </div>

          <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, index) => (
              <div key={item.title} className="rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-7 shadow-xl shadow-blue-100/50">
                <span className="text-sm font-black text-blue-600">0{index + 1}</span>
                <h3 className="mt-4 break-words text-xl font-black text-slate-950 sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
