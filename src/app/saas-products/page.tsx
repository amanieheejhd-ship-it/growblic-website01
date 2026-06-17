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
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(168,85,247,0.13),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.10),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 rounded-[3.4rem] border border-blue-100/70 bg-[#fbfdff]/88 p-5 shadow-2xl shadow-blue-100/60 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="p-5 lg:p-10">
                <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                  SaaS Products
                </p>

                <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
                  Subscription-ready software for growth.
                </h1>

                <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
                  We help businesses build SaaS products with dashboards, roles,
                  subscription flows, admin controls, and scalable frontend foundations.
                  The goal is to make your product clean for users and manageable for your team.
                </p>
              </div>

              <div className="relative h-[560px] overflow-hidden rounded-[2.8rem]">
                <Image src="/images/business/saas-1.jpg" alt="SaaS products" fill className="will-change-transform object-cover" priority unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/12 to-transparent" />
              </div>
            </div>
          </div>

          <div className="mt-10 mb-8">
            <h2 className="text-4xl font-black tracking-tight text-slate-950">
              SaaS product foundations we can build
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              From early MVP to scalable product, we structure the frontend and user
              journeys so your SaaS can support teams, plans, roles, and growth.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((item, index) => (
              <div key={item.title} className="rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-7 shadow-xl shadow-blue-100/50">
                <span className="text-sm font-black text-blue-600">0{index + 1}</span>
                <h3 className="mt-4 text-2xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
