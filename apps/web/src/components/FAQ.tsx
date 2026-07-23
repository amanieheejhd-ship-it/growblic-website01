"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Expo-out — the entrance easing used across the site.
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Only the first N questions render on the homepage; the data below stays
// intact as the single source.
const FAQ_VISIBLE_COUNT = 5;

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

type FAQProps = {
  onStartProject?: () => void;
};

// Minimal two-column FAQ: a large left-aligned heading and a plain right-hand
// question list — typography, thin dividers, and chevrons on the open
// background. No card or pill surfaces.
export default function FAQ({ onStartProject }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const visibleFaqs = faqs.slice(0, FAQ_VISIBLE_COUNT);

  const list: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
    },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: EXPO_OUT },
    },
  };

  return (
    <section id="faqs" className="relative px-4 py-16 sm:px-6 sm:py-20">
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={list}
        className="mx-auto grid max-w-[1800px] gap-10 md:grid-cols-[1fr_2fr] md:gap-14 xl:gap-24"
      >
        {/* Left column: eyebrow + large multi-line heading + muted subtitle. */}
        <motion.div
          variants={rise}
          className="motion-reduce:transform-none! motion-reduce:opacity-100!"
        >
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600 sm:tracking-[0.34em]">
            FAQs
          </p>

          <h2 className="mt-4 max-w-[11ch] break-words text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-6xl">
            Frequently asked questions
          </h2>

          <p className="mt-5 max-w-sm text-sm font-semibold leading-6 text-slate-500">
            Quick answers before starting your project with Growblic.
          </p>
        </motion.div>

        {/* Right column: plain rows with thin dividers — no surfaces. */}
        <div>
          {visibleFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.q}
                variants={rise}
                className="motion-reduce:transform-none! motion-reduce:opacity-100! border-b border-slate-200/80"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left outline-none transition-colors duration-300 hover:text-blue-700 focus-visible:rounded-lg focus-visible:ring-4 focus-visible:ring-blue-100 sm:py-6"
                >
                  <span className="min-w-0 break-words text-base font-bold leading-snug text-slate-950 sm:text-lg">
                    {faq.q}
                  </span>

                  <ChevronDown
                    aria-hidden
                    className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Smooth expand/collapse via the grid-rows trick. */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-3xl pb-6 text-sm font-semibold leading-7 text-slate-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Kept: the contact-flow entry point (reveals the homepage contact
              section) — restyled to sit quietly under the list. */}
          <motion.div
            variants={rise}
            className="motion-reduce:transform-none! motion-reduce:opacity-100! flex flex-col gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm font-semibold text-slate-500">
              Need custom help? Tell us your idea, we will guide you.
            </p>
            <button
              type="button"
              onClick={onStartProject}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Project →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
