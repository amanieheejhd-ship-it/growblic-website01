import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/BackButton";

const products = [
  {
    title: "Custom Software",
    href: "/software",
    text: "Internal platforms, dashboards, admin panels, and business workflow tools.",
    image: "/images/business/web-1.jpg",
  },
  {
    title: "Mobile Apps",
    href: "/mobile-apps",
    text: "Premium mobile app experiences for iOS, Android, booking, ordering, and users.",
    image: "/images/business/mobile-1.jpg",
  },
  {
    title: "SaaS Products",
    href: "/saas",
    text: "Subscription-ready platforms with roles, dashboards, modules, and scalable UI.",
    image: "/images/business/saas-1.jpg",
  },
  {
    title: "AI Automation",
    href: "/ai-automation",
    text: "Smart automation flows that reduce manual work and improve business speed.",
    image: "/images/business/ai-1.jpg",
  },
  {
    title: "CRM Platform",
    href: "/crm-platform",
    text: "Lead management, customer profiles, follow-ups, sales pipeline, and reports.",
    image: "/images/products/crm-1.jpg",
  },
  {
    title: "Analytics",
    href: "/analytics",
    text: "Business dashboards, KPI cards, charts, filters, reports, and insights.",
    image: "/images/products/analytics-1.jpg",
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#fbfdff]">
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_82%_80%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Products
            </p>
            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Explore what Growblic can build for you.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              Choose a product category and see how Growblic can design, build,
              launch, and support it with a premium software experience.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Link
                key={product.href}
                href={product.href}
                className="group relative overflow-hidden rounded-[2.4rem] border border-blue-100/70 bg-[#fbfdff] p-4 shadow-2xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200 hover:shadow-blue-100"
              >
                <div className="relative h-72 overflow-hidden rounded-[1.9rem]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="will-change-transform object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/18 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-2xl border border-white/20 bg-[#fbfdff]/15 px-4 py-3 text-xs font-black text-white backdrop-blur-xl">
                    0{index + 1}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h2 className="text-3xl font-black tracking-tight text-white">
                      {product.title}
                    </h2>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white/78">
                      {product.text}
                    </p>
                    <div className="mt-5 h-1.5 w-14 rounded-full bg-[#fbfdff]/40 transition-all duration-500 ease-out group-hover:w-24 group-hover:bg-[#fbfdff]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
