import Link from "next/link";

const services = [
  { label: "Software", href: "/software" },
  { label: "Mobile Apps", href: "/mobile-apps" },
  { label: "SaaS", href: "/saas" },
  { label: "AI Automation", href: "/ai-automation" },
];

const products = [
  { label: "CRM Platform", href: "/crm-platform" },
  { label: "FinTech App", href: "/fintech-app" },
  { label: "HR System", href: "/hr-system" },
  { label: "Analytics", href: "/analytics" },
];

const company = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "mailto:hello@growblic.com" },
  { label: "Support", href: "/support" },
  { label: "Client Login", href: "/client-login" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-blue-100/70 bg-[#fbfdff] px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.08),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.08),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full shadow-md shadow-slate-200">
                <img
                  src="/growblic-website01/images/brand/growblic-logo.png"
                  alt="Growblic"
                  className="h-full w-full rounded-full object-cover"
                />
              </span>
              <span className="text-2xl font-black tracking-tight text-slate-950">
                Growblic
              </span>
            </Link>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
              Growblic builds websites, mobile apps, SaaS products, dashboards,
              and automation systems for modern businesses.
            </p>

            <div className="mt-6 h-2 w-28 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950">Services</h3>
            <div className="mt-6 space-y-4">
              {services.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-lg font-medium text-slate-500 transition-colors duration-300 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950">Products</h3>
            <div className="mt-6 space-y-4">
              {products.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-lg font-medium text-slate-500 transition-colors duration-300 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-950">Company</h3>
            <div className="mt-6 space-y-4">
              {company.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-lg font-medium text-slate-500 transition-colors duration-300 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-blue-100/70 pt-8 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Growblic. All rights reserved.</p>

          <div className="flex gap-5">
            <a
              href="https://www.linkedin.com/in/bintu-malik-6b7917387/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3Bn%2F%2B36pheQBKUivaxal4GUQ%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-300 hover:text-blue-600"
            >
              LinkedIn
            </a>
            <a
              href="mailto:hello@growblic.com"
              className="transition-colors duration-300 hover:text-blue-600"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
