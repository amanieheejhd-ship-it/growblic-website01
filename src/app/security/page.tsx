import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Security - Growblic",
  description:
    "Growblic security overview covering compliance readiness, data security, product security, infrastructure, organizational practices, enterprise readiness, vulnerability disclosure, and abuse reporting.",
  path: "/security",
});

const sidebarLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Compliance", href: "#compliance" },
  { label: "Data Security", href: "#data-security" },
  { label: "Product Security", href: "#product-security" },
  { label: "Infrastructure & Network", href: "#infrastructure-network" },
  { label: "Organizational Security", href: "#organizational-security" },
  { label: "Operational Security", href: "#operational-security" },
  { label: "Enterprise Security", href: "#enterprise-security" },
  { label: "Vulnerability Disclosure", href: "#vulnerability-disclosure" },
  { label: "Report Abuse", href: "#report-abuse" },
];

const complianceCards = [
  {
    title: "ISO 27001 readiness",
    text: "Growblic aligns internal practices with recognized information security principles and can work with clients that require structured security reviews.",
  },
  {
    title: "SOC 2 readiness",
    text: "Growblic can support enterprise clients with control-oriented delivery practices such as access control, change review, incident handling, and availability planning.",
  },
  {
    title: "GDPR-aligned privacy practices",
    text: "Growblic treats personal data carefully and encourages clients to request formal privacy/data processing documentation when needed.",
  },
  {
    title: "CCPA awareness",
    text: "Growblic can support clients with privacy-conscious project workflows where applicable.",
  },
];

const securitySections = [
  {
    id: "overview",
    title: "Overview",
    eyebrow: "Practical security controls",
    items: [
      "Growblic builds websites, apps, SaaS products, dashboards, and automation systems with practical security, privacy, and reliability in mind.",
      "Security decisions are planned around project scope, hosting model, user roles, data sensitivity, third-party integrations, and client requirements.",
      "Formal compliance documentation, security questionnaires, and enterprise readiness details can be requested during project discussion.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    eyebrow: "Classification and protection",
    items: [
      "Data classification: Confidential, Internal, and Public information should be handled according to sensitivity and project context.",
      "Encryption in transit: HTTPS/TLS should be used for production websites and applications where configured.",
      "Encryption at rest: Projects should use secure hosting/provider storage where available and appropriate for the data type.",
      "Secrets and key management: Secrets should not be placed in frontend code; environment variables and deploy secrets should be used for builds and integrations.",
      "Separation of environments: Production, staging, and development separation should be maintained where project scope requires it.",
    ],
  },
  {
    id: "product-security",
    title: "Product Security",
    eyebrow: "Secure delivery practices",
    items: [
      "Secure development: Product flows should be designed with authentication, authorization, validation, and least-privilege access in mind.",
      "Code review: Important changes can be reviewed before delivery, especially for sensitive workflows, admin panels, payments, and integrations.",
      "Dependency management: Dependencies should be selected carefully and updated when project scope and compatibility allow.",
      "Build/lint/type checks: Growblic uses practical checks such as build, lint, and TypeScript validation where applicable.",
      "External security testing: Independent security testing or penetration testing can be arranged upon request.",
      "Responsible use of AI-assisted development: AI-assisted tools may support planning or development, with human review before final delivery.",
    ],
  },
  {
    id: "infrastructure-network",
    title: "Infrastructure & Network Security",
    eyebrow: "Deployment readiness",
    items: [
      "Transport security should be enabled for production traffic through HTTPS/TLS where configured.",
      "Public attack surface should be kept minimal by exposing only the required routes, services, APIs, and admin tools.",
      "Access control should be applied for hosting dashboards, repositories, admin systems, and operational tools.",
      "Monitoring and logging recommendations can be provided for production products based on scope and hosting provider.",
      "Network segmentation, private services, and restricted admin access can be planned where applicable.",
    ],
  },
  {
    id: "organizational-security",
    title: "Organizational Security",
    eyebrow: "People and process",
    items: [
      "Security awareness is encouraged across planning, design, development, deployment, and support.",
      "Least privilege access should be used for accounts, repositories, hosting providers, and client systems.",
      "Client data handling should be limited to what is needed for project communication, delivery, support, and maintenance.",
      "Incident management should include clear reporting, triage, communication, and remediation steps when concerns arise.",
    ],
  },
  {
    id: "operational-security",
    title: "Operational Security",
    eyebrow: "Reliable operations",
    items: [
      "Operational workflows should include clear ownership, deployment discipline, backup planning, and change visibility where appropriate.",
      "Production changes should be planned carefully, especially for business-critical websites, apps, dashboards, and automation systems.",
      "Access reviews, credential rotation, and offboarding steps can be included for ongoing support arrangements.",
      "Support and maintenance plans can include uptime awareness, bug triage, performance review, and recovery recommendations.",
    ],
  },
  {
    id: "enterprise-security",
    title: "Enterprise Security",
    eyebrow: "Available upon request",
    items: [
      "Growblic can support enterprise readiness conversations for clients that need security reviews before starting work.",
      "Formal compliance documentation, security questionnaires, data processing terms, vendor reviews, or project-specific controls can be requested.",
      "Enterprise projects may include stronger access controls, audit-friendly workflows, environment separation, approval steps, and documentation.",
    ],
  },
  {
    id: "vulnerability-disclosure",
    title: "Vulnerability Disclosure",
    eyebrow: "Responsible reporting",
    items: [
      "Please report security concerns responsibly and avoid malicious testing, destructive scanning, social engineering, data extraction, or unauthorized access attempts.",
      "Useful reports include affected URLs, clear steps to reproduce, screenshots or logs when safe to share, expected impact, and contact details.",
      "Security concerns can be emailed to abuse@growblic.com or hello@growblic.com. Growblic will review reports according to severity, scope, and available context.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-5xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Version 1.0 - Effective 2026
            </p>
            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Security
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              Growblic builds websites, apps, SaaS products, and automation systems
              with practical security, privacy, and reliability in mind.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="mailto:abuse@growblic.com?subject=Growblic Abuse Report"
                className="rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Report Abuse
              </a>
              <a
                href="mailto:hello@growblic.com?subject=Growblic Security Inquiry"
                className="rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
              >
                Contact Growblic
              </a>
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[300px_1fr] lg:items-start">
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-[2rem] border border-blue-100/80 bg-white/90 p-4 shadow-xl shadow-blue-100/55 backdrop-blur-xl">
                <p className="px-3 text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                  Security sections
                </p>
                <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0">
                  {sidebarLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="whitespace-nowrap rounded-full border border-blue-100 bg-blue-50/60 px-4 py-2 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-600 hover:text-white lg:whitespace-normal lg:rounded-2xl lg:bg-white lg:px-4 lg:py-3"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="grid gap-5">
              {securitySections.slice(0, 1).map((section) => (
                <article
                  id={section.id}
                  key={section.id}
                  className="scroll-mt-24 rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 sm:p-8"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                    {section.eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    {section.title}
                  </h2>
                  <div className="mt-6 grid gap-4 text-base font-semibold leading-8 text-slate-600">
                    {section.items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </article>
              ))}

              <article
                id="compliance"
                className="scroll-mt-24 rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 sm:p-8"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                  Security-aligned practices
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Compliance
                </h2>
                <p className="mt-4 text-base font-semibold leading-8 text-slate-600">
                  Growblic does not claim certification unless formal documentation is
                  explicitly provided. The following areas describe readiness and practical
                  controls that can support client reviews.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {complianceCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-[1.5rem] border border-blue-100 bg-blue-50/45 p-5"
                    >
                      <h3 className="text-lg font-black text-slate-950">{card.title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                        {card.text}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              {securitySections.slice(1).map((section) => (
                <article
                  id={section.id}
                  key={section.id}
                  className="scroll-mt-24 rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 sm:p-8"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                    {section.eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    {section.title}
                  </h2>
                  <ul className="mt-6 grid gap-3 text-base font-semibold leading-8 text-slate-600">
                    {section.items.map((item) => (
                      <li key={item} className="rounded-2xl border border-blue-100 bg-blue-50/35 px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}

              <article
                id="report-abuse"
                className="scroll-mt-24 overflow-hidden rounded-[2rem] border border-blue-100/70 bg-white shadow-xl shadow-blue-100/50"
              >
                <div className="relative p-7 sm:p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.12),transparent_28%),linear-gradient(135deg,rgba(239,246,255,0.82),rgba(255,255,255,0.95))]" />
                  <div className="relative">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                      Report Abuse
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                      Send abuse or security concerns to abuse@growblic.com.
                    </h2>
                    <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
                      Include the affected URL, message, account, screenshot, technical
                      detail, or any useful context so Growblic can review the concern
                      responsibly.
                    </p>
                    <a
                      href="mailto:abuse@growblic.com?subject=Growblic Abuse Report"
                      className="mt-7 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                      Email abuse@growblic.com
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
