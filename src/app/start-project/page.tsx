import BackButton from "../../components/BackButton";
import StartProjectForm from "../../components/StartProjectForm";

const options = [
  "Website or landing page",
  "Mobile app",
  "SaaS product",
  "CRM or dashboard",
  "AI automation",
  "Custom software",
];

export const metadata = {
  title: "Start a Project | Growblic",
  description:
    "Start your website, mobile app, SaaS, dashboard, CRM, or AI automation project with Growblic.",
};

export default function StartProjectPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-4 py-16 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_82%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl">
          <BackButton />

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600 sm:tracking-[0.34em]">
                Start a Project
              </p>

              <h1 className="mt-5 text-5xl font-black leading-[0.94] tracking-tight text-slate-950 sm:text-6xl md:text-8xl">
                Tell us what you want to build.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
                Share your idea, business problem, product requirement, or app concept.
                Growblic can help you plan, design, build, and launch it professionally.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {options.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-100/70 bg-white/90 p-4 text-sm font-black text-slate-700 shadow-lg shadow-blue-100/50"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <StartProjectForm />
          </div>
        </div>
      </section>
    </main>
  );
}
