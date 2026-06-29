import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic Meetup",
  description:
    "Growblic community meetups for founders, developers, creators, marketers, and businesses exploring software, apps, AI automation, and digital growth.",
  path: "/meetup",
});

const heroPoints = [
  "Become a Growblic meetup host",
  "Build local founder and developer connections",
  "Learn practical software, AI, and automation workflows",
  "Get support from the Growblic team",
];

const collageCards = [
  { title: "Community session", className: "left-0 top-8 h-44 w-56 bg-gradient-to-br from-blue-500 to-cyan-300" },
  { title: "Founder workshop", className: "right-6 top-0 h-52 w-64 bg-gradient-to-br from-white to-blue-100 text-slate-950" },
  { title: "AI automation demo", className: "left-24 top-48 h-56 w-72 bg-gradient-to-br from-slate-950 to-blue-700" },
  { title: "Developer meetup", className: "right-0 top-64 h-44 w-56 bg-gradient-to-br from-cyan-100 to-white text-slate-950" },
  { title: "Digital growth talk", className: "left-2 bottom-0 h-40 w-64 bg-gradient-to-br from-blue-100 to-white text-slate-950" },
];

const meetupWays = [
  {
    title: "Founder networking",
    text: "Casual meetups where local businesses and startup founders discuss digital growth, websites, apps, and automation.",
    visual: "from-blue-500 to-cyan-300",
  },
  {
    title: "Workshop night",
    text: "Hands-on sessions for websites, mobile apps, AI tools, dashboards, and marketing automation.",
    visual: "from-slate-950 to-blue-700",
  },
  {
    title: "Demo day",
    text: "Community sessions where builders present products, case studies, and real business workflows.",
    visual: "from-cyan-200 to-blue-100",
  },
];

const supportCards = [
  "Planning guide & checklist",
  "Speaker/topic suggestions",
  "Growblic brand kit",
  "Community promotion support",
];

const upcomingMeetups = [
  {
    title: "Growblic AI Automation Workshop",
    location: "Online / India",
    description: "A practical session on AI workflows, lead automation, dashboards, and business operations.",
  },
  {
    title: "Growblic Website Growth Session",
    location: "Online / India",
    description: "A focused session on business websites, conversion pages, SEO basics, and digital trust.",
  },
  {
    title: "Growblic Founder Digital Meetup",
    location: "Community / India",
    description: "A founder-friendly discussion around software ideas, app launches, SaaS, and automation.",
  },
];

const optionalCards = [
  {
    title: "What you can host",
    text: "Talks, panels, workshops, product demos, founder circles, automation sessions, and digital growth clinics.",
  },
  {
    title: "Who should attend",
    text: "Founders, creators, developers, marketers, students, agencies, business owners, and product builders.",
  },
  {
    title: "Community guidelines",
    text: "Keep sessions respectful, practical, inclusive, and useful. No spam, abuse, fraud, or disruptive promotion.",
  },
];

export default function MeetupPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 overflow-hidden rounded-[3rem] border border-blue-100/80 bg-slate-950 shadow-2xl shadow-blue-100/70">
            <div className="relative grid min-h-[680px] gap-10 p-8 text-white sm:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:p-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(37,99,235,0.42),transparent_34%),radial-gradient(circle_at_82%_30%,rgba(6,182,212,0.28),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.2),rgba(15,23,42,1))]" />
              <div className="relative self-center">
                <p className="text-sm font-black uppercase tracking-[0.34em] text-cyan-200">
                  Growblic Meetup
                </p>
                <h1 className="mt-5 text-5xl font-black leading-[0.94] tracking-tight md:text-7xl">
                  Shape the Growblic digital community in your city
                </h1>
                <p className="mt-7 max-w-3xl text-lg font-semibold leading-9 text-white/74">
                  Host meetups for founders, creators, developers, marketers, and business
                  owners who want to learn websites, apps, SaaS, automation, AI workflows,
                  and digital growth.
                </p>

                <div className="mt-7 grid gap-3">
                  {heroPoints.map((point) => (
                    <div
                      key={point}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white/86 backdrop-blur"
                    >
                      {point}
                    </div>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="mailto:hello@growblic.com?subject=Growblic Meetup Host"
                    className="rounded-full bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-cyan-100"
                  >
                    Become a host
                  </a>
                  <a
                    href="#upcoming-meetups"
                    className="rounded-full border border-white/18 bg-white/10 px-7 py-4 text-sm font-black text-white shadow-xl shadow-blue-950/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
                  >
                    Meetup calendar
                  </a>
                </div>
              </div>

              <div className="relative min-h-[560px]">
                {collageCards.map((card) => (
                  <div
                    key={card.title}
                    className={`absolute overflow-hidden rounded-[2rem] border border-white/20 p-5 text-white shadow-2xl shadow-blue-950/30 backdrop-blur-xl ${card.className}`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.26),rgba(255,255,255,0))]" />
                    <div className="relative flex h-full flex-col justify-end">
                      <div className="mb-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/22 text-xl font-black">
                        +
                      </div>
                      <p className="text-lg font-black leading-tight">{card.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-20">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Meetup formats
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Ways to run a Growblic meetup
            </h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {meetupWays.map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl shadow-blue-100/50"
                >
                  <div className={`h-52 bg-gradient-to-br ${item.visual} p-6`}>
                    <div className="h-full rounded-[1.4rem] border border-white/30 bg-white/18 backdrop-blur" />
                  </div>
                  <div className="p-7">
                    <h3 className="text-2xl font-black text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Host support
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Support for your Growblic meetups
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              Approved events may receive promotional support, digital assets, and
              guidance from Growblic.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {supportCards.map((item, index) => (
                <article
                  key={item}
                  className="rounded-[1.8rem] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/45"
                >
                  <span className="text-sm font-black text-blue-600">0{index + 1}</span>
                  <h3 className="mt-4 text-xl font-black text-slate-950">{item}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                    Practical support to help hosts shape useful, respectful, and
                    well-organized community sessions.
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="upcoming-meetups" className="mt-20 scroll-mt-24">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Calendar
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Upcoming meetups
            </h2>
            <div className="mt-8 grid gap-4">
              {upcomingMeetups.map((meetup) => (
                <article
                  key={meetup.title}
                  className="grid gap-5 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/45 lg:grid-cols-[180px_1fr_auto] lg:items-center"
                >
                  <div className="rounded-[1.3rem] bg-blue-50 px-5 py-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                      Coming soon
                    </p>
                    <p className="mt-2 text-sm font-black text-slate-600">{meetup.location}</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{meetup.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">
                      {meetup.description}
                    </p>
                  </div>
                  <a
                    href="mailto:hello@growblic.com?subject=Growblic Meetup Interest"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Register interest
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-5 lg:grid-cols-3">
            {optionalCards.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/45"
              >
                <h3 className="text-2xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-20 overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white shadow-2xl shadow-blue-100/60">
            <div className="relative p-8 sm:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(37,99,235,0.13),transparent_30%),linear-gradient(135deg,rgba(239,246,255,0.78),rgba(255,255,255,0.96))]" />
              <div className="relative max-w-4xl">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                  Become a host
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                  Bring Growblic to your community
                </h2>
                <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
                  Tell us your city, audience, and the type of event you want to host.
                  We&apos;ll help you shape a practical session around software, apps,
                  AI automation, and digital growth.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="mailto:hello@growblic.com?subject=Growblic Meetup Host"
                    className="rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Become a host
                  </a>
                  <a
                    href="mailto:hello@growblic.com"
                    className="rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
                  >
                    Contact Growblic
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
