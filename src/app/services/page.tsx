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
        <section className="relative overflow-hidden bg-[#fbfdff] px-6 py-20">
          <div className="aurora absolute inset-0 opacity-60" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">Services</p>
              <h1 className="mt-4 max-w-4xl text-balance text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
                Business-focused services for building and growing digital products.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
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
                  <div key={item.label} className="rounded-[2rem] border border-blue-100/70 bg-[#fbfdff]/88 p-6 shadow-xl shadow-slate-900/6 backdrop-blur-xl">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-blue-600 shadow-lg shadow-blue-100/70">
                      <Icon size={24} />
                    </span>
                    <p className="mt-10 text-2xl font-black text-slate-950">{item.label}</p>
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
