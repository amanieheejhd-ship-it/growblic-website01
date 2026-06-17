import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import SmoothScroll from "@/components/SmoothScroll";
import { Bot, Cloud, Code2, Smartphone } from "lucide-react";

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
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Services</p>
              <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
                End-to-end development for web, mobile, SaaS, and automation.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f6673]">
                Strategy, product design, production engineering, deployment, and support brought together under one
                careful build system.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Code", icon: Code2 },
                { label: "Mobile", icon: Smartphone },
                { label: "AI", icon: Bot },
                { label: "Cloud", icon: Cloud },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-[2rem] border border-blue-100/70 bg-[#fbfdff]/80 p-6 shadow-xl shadow-slate-900/6 backdrop-blur-xl">
                    <Icon className="text-blue-600" size={28} />
                    <p className="mt-12 text-2xl font-semibold text-[#111827]">{item.label}</p>
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
