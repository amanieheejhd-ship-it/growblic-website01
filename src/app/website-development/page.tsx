import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Globe2,
  Layers3,
  LayoutDashboard,
  MousePointerClick,
  SearchCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";

const heroPoints = [
  "Business websites",
  "Landing pages",
  "Service pages",
  "Responsive design",
];

const features = [
  {
    icon: Globe2,
    title: "Business websites",
    text: "Professional company websites with clear pages, strong service positioning, and trust-building layouts.",
    chips: ["Company profile", "Lead flow"],
  },
  {
    icon: MousePointerClick,
    title: "Landing pages",
    text: "Focused pages for ads, offers, campaigns, and enquiries with conversion-first section planning.",
    chips: ["Campaign ready", "CTA focused"],
  },
  {
    icon: Layers3,
    title: "Service pages",
    text: "Dedicated pages for each service so visitors understand what you offer and how to contact you.",
    chips: ["SEO structure", "Clear content"],
  },
  {
    icon: Smartphone,
    title: "Responsive design",
    text: "Layouts tested for mobile, tablet, and desktop so your website feels clean on every screen size.",
    chips: ["Mobile first", "Fast UI"],
  },
  {
    icon: SearchCheck,
    title: "SEO-ready structure",
    text: "Clean headings, metadata planning, sitemap-friendly pages, and content structure built for discoverability.",
    chips: ["Search ready", "Clean pages"],
  },
  {
    icon: BarChart3,
    title: "Lead-focused CTA sections",
    text: "Smart call-to-action blocks, forms, service highlights, and trust sections to help convert visitors.",
    chips: ["Enquiry flow", "Conversion"],
  },
];

export default function WebsiteDevelopmentPage() {
  return (
    <main className="relative overflow-hidden bg-[#f8fbff] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="pointer-events-none absolute left-0 top-0 h-[34rem] w-[34rem] rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-[34rem] w-[34rem] rounded-full bg-cyan-200/35 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-10 sm:pb-20 sm:pt-14">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-4 py-2 text-sm font-black text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.35em] text-blue-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Website Development
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[0.92] tracking-[-0.07em] text-slate-950 sm:text-7xl">
              Premium websites built to convert visitors into leads.
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
              Growblic designs and builds fast, responsive, SEO-ready websites
              that help businesses look professional, explain services clearly,
              and generate real enquiries.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {heroPoints.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-blue-100 bg-white/85 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200"
                >
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
                    0{index + 1}
                  </p>
                  <p className="mt-2 font-black text-slate-900">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start-project"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start Project
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/price-calculator"
                className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white/85 px-6 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
              >
                Estimate Budget
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-blue-200/45 via-cyan-200/30 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white/80 p-5 shadow-[0_35px_110px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-inner">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
                      Growblic Website OS
                    </p>
                    <h2 className="mt-2 text-2xl font-black">Conversion website system</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
                    SEO-ready
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-black">Page launch flow</p>
                      <Zap className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="mt-5 space-y-3">
                      {["Hero", "Services", "Trust", "Enquiry"].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3"
                        >
                          <span className="text-sm font-bold text-slate-200">{item}</span>
                          <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-black text-cyan-200">
                            0{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5">
                      <p className="text-sm font-bold text-slate-300">Lead sections</p>
                      <p className="mt-3 text-5xl font-black tracking-[-0.05em]">8+</p>
                      <div className="mt-4 h-2 rounded-full bg-white/10">
                        <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-5">
                      <p className="text-sm font-bold text-slate-300">Build quality</p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-black text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        Responsive ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 right-8 rounded-2xl border border-blue-100 bg-white px-5 py-4 text-xs font-black uppercase tracking-[0.3em] text-blue-600 shadow-[0_20px_55px_rgba(37,99,235,0.18)]">
                Scalable Build
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2.4rem] border border-blue-100 bg-white/72 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-6">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-600">
                What we build
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950">
                Website systems that feel premium
              </h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-slate-600">
              Every section is planned for clarity, trust, speed, and real enquiry generation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50/45 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_80px_rgba(37,99,235,0.13)]"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-200/35 blur-2xl transition group-hover:bg-blue-200/45" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white shadow-lg">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-2xl font-black tracking-[-0.035em] text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="relative mt-3 min-h-[4.5rem] text-sm font-semibold leading-6 text-slate-600">
                    {feature.text}
                  </p>

                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {feature.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-black text-slate-600"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-5 h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-[2.4rem] border border-slate-800/20 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.22),transparent_30%),linear-gradient(135deg,#020617,#172554)] p-8 text-white shadow-[0_34px_110px_rgba(15,23,42,0.24)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-300">
                Ready to build
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Let Growblic shape this into a real product.
              </h2>
              <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-300">
                From planning to UI, development, launch, and support — we can
                handle the complete website journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/start-project"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
              >
                Contact Growblic
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-white/15 px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
