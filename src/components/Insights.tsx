import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";

const insights = [
  {
    category: "Custom Software",
    title: "Why custom software is better than one-size-fits-all tools",
    description:
      "Purpose-built systems match your workflows, reduce manual work, and keep your team moving without workaround-heavy tools.",
    readTime: "4 min read",
    accent: "from-blue-500/18 via-cyan-400/14 to-violet-500/16",
  },
  {
    category: "Mobile Apps",
    title: "How mobile apps improve customer experience",
    description:
      "Well-designed apps make ordering, booking, tracking, and support feel faster for customers who expect everything on mobile.",
    readTime: "5 min read",
    accent: "from-cyan-400/18 via-blue-500/14 to-indigo-500/16",
  },
  {
    category: "Dashboards",
    title: "What every business dashboard should include",
    description:
      "The best dashboards bring revenue, users, operations, and alerts into one clean view for confident daily decisions.",
    readTime: "4 min read",
    accent: "from-violet-500/18 via-blue-500/14 to-cyan-400/16",
  },
  {
    category: "AI Automation",
    title: "How AI automation saves time for growing teams",
    description:
      "Automation can handle repetitive updates, reports, routing, and customer replies so teams can focus on higher-value work.",
    readTime: "6 min read",
    accent: "from-blue-500/16 via-violet-500/16 to-cyan-400/18",
  },
  {
    category: "Websites",
    title: "Why every business needs a scalable website",
    description:
      "A scalable website supports campaigns, content, products, integrations, and future features without constant rebuilds.",
    readTime: "3 min read",
    accent: "from-cyan-400/16 via-indigo-500/14 to-blue-500/18",
  },
  {
    category: "Operations",
    title: "How admin panels make operations easier",
    description:
      "Admin panels give teams practical control over users, content, orders, reports, and internal workflows in one place.",
    readTime: "4 min read",
    accent: "from-indigo-500/16 via-cyan-400/14 to-violet-500/18",
  },
];

export default function Insights() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_86%_16%,rgba(124,58,237,0.09),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0),rgba(239,246,255,0.38))]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-600 sm:text-sm">
              Insights
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Ideas, guides, and product thinking from Growblic
            </h2>
          </div>

          <p className="max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:justify-self-end">
            Learn how websites, apps, SaaS platforms, and automation systems
            help modern businesses grow.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => (
            <Link
              key={insight.title}
              href="#contact"
              aria-label={`Discuss insight: ${insight.title}`}
              className="group block h-full rounded-[1.75rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <article className="relative flex h-full min-h-[300px] overflow-hidden rounded-[1.75rem] border border-blue-100/80 bg-white p-6 shadow-xl shadow-slate-900/6 transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-blue-200 group-hover:shadow-2xl group-hover:shadow-blue-100/70">
                <div
                  className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${insight.accent}`}
                />
                <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-blue-100/80 bg-white/80 text-slate-950 shadow-lg shadow-blue-100/50 backdrop-blur transition duration-300 group-hover:bg-slate-950 group-hover:text-white">
                  <ArrowUpRight size={18} />
                </div>

                <div className="relative flex h-full w-full flex-col">
                  <span className="w-fit rounded-full border border-blue-100 bg-white/82 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-blue-100/70">
                    {insight.category}
                  </span>

                  <h3 className="mt-7 text-2xl font-black leading-tight tracking-tight text-slate-950">
                    {insight.title}
                  </h3>

                  <p className="mt-4 min-h-14 text-sm font-semibold leading-7 text-slate-600">
                    {insight.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-8 text-sm font-black text-slate-500">
                    <Clock3 size={16} className="text-cyan-500" />
                    {insight.readTime}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
