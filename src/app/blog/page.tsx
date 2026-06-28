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
