"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What does Growblic build?",
    a: "We build websites, mobile apps, SaaS products, CRM, dashboards, admin panels, AI automation, and custom business software.",
  },
  {
    q: "Do you build mobile apps?",
    a: "Yes. We build Android and iOS apps with clean UI, backend, admin panel, testing, and Play Store ready setup.",
  },
  {
    q: "Can you build custom business software?",
    a: "Yes. We create custom software for billing, booking, inventory, HR, school, real estate, e-commerce, and service businesses.",
  },
  {
    q: "Do you build SaaS products?",
    a: "Yes. We build SaaS products with login, roles, dashboards, subscriptions, analytics, and admin panels.",
  },
  {
    q: "Do you provide AI automation?",
    a: "Yes. We build AI automation for lead handling, reports, workflow automation, support, and business operations.",
  },
  {
    q: "Do you give support after delivery?",
    a: "Yes. We provide updates, maintenance, bug fixing, improvements, and long-term support based on project needs.",
  },
  {
    q: "How long does it take to build a website or app?",
    a: "Timelines depend on scope, but simple websites can launch faster while apps and SaaS platforms need planned design, development, and testing phases.",
  },
  {
    q: "Do you provide admin panel with mobile apps?",
    a: "Yes. Mobile app projects can include an admin panel for users, content, bookings, reports, and business controls.",
  },
  {
    q: "Can Growblic build custom SaaS platforms?",
    a: "Yes. We build SaaS platforms with login, dashboards, roles, subscriptions, analytics, and scalable product foundations.",
  },
  {
    q: "Do you help with SEO and digital marketing?",
    a: "Yes. Growblic can support SEO-ready website structure, SEO services, Google Ads, Meta Ads, and digital growth systems.",
  },
  {
    q: "Can you support after launch?",
    a: "Yes. We can help with improvements, maintenance, bug fixes, new features, and launch support after delivery.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faqs" className="relative overflow-hidden px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-600">
            FAQs
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Common questions.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
            Quick answers before starting your project with Growblic.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.q}
                onMouseEnter={() => setOpenIndex(index)}
                onFocus={() => setOpenIndex(index)}
                tabIndex={0}
                className={`group cursor-pointer overflow-hidden rounded-[1.7rem] border bg-white shadow-lg shadow-blue-100/45 transition-all duration-300 ease-out ${
                  isOpen
                    ? "border-blue-300 bg-blue-50/70 shadow-xl shadow-blue-100/70"
                    : "border-blue-100/70 hover:-translate-y-1 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between gap-4 p-5">
                  <span className="text-lg font-black leading-tight text-slate-950">
                    {faq.q}
                  </span>

                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg font-black text-white transition-all duration-300 ease-out ${
                      isOpen ? "rotate-45 bg-blue-700" : "bg-slate-950"
                    }`}
                  >
                    +
                  </span>
                </div>

                <div
                  className={`transition-all duration-300 ease-out ${
                    isOpen
                      ? "max-h-40 translate-y-0 opacity-100"
                      : "max-h-0 -translate-y-2 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-sm font-semibold leading-7 text-slate-600">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-[2rem] border border-blue-100 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 p-6 text-white shadow-xl shadow-blue-100/60">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                Need custom help?
              </p>
              <h3 className="mt-2 text-2xl font-black">
                Tell us your idea, we will guide you.
              </h3>
            </div>

            <a
              href="#contact"
              className="rounded-full bg-white px-7 py-4 text-center text-sm font-black text-slate-950 transition-all duration-300 hover:-translate-y-1"
            >
              Start Project →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
