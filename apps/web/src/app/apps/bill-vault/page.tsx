import Image from "next/image";
import Link from "next/link";
import BackButton from "../../../components/BackButton";
import { companyApps } from "../../../data/companyApps";

const app = companyApps.find((item) => item.slug === "bill-vault")!;

export const metadata = {
  title: "Bill Vault | Growblic App",
  description:
    "Bill Vault is a warranty and bill manager app by Growblic for storing bills, warranty cards, receipts, expiry reminders, service contacts, and cloud backup.",
};

export default function BillVaultPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(239,68,68,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_30%)]" />

        <div className="relative mx-auto max-w-[1800px]">
          <BackButton />

          <div className="mt-8 grid min-w-0 gap-8 sm:mt-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <p className="max-w-full break-words text-xs font-black uppercase tracking-[0.18em] sm:text-sm sm:tracking-[0.28em] text-blue-600">
                {app.category}
              </p>

              <h1 className="mt-5 break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
                {app.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                {app.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
                <a
                  href={app.playStore}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-slate-950 to-blue-950 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-100/70 transition-all duration-500 ease-out hover:-translate-y-1.5 sm:w-auto"
                >
                  Open on Play Store →
                </a>

                <Link
                  href="/"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-blue-100 bg-white px-8 py-4 text-center text-sm font-black text-slate-950 shadow-lg shadow-blue-100/50 sm:w-auto"
                >
                  Back to Website
                </Link>
              </div>
            </div>

            <div className="min-w-0 rounded-[2rem] border border-blue-100/70 bg-white/90 p-5 shadow-2xl shadow-blue-100/60 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.6rem] sm:rounded-[2.5rem] bg-gradient-to-br from-red-50 via-white to-blue-50 p-8">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-red-200/60 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-blue-200/50 blur-3xl" />

                <div className="relative">
                  <span className="relative mx-auto grid h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 place-items-center overflow-hidden rounded-[2.2rem] bg-white shadow-2xl shadow-blue-100">
                    <Image
                      src={app.logo}
                      alt={app.name}
                      fill
                      sizes="144px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>

                  <div className="mt-8 rounded-[1.5rem] border border-blue-100/70 bg-white/85 p-6 text-center shadow-xl shadow-blue-100/50">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                      App Status
                    </p>

                    <h2 className="mt-3 break-words text-3xl font-black tracking-tight sm:text-4xl text-slate-950">
                      {app.status}
                    </h2>

                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-500">
                      Store, track, and manage warranty bills and receipts in one secure app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid min-w-0 gap-8 sm:mt-16 lg:grid-cols-[1fr_0.85fr] lg:gap-10">
            <div>
              <p className="max-w-full break-words text-xs font-black uppercase tracking-[0.18em] sm:text-sm sm:tracking-[0.28em] text-blue-600">
                Key Features
              </p>

              <h2 className="mt-4 max-w-4xl break-words text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Built for warranty and bill management.
              </h2>

              <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
                {app.features.map((feature, index) => (
                  <div
                    key={feature}
                    className="min-w-0 rounded-[1.5rem] border border-blue-100/70 bg-white p-5 sm:rounded-[2rem] sm:p-7 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
                  >
                    <span className="text-sm font-black text-blue-600">
                      0{index + 1}
                    </span>

                    <h3 className="mt-4 break-words text-xl font-black text-slate-950 sm:text-2xl">
                      {feature}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      A bill management feature designed to help users keep documents, warranties, and service contacts safe.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-[1.75rem] border border-blue-100/70 bg-white p-5 sm:rounded-[2.5rem] sm:p-8 shadow-2xl shadow-blue-100/60">
              <p className="max-w-full break-words text-xs font-black uppercase tracking-[0.18em] sm:text-sm sm:tracking-[0.28em] text-blue-600">
                App Info
              </p>

              <div className="mt-8 space-y-4">
                {app.info.map((item) => (
                  <div
                    key={item}
                    className="min-w-0 break-words rounded-2xl border border-blue-100/70 bg-blue-50/50 px-5 py-4 text-sm font-black text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-5 sm:rounded-[2rem] sm:p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                  About this app
                </p>

                <p className="mt-4 text-sm font-semibold leading-7 text-white/75">
                  Bill Vault helps users store warranty bills and purchase receipts,
                  track warranty expiry dates, get reminders, contact service centers,
                  upload warranty cards, and back up important documents securely.
                </p>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-red-100 bg-red-50 p-6">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-700">
                  Why Bill Vault?
                </p>

                <ul className="mt-4 space-y-3 text-sm font-bold text-slate-700">
                  <li>✓ Keep all warranty bills in one safe place</li>
                  <li>✓ Get expiry reminders before claims are missed</li>
                  <li>✓ Contact support and dealers quickly</li>
                  <li>✓ Cloud backup for documents</li>
                  <li>✓ Easy, clean and user-friendly interface</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-blue-100/70 bg-gradient-to-br from-slate-950 via-blue-950 to-red-950 p-8 text-white shadow-2xl shadow-blue-100/60">
            <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
                  Growblic Utility Product
                </p>

                <h2 className="mt-4 break-words text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                  Want a similar document manager app?
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                  Growblic can build bill manager apps, warranty tracking tools,
                  document storage systems, reminder apps, cloud backup tools,
                  and productivity utilities.
                </p>
              </div>

              <Link
                href="/start-project"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-8 py-4 text-center text-sm font-black text-slate-950 shadow-xl transition-all duration-500 ease-out hover:-translate-y-1.5 sm:w-auto"
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
