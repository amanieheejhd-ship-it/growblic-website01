import Image from "next/image";
import Link from "next/link";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const serviceLinks = [
  { label: "Website Development", href: "/website-development" },
  { label: "Software Development", href: "/software" },
  { label: "Mobile Apps", href: "/mobile-apps" },
  { label: "SaaS Products", href: "/saas" },
  { label: "AI Automation", href: "/ai-automation" },
  { label: "SEO Services", href: "/seo-services" },
  { label: "Price Calculator", href: "/price-calculator" },
];

const downloadLinks = [
  { label: "Downloads", href: "/downloads" },
  { label: "Live Products", href: "/downloads#live-products" },
  { label: "Mobile Apps", href: "/downloads#mobile-apps" },
  { label: "SaaS Products", href: "/downloads#saas-products" },
  { label: "Other Categories", href: "/downloads#other-categories" },
];

const resourceLinks = [
  { label: "Developer", href: "/developer" },
  { label: "Brand", href: "/brand" },
  { label: "Meetup", href: "/meetup" },
  { label: "Why Growblic", href: "/why-growblic" },
  { label: "Process", href: "/process" },
];

const trustLegalLinks = [
  { label: "Security", href: "/security" },
  { label: "Legal", href: "/legal" },
  { label: "Report Abuse", href: "mailto:abuse@growblic.com" },
];

const connectLinks = [
  { label: "Email: hello@growblic.com", href: "mailto:hello@growblic.com" },
  { label: "Website: www.growblic.com", href: "https://www.growblic.com", external: true },
  {
    label: "India",
    href: "https://www.google.com/maps/search/?api=1&query=India",
    external: true,
  },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-950">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">
        {links.map((item) =>
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold leading-6 text-slate-500 transition hover:text-blue-700"
            >
              {item.label}
            </a>
          ) : item.href.startsWith("mailto:") ? (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-bold leading-6 text-slate-500 transition hover:text-blue-700"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-bold leading-6 text-slate-500 transition hover:text-blue-700"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-blue-100/80 bg-[#fbfdff] px-5 py-10 sm:px-6 sm:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(37,99,235,0.09),transparent_28%),radial-gradient(circle_at_88%_80%,rgba(6,182,212,0.09),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] border border-blue-100/80 bg-white/86 p-6 shadow-2xl shadow-blue-100/55 backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid gap-10 xl:grid-cols-[0.9fr_2.1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-blue-100 bg-white shadow-md shadow-blue-100/70">
                <Image
                  src="/growblic-website01/images/brand/growblic-logo.png"
                  alt="Growblic"
                  fill
                  sizes="48px"
                  className="rounded-full object-cover"
                />
              </span>
              <span className="text-2xl font-black tracking-tight text-slate-950">
                Growblic
              </span>
            </Link>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-blue-700">
              Software Development Company
            </p>
            <p className="mt-4 max-w-md text-base font-semibold leading-8 text-slate-600">
              Building premium websites, apps, SaaS products, and automation systems.
            </p>

            <Link
              href="/start-project"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Project →
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Services" links={serviceLinks} />
            <FooterColumn title="Downloads" links={downloadLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
            <FooterColumn title="Trust & Legal" links={trustLegalLinks} />
            <FooterColumn title="Connect" links={connectLinks} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-blue-100/80 pt-6 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Growblic. All rights reserved.</p>
          <p>Building premium websites, apps, SaaS products, and automation systems.</p>
        </div>
      </div>
    </footer>
  );
}
