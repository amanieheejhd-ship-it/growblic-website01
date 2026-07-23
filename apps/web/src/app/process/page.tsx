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
    <main className="min-h-screen overflow-hidden">
      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-[1800px] min-w-0">
          <BackButton />

          <div className="mt-8 max-w-4xl min-w-0 sm:mt-10">
            <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.28em]">
              Process
            </p>

            <h1 className="mt-5 break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
              From idea to launched product.
            </h1>

            <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              Growblic follows a clean step-by-step process so your website,
              mobile app, SaaS product, or automation system is planned and built properly.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="min-w-0 rounded-[1.5rem] border border-blue-100/70 bg-white p-5 sm:rounded-[2rem] sm:p-6 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>
                <h2 className="mt-5 break-words text-xl font-black text-slate-950 sm:text-2xl">
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
