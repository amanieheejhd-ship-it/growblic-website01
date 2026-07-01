import Image from "next/image";
import Link from "next/link";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
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

const resourceLinks = [
  { label: "Developer", href: "/developer" },
  { label: "Brand", href: "/brand" },
  { label: "Downloads", href: "/downloads" },
  { label: "Meetup", href: "/meetup" },
];

const trustLegalLinks = [
  { label: "Security", href: "/security" },
  { label: "Legal", href: "/legal" },
  { label: "Report Abuse", href: "/security#report-abuse" },
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

const socialLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@growblic",
    logo: "https://img.magnific.com/premium-vector/free-vector-youtube-icon-logo-black-white_901408-456.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bintu-malik-6b7917387?utm_source=share_via&utm_content=profile&utm_medium=membe_android",
    logo: "https://freebiehive.com/wp-content/uploads/2023/07/Linkedin-logo-transparent-Black.jpg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/growblic?igsh=MWk2OHZiaTQzeGw2bA",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKQWYhUTjoT0qzAysHn7dgNjPZOg6Wme3ENTb1TN2XXg&s=10",
  },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  function FooterLinkLabel({ label }: { label: string }) {
    return (
      <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-all group-hover:bg-[length:100%_1px]">
        {label}
      </span>
    );
  }

  return (
    <div className="min-w-0">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-slate-950">
        {title}
      </h3>
      <div className="mt-3 grid gap-2.5">
        {links.map((item) =>
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group w-fit text-sm font-bold leading-5 text-slate-500 transition hover:text-blue-700"
            >
              <FooterLinkLabel label={item.label} />
            </a>
          ) : item.href.startsWith("mailto:") ? (
            <a
              key={item.label}
              href={item.href}
              className="group w-fit text-sm font-bold leading-5 text-slate-500 transition hover:text-blue-700"
            >
              <FooterLinkLabel label={item.label} />
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="group w-fit text-sm font-bold leading-5 text-slate-500 transition hover:text-blue-700"
            >
              <FooterLinkLabel label={item.label} />
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-blue-100/80 bg-[#fbfdff] px-4 py-6 sm:px-6 sm:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(37,99,235,0.09),transparent_28%),radial-gradient(circle_at_88%_80%,rgba(6,182,212,0.09),transparent_28%)]" />

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/82 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.14)] ring-1 ring-blue-100/70 backdrop-blur-2xl sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        <div className="grid gap-7 xl:grid-cols-[0.72fr_2.28fr] xl:items-start">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-blue-100 bg-white shadow-md shadow-blue-100/70">
                <Image
                  src="/growblic-website01/images/brand/growblic-logo.png"
                  alt="Growblic"
                  fill
                  sizes="40px"
                  className="rounded-full object-cover"
                />
              </span>
              <span className="text-xl font-black tracking-tight text-slate-950">
                Growblic
              </span>
            </Link>

            <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              Software Development Company
            </p>
            <p className="mt-3 max-w-sm text-sm font-semibold leading-6 text-slate-600">
              Building premium websites, apps, SaaS products, and automation systems.
            </p>

            <Link
              href="/start-project"
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Project →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Services" links={serviceLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
            <FooterColumn title="Trust & Legal" links={trustLegalLinks} />
            <FooterColumn title="Connect" links={connectLinks} />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-blue-100/80 pt-4 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Growblic. All rights reserved.</p>
          <div className="flex items-center justify-center gap-5 sm:justify-end">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="group inline-flex items-center justify-center transition duration-300 hover:-translate-y-1 hover:opacity-80"
              >
                <img
                  src={item.logo}
                  alt={item.label}
                  className="h-6 w-6 object-contain opacity-85 transition group-hover:opacity-100"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
