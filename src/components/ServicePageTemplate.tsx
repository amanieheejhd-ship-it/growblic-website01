import Image from "next/image";
import BackButton from "@/components/BackButton";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  points: string[];
};

export default function ServicePageTemplate({
  eyebrow,
  title,
  description,
  image,
  points,
}: Props) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 pb-16 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_4%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_84%_28%,rgba(6,182,212,0.11),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:86px_86px] opacity-35" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-blue-100 bg-[#fbfdff]/90 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-700 shadow-lg shadow-blue-100/60 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.8)]" />
                {eyebrow}
              </div>

              <h1 className="mt-6 max-w-4xl text-6xl font-black leading-[0.92] tracking-tight text-slate-950 md:text-8xl">
                {title}
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
                {description}
              </p>

              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
                {points.slice(0, 4).map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-100/70 bg-[#fbfdff]/88 p-4 shadow-lg shadow-slate-200/60 backdrop-blur transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl"
                  >
                    <span className="text-xs font-black text-blue-600">
                      0{index + 1}
                    </span>
                    <p className="mt-2 text-sm font-black text-slate-800">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-12 z-20 hidden rounded-2xl border border-blue-100/70 bg-[#fbfdff]/90 px-5 py-4 shadow-xl backdrop-blur lg:block">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  Premium UI
                </p>
              </div>

              <div className="absolute -right-6 bottom-16 z-20 hidden rounded-2xl border border-blue-100/70 bg-[#fbfdff]/90 px-5 py-4 shadow-xl backdrop-blur lg:block">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  Scalable Build
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[3.2rem] border border-blue-100/70 bg-[#fbfdff]/85 p-4 shadow-2xl shadow-blue-100/60 backdrop-blur-xl">
                <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

                <div className="relative h-[560px] overflow-hidden rounded-[2.55rem]">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="will-change-transform object-cover transition-transform duration-700 hover:scale-105"
                    priority
                    unoptimized
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/14 to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="rounded-[2rem] border border-white/20 bg-[#fbfdff]/15 p-6 text-white shadow-2xl backdrop-blur-xl">
                      <p className="text-xs font-black uppercase tracking-[0.28em] text-white/70">
                        Growblic solution
                      </p>
                      <h2 className="mt-3 text-5xl font-black tracking-tight">
                        {eyebrow}
                      </h2>
                      <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/75">
                        Clean design, reliable development, and business-ready product experience.
                      </p>

                      <div className="mt-5 h-2 w-28 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 rounded-[3rem] border border-blue-100/70 bg-[#fbfdff]/88 p-5 shadow-2xl shadow-slate-200/75 backdrop-blur-xl">
            <div className="grid gap-5 md:grid-cols-3">
              {points.map((item, index) => (
                <div
                  key={item}
                  className="group relative overflow-hidden rounded-[2rem] border border-blue-100/70 bg-[#fbfdff] p-7 shadow-xl shadow-slate-200/60 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100/80 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-xl">
                      0{index + 1}
                    </span>

                    <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
                      {item}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Built with a clean interface, strong structure, and practical business use in mind.
                    </p>

                    <div className="mt-6 h-1.5 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 ease-out group-hover:w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[3rem] border border-blue-100/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-2xl shadow-slate-300/70">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                  Ready to build
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                  Let Growblic shape this into a real product.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                  From planning to UI, development, launch, and support — we can handle the complete product journey.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href="/start-project"
                  className="rounded-full bg-[#fbfdff] px-7 py-4 text-sm font-black text-slate-950 shadow-xl transition-all duration-500 ease-out hover:-translate-y-1.5"
                >
                  Contact Growblic →
                </a>
                <a
                  href="/"
                  className="rounded-full border border-white/20 px-7 py-4 text-sm font-black text-white transition-all duration-500 ease-out hover:-translate-y-1.5 hover:bg-[#fbfdff]/10"
                >
                  Back Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
