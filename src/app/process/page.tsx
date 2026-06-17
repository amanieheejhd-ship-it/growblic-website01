import BackButton from "../../components/BackButton";

const steps = [
  {
    title: "Understand",
    text: "We understand your idea, business goal, features, and user journey.",
  },
  {
    title: "Design",
    text: "We create clean UI, layout, product flow, and premium visual direction.",
  },
  {
    title: "Build",
    text: "We develop the website, app, SaaS, dashboard, or automation system.",
  },
  {
    title: "Launch",
    text: "We prepare the product for real users with responsive and smooth experience.",
  },
  {
    title: "Improve",
    text: "We support updates, fixes, new features, and long-term improvements.",
  },
];

export default function ProcessPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Process
            </p>

            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              From idea to launched product.
            </h1>

            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              Growblic follows a clean step-by-step process so your website,
              mobile app, SaaS product, or automation system is planned and built properly.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-5">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[2rem] border border-blue-100/70 bg-white p-6 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>
                <h2 className="mt-5 text-2xl font-black text-slate-950">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
