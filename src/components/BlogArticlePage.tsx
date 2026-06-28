import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import Link from "next/link";
import { blogPosts, type BlogPost } from "@/app/blog/blogData";

const withBasePath = (path: string) => `/growblic-website01${path}`;

export default function BlogArticlePage({ post }: { post: BlogPost }) {
  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-5 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(124,58,237,0.10),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0),rgba(239,246,255,0.72))]" />
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white/90 px-4 py-2.5 text-sm font-black text-slate-950 shadow-xl shadow-blue-950/5 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
          >
            ← Back to Blog
          </Link>

          <div className="mt-9">
            <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
              <Link href="/" className="transition hover:text-blue-700">Growblic</Link>
              <span>/</span>
              <Link href="/blog" className="transition hover:text-blue-700">Blog</Link>
              <span>/</span>
              <span className="text-slate-950">{post.category}</span>
            </nav>

            <div className="mt-8 max-w-4xl">
              <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-blue-100/60">
                {post.category}
              </span>
              <h1 className="mt-5 text-balance text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
                {post.excerpt}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm font-black text-slate-500">
                <span>Growblic Guide</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} className="text-cyan-500" />
                  {post.readingTime}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>Software insights</span>
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-2 shadow-2xl shadow-blue-950/10 sm:rounded-[2.25rem] sm:p-3">
            <div className="relative min-h-[260px] overflow-hidden rounded-[1.55rem] bg-blue-50 sm:min-h-[430px] lg:min-h-[520px]">
              <img
                src={withBasePath(post.coverImage)}
                alt={post.title}
                className="h-full min-h-[260px] w-full object-cover sm:min-h-[430px] lg:min-h-[520px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article className="min-w-0">
            <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/70 p-6 shadow-xl shadow-blue-950/5 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                In this guide
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {post.summary.map((item) => (
                  <div key={item} className="rounded-2xl border border-blue-100 bg-white p-4 text-sm font-bold leading-6 text-slate-600 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              {post.sections.map((section, index) => (
                <section
                  key={section.heading}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${post.accent} text-xs font-black text-white shadow-lg shadow-blue-500/20`}>
                      0{index + 1}
                    </span>
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                        {section.heading}
                      </h2>
                      <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                        {section.body}
                      </p>
                      <h3 className="mt-7 text-lg font-black leading-tight text-slate-950">
                        What to pay attention to
                      </h3>
                      <p className="mt-3 text-base leading-8 text-slate-600">
                        For growing businesses, this part of the product should
                        connect strategy, user experience, and day-to-day
                        operations instead of living as a separate design idea.
                      </p>
                    </div>
                  </div>

                  {section.points && (
                    <div className="mt-7 grid gap-3">
                      {section.points.map((point) => (
                        <div
                          key={point}
                          className="flex gap-3 rounded-2xl border border-blue-100 bg-[#fbfdff] p-4 text-sm font-semibold leading-6 text-slate-600 sm:text-base"
                        >
                          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-blue-600" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {index === 1 && (
                    <div className="mt-7 rounded-[1.4rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5">
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">
                        Growblic note
                      </p>
                      <p className="mt-3 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                        The strongest digital products are planned around the
                        real workflow first, then shaped into clean screens,
                        reliable systems, and practical launch steps.
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </article>

          <aside className="grid gap-5 lg:sticky lg:top-8">
            <div className="rounded-[2rem] border border-blue-100 bg-[#fbfdff] p-6 shadow-2xl shadow-blue-950/10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Article summary
              </p>
              <div className="mt-5 grid gap-3">
                {post.summary.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-sm font-bold leading-6 text-slate-600">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Topics covered
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-blue-100 bg-[#fbfdff] px-3 py-1.5 text-xs font-black uppercase text-blue-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-[#fbfdff] p-6 shadow-xl shadow-blue-950/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Best for
              </p>
              <ul className="mt-5 grid gap-3">
                {post.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold leading-6 text-slate-600">
                    <span className={`mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r ${post.accent}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Start a Project
              </Link>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-xl shadow-blue-950/5">
              <p className="text-xl font-black leading-tight text-slate-950">
                Need this for your business?
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                Growblic can help turn this idea into a planned, designed, and
                launch-ready digital product.
              </p>
              <Link
                href="/#contact"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-950"
              >
                Start a Project
              </Link>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Related blogs
              </p>
              <div className="mt-5 grid gap-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.href}
                    className="group grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-100 bg-[#fbfdff] p-3 transition hover:border-blue-200 hover:bg-white"
                  >
                    <div className="relative h-20 overflow-hidden rounded-xl bg-blue-50">
                      <img
                        src={withBasePath(item.coverImage)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black leading-snug text-slate-950">
                        {item.title}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-2 text-xs font-black text-blue-700">
                        Read guide <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Keep reading
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950">
                Related product guides
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group overflow-hidden rounded-[1.8rem] border border-blue-100 bg-white shadow-xl shadow-blue-950/5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70"
              >
                <div className="relative h-44 bg-blue-50">
                  <img
                    src={withBasePath(item.coverImage)}
                    alt={item.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                    {item.category}
                  </p>
                  <h3 className="mt-3 text-lg font-black leading-snug text-slate-950">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-2xl shadow-blue-950/10 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-3xl font-black leading-tight text-slate-950">
              Ready to build something like this?
            </p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Growblic can help you plan, design, develop, and launch your next
              website, app, SaaS, dashboard, or automation system.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:mt-0">
            <Link href="/#contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700">
              Start a Project
            </Link>
            <Link href="/#apps" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700">
              View Live Apps
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
