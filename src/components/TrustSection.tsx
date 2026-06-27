const trustCards = [
  {
    title: "Product-first thinking",
    copy: "We build software with real business use cases, not just good-looking screens.",
  },
  {
    title: "Scalable development",
    copy: "Websites, apps, dashboards, and SaaS products built with future growth in mind.",
  },
  {
    title: "Launch support",
    copy: "From idea to deployment, we help with design, development, testing, and release.",
  },
];

export default function TrustSection() {
  return (
    <section className="growblic-trust-section bg-[#f7f9fd] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Why Growblic
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#050505] sm:text-6xl">
            Why businesses choose Growblic
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {trustCards.map((card) => (
            <div
              key={card.title}
              className="growblic-trust-card rounded-[1.75rem] border border-blue-100/80 bg-white p-7 shadow-xl shadow-slate-900/6"
            >
              <div className="mb-6 h-2 w-16 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500" />
              <h3 className="text-xl font-semibold text-slate-950">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {card.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
