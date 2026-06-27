import Link from "next/link";
import BackButton from "../../../components/BackButton";
import { companyApps } from "../../../data/companyApps";

const app = companyApps.find((item) => item.slug === "fresh-fold-vendor")!;

export const metadata = {
  title: "Fresh Fold Vendor | Growblic App",
  description:
    "Fresh Fold Vendor is a laundry vendor management app by Growblic for orders, clients, addresses, payments, promotions, and shop productivity.",
};

export default function FreshFoldVendorPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(14,165,233,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.08),transparent_30%)]" />

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
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-50 via-white to-violet-50 p-8">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-200/60 blur-3xl" />
                <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-violet-200/50 blur-3xl" />

                <div className="relative">
                  <span className="mx-auto grid h-36 w-36 place-items-center overflow-hidden rounded-[2.2rem] bg-white shadow-2xl shadow-blue-100">
                    <img
                      src={app.logo}
                      alt={app.name}
                      className="h-full w-full object-cover"
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
                      Manage laundry orders, clients, payments, and promotions efficiently.
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
                Built for laundry shop management.
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
                      A vendor-focused feature created to help laundry shops save time and manage clients clearly.
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
                  Fresh Fold Vendor helps laundry shopkeepers manage customer
                  orders, track client details, access addresses for accurate
                  deliveries, upload promotions, manage payments, and reduce
                  manual workflow with one easy-to-use app.
                </p>
              </div>

              <div className="mt-6 rounded-[2rem] border border-sky-100 bg-sky-50 p-6">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-700">
                  What&apos;s New
                </p>

                <ul className="mt-4 space-y-3 text-sm font-bold text-slate-700">
                  <li>✓ New promo upload feature for shopkeepers</li>
                  <li>✓ Improved order management and client tracking</li>
                  <li>✓ Enhanced performance and minor bug fixes</li>
                  <li>✓ Updated design for smoother user experience</li>
                  <li>✓ Optimized app stability for better performance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-[3rem] border border-blue-100/70 bg-gradient-to-br from-slate-950 via-blue-950 to-sky-950 p-8 text-white shadow-2xl shadow-blue-100/60">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
                  Growblic Laundry Product
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                  Want a similar vendor app?
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                  Growblic can build laundry management apps, vendor dashboards,
                  client tracking systems, order management tools, payment flows,
                  and delivery business platforms.
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
