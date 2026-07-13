import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import SmoothScroll from "@/components/SmoothScroll";
import { Bot, Cloud, Code2, Smartphone } from "lucide-react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Services - Website, App, SaaS and AI Automation Development",
  description:
    "Explore Growblic services for website development, custom software, mobile apps, SaaS products, dashboards, SEO, ads, and AI automation systems.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="pt-28">
        <section className="relative overflow-hidden bg-[#fbfdff] px-4 py-16 sm:px-6 sm:py-20">
          <div className="aurora absolute inset-0 opacity-60" />
          <div className="relative mx-auto grid max-w-7xl min-w-0 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">Services</p>
              <h1 className="mt-4 max-w-4xl break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Business-focused services for building and growing digital products.
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Growblic helps you plan, design, build, launch, and grow websites, apps,
                SaaS platforms, automations, and marketing systems with a clean product-first approach.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Software", detail: "Custom business systems", icon: Code2 },
                { label: "Mobile Apps", detail: "Polished customer journeys", icon: Smartphone },
                { label: "Automation", detail: "AI-powered workflows", icon: Bot },
                { label: "Launch", detail: "Deployment and growth support", icon: Cloud },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="min-w-0 rounded-[1.5rem] border border-blue-100/70 bg-[#fbfdff]/88 p-5 shadow-xl shadow-slate-900/6 backdrop-blur-xl sm:rounded-[2rem] sm:p-6">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-600 shadow-lg shadow-blue-100/70">
                      <Icon size={24} />
                    </span>
                    <p className="mt-8 break-words text-xl font-black text-slate-950 sm:mt-10 sm:text-2xl">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <Services />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
