import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic Meetup",
  description:
    "Growblic Meetup for community, startups, software, automation, digital growth, and product conversations.",
  path: "/meetup",
});

const meetupTopics = [
  "Startups",
  "Software",
  "Automation",
  "Digital Growth",
  "Product Design",
  "Business Systems",
];

export default function MeetupPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Meetup
            </p>
            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Community for software, startups, automation, and growth.
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              Growblic Meetup is for conversations around building better digital
              products, startup systems, automation workflows, and modern business growth.
            </p>
            <a
              href="mailto:hello@growblic.com?subject=Growblic Meetup Host Inquiry"
              className="mt-9 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Become a host / Contact Growblic
            </a>
          </div>

          <div id="events" className="mt-14 grid scroll-mt-24 gap-5 md:grid-cols-3">
            {meetupTopics.map((topic, index) => (
              <article
                key={topic}
                className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50"
              >
                <span className="text-sm font-black text-blue-600">0{index + 1}</span>
                <h2 className="mt-4 text-2xl font-black text-slate-950">{topic}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  Practical community sessions for modern teams and builders.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
