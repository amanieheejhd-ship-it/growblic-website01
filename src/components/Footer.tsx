import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.9l4.7 6.2L18.9 2Zm-1.2 17.9h1.8L7.7 4H5.8l11.9 15.9Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.53V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <rect
        width="18"
        height="18"
        x="3"
        y="3"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Internships", href: "/internships" },
  { label: "Contact", href: "/#contact" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" }
];

const serviceLinks = [
  { label: "AI Automation", href: "/ai-automation" },
  { label: "Mobile Apps", href: "/mobile-apps" },
  { label: "Price Calculator", href: "/price-calculator" },
  { label: "SaaS Products", href: "/saas" },
  { label: "SEO Services", href: "/seo-services" },
  { label: "Software Development", href: "/software" },
  { label: "Website Development", href: "/website-development" }
];

const resourceLinks = [
  { label: "Brand", href: "/brand" },
  { label: "Datacenter", href: "/datacenter" },
  { label: "Developer", href: "/developer" },
  { label: "Downloads", href: "/downloads" },
  { label: "Fastoldp", href: "/fastoldp" },
  { label: "Meetups", href: "/meetup" }
];

const trustLegalLinks = [
  { label: "Security", href: "/security" },
  { label: "Legal", href: "/legal" },
  { label: "Report Abuse", href: "/security#report-abuse" },
];

const connectLinks = [
  { label: "Email: hello@growblic.com", href: "mailto:hello@growblic.com" },
  { label: "PairupChat", href: "https://web.growblic.com", external: true }
];

const socialLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@growblic",
    Icon: YouTubeIcon,
  },
  {
    label: "X",
    href: "https://x.com/bintumalik545",
    Icon: XIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bintu-malik-6b7917387?utm_source=share_via&utm_content=profile&utm_medium=membe_android",
    Icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/growblic?igsh=MWk2OHZiaTQzeGw2bA",
    Icon: InstagramIcon,
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
            className="group max-w-full break-words text-sm font-bold leading-5 text-slate-500 transition hover:text-blue-700"
            >
              <FooterLinkLabel label={item.label} />
            </a>
          ) : item.href.startsWith("mailto:") ? (
            <a
              key={item.label}
              href={item.href}
              className="group max-w-full break-words text-sm font-bold leading-5 text-slate-500 transition hover:text-blue-700"
            >
              <FooterLinkLabel label={item.label} />
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="group max-w-full break-words text-sm font-bold leading-5 text-slate-500 transition hover:text-blue-700"
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

        <div className="grid min-w-0 gap-7 xl:grid-cols-[0.72fr_2.28fr] xl:items-start">
          <div className="min-w-0">
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

          <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-6 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Services" links={serviceLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
            <FooterColumn title="Trust & Legal" links={trustLegalLinks} />
            <FooterColumn title="Connect" links={connectLinks} />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-blue-100/80 pt-4 text-sm font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left">© 2026 Growblic. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end sm:gap-4">
            {socialLinks.map((social) => {
              const Icon = social.Icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group grid h-10 w-10 place-items-center rounded-full border border-blue-100/80 bg-white text-slate-950 shadow-md shadow-blue-100/50 ring-1 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-slate-950 hover:bg-slate-950 hover:text-white hover:shadow-xl hover:shadow-slate-950/15"
                >
                  <Icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-105" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
