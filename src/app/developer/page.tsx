import Link from "next/link";
import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic for Developers",
  description:
    "Developer information for Growblic APIs, integrations, dashboards, automation systems, and code components.",
  path: "/developer",
});

const developerSections = [
  {
    id: "developer-docs",
    title: "Developer Docs",
    text: "Technical planning notes for dashboards, portals, workflows, and software products built with Growblic.",
  },
  {
    id: "api-reference",
    title: "API Reference",
    text: "Plan API-ready dashboards, business systems, integrations, and automation workflows with Growblic.",
  },
  {
    id: "code-components",
    title: "Code Components",
    text: "Reusable UI patterns, admin panels, product modules, and scalable frontend components for real products.",
  },
  {
    id: "integrations",
    title: "Integrations",
    text: "Connect CRMs, payment gateways, analytics, forms, ads tools, email flows, and business operations.",
  },
];

export default function DeveloperPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_0.75fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                Growblic for Developers
              </p>
              <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
                APIs, integrations, dashboards, and automation systems.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
                Growblic helps teams design and build developer-friendly software foundations:
                admin systems, integrations, internal tools, APIs, and automated workflows.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/start-project"
                  className="rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Project
                </Link>
                <a
                  href="mailto:hello@growblic.com?subject=Growblic Developer Inquiry"
                  className="rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
                >
                  Contact Growblic
                </a>
              </div>
            </div>

            <div className="rounded-[2.3rem] border border-blue-100/80 bg-white/90 p-6 shadow-2xl shadow-blue-100/60">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
                Developer scope
              </p>
              <div className="mt-5 grid gap-3">
                {["APIs", "Integrations", "Dashboards", "Automation"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-100 bg-blue-50/55 px-4 py-3 text-sm font-black text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {developerSections.map((section, index) => (
              <article
                id={section.id}
                key={section.id}
                className="scroll-mt-24 rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 transition hover:-translate-y-1 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">0{index + 1}</span>
                <h2 className="mt-4 text-2xl font-black text-slate-950">{section.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  {section.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
