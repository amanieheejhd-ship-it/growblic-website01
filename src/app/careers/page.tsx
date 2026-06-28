import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Growblic",
  description:
    "Join Growblic and build premium websites, apps, SaaS products, and automation systems for modern businesses.",
};

const logoUrl =
  "https://play-lh.googleusercontent.com/g0grr8jGzVcS1_uUzh05Ht2a7w7PcavodUBDgK7XOel8DwYKNSVtNZaF6HmqUFPK37xlr4WafEddfvWeyeDSKA=w240-h480-rw";

const openings = [
  {
    role: "Frontend Developer",
    type: "Full-time / Internship",
    location: "Remote / India",
    description:
      "Build premium web interfaces using Next.js, React, Tailwind CSS, and modern UI patterns.",
    skills: ["Next.js", "React", "Tailwind", "UI polish"],
  },
  {
    role: "Backend Developer",
    type: "Full-time / Internship",
    location: "Remote / India",
    description:
      "Work on APIs, dashboards, business tools, and scalable backend systems for real products.",
    skills: ["Node.js", "NestJS", "APIs", "Database"],
  },
  {
    role: "UI/UX Designer",
    type: "Part-time / Internship",
    location: "Remote / India",
    description:
      "Design clean, premium, conversion-focused screens for websites, apps, and SaaS dashboards.",
    skills: ["Figma", "Wireframes", "Design systems", "Prototyping"],
  },
  {
    role: "Digital Marketing Executive",
    type: "Part-time / Internship",
    location: "Remote / India",
    description:
      "Help Growblic and clients grow through SEO, Google Ads, Meta Ads, content, and lead generation.",
    skills: ["SEO", "Google Ads", "Meta Ads", "Content"],
  },
];

const perks = [
  "Real product work",
  "Remote-friendly workflow",
  "Modern tech stack",
  "Fast learning culture",
  "Design-focused execution",
  "Growth opportunities",
];

const values = [
  {
    title: "Build with ownership",
    text: "We take responsibility for quality, clarity, and delivery.",
  },
  {
    title: "Think like product people",
    text: "We do not just make screens. We solve real business problems.",
  },
  {
    title: "Move fast, improve faster",
    text: "We launch, learn, polish, and keep improving.",
  },
];

const cultureCards = [
  {
    title: "Insights",
    text: "Learn how we build websites, apps, SaaS products, automation systems, and dashboards.",
  },
  {
    title: "Humans of Growblic",
    text: "Meet the people, mindset, and execution culture behind Growblic products.",
  },
];

function CareersTopNav() {
  return (
    <div className="relative z-20 mx-auto max-w-7xl px-6 pt-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link href="/careers" className="flex items-center gap-4">
          <Image
            src={logoUrl}
            alt="Growblic logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-2xl object-cover"
            unoptimized
          />
          <span className="text-xl font-black uppercase tracking-[0.20em] text-white">
            Growblic Careers
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.20em] text-white sm:gap-6">
          <a href="#openings" className="transition hover:text-blue-200">
            Openings
          </a>
          <span className="hidden text-white/45 sm:inline">|</span>
          <a href="#perks" className="transition hover:text-blue-200">
            Perks
          </a>
          <span className="hidden text-white/45 sm:inline">|</span>
          <a href="#values" className="transition hover:text-blue-200">
            Values
          </a>
          <span className="hidden text-white/45 sm:inline">|</span>

          <details className="group relative">
            <summary className="list-none cursor-pointer transition hover:text-blue-200">
              Culture <span className="inline-block transition group-open:rotate-180">⌄</span>
            </summary>
            <div className="absolute right-0 top-8 z-30 w-64 border border-white/35 bg-black p-5 text-center shadow-2xl shadow-black/40">
              <a
                href="#culture"
                className="block py-2 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-blue-200"
              >
                Insights
              </a>
              <a
                href="#humans"
                className="block py-2 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-blue-200"
              >
                Humans of Growblic
              </a>
            </div>
          </details>
        </nav>
      </div>
    </div>
  );
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.22),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.25),#000)]" />

        <CareersTopNav />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <p className="mb-6 inline-flex border border-white/40 px-5 py-2 text-xs font-black uppercase tracking-[0.35em] text-white">
              Careers at Growblic
            </p>

            <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
              Ready to grow your career?
            </h1>

            <p className="mt-8 max-w-3xl text-lg font-semibold leading-9 text-slate-300 sm:text-xl">
              Join Growblic and work on premium websites, mobile apps, SaaS products,
              automation systems, dashboards, and real business software.
            </p>

            <div className="mt-12 grid max-w-5xl gap-5 md:grid-cols-[1fr_1fr]">
              <div className="flex h-16 items-center border border-white/45 bg-transparent px-5 text-sm font-bold tracking-[0.12em] text-slate-300">
                seek and you shall find
              </div>
              <a
                href="#openings"
                className="flex h-16 items-center justify-center bg-white px-5 text-sm font-black uppercase tracking-[0.22em] text-slate-950 transition hover:bg-blue-50"
              >
                Discover roles <span className="ml-4 text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="openings" className="bg-white px-6 py-24 text-slate-950 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-700">
                Openings
              </p>
              <h2 className="mt-5 text-5xl font-black uppercase tracking-tight sm:text-6xl">
                Choose your next role.
              </h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-8 text-slate-600">
              We are building a focused team of developers, designers, and growth people
              who want to work on real digital products.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {openings.map((job) => (
              <article
                key={job.role}
                className="border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{job.role}</h3>
                    <p className="mt-2 text-sm font-bold text-blue-700">{job.type}</p>
                  </div>
                  <span className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                    {job.location}
                  </span>
                </div>

                <p className="mt-5 leading-7 text-slate-600">{job.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="mt-7 inline-flex bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Apply now →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="perks" className="min-h-screen bg-black px-6 py-28 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-slate-400">
              Perks
            </p>
            <h2 className="mt-5 text-6xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-7xl">
              Perks that help you do your best work.
            </h2>
            <p className="mt-8 max-w-xl text-lg font-semibold leading-9 text-slate-300">
              Growblic gives you the space to learn, build, improve, and work on real
              business projects with a serious product mindset.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {perks.map((perk, index) => (
              <div
                key={perk}
                className="border border-white/20 bg-white p-6 text-slate-950"
              >
                <p className="text-sm font-black text-blue-700">
                  0{index + 1}
                </p>
                <h3 className="mt-6 text-2xl font-black uppercase leading-tight">
                  {perk}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="relative min-h-screen overflow-hidden bg-black px-6 py-28 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.11),transparent_25%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-6xl font-black uppercase leading-[0.86] tracking-tight text-white sm:text-7xl lg:text-8xl">
              Our values define our journey.
            </h2>
            <p className="mt-8 max-w-md text-base font-bold leading-8 text-slate-300">
              Our values lie at the core of all that we do. Know them and you will
              know our DNA.
            </p>
          </div>

          <div className="relative min-h-[460px]">
            <div className="absolute right-12 top-8 h-44 w-44 rotate-45 border border-white/25" />
            <div className="absolute right-40 top-36 h-28 w-28 rotate-45 border border-white/20" />
            <div className="absolute bottom-6 right-10 h-56 w-80 rounded-full border border-white/15" />
            <div className="absolute right-0 top-0 h-full w-px bg-white/15" />

            <div className="relative z-10 grid gap-5 pt-28">
              {values.map((value) => (
                <article key={value.title} className="border border-white/20 bg-black p-6">
                  <h3 className="text-xl font-black uppercase text-white">{value.title}</h3>
                  <p className="mt-3 font-semibold leading-7 text-slate-400">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="culture" className="bg-white px-6 py-28 text-slate-950 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-700">
            Culture
          </p>
          <h2 className="mt-5 text-5xl font-black uppercase tracking-tight sm:text-6xl">
            Inside Growblic.
          </h2>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {cultureCards.map((card) => (
              <article key={card.title} className="border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-3xl font-black uppercase text-slate-950">{card.title}</h3>
                <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="humans" className="bg-black px-6 py-28 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-slate-400">
            Humans of Growblic
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl text-5xl font-black uppercase tracking-tight sm:text-6xl">
            Great products are built by focused people.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-300">
            We value consistency, learning, execution, honesty, and premium work quality.
          </p>

          <Link
            href="/contact"
            className="mt-10 inline-flex bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-blue-50"
          >
            Apply through contact →
          </Link>
        </div>
      </section>
    </main>
  );
}
