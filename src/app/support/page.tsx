import BackButton from "../../components/BackButton";

const supportItems = [
  "Bug fixes",
  "Website updates",
  "App improvements",
  "Performance checks",
  "Feature upgrades",
  "Project guidance",
];

export default function SupportPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Support
            </p>

            <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Support that keeps your product running smoothly.
            </h1>

            <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-600">
              After launch, Growblic helps with updates, fixes, improvements,
              performance checks, new features, and long-term product care.
            </p>

            <a
              href="mailto:hello@growblic.com?subject=Growblic Support Request"
              className="mt-9 inline-flex rounded-full bg-gradient-to-r from-slate-950 to-blue-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-100/70 transition-all duration-500 ease-out hover:-translate-y-1.5"
            >
              Email Support →
            </a>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {supportItems.map((item, index) => (
              <div
                key={item}
                className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>
                <h2 className="mt-4 text-2xl font-black text-slate-950">
                  {item}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Quick and clean support for your website, app, dashboard, or SaaS product.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
