import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Legal - Growblic Policy Hub",
  description:
    "Growblic legal policy hub with acceptable use, privacy, terms, cookies, data processing, AI notice, community terms, trademark, security, and abuse reporting information.",
  path: "/legal",
});

const sidebarLinks = [
  { label: "Acceptable Use Policy", href: "#acceptable-use" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Cookie Statement", href: "#cookies" },
  { label: "Data Processing Addendum", href: "#data-processing" },
  { label: "AI Notice", href: "#ai-notice" },
  { label: "Community Terms", href: "#community-terms" },
  { label: "Trademark Guidelines", href: "#trademark" },
  { label: "Security", href: "#security" },
  { label: "Report Abuse", href: "#report-abuse" },
];

const policySections = [
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    eyebrow: "Version 1.0 / Effective date: 2026",
    paragraphs: [
      "Growblic builds websites, apps, software, automation systems, and digital products for real business use. This Acceptable Use Policy explains the basic safety and fair-use expectations for anyone using Growblic websites, forms, communication channels, project systems, or related digital services.",
      "Users should communicate honestly, submit accurate information, respect other people and businesses, and use Growblic services only for lawful and reasonable purposes.",
      "You may not misuse Growblic systems, attempt unauthorized access, interfere with service availability, submit malware, spam, phishing content, deceptive requests, or harmful instructions, or use Growblic communication channels to promote illegal, abusive, discriminatory, exploitative, or unsafe activity.",
      "Growblic may review, limit, reject, or stop communication related to suspected abuse, security risk, fraud, unlawful content, or misuse. Abuse concerns can be reported at abuse@growblic.com.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    eyebrow: "Project inquiries and business communication",
    paragraphs: [
      "Growblic may collect information you provide through lead forms, contact forms, estimate requests, email communication, project discovery, and support requests. This can include name, email, phone number, company, location, project notes, budget preferences, and technical requirements.",
      "We use this information to respond to inquiries, prepare estimates, understand project needs, provide support, improve communication, and manage business relationships.",
      "Lead forms, contact requests, and price calculator submissions are used for project discussion and follow-up. Estimate requests are planning tools and may include selected service options and customer-provided notes.",
      "Growblic aims to handle business information carefully and limit access to people or tools needed for communication, planning, support, and project delivery. For privacy questions, contact hello@growblic.com.",
    ],
  },
  {
    id: "terms",
    title: "Terms of Service",
    eyebrow: "Website and service use",
    paragraphs: [
      "By using the Growblic website or contacting Growblic, you agree to use the website and communication channels responsibly and for lawful business purposes.",
      "Prices, timelines, calculator outputs, estimates, and website descriptions are informational. Estimates are not final pricing. Final pricing, scope, milestones, ownership, payment terms, delivery timelines, and responsibilities depend on project discussion and written agreement.",
      "Clients are responsible for the accuracy and rights to any content, brand assets, data, account access, or materials they provide. Growblic work, templates, code, design files, and deliverables are governed by the relevant proposal, invoice, or project agreement.",
      "Payments, refunds, revisions, maintenance, third-party subscriptions, hosting, ad spend, and support terms should be confirmed in writing before project work begins.",
    ],
  },
  {
    id: "cookies",
    title: "Cookie Statement",
    eyebrow: "Basic website preferences and performance",
    paragraphs: [
      "Growblic may use basic cookies or similar browser technologies for website functionality, performance, analytics, or user experience improvements if enabled on the site.",
      "Cookies can help understand general website usage, improve page performance, and support forms or browser preferences. You can control or block cookies through your browser settings.",
    ],
  },
  {
    id: "data-processing",
    title: "Data Processing Addendum",
    eyebrow: "Business client data handling",
    paragraphs: [
      "Growblic may process business information for project communication, discovery, development, support, maintenance, and delivery. Processing depends on the services requested and the information shared by the client.",
      "Business clients who need a formal Data Processing Addendum can request one at hello@growblic.com. Formal obligations should be confirmed in a signed agreement before sensitive or regulated data is shared.",
    ],
  },
  {
    id: "ai-notice",
    title: "AI Notice",
    eyebrow: "Human-reviewed AI assistance",
    paragraphs: [
      "Growblic may use AI-assisted tools to support planning, research, design exploration, development workflows, documentation, testing, automation ideas, or productivity tasks.",
      "AI-assisted output should be reviewed by humans before being treated as final project work. Clients should avoid submitting unnecessary sensitive, confidential, regulated, or personal data in project notes, forms, or informal communication.",
    ],
  },
  {
    id: "community-terms",
    title: "Community Terms",
    eyebrow: "Meetups, events, and communication",
    paragraphs: [
      "Growblic community spaces, meetups, events, and communication channels are intended for respectful discussion about startups, software, automation, digital growth, and product building.",
      "Participants should avoid harassment, spam, fraud, impersonation, abusive behavior, illegal promotion, or disruptive communication. Growblic may decline or remove participation when conduct does not match these expectations.",
    ],
  },
  {
    id: "trademark",
    title: "Trademark Guidelines",
    eyebrow: "Brand identity and permissions",
    paragraphs: [
      "The Growblic name, logo, visual identity, and brand assets should not be misused, distorted, copied, used to imply false endorsement, or presented in a way that confuses people about official Growblic services.",
      "Permission for partner, press, community, or commercial use of Growblic brand assets can be requested at hello@growblic.com.",
    ],
  },
  {
    id: "security",
    title: "Security",
    eyebrow: "Responsible disclosure",
    paragraphs: [
      "Growblic values responsible reporting of security concerns. Do not perform malicious testing, destructive scanning, social engineering, data extraction, or unauthorized access attempts without written permission.",
      "If you discover a security issue, include affected URLs, steps to reproduce, screenshots if useful, and your contact details. Security concerns can be reported at abuse@growblic.com or hello@growblic.com.",
    ],
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-5xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Legal Hub
            </p>
            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Policies for responsible digital work.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              This page is informational and not legal advice. Formal legal documents
              can be requested at hello@growblic.com.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[300px_1fr] lg:items-start">
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-[2rem] border border-blue-100/80 bg-white/90 p-4 shadow-xl shadow-blue-100/55 backdrop-blur-xl">
                <p className="px-3 text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                  Policy sections
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
              <article className="rounded-[2rem] border border-blue-100/80 bg-white p-7 shadow-xl shadow-blue-100/50">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                  Important note
                </p>
                <p className="mt-3 text-base font-semibold leading-8 text-slate-600">
                  These policies are concise, Growblic-friendly placeholders for website
                  transparency. Formal project agreements, privacy terms, data processing
                  documents, and legal documents can be requested at hello@growblic.com.
                </p>
              </article>

              {policySections.map((section, index) => (
                <article
                  id={section.id}
                  key={section.id}
                  className="scroll-mt-24 rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 sm:p-8"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="text-sm font-black text-blue-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                        {section.title}
                      </h2>
                    </div>
                    <p className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                      {section.eyebrow}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 text-base font-semibold leading-8 text-slate-600">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
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
                      Send abuse concerns to abuse@growblic.com.
                    </h2>
                    <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
                      Include the affected URL, message, account, screenshot, or any useful
                      context so Growblic can review the concern responsibly.
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
