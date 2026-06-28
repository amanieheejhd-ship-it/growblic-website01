import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Clock3, Layers3 } from "lucide-react";
import Link from "next/link";
import { blogPosts, type BlogPost } from "./blogData";

export const metadata: Metadata = {
  title: "Growblic Blog | Software Product Guides",
  description:
    "Guides from Growblic on websites, mobile apps, SaaS platforms, dashboards, admin panels, and AI automation for growing businesses.",
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

function HeroDashboardVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-blue-200/45 blur-3xl" />
      <div className="absolute -right-4 bottom-8 h-44 w-44 rounded-full bg-violet-200/45 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/90 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur sm:rounded-[2.25rem] sm:p-5">
        <div className="rounded-[1.65rem] border border-slate-100 bg-[#fbfdff] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Content dashboard
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                Product insights
              </p>
            </div>
            <div className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm">
              Growblic Guide
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.75fr]">
            <div className="rounded-[1.35rem] border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/45">
              <div className="flex gap-2">
                {["SaaS", "Apps", "AI"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-50 px-3 py-1 text-[0.65rem] font-black uppercase text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                <div className="h-3 w-4/5 rounded-full bg-slate-100" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[72, 54, 86].map((height, index) => (
                  <div key={height} className="flex h-24 items-end rounded-2xl bg-blue-50 p-2">
                    <div
                      className={`w-full rounded-xl bg-gradient-to-t ${
                        index === 1
                          ? "from-cyan-500 to-blue-400"
                          : "from-blue-600 to-violet-500"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {[
                ["5 min", "Read time"],
                ["6", "Guides"],
                ["3", "Focus areas"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm shadow-blue-100/50"
                >
                  <p className="text-xl font-black text-slate-950">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {["Software", "Dashboards", "Automation"].map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-3"
              >
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
                <p className="mt-3 text-sm font-black text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCardVisual({ post }: { post: BlogPost }) {
  const visualShell =
    "relative h-44 overflow-hidden rounded-[1.45rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-cyan-50 p-4";

  if (post.visualType === "mobile") {
    return (
      <div className={visualShell}>
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-200/60 blur-2xl" />
        <div className="relative mx-auto grid h-full max-w-[230px] grid-cols-2 items-end gap-3">
          {[0, 1].map((item) => (
            <div
              key={item}
              className={`rounded-[1.6rem] border border-slate-200 bg-slate-950 p-1.5 shadow-xl ${
                item === 0 ? "h-36" : "h-40"
              }`}
            >
              <div className="h-full rounded-[1.2rem] bg-white p-2">
                <div className={`h-14 rounded-2xl bg-gradient-to-br ${post.accent}`} />
                <div className="mt-3 grid gap-2">
                  <div className="h-2 rounded-full bg-slate-200" />
                  <div className="h-2 w-2/3 rounded-full bg-slate-100" />
                </div>
                <div className="mt-3 h-9 rounded-xl bg-blue-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (post.visualType === "dashboard") {
    return (
      <div className={visualShell}>
        <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-3">
          <div className="grid gap-2">
            {[64, 82, 48].map((width) => (
              <div key={width} className="rounded-2xl bg-white p-3 shadow-sm">
                <div className="h-2 rounded-full bg-slate-100">
                  <div className={`h-full rounded-full bg-gradient-to-r ${post.accent}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2 rounded-2xl bg-white/80 p-3">
            {[45, 70, 55, 88, 74].map((height) => (
              <div key={height} className="flex flex-1 items-end">
                <div className={`w-full rounded-t-xl bg-gradient-to-t ${post.accent}`} style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (post.visualType === "automation") {
    return (
      <div className={visualShell}>
        <div className="absolute left-8 right-8 top-1/2 h-px bg-blue-200" />
        <div className="absolute bottom-6 top-6 left-1/2 w-px bg-blue-200" />
        <div className={`absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br ${post.accent} text-xs font-black text-white shadow-xl`}>
          AI
        </div>
        {["Lead", "Reply", "Data", "Task"].map((item, index) => {
          const positions = ["left-4 top-5", "right-4 top-5", "bottom-5 left-5", "bottom-5 right-5"];
          return (
            <div key={item} className={`absolute ${positions[index]} rounded-2xl border border-blue-100 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-lg`}>
              {item}
            </div>
          );
        })}
      </div>
    );
  }

  if (post.visualType === "website") {
    return (
      <div className={visualShell}>
        <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-xl shadow-blue-100/50">
          <div className="flex gap-1.5 border-b border-slate-100 bg-[#fbfdff] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="grid gap-3 p-3">
            <div className={`h-16 rounded-2xl bg-gradient-to-br ${post.accent}`} />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 rounded-xl bg-blue-50" />
              <div className="h-10 rounded-xl bg-cyan-50" />
              <div className="h-10 rounded-xl bg-violet-50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (post.visualType === "admin") {
    return (
      <div className={visualShell}>
        <div className="grid h-full grid-cols-[0.75fr_1.25fr] gap-3">
          <div className="grid gap-2">
            {["Users", "Roles", "Logs"].map((item) => (
              <div key={item} className="rounded-2xl bg-white p-3 text-xs font-black text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="grid gap-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl bg-[#fbfdff] p-2">
                  <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${post.accent}`} />
                  <span className="h-2 flex-1 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={visualShell}>
      <div className="grid h-full gap-3">
        <div className="grid grid-cols-2 gap-3">
          {["CRM", "Flow", "Data", "Team"].map((item, index) => (
            <div key={item} className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
              <span className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${post.accent} text-[0.65rem] font-black text-white`}>
                0{index + 1}
              </span>
              <p className="mt-3 text-xs font-black text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedWorkflowVisual({ post }: { post: BlogPost }) {
  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-[1.8rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5">
      <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-violet-200/55 blur-3xl" />
      <div className="absolute -left-14 bottom-0 h-44 w-44 rounded-full bg-cyan-200/55 blur-3xl" />
      <div className="relative grid h-full gap-4">
        <div className="rounded-[1.4rem] border border-white bg-white/85 p-4 shadow-xl shadow-blue-100/50">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Workflow map
            </p>
            <Layers3 size={18} className="text-cyan-500" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Intake", "Roles", "Reports", "Automation"].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-blue-100 bg-[#fbfdff] p-3"
              >
                <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${post.accent} text-xs font-black text-white`}>
                  0{index + 1}
                </span>
                <p className="mt-3 text-sm font-black text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[76, 54, 88].map((width) => (
            <div key={width} className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
              <div className="h-2 rounded-full bg-slate-100">
                <div className={`h-full rounded-full bg-gradient-to-r ${post.accent}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.slug === "custom-software") ?? blogPosts[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-5 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.13),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(124,58,237,0.10),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.12),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:76px_76px] opacity-35" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-700 shadow-sm shadow-blue-100/60">
              GROWBLIC BLOG
            </p>
            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Insights for building better software products
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Guides on websites, mobile apps, SaaS platforms, dashboards,
              admin panels, and AI automation for growing businesses.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href="#recent-blogs"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore Blogs <ArrowRight size={17} />
              </a>
              <Link
                href="/#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-white px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
              >
                Start a Project
              </Link>
            </div>
          </div>

          <HeroDashboardVisual />
        </div>
      </section>

      <section className="bg-white px-5 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3">
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
            <article className="grid gap-6 overflow-hidden rounded-[2.1rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-cyan-50/70 p-5 shadow-2xl shadow-blue-950/10 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-blue-200 group-hover:shadow-blue-100/80 lg:grid-cols-[0.95fr_1.05fr] lg:p-7">
              <div className="flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm">
                    Featured Guide
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-slate-500">
                    <Clock3 size={16} className="text-cyan-500" />
                    {featuredPost.readingTime}
                  </span>
                </div>
                <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                  {featuredPost.category}
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
                  Custom software helps businesses build workflows that match
                  real operations, improve productivity, and scale without
                  limitations.
                </p>
                <p className="mt-7 inline-flex items-center gap-2 text-sm font-black text-blue-700">
                  Read featured guide
                  <ArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </div>

              <FeaturedWorkflowVisual post={featuredPost} />
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
                Practical guides for product growth
              </h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-7 text-slate-600">
              Explore focused thinking for software, mobile apps, dashboards,
              websites, admin panels, and automation systems.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={post.href}
                className="group block h-full rounded-[1.9rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <article className="flex h-full min-h-[440px] flex-col overflow-hidden rounded-[1.9rem] border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/5 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-blue-200 group-hover:shadow-2xl group-hover:shadow-blue-100/70">
                  <BlogCardVisual post={post} />

                  <div className="flex flex-1 flex-col p-2 pt-5">
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

      <section className="bg-white px-5 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.1rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-2xl shadow-blue-950/10 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              Need help turning an idea into software?
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Growblic can help you plan, design, build, and launch websites,
              apps, SaaS platforms, dashboards, and automation systems.
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
