const trustCards = [
  {
    title: "Real product experience",
    text: "We build websites, dashboards, mobile apps, SaaS products, and business tools with production-ready thinking.",
  },
  {
    title: "Clean UI + scalable code",
    text: "Every product is designed to look premium and built so it can grow with your business.",
  },
  {
    title: "Business-first approach",
    text: "We do not only create pages. We understand your workflow, customers, and growth goals before development.",
  },
];

const industries = [
  "Education",
  "Healthcare",
  "Fintech",
  "Laundry",
  "E-commerce",
  "Real Estate",
  "Events",
  "Local Business",
];

const steps = [
  "Understand",
  "Design",
  "Build",
  "Launch",
  "Improve",
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              Why choose Growblic
            </p>

            <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              A trusted software partner for serious digital products.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Growblic helps businesses turn ideas into clean, fast, and scalable
              digital products — from websites and mobile apps to dashboards,
              SaaS platforms, automation, and growth systems.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {industries.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {trustCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_80px_rgba(15,23,42,0.10)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)] sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                Our process
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-5">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="text-sm text-slate-300">0{index + 1}</p>
                    <p className="mt-2 font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 text-slate-950">
              <p className="text-sm font-semibold text-slate-500">
                Client-ready mindset
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                Have an idea? Let’s turn it into a product.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Share your business idea, app requirement, or website plan. We
                will help you shape it into a clean digital solution.
              </p>

              <a
                href="/growblic-website01/start-project"
                className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start your project →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
