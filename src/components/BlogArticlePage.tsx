import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import Link from "next/link";
import { blogPosts, type BlogPost } from "@/app/blog/blogData";

function BlogHeroVisual({ post }: { post: BlogPost }) {
  const baseCard = "rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-xl shadow-blue-950/10 backdrop-blur";

  if (post.visualType === "software") {
    return (
      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <div className={baseCard}>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Workflow modules</p>
          <div className="mt-5 grid gap-3">
            {["Lead intake", "Approval", "Reporting", "Automation"].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#fbfdff] p-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${post.accent} text-xs font-black text-white`}>
                  0{index + 1}
                </span>
                <span className="text-sm font-black text-slate-950">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`${baseCard} grid min-h-[260px] place-items-center`}>
          <div className="relative h-64 w-full max-w-md">
            <div className={`absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.5rem] bg-gradient-to-br ${post.accent} text-xs font-black text-white shadow-xl`}>
              Core
            </div>
            {["CRM", "Data", "Team", "Tasks"].map((item, index) => {
              const positions = ["left-0 top-8", "right-0 top-8", "bottom-8 left-4", "bottom-8 right-4"];
              return (
                <div key={item} className={`absolute ${positions[index]} rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-lg`}>
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (post.visualType === "mobile") {
    return (
      <div className="grid gap-4 md:grid-cols-3 md:items-center">
        {["Browse", "Book", "Track"].map((item, index) => (
          <div key={item} className={`${baseCard} ${index === 1 ? "md:min-h-[360px]" : "md:min-h-[300px]"}`}>
            <div className="mx-auto max-w-[180px] rounded-[2rem] border border-slate-200 bg-slate-950 p-2 shadow-2xl shadow-blue-100/60">
              <div className="overflow-hidden rounded-[1.5rem] bg-white p-3">
                <div className={`h-24 rounded-[1.2rem] bg-gradient-to-br ${post.accent}`} />
                <div className="mt-4 grid gap-2">
                  <div className="h-3 rounded-full bg-slate-200" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                </div>
                <div className="mt-5 grid gap-2">
                  <div className="h-14 rounded-2xl bg-blue-50" />
                  <div className="h-14 rounded-2xl bg-cyan-50" />
                </div>
              </div>
            </div>
            <p className="mt-5 text-center text-sm font-black text-slate-950">{item}</p>
          </div>
        ))}
      </div>
    );
  }

  if (post.visualType === "dashboard") {
    return (
      <div className={baseCard}>
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-3">
            {["Sales", "Leads", "Operations"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-slate-100 bg-[#fbfdff] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-slate-950">{item}</p>
                  <span className="text-xs font-black text-blue-700">+{18 + index * 7}%</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <div className={`h-full rounded-full bg-gradient-to-r ${post.accent}`} style={{ width: `${58 + index * 14}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-5">
            <div className="grid grid-cols-4 items-end gap-3">
              {[44, 62, 55, 78, 70, 88, 76, 94].map((height, index) => (
                <div key={`${height}-${index}`} className="flex h-52 items-end rounded-2xl bg-white/70 p-2">
                  <div className={`w-full rounded-xl bg-gradient-to-t ${post.accent}`} style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (post.visualType === "automation") {
    return (
      <div className={`${baseCard} min-h-[340px]`}>
        <div className="relative mx-auto h-[320px] max-w-4xl">
          <div className={`absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br ${post.accent} text-sm font-black text-white shadow-2xl shadow-blue-500/25`}>
            AI Flow
          </div>
          <div className="absolute left-8 right-8 top-1/2 h-px bg-blue-100" />
          <div className="absolute bottom-10 top-10 left-1/2 w-px bg-blue-100" />
          {["Lead", "Reply", "Report", "Notify", "Route", "Review"].map((item, index) => {
            const positions = [
              "left-0 top-8",
              "right-0 top-8",
              "left-8 bottom-8",
              "right-8 bottom-8",
              "left-[18%] top-1/2 -translate-y-1/2",
              "right-[18%] top-1/2 -translate-y-1/2",
            ];
            return (
              <div key={item} className={`absolute ${positions[index]} rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-xl shadow-blue-100/70`}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (post.visualType === "website") {
    return (
      <div className={baseCard}>
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-blue-100/50">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-[#fbfdff] px-5 py-4">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className={`min-h-[250px] rounded-[1.5rem] bg-gradient-to-br ${post.accent} p-6 text-white`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Scalable website</p>
              <h3 className="mt-5 max-w-sm text-4xl font-black leading-tight">Brand, SEO, leads, and future growth.</h3>
            </div>
            <div className="grid gap-3">
              <div className="h-20 rounded-2xl bg-blue-50" />
              <div className="h-20 rounded-2xl bg-cyan-50" />
              <div className="h-20 rounded-2xl bg-violet-50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={baseCard}>
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-[#fbfdff] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Control panel</p>
          <div className="mt-5 grid gap-3">
            {["Users", "Orders", "Reports", "Settings"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
                <span className="text-sm font-black text-slate-950">{item}</span>
                <span className={`h-3 w-10 rounded-full bg-gradient-to-r ${post.accent}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Role access", "Status queues", "Content tools", "Daily reports"].map((item, index) => (
            <div key={item} className="rounded-[1.4rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-lg shadow-blue-100/40">
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${post.accent} text-xs font-black text-white`}>
                0{index + 1}
              </span>
              <p className="mt-5 text-lg font-black text-slate-950">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

          <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
                <Link href="/" className="transition hover:text-blue-700">Growblic</Link>
                <span>/</span>
                <Link href="/blog" className="transition hover:text-blue-700">Blog</Link>
                <span>/</span>
                <span className="text-slate-950">{post.category}</span>
              </nav>

              <div className="mt-8">
                <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-blue-100/60">
                  {post.category}
                </span>
                <h1 className="mt-5 text-balance text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
                  {post.excerpt}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600">
                    <Clock3 size={16} className="text-cyan-500" />
                    {post.readingTime}
                  </span>
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase text-blue-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-white/90 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Article summary</p>
              <div className="mt-5 grid gap-3">
                {post.summary.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-slate-100 bg-[#fbfdff] p-3 text-sm font-bold leading-6 text-slate-600">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-12">
            <div className={`relative overflow-hidden rounded-[2.25rem] border border-blue-100 bg-gradient-to-br ${post.accent} p-[1px] shadow-2xl shadow-blue-950/10`}>
              <div className="rounded-[2.2rem] bg-white/76 p-3 backdrop-blur sm:p-5">
                <BlogHeroVisual post={post} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <article className="grid gap-5">
            {post.sections.map((section) => (
              <section key={section.heading} className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-8">
                <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${post.accent}`} />
                <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{section.heading}</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">{section.body}</p>
                {section.points && (
                  <div className="mt-6 grid gap-3">
                    {section.points.map((point) => (
                      <div key={point} className="flex gap-3 rounded-2xl border border-blue-100 bg-[#fbfdff] p-4 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-blue-600" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </article>

          <aside className="grid gap-5 lg:sticky lg:top-8">
            <div className="rounded-[2rem] border border-blue-100 bg-[#fbfdff] p-6 shadow-2xl shadow-blue-950/10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Best for</p>
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

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Related blogs</p>
              <div className="mt-5 grid gap-3">
                {relatedPosts.map((item) => (
                  <Link key={item.slug} href={item.href} className="group rounded-2xl border border-slate-100 bg-[#fbfdff] p-4 transition hover:border-blue-200 hover:bg-white">
                    <p className="text-sm font-black leading-snug text-slate-950">{item.title}</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-xs font-black text-blue-700">
                      Read guide <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-10 max-w-6xl rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 p-6 shadow-2xl shadow-blue-950/10 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-3xl font-black leading-tight text-slate-950">
              Ready to build something like this?
            </p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Growblic can help you plan, design, develop, and launch your next website, app, SaaS, dashboard, or automation system.
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
