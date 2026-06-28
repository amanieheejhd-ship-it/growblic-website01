import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "./blogData";
import BlogFilterGrid from "./BlogFilterGrid";

export const metadata: Metadata = {
  title: "Growblic Blog | Software Product Guides",
  description:
    "Practical articles from Growblic on websites, mobile apps, SaaS platforms, dashboards, admin panels, and AI automation.",
};

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.slug === "custom-software") ?? blogPosts[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-5 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.13),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(124,58,237,0.10),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.12),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:78px_78px] opacity-35" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-700 shadow-sm shadow-blue-100/60">
              GROWBLIC BLOG
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Ideas, guides, and stories for building better digital products
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Practical software insights from Growblic on websites, mobile
              apps, SaaS platforms, dashboards, admin panels, and AI automation.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href="#recent-blogs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Read Latest Articles <ArrowRight size={17} />
              </a>
              <Link
                href="/#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-white px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
              >
                Start a Project
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-44 w-44 rounded-full bg-blue-200/45 blur-3xl" />
            <div className="absolute -right-6 bottom-8 h-52 w-52 rounded-full bg-violet-200/45 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-blue-100 bg-white/86 p-3 shadow-2xl shadow-blue-950/10 backdrop-blur sm:p-4">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-200/45 blur-3xl" />
              <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-blue-100 bg-[#fbfdff] shadow-xl shadow-blue-100/50">
                <div className="flex items-center justify-between border-b border-blue-100 bg-white/90 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                    Growblic Insights
                  </p>
                  <div className="h-7 w-7 rounded-full border border-blue-100 bg-blue-50" />
                </div>

                <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/50">
                    <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-cyan-100 blur-2xl" />
                    <div className="relative">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-blue-700">
                        Featured Guide
                      </span>
                      <h2 className="mt-5 max-w-sm text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                        Custom software for modern teams
                      </h2>
                      <p className="mt-3 text-sm font-black text-slate-500">5 min read</p>
                      <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-slate-600">
                        Practical ideas for turning messy operations into clear
                        workflow systems, dashboards, and launch-ready products.
                      </p>

                      <div className="mt-6 rounded-[1.25rem] border border-slate-100 bg-[#f8fbff] p-4">
                        <div className="flex items-end gap-2">
                          {[34, 58, 46, 74, 62, 88].map((height, index) => (
                            <span
                              key={`${height}-${index}`}
                              className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 via-cyan-400 to-violet-400"
                              style={{ height }}
                            />
                          ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="h-2 w-24 rounded-full bg-blue-100" />
                          <span className="h-2 w-16 rounded-full bg-cyan-100" />
                          <span className="h-2 w-20 rounded-full bg-violet-100" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      ["Mobile App UX", "Customer journeys"],
                      ["AI Automation", "Smarter workflows"],
                      ["Dashboard Systems", "Useful reporting"],
                    ].map(([title, description], index) => (
                      <div
                        key={title}
                        className="rounded-[1.35rem] border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-black leading-tight text-slate-950">
                              {title}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              {description}
                            </p>
                          </div>
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-xs font-black text-white ${
                              index === 0
                                ? "bg-blue-600"
                                : index === 1
                                  ? "bg-violet-600"
                                  : "bg-cyan-600"
                            }`}
                          >
                            0{index + 1}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <span className="h-2 rounded-full bg-blue-100" />
                          <span className="h-2 rounded-full bg-cyan-100" />
                          <span className="h-2 rounded-full bg-violet-100" />
                        </div>
                      </div>
                    ))}

                    <div
                      className="rounded-[1.35rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-4 shadow-sm shadow-blue-100/50"
                    >
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                          ["6", "Guides"],
                          ["8", "Services"],
                          ["100%", "Practical"],
                        ].map(([value, label]) => (
                          <div key={label} className="rounded-2xl bg-white/85 px-3 py-4">
                            <p className="text-xl font-black text-slate-950">{value}</p>
                            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="bg-white px-5 py-16 sm:px-6" />}>
        <BlogFilterGrid blogPosts={blogPosts} featuredPost={featuredPost} />
      </Suspense>

      <section id="blog-cta" className="bg-white px-5 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.1rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-2xl shadow-blue-950/10 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              Planning your next software project?
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Growblic can help you turn ideas into websites, apps, dashboards,
              SaaS products, and automation systems.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:mt-0">
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start a Project
            </Link>
            <Link
              href="/#apps"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
            >
              View Live Apps
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
