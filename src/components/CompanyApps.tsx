import Link from "next/link";
import * as companyAppData from "@/data/companyApps";

type AppItem = {
  title?: string;
  name?: string;
  slug?: string;
  href?: string;
  image?: string;
  icon?: string;
  logo?: string;
  appIcon?: string;
  thumbnail?: string;
  category?: string;
  description?: string;
  status?: string;
};

const rawData = companyAppData as Record<string, unknown>;

const apps =
  ((rawData.companyApps as AppItem[] | undefined) ??
    (rawData.apps as AppItem[] | undefined) ??
    (rawData.default as AppItem[] | undefined) ??
    []) as AppItem[];

function appTitle(app: AppItem) {
  return app.title || app.name || "Growblic App";
}

function appImage(app: AppItem) {
  return (
    app.image ||
    app.icon ||
    app.logo ||
    app.appIcon ||
    app.thumbnail ||
    "/images/brand/growblic-logo.png"
  );
}

function appHref(app: AppItem) {
  if (app.href) return app.href;
  if (app.slug) return `/apps/${app.slug}`;
  return "/apps/growblic-earn-money-online";
}

function AppCard({ app }: { app: AppItem }) {
  return (
    <Link
      href={appHref(app)}
      className="group block w-[78vw] shrink-0 overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white/95 p-5 shadow-xl shadow-blue-100/60 transition hover:-translate-y-1 hover:shadow-2xl sm:w-[360px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 shadow-inner">
          <img
            src={appImage(app)}
            alt={appTitle(app)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          {app.status || "Live"}
        </span>
      </div>

      <div className="mt-7">
        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          {app.category || "Growblic Product"}
        </span>

        <h3 className="mt-6 text-3xl font-black leading-[1.05] tracking-[-0.06em] text-slate-950">
          {appTitle(app)}
        </h3>

        <p className="mt-5 line-clamp-3 text-base leading-7 text-slate-600">
          {app.description ||
            "A premium digital product built by Growblic for modern users and businesses."}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-500">View Product</span>
        <span className="grid h-14 w-14 place-items-center rounded-full bg-slate-950 text-2xl font-black text-white transition group-hover:bg-blue-600">
          →
        </span>
      </div>
    </Link>
  );
}

export default function CompanyApps() {
  const firstRow = apps.filter((_, index) => index % 2 === 0);
  const secondRow = apps.filter((_, index) => index % 2 !== 0);

  return (
    <section className="overflow-hidden bg-[#fbfdff] px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-blue-600">
            Growblic Apps
          </p>
          <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] text-slate-950 md:text-7xl">
            Our live apps and digital products.
          </h2>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-600">
            Explore real apps built by Growblic. Swipe or watch the product cards
            moving smoothly across the screen.
          </p>
        </div>

        <div className="mt-14 space-y-5 md:hidden">
          <div className="mobile-app-marquee">
            <div className="mobile-app-track">
              {[...firstRow, ...firstRow].map((app, index) => (
                <AppCard key={`row-1-${app.slug || appTitle(app)}-${index}`} app={app} />
              ))}
            </div>
          </div>

          <div className="mobile-app-marquee">
            <div className="mobile-app-track mobile-app-track-reverse">
              {[...secondRow, ...secondRow].map((app, index) => (
                <AppCard key={`row-2-${app.slug || appTitle(app)}-${index}`} app={app} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 hidden grid-cols-3 gap-6 md:grid">
          {apps.map((app, index) => (
            <AppCard key={`desktop-${app.slug || appTitle(app)}-${index}`} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}
