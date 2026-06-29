import Link from "next/link";
import { Metadata } from "next";
import Scroll3DSection from "../../../components/Scroll3DSection";

export const metadata: Metadata = {
  title: "Values | Growblic Careers",
  description:
    "Growblic values guide how we design, build, communicate, and deliver premium digital products.",
};

const values = [
  {
    title: "build to win",
    text: "we design, develop, and deliver with a clear goal — create work that helps real businesses grow.",
  },
  {
    title: "fast & right",
    text: "speed matters, but quality matters too. we move quickly while keeping the product clean, useful, and scalable.",
  },
  {
    title: "trustworthy",
    text: "we build trust through consistency, honest communication, clean execution, and ownership of outcomes.",
  },
  {
    title: "compounding",
    text: "every project improves our systems, design taste, development process, and long-term product thinking.",
  },
  {
    title: "high agency",
    text: "we do not wait for perfect conditions. we find solutions, take ownership, and finish what matters.",
  },
  {
    title: "client success",
    text: "every decision should make the client experience better — clearer, faster, smoother, and more valuable.",
  },
  {
    title: "frugal",
    text: "we use time, tools, and resources carefully. simple solutions often create the strongest business impact.",
  },
];

const workWays = [
  "Start with the business outcome",
  "Design the simplest useful system",
  "Ship, learn, and improve the next version",
];

export default function ValuesPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_86%_82%,rgba(6,182,212,0.10),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.30em] text-blue-700 shadow-lg shadow-blue-100/60">
            Growblic Careers / Values
          </p>

          <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Our values define our journey.
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-slate-600">
            Our values guide how we build software, handle clients, improve systems,
            and create premium digital products.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-100/70 sm:p-12">
          <div className="grid gap-x-20 gap-y-20 lg:grid-cols-2">
            {values.map((item, index) => (
              <Scroll3DSection key={item.title} delay={index * 0.04}>
                <article className="group relative h-full overflow-hidden rounded-[2rem] border border-blue-100/75 bg-gradient-to-br from-white via-blue-50/35 to-white p-6 shadow-xl shadow-blue-100/45 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70">
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-200/35 blur-3xl transition group-hover:bg-cyan-200/45" />
                  <span className="relative inline-flex rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-black text-blue-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="relative mt-4 text-4xl font-black tracking-tight text-slate-950">
                    {item.title}
                  </h2>
                  <p className="relative mt-6 max-w-xl text-base font-semibold leading-8 text-slate-600">
                    {item.text}
                  </p>
                </article>
              </Scroll3DSection>
            ))}
          </div>

          <Scroll3DSection className="mt-16">
            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-blue-50/90 via-white to-white p-6 shadow-xl shadow-blue-100/55 ring-1 ring-blue-100/70 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                How we work
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {workWays.map((item, index) => (
                  <div key={item} className="rounded-[1.5rem] border border-blue-100 bg-white/75 p-5 shadow-lg shadow-blue-100/45">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                      Step {index + 1}
                    </span>
                    <p className="mt-3 text-lg font-black leading-7 text-slate-950">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Scroll3DSection>

          <div className="mt-16 flex flex-col gap-4 border-t border-blue-100 pt-8 sm:flex-row">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
            >
              Back to Careers
            </Link>
            <Link
              href="/careers/openings"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              See Openings →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
