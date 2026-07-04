"use client";

import Link from "next/link";
import { useState } from "react";

const INITIAL_FAQ_COUNT = 9;

const faqs = [
  {
    q: "What does Growblic build?",
    a: "Growblic builds premium websites, mobile apps, SaaS products, dashboards, backend APIs, admin panels, automation systems, and cloud-ready software solutions.",
  },
  {
    q: "Do you build mobile apps?",
    a: "Yes. Growblic can build Android/iOS apps with login, dashboard, booking/order flow, payments, notifications, admin panel, backend APIs, and deployment planning.",
  },
  {
    q: "Can you build custom business software?",
    a: "Yes. Growblic can build custom business software for operations, CRM, HR/payroll, billing, reporting, workflow automation, and internal dashboards.",
  },
  {
    q: "Do you build SaaS products?",
    a: "Yes. Growblic can help build SaaS platforms with onboarding, user accounts, subscriptions, admin controls, scalable modules, and backend APIs.",
  },
  {
    q: "Do you provide AI automation?",
    a: "Yes. Growblic can help with automated replies, workflow automation, lead follow-ups, task automation, dashboard alerts, and business process automation.",
  },
  {
    q: "Do you give support after delivery?",
    a: "Yes. Support can include fixes, improvements, deployment checks, updates, and guidance after launch depending on the project scope.",
  },
  {
    q: "How long does it take to build a website or app?",
    a: "Timeline depends on design, pages/screens, features, backend, integrations, and revisions. A simple website can be faster, while advanced apps or SaaS platforms take more planning and development time.",
  },
  {
    q: "Do you provide admin panel with mobile apps?",
    a: "Yes. Mobile app projects can include an admin panel for users, content, bookings, orders, reports, settings, and business controls.",
  },
  {
    q: "Do you help with SEO and digital marketing?",
    a: "Yes. Growblic can help with SEO Services, Google Ads Management, Meta Ads Management, and GMB Rating & Reviews.",
  },
  {
    q: "Can Growblic build custom SaaS platforms?",
    a: "Yes. Growblic can build custom SaaS platforms with login, dashboards, subscriptions, role-based access, admin controls, reports, and scalable backend APIs.",
  },
  {
    q: "Can you support after launch?",
    a: "Yes. Growblic can provide launch support, bug fixes, performance improvements, updates, and guidance based on the selected project plan.",
  },
  {
    q: "Can you build ecommerce websites?",
    a: "Yes. Growblic can build ecommerce websites with product catalog, cart, checkout, payment integration, offers, order management, admin panel, and SEO-ready pages.",
  },
  {
    q: "Can you build a restaurant website?",
    a: "Yes. Restaurant websites can include menu, table booking, online order, location/map, offers, gallery, reviews, WhatsApp enquiry, and admin update flow.",
  },
  {
    q: "Can you build a school app?",
    a: "Yes. School apps can include students, teachers, attendance, notices, homework, fees, timetable, reports, parent/student login, and admin panel.",
  },
  {
    q: "Can you build salon or barber apps?",
    a: "Yes. Salon/barber apps can include appointment booking, services, stylist/barber selection, time slots, offers, online payments, reminders, customer login, and business admin panel.",
  },
  {
    q: "Can you build real estate websites?",
    a: "Yes. Real estate websites can include property listings, filters, gallery, location, lead forms, WhatsApp enquiry, agent/admin panel, and SEO-ready pages.",
  },
  {
    q: "Can you build billing or GST software?",
    a: "Yes. Billing/GST software can include invoices, customers, products, tax, payment tracking, reports, and admin dashboard.",
  },
  {
    q: "Can you build HR or payroll systems?",
    a: "Yes. HR/payroll systems can include employees, attendance, salary, leaves, documents, reports, role-based access, and admin dashboard.",
  },
  {
    q: "Can you integrate payment gateways?",
    a: "Yes. Payment integration can include cart/checkout, payment gateway, order status, invoice/receipt, and admin tracking.",
  },
  {
    q: "Can you add login and OTP?",
    a: "Yes. Growblic can add email/phone login, OTP verification, secure sessions, user dashboard, and role-based access.",
  },
  {
    q: "Can you add WhatsApp enquiry?",
    a: "Yes. Growblic can add WhatsApp enquiry buttons, pre-filled messages, lead capture, and follow-up flows.",
  },
  {
    q: "Can you add animations to a website?",
    a: "Yes. Premium websites can include smooth animations, hero motion, hover effects, product/card animations, loading intro, 3D-style visuals, and micro-interactions.",
  },
  {
    q: "Do you provide cloud deployment?",
    a: "Yes. Growblic can help with GitHub Pages, Render, Vercel, Node.js APIs, PostgreSQL, HTTPS, environment variables, logs, backups, and launch checks.",
  },
  {
    q: "Does Growblic own datacenters?",
    a: "Growblic Datacenter means cloud-ready deployment planning. It does not mean physical datacenter ownership.",
  },
  {
    q: "How does pricing work?",
    a: "Pricing depends on pages/screens, design level, backend, admin panel, payment, integrations, timeline, and maintenance. Use the Price Calculator or Start Project page for better guidance.",
  },
  {
    q: "Can I get a price estimate?",
    a: "Yes. You can use the Price Calculator or share your project type, required features, timeline, and budget range through the Start Project page.",
  },
  {
    q: "How do I start a project with Growblic?",
    a: "You can start by sharing your idea, required features, timeline, and budget range through the Start Project page.",
  },
  {
    q: "Can Growblic redesign my existing website?",
    a: "Yes. Growblic can redesign an existing website with better UI/UX, performance, responsiveness, SEO-ready structure, and modern visuals.",
  },
  {
    q: "Can you build dashboards?",
    a: "Yes. Growblic can build dashboards for analytics, business operations, CRM, HR, billing, orders, leads, reports, and admin controls.",
  },
  {
    q: "Can Growblic build backend APIs?",
    a: "Yes. Growblic can build backend APIs for websites, apps, dashboards, SaaS platforms, admin panels, and integrations.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, INITIAL_FAQ_COUNT);

  function toggleFaqList() {
    setShowAllFaqs((current) => !current);
    setOpenIndex(null);
  }

  return (
    <section id="faqs" className="relative overflow-hidden px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="growblic-card-reveal mb-8 text-center">
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

        <div className="growblic-reveal-grid grid gap-4 md:grid-cols-2">
          {visibleFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <button
                type="button"
                key={faq.q}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                onFocus={() => setOpenIndex(index)}
                className={`group cursor-pointer overflow-hidden rounded-[1.7rem] border bg-white text-left shadow-lg shadow-blue-100/45 transition-all duration-300 ease-out ${
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
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={toggleFaqList}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-7 py-3 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/60 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700 hover:shadow-2xl hover:shadow-blue-100/80"
            aria-expanded={showAllFaqs}
          >
            {showAllFaqs ? "Show Less" : "See More Questions"}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        <div className="growblic-card-reveal relative mt-8 overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/90 p-6 shadow-xl shadow-blue-100/50 ring-1 ring-white/80 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_92%_100%,rgba(6,182,212,0.11),transparent_32%)]" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                Need custom help?
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">
                Tell us your idea, we will guide you.
              </h3>
            </div>

            <Link
              href="/start-project"
              className="relative rounded-full bg-slate-950 px-7 py-4 text-center text-sm font-black text-white shadow-xl shadow-slate-950/15 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
            >
              Start Project →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
