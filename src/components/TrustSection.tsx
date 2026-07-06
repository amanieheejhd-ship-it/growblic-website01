const trustCards = [
  {
    number: "01",
    symbol: "P",
    title: "Product-first thinking",
    copy: "We build software around real business goals, not just attractive screens.",
  },
  {
    number: "02",
    symbol: "S",
    title: "Scalable development",
    copy: "Websites, apps, dashboards, and SaaS products are structured to grow with your business.",
  },
  {
    number: "03",
    symbol: "L",
    title: "Launch support",
    copy: "From planning to deployment, testing, and release, Growblic helps you move faster.",
  },
];

export default function TrustSection() {
  return (
    <section className="why-growblic-section relative overflow-hidden bg-[#f7f9fd] px-4 py-14 sm:px-6 sm:py-16 lg:py-24">
      <div className="why-growblic-glow pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="growblic-card-reveal max-w-3xl">
          <span className="inline-flex rounded-full border border-blue-100/80 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-600 shadow-lg shadow-blue-100/45 backdrop-blur">
            Why Growblic
          </span>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-5xl">
            Why businesses choose Growblic
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            We combine product strategy, clean design, and reliable engineering
            to build software that feels premium and works for real businesses.
          </p>
        </div>

        <div className="growblic-reveal-grid grid gap-5 md:grid-cols-3">
          {trustCards.map((card, index) => (
            <div
              key={card.title}
              className="why-growblic-card group relative flex h-full min-h-[250px] flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/82 p-6 shadow-xl shadow-blue-950/8 backdrop-blur-xl transition duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70"
            >
              <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100/70 blur-2xl transition duration-300 group-hover:bg-cyan-100/80" />

              <div className="relative flex items-center justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 text-sm font-black text-white shadow-xl shadow-blue-100/70">
                  {card.symbol}
                </span>
                <span className="rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-black text-blue-700">
                  {card.number}
                </span>
              </div>

              <h3 className="relative mt-8 text-xl font-semibold leading-tight text-slate-950">
                {card.title}
              </h3>
              <p className="relative mt-3 text-sm leading-6 text-slate-600">
                {card.copy}
              </p>

              <div className="relative mt-auto pt-6">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
                <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  0{index + 1} / Product care
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
