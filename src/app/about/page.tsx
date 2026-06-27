import BackButton from "../../components/BackButton";

const values = [
  "Premium UI design",
  "Modern web development",
  "Mobile app experience",
  "SaaS product thinking",
  "AI automation systems",
  "Long-term support",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.07),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                About Growblic
              </p>

              <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
                We build premium software for modern businesses.
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
                Growblic is a software development company focused on websites,
                mobile apps, SaaS products, dashboards, automation systems, and
                clean digital experiences that help businesses grow.
              </p>
            </div>

            <div className="rounded-[3rem] border border-blue-100/70 bg-white/90 p-5 shadow-2xl shadow-blue-100/60 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950 p-8 text-white">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-400/25 blur-3xl" />
                <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

                <div className="relative">
                  <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full shadow-xl">
                    <img
                      src="/growblic-website01/images/brand/growblic-logo.png"
                      alt="Growblic"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </span>

                  <p className="mt-10 text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
                    Company engine
                  </p>

                  <h2 className="mt-4 text-5xl font-black tracking-tight">
                    Design. Build. Launch.
                  </h2>

                  <p className="mt-5 max-w-md text-base leading-7 text-white/70">
                    From idea to product, Growblic creates smooth and scalable
                    digital solutions with premium frontend experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {values.map((item, index) => (
              <div
                key={item}
                className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-2xl font-black text-slate-950">
                  {item}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Built with clean structure, business focus, and premium visual quality.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
