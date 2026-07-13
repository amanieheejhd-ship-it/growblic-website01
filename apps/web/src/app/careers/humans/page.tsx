"use client";

import { useState } from "react";

const people = [
  {
    name: "Bintu Malik",
    role: "Founder",
    badge: "Founder",
    image: "/images/team/bintu-malik.jpg",
    text: "Leading Growblic's product, software, and digital growth vision.",
  },
  {
    name: "Jaspreet Singh Thind",
    role: "Backend Developer",
    badge: "Backend Developer",
    image: "/images/team/jaspreet-singh-thind-v01.jpg",
    text: "Building reliable backend systems, APIs, and scalable product foundations.",
  },
  {
    name: "Gautam",
    role: "Frontend Developer",
    badge: "Frontend Developer",
    image: "/images/team/gautam-frontend-developer.jpg",
    text: "Building clean frontend interfaces, responsive layouts, and smooth user experiences.",
  },
  {
    name: "Human Resources",
    role: "HR",
    badge: "HR",
    image: "/images/team/madhu-bala-hr.jpg",
    text: "Supporting people operations, team coordination, and hiring workflows.",
  },
  {
    name: "Business Analyst",
    role: "Business Analyst",
    badge: "Business Analyst",
    image: "/images/team/deepak-business-analyst.jpg",
    text: "Understanding client needs, product flows, and practical business requirements.",
  },
  {
    name: "Growth Partner",
    role: "Business Analyst",
    badge: "Business Analyst",
    image: "/images/team/bhumit-sharma-business-analyst.jpg",
    text: "Helping shape client communication, project planning, and digital growth direction.",
  },
];

export default function CareersHumansPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-950">
      <section className="relative border-b border-blue-100/70 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-black text-white shadow-xl shadow-blue-100">
              <span className="text-xl">◒</span>
            </div>

            <div className="min-w-0">
              <p className="text-lg font-black uppercase tracking-[0.32em] sm:text-2xl">
                Growblic Careers
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-blue-600 sm:hidden">
                Tap a photo to view info
              </p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {["Careers Home", "Perks", "Values", "Openings"].map((item) => (
              <span
                key={item}
                className="shrink-0 rounded-full border border-blue-100 bg-white px-6 py-3 text-xs font-black uppercase tracking-[0.24em] text-slate-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-600">
              Humans of Growblic
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              The people building Growblic.
            </h1>
            <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              Meet the people behind Growblic&apos;s products, software systems, and digital growth work.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person, index) => {
              const isActive = activeCard === index;

              return (
                <button
                  type="button"
                  key={person.name}
                  onClick={() => setActiveCard(isActive ? null : index)}
                  className="group relative block min-h-[390px] overflow-hidden rounded-[2rem] border border-blue-100 bg-white text-left shadow-xl shadow-blue-100/50 outline-none transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/60 focus-visible:ring-4 focus-visible:ring-blue-200 sm:min-h-[470px] lg:min-h-[520px]"
                >
                  <img
                    src={person.image}
                    alt={person.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='1100' viewBox='0 0 900 1100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23dbeafe'/%3E%3Cstop offset='1' stop-color='%23f8fafc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='900' height='1100' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f172a' font-size='54' font-family='Arial' font-weight='800'%3EGrowblic%3C/text%3E%3C/svg%3E";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-white/10" />

                  <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-5 py-3 text-[0.62rem] font-black uppercase tracking-[0.34em] text-blue-600 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                    {person.badge}
                  </span>

                  <span className="absolute bottom-4 right-4 z-10 rounded-full bg-white/90 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-700 shadow-lg backdrop-blur-xl sm:hidden">
                    Tap
                  </span>

                  <div
                    className={`absolute inset-x-4 bottom-4 z-20 rounded-[1.5rem] bg-white/92 p-5 shadow-2xl shadow-slate-950/15 backdrop-blur-2xl transition duration-500 sm:translate-y-0 sm:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0 sm:opacity-100"
                    }`}
                  >
                    <h2 className="break-words text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl">
                      {person.name}
                    </h2>

                    <p className="mt-3 text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                      {person.role}
                    </p>

                    <p className="mt-5 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                      {person.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
