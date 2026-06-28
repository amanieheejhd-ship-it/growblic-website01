import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "./blogData";

export const metadata: Metadata = {
  title: "Growblic Blog | Software Product Guides",
  description:
    "Practical articles from Growblic on websites, mobile apps, SaaS platforms, dashboards, admin panels, and AI automation.",
};

const categoryChips = [
  "All",
  "Software",
  "Mobile Apps",
  "Dashboards",
  "AI Automation",
  "Website",
  "Admin Panels",
];

const withBasePath = (path: string) => `/growblic-website01${path}`;

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.slug === "custom-software") ?? blogPosts[0];
  const collagePosts = blogPosts.slice(0, 3);

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
            <div className="relative rounded-[2.2rem] border border-blue-100 bg-white/82 p-3 shadow-2xl shadow-blue-950/10 backdrop-blur sm:p-4">
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="relative min-h-[290px] overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white shadow-xl shadow-blue-100/50 sm:min-h-[360px]">
                  <img
                    src={withBasePath(featuredPost.coverImage)}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 rounded-[1.35rem] border border-white/70 bg-white/82 p-4 shadow-xl shadow-blue-950/10 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                      Featured newsroom guide
                    </p>
                    <p className="mt-2 text-lg font-black leading-tight text-slate-950">
                      {featuredPost.title}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {collagePosts.map((post) => (
                    <div
                      key={post.slug}
                      className="relative min-h-[110px] overflow-hidden rounded-[1.4rem] border border-blue-100 bg-white shadow-lg shadow-blue-100/40 sm:min-h-[116px]"
                    >
                      <img
                        src={withBasePath(post.coverImage)}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 border-y border-blue-100/70 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {["6 Practical Guides", "8 Service Areas", "Product Thinking", "Growblic Insights"].map((item) => (
              <div key={item} className="rounded-2xl border border-blue-100 bg-[#fbfdff] px-4 py-3 text-sm font-black text-slate-700 shadow-sm shadow-blue-100/50">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categoryChips.map((category, index) => (
              <span
                key={category}
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] shadow-sm ${
                  index === 0
                    ? "border-slate-950 bg-slate-950 text-white shadow-slate-950/10"
                    : "border-blue-100 bg-[#fbfdff] text-blue-700 shadow-blue-100/60"
                }`}
              >
                {category}
              </span>
            ))}
          </div>

          <Link
            href={featuredPost.href}
            className="group mt-8 block rounded-[2.1rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <article className="grid overflow-hidden rounded-[2.1rem] border border-blue-100 bg-white shadow-2xl shadow-blue-950/10 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-blue-200 group-hover:shadow-blue-100/80 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[280px] bg-[#f8fbff] lg:min-h-[430px]">
                <img
                  src={withBasePath(featuredPost.coverImage)}
                  alt={featuredPost.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                    Featured Guide
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-black text-slate-500">
                    <CalendarDays size={16} className="text-blue-500" />
                    {featuredPost.displayDate}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-black text-slate-500">
                    <Clock3 size={16} className="text-cyan-500" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                  {featuredPost.category}
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                  {featuredPost.excerpt}
                </p>
                <p className="mt-7 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                  Read featured guide
                  <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </div>
            </article>
          </Link>
        </div>
      </section>

      <section id="recent-blogs" className="bg-white px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Recent Blogs
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                Latest articles from Growblic
              </h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-7 text-slate-600">
              Guides for business owners, teams, and founders planning websites,
              apps, dashboards, and automation systems.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={post.href}
                className="group block h-full rounded-[1.9rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <article className="flex h-full min-h-[500px] flex-col overflow-hidden rounded-[1.9rem] border border-blue-100 bg-white shadow-xl shadow-blue-950/5 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-blue-200 group-hover:shadow-2xl group-hover:shadow-blue-100/70">
                  <div className="relative h-56 overflow-hidden bg-blue-50">
                    <img
                      src={withBasePath(post.coverImage)}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="w-fit rounded-full border border-blue-100 bg-[#fbfdff] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                        {post.category}
                      </span>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-blue-100 bg-white text-slate-950 shadow-sm transition group-hover:bg-slate-950 group-hover:text-white">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-black leading-tight tracking-tight text-slate-950">
                      {post.title}
                    </h3>
                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-7 text-sm font-black text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} className="text-blue-500" />
                        {post.displayDate}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="inline-flex items-center gap-2">
                        <Clock3 size={16} className="text-cyan-500" />
                        {post.readTime}
                      </span>
                    </div>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                      Read article
                      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 sm:px-6 sm:pb-20">
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
