/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Handshake,
  MapPin,
  Megaphone,
  Mic2,
  Users,
  Workflow,
} from "lucide-react";

const heroPoints = [
  "Become a Growblic meetup host",
  "Build local founder and developer connections",
  "Learn practical software, AI, and automation workflows",
  "Get support from the Growblic team",
];

const meetupWays = [
  {
    title: "Founder networking",
    text: "Casual meetups where founders, local businesses, and builders discuss websites, apps, SaaS, and automation.",
    image: "/growblic-website01/images/business/saas-3.jpg",
    icon: Handshake,
  },
  {
    title: "Workshop night",
    text: "Hands-on sessions for websites, mobile apps, AI tools, dashboards, and marketing automation.",
    image: "/growblic-website01/images/business/ai-2.svg",
    icon: Workflow,
  },
  {
    title: "Demo day",
    text: "Community sessions where builders present products, case studies, business tools, and real workflows.",
    image: "/growblic-website01/images/business/ai-3.svg",
    icon: Mic2,
  },
];

const supportCards = [
  {
    number: "01",
    title: "Planning guide",
    text: "Practical support to help hosts plan useful, respectful, and well-organized community sessions.",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "Speaker ideas",
    text: "Topic suggestions around websites, apps, AI workflow, dashboards, software, and digital growth.",
    icon: Mic2,
  },
  {
    number: "03",
    title: "Growblic brand kit",
    text: "Clean assets and guidance so your meetup feels consistent, premium, and trusted.",
    icon: BadgeCheck,
  },
  {
    number: "04",
    title: "Promotion support",
    text: "Support with event messaging, community announcements, and session positioning.",
    icon: Megaphone,
  },
];

const upcomingMeetups = [
  {
    title: "Growblic AI Automation Workshop",
    type: "Online / India",
    text: "A practical session on AI workflows, lead automation, dashboards, and business operations.",
  },
  {
    title: "Growblic Website Growth Session",
    type: "Online / India",
    text: "A focused session on business websites, conversion pages, SEO basics, and digital trust.",
  },
  {
    title: "Growblic Founder Digital Meetup",
    type: "Community / India",
    text: "A founder-friendly discussion around software ideas, app launches, SaaS, and automation.",
  },
];

export default function MeetupPage() {
  return (
    <main className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_88%_55%,rgba(6,182,212,0.12),transparent_32%),linear-gradient(180deg,#ffffff,rgba(239,246,255,0.66),#ffffff)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2.9rem] border border-blue-100/90 bg-white/86 p-6 shadow-[0_38px_130px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-8 lg:p-11">
          <div className="grid gap-12 lg:grid-cols-[0.98fr_0.92fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-white/95 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.34em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.08)]">
                Growblic Meetup
              </p>

              <h1 className="mt-7 max-w-3xl text-[clamp(3.25rem,6vw,5.9rem)] font-extrabold leading-[1.01] tracking-[-0.06em] text-slate-950">
                Build a premium digital community in your city.
              </h1>

              <p className="mt-7 max-w-2xl text-[1.18rem] font-semibold leading-[2.1rem] text-slate-600">
                Host meetups for founders, creators, developers, marketers, and business owners who want to learn websites, apps, SaaS, AI workflows, and digital growth.
              </p>

              <div className="mt-8 grid max-w-2xl gap-3.5">
                {heroPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-[1.25rem] border border-blue-100 bg-white/90 px-5 py-4 text-sm font-extrabold text-slate-700 shadow-[0_12px_30px_rgba(37,99,235,0.06)] backdrop-blur-xl"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3.5 sm:flex-row">
                <a
                  href="#become-host"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Become a host <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#calendar"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white px-8 py-4 text-sm font-extrabold text-slate-950 shadow-[0_16px_35px_rgba(37,99,235,0.08)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                >
                  Meetup calendar <CalendarDays className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="relative min-h-[690px] overflow-hidden rounded-[2.5rem] border border-blue-100 bg-[linear-gradient(135deg,rgba(239,246,255,0.95),rgba(255,255,255,0.97),rgba(236,254,255,0.92))] p-5 shadow-[0_32px_110px_rgba(37,99,235,0.12)]">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-200/55 blur-3xl" />
              <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-cyan-200/45 blur-3xl" />

              <div className="absolute left-6 top-7 w-[50%] overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-3 shadow-[0_24px_80px_rgba(37,99,235,0.16)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-x-3 hover:-translate-y-3 hover:rotate-[-1deg] hover:shadow-[0_35px_100px_rgba(37,99,235,0.20)]">
                <img src="/growblic-website01/images/business/mobile-3.jpg" alt="Growblic meetup session" className="h-[13rem] w-full rounded-[1.35rem] object-cover" />
                <div className="px-2 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">Community</p>
                  <h3 className="mt-2 text-[1.9rem] font-extrabold leading-[1.05] tracking-[-0.045em] text-slate-950">Founder circle</h3>
                </div>
              </div>

              <div className="absolute right-6 top-14 w-[40%] overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-3 shadow-[0_24px_80px_rgba(6,182,212,0.16)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-3 hover:-translate-y-3 hover:rotate-[1deg] hover:shadow-[0_35px_100px_rgba(6,182,212,0.20)]">
                <img src="/growblic-website01/images/business/ai-1.svg" alt="Workshop night" className="h-40 w-full rounded-[1.35rem] object-cover" />
                <div className="px-2 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-700">Workshop</p>
                  <h3 className="mt-2 text-xl font-black tracking-[-0.05em] text-slate-950">Build night</h3>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 w-[44%] overflow-hidden rounded-[1.7rem] border border-white/80 bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.13)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-x-3 hover:translate-y-3 hover:rotate-[1deg] hover:shadow-[0_35px_100px_rgba(15,23,42,0.16)]">
                <img src="/growblic-website01/images/business/mobile-2.jpg" alt="AI automation demo" className="h-44 w-full rounded-[1.35rem] object-cover" />
                <div className="px-2 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">Demo</p>
                  <h3 className="mt-2 text-xl font-black tracking-[-0.05em] text-slate-950">AI workflow</h3>
                </div>
              </div>

              <div className="absolute bottom-12 right-6 w-[38%] rounded-[1.8rem] border border-blue-100 bg-white/92 p-5 shadow-[0_28px_90px_rgba(37,99,235,0.12)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-3 hover:translate-y-3 hover:rotate-[-1deg] hover:shadow-[0_36px_110px_rgba(37,99,235,0.16)]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                  <Users className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-blue-700">Local hosts</p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-slate-950">Sessions that feel premium.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">
            Meetup formats
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
            Ways to run a Growblic meetup.
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {meetupWays.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-[2rem] border border-blue-100 bg-white/82 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.10)] backdrop-blur-2xl transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white"
                >
                  <div className="relative h-56 overflow-hidden rounded-[1.5rem] border border-blue-100 bg-blue-50">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-xl shadow-blue-950/10">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-7 text-2xl font-black tracking-[-0.04em] text-slate-950">
                    {item.title}
                  </h3>

                  <p className="relative mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="relative mt-20 overflow-hidden rounded-[2.7rem] border border-blue-100/90 bg-white/88 p-7 shadow-[0_38px_130px_rgba(37,99,235,0.13)] backdrop-blur-2xl sm:p-9">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">
                Host support
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
                Support for your Growblic meetups.
              </h2>
              <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
                Approved events may receive promotional support, digital assets, topic guidance, and practical planning help from Growblic.
              </p>
              <div className="mt-8 overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-3 shadow-[0_22px_75px_rgba(37,99,235,0.12)]">
                <img src="/growblic-website01/images/business/saas-1.jpg" alt="Growblic host support" className="h-72 w-full rounded-[1.55rem] object-cover saturate-110" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {supportCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(37,99,235,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_34px_105px_rgba(37,99,235,0.16)]"
                  >
                    <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-cyan-100/80" />
                    <div className="relative flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black tracking-[0.24em] text-blue-700 ring-1 ring-blue-100">
                        {card.number}
                      </span>
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-[0_12px_35px_rgba(37,99,235,0.14)] ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>

                    <h3 className="relative mt-8 text-[1.35rem] font-black leading-tight tracking-[-0.045em] text-slate-950">
                      {card.title}
                    </h3>

                    <p className="relative mt-4 text-sm font-semibold leading-7 text-slate-600">
                      {card.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="calendar"
          className="relative mt-20 scroll-mt-24 overflow-hidden rounded-[2.6rem] border border-blue-100 bg-white/86 p-6 shadow-[0_34px_110px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-200/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/35 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />

          <div className="relative z-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">
                  Calendar
                </p>
                <h2 className="mt-4 text-[clamp(2.6rem,4.8vw,5rem)] font-extrabold leading-none tracking-[-0.07em] text-slate-950">
                  Upcoming meetups.
                </h2>
              </div>

              <div className="w-fit rounded-full border border-blue-100 bg-white/90 px-5 py-3 text-sm font-black text-slate-700 shadow-[0_14px_35px_rgba(37,99,235,0.08)]">
                3 upcoming sessions
              </div>
            </div>

            <div className="mt-9 grid gap-5">
              {upcomingMeetups.map((event, index) => (
                <article
                  key={event.title}
                  className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/92 p-5 shadow-[0_22px_75px_rgba(37,99,235,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_34px_105px_rgba(37,99,235,0.16)]"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-600 via-cyan-400 to-blue-200 opacity-0 transition group-hover:opacity-100" />

                  <div className="grid gap-5 lg:grid-cols-[0.25fr_1fr_auto] lg:items-center">
                    <div className="rounded-[1.4rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-700">
                        Coming soon
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-sm font-black text-slate-600">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        {event.type}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-xs font-black tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl font-black tracking-[-0.045em] text-slate-950">
                          {event.title}
                        </h3>
                      </div>

                      <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-slate-600">
                        {event.text}
                      </p>
                    </div>

                    <a
                      href="#become-host"
                      className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                      Register interest
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {[
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
              ].map((item, index) => (
                <article
                  key={item.title}
                  className="group rounded-[2rem] border border-blue-100 bg-white/92 p-7 shadow-[0_22px_75px_rgba(37,99,235,0.09)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_30px_95px_rgba(37,99,235,0.14)]"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black tracking-[0.24em] text-blue-700 ring-1 ring-blue-100">
                      0{index + 1}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-700 shadow-[0_12px_35px_rgba(37,99,235,0.12)] ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                      <CalendarDays className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.045em] text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-sm font-semibold leading-7 text-slate-600">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="become-host"
          className="mt-20 scroll-mt-24 overflow-hidden rounded-[2.2rem] border border-blue-100 bg-white/86 p-8 shadow-[0_28px_90px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">
                Become a host
              </p>
              <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
                Bring Growblic to your community.
              </h2>
              <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600">
                Tell us your city, audience, and the type of event you want to host. We will help you shape a practical session around software, apps, AI automation, and digital growth.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@growblic.com?subject=Growblic Meetup Host Request"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Become a host <ArrowRight className="h-4 w-4" />
              </a>

              <Link
                href="/start-project"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/55 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Contact Growblic <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
