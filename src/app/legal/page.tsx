import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Legal - Growblic",
  description:
    "Legal information, privacy, terms, and business communication notes for Growblic.",
  path: "/legal",
});

const legalSections = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    text: "Growblic handles project inquiries and business communication with care. Official privacy documents can be requested by email.",
  },
  {
    id: "terms-of-service",
    title: "Terms of Service",
    text: "Project terms, timelines, scope, payment milestones, and deliverables are confirmed during official project discussion.",
  },
  {
    id: "business-disclaimer",
    title: "Business Communication Disclaimer",
    text: "Website information is general business communication and does not replace a written agreement or official proposal.",
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Legal Information
            </p>
            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Legal, privacy, and communication notes.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              This page summarizes Growblic legal information. Official documents,
              project agreements, privacy notes, and terms can be requested at
              hello@growblic.com.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {legalSections.map((section, index) => (
              <article
                id={section.id}
                key={section.id}
                className="scroll-mt-24 rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50"
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
