import type { Metadata } from "next";
import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "./blogData";

export const metadata: Metadata = {
  title: "Growblic Blog | Websites, Apps, SaaS & Automation Insights",
  description:
    "Practical guides from Growblic on websites, mobile apps, SaaS platforms, dashboards, custom software, and AI automation.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-5 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(124,58,237,0.10),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.12),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:76px_76px] opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-700 shadow-sm shadow-blue-100/60">
              GROWBLIC BLOG
            </p>
            <h1 className="mt-6 text-balance text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Insights for websites, apps, SaaS, and automation
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Practical guides from Growblic on building better digital products,
              business software, mobile apps, dashboards, and automation systems.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Software Development", "Mobile Apps", "AI Automation"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase text-blue-700 shadow-lg shadow-blue-100/60"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl rounded-[2.25rem] border border-blue-100 bg-white/74 p-3 shadow-2xl shadow-blue-950/10 backdrop-blur">
            <div className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 p-6 text-white sm:p-8">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />
              <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
              <div className="relative grid gap-5 md:grid-cols-3">
                {["Plan", "Build", "Grow"].map((item, index) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                    <span className="text-sm font-black text-cyan-200">0{index + 1}</span>
                    <p className="mt-4 text-2xl font-black">{item}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/70">
                      Product thinking for practical digital systems.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Recent Blogs
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Recent Blogs
              </h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-7 text-slate-600">
              Guides for teams planning websites, apps, dashboards, internal tools,
              and automation systems.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={post.href}
                className="group block h-full rounded-[1.8rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <article className="relative flex h-full min-h-[360px] overflow-hidden rounded-[1.8rem] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/5 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-blue-200 group-hover:shadow-2xl group-hover:shadow-blue-100/70">
                  <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-r ${post.accent} opacity-10`} />
                  <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-blue-100 bg-white/85 text-slate-950 shadow-lg shadow-blue-100/60 backdrop-blur transition group-hover:bg-slate-950 group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </div>

                  <div className="relative flex h-full flex-col">
                    <span className="w-fit rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm">
                      {post.category}
                    </span>
                    <h3 className="mt-7 text-2xl font-black leading-tight tracking-tight text-slate-950">
                      {post.title}
                    </h3>
                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-8 text-sm font-black text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 size={16} className="text-cyan-500" />
                        {post.readingTime}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{post.guideLabel}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
