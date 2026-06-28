"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Clock3,
  Grid3X3,
  Layers3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BlogPost } from "./blogData";

type CategoryOption = {
  label: string;
  slug: string;
  match?: string;
};

const categoryOptions: CategoryOption[] = [
  { label: "All", slug: "all" },
  { label: "Software", slug: "software", match: "Software Development" },
  { label: "Mobile Apps", slug: "mobile-apps", match: "Mobile Apps" },
  { label: "Dashboards", slug: "dashboards", match: "Dashboards" },
  { label: "AI Automation", slug: "ai-automation", match: "AI Automation" },
  { label: "Website", slug: "website", match: "Website Development" },
  { label: "Admin Panels", slug: "admin-panels", match: "Admin Panels" },
];

const withBasePath = (path: string) => `/growblic-website01${path}`;

function formatCategoryForSentence(label: string) {
  return label === "Website" ? "website" : label.toLowerCase();
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function BlogFilterGrid({
  blogPosts,
  featuredPost,
}: {
  blogPosts: BlogPost[];
  featuredPost: BlogPost;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get("category") ?? "all";
  const activeOption =
    categoryOptions.find((option) => option.slug === selectedParam) ?? categoryOptions[0];
  const isAll = activeOption.slug === "all";

  const serviceAreaCount = useMemo(
    () => new Set(blogPosts.map((post) => post.category)).size,
    [blogPosts],
  );

  const filteredPosts = useMemo(() => {
    if (isAll || !activeOption.match) {
      return blogPosts;
    }

    return blogPosts.filter((post) => post.category === activeOption.match);
  }, [activeOption.match, blogPosts, isAll]);

  const updateCategory = (slug: string, scrollTarget = "recent-blogs") => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
    window.requestAnimationFrame(() => scrollTo(scrollTarget));
  };

  const statCards = [
    {
      icon: Grid3X3,
      value: String(blogPosts.length),
      title: "Practical Guides",
      description: "Explore all articles",
      action: () => updateCategory("all"),
    },
    {
      icon: Layers3,
      value: String(serviceAreaCount),
      title: "Service Areas",
      description: "Browse by category",
      action: () => scrollTo("blog-categories"),
    },
    {
      icon: BarChart3,
      value: "Product",
      title: "Thinking",
      description: "Strategy guides for teams",
      action: () => updateCategory("software"),
    },
    {
      icon: Sparkles,
      value: "Growblic",
      title: "Insights",
      description: "Ideas for better software",
      action: () => scrollTo("blog-cta"),
    },
  ];

  return (
    <>
      <section className="bg-white px-5 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 border-y border-blue-100/70 py-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={`${card.value}-${card.title}`}
                  type="button"
                  onClick={card.action}
                  className="group cursor-pointer rounded-2xl border border-blue-100 bg-[#fbfdff] px-4 py-4 text-left shadow-sm shadow-blue-100/50 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-100/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm shadow-blue-100/60 transition group-hover:bg-slate-950 group-hover:text-white">
                      <Icon size={18} />
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-700"
                    />
                  </div>
                  <p className="mt-4 text-3xl font-black leading-none text-slate-950">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm font-black text-slate-800">{card.title}</p>
                  <p className="mt-2 text-sm font-bold text-blue-700">{card.description} →</p>
                </button>
              );
            })}
          </div>

          <div
            id="blog-categories"
            className="-mx-5 mt-6 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          >
            {categoryOptions.map((category) => {
              const active = category.slug === activeOption.slug;

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => updateCategory(category.slug)}
                  className={`inline-flex shrink-0 items-center justify-center rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] shadow-sm transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white shadow-slate-950/15"
                      : "border-blue-100 bg-[#fbfdff] text-blue-700 shadow-blue-100/60 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <Link
            id="featured-guide"
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
                  <ArrowUpRight
                    size={17}
                    className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </p>
              </div>
            </article>
          </Link>
        </div>
      </section>

      <section id="recent-blogs" className="bg-white px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Recent Blogs
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                {isAll ? "Latest articles from Growblic" : `${activeOption.label} articles`}
              </h2>
              <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                {isAll
                  ? `Showing all ${blogPosts.length} practical guides`
                  : `Showing ${filteredPosts.length} guide${
                      filteredPosts.length === 1 ? "" : "s"
                    } for ${formatCategoryForSentence(activeOption.label)}`}
              </p>
            </div>

            {!isAll && (
              <button
                type="button"
                onClick={() => updateCategory("all")}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white px-5 py-2 text-sm font-black text-blue-700 shadow-sm shadow-blue-100/60 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:self-end"
              >
                Clear filter
              </button>
            )}
          </div>

          {filteredPosts.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
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
          ) : (
            <div className="mt-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-8 text-center shadow-xl shadow-blue-950/5">
              <p className="text-2xl font-black text-slate-950">No guides found</p>
              <p className="mt-3 text-base font-semibold text-slate-600">Try another category</p>
              <button
                type="button"
                onClick={() => updateCategory("all")}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                View all guides
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
