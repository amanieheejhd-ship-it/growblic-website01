import Image from "next/image";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import { companyApps } from "../../../data/companyApps";

const app = companyApps.find((item) => item.slug === "fresh-fade")!;

export const metadata = {
  title: "Fresh Fade | Growblic App",
  description:
    "Fresh Fade is a barber booking app by Growblic for appointments, nearby barbers, chat, calls, live location, distance calculation, profiles, services, and reviews.",
};

export default function FreshFadePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(234,179,8,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                {app.category}
              </p>

              <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
                {app.name}
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
                {app.description}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={app.playStore}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gradient-to-r from-slate-950 to-blue-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-100/70 transition-all duration-500 ease-out hover:-translate-y-1.5"
                >
                  Open on Play Store →
                </a>

                <Link
                  href="/"
                  className="rounded-full border border-blue-100 bg-white px-8 py-4 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/50"
                >
                  Back to Website
                </Link>
              </div>
            </div>

            <div className="rounded-[3rem] border border-blue-100/70 bg-white/90 p-5 shadow-2xl shadow-blue-100/60 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-8">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-yellow-200/60 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-blue-200/50 blur-3xl" />

                <div className="relative">
                  <span className="relative mx-auto grid h-36 w-36 place-items-center overflow-hidden rounded-[2.2rem] bg-white shadow-2xl shadow-blue-100">
                    <Image
                      src={app.logo}
                      alt={app.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>

                  <div className="mt-10 rounded-[2rem] border border-blue-100/70 bg-white/85 p-6 text-center shadow-xl shadow-blue-100/50">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                      App Status
                    </p>

                    <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                      {app.status}
                    </h2>

                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-500">
                      Smart barber booking application for quick appointments and nearby barber discovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                Key Features
              </p>

              <h2 className="mt-4 max-w-4xl text-5xl font-black tracking-tight text-slate-950">
                Built for simple barber booking.
              </h2>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {app.features.map((feature, index) => (
                  <div
                    key={feature}
                    className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
                  >
                    <span className="text-sm font-black text-blue-600">
                      0{index + 1}
                    </span>

                    <h3 className="mt-4 text-2xl font-black text-slate-950">
                      {feature}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      A booking feature designed to make finding and connecting with barbers simple and fast.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-blue-100/70 bg-white p-8 shadow-2xl shadow-blue-100/60">
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                App Info
              </p>

              <div className="mt-8 space-y-4">
                {app.info.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-100/70 bg-blue-50/50 px-5 py-4 text-sm font-black text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                  About this app
                </p>

                <p className="mt-4 text-sm font-semibold leading-7 text-white/75">
                  Fresh Fade lets users book barbers, chat directly, share images,
                  make calls, track live location, calculate distance, find nearby
                  barbershops, manage profiles, view services, and read reviews.
                </p>
              </div>

              <div className="mt-6 rounded-[2rem] border border-yellow-100 bg-yellow-50 p-6">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-yellow-700">
                  Why Fresh Fade?
                </p>

                <ul className="mt-4 space-y-3 text-sm font-bold text-slate-700">
                  <li>✓ Easy appointment booking</li>
                  <li>✓ Nearby barber search</li>
                  <li>✓ Chat, calls and image sharing</li>
                  <li>✓ Live location and distance tools</li>
                  <li>✓ Clean, simple and fast experience</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-[3rem] border border-blue-100/70 bg-gradient-to-br from-slate-950 via-blue-950 to-yellow-950 p-8 text-white shadow-2xl shadow-blue-100/60">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
                  Growblic Booking Product
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                  Want a similar booking app?
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                  Growblic can build barber booking apps, salon apps, appointment
                  systems, location tracking, chat modules, and service marketplace platforms.
                </p>
              </div>

              <Link
                href="/start-project"
                className="rounded-full bg-white px-8 py-4 text-center text-sm font-black text-slate-950 shadow-xl transition-all duration-500 ease-out hover:-translate-y-1.5"
              >
                Start a Project →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
