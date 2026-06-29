import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Security & Abuse - Growblic",
  description:
    "Responsible reporting, security contact, and abuse reporting information for Growblic.",
  path: "/security",
});

const securityItems = [
  {
    title: "Responsible Reporting",
    text: "If you notice a security concern related to Growblic systems or communication, report it responsibly with clear details.",
  },
  {
    title: "Abuse Reports",
    text: "Abuse reports should be sent directly to abuse@growblic.com for review.",
  },
  {
    title: "Security Contact",
    text: "Security reports can be emailed to hello@growblic.com or abuse@growblic.com.",
  },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Security & Abuse
            </p>
            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Responsible reporting keeps digital work safer.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              Growblic reviews security and abuse reports with care. Please include
              useful context, affected URLs, screenshots if available, and contact details.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="mailto:abuse@growblic.com?subject=Growblic Abuse Report"
                className="rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Report Abuse
              </a>
              <a
                href="mailto:hello@growblic.com?subject=Growblic Security Report"
                className="rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
              >
                Security Email
              </a>
            </div>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {securityItems.map((item, index) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50"
              >
                <span className="text-sm font-black text-blue-600">0{index + 1}</span>
                <h2 className="mt-4 text-2xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
