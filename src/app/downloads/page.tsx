import Image from "next/image";
import Link from "next/link";
import BackButton from "../../components/BackButton";
import { companyApps } from "../../data/companyApps";
import { products } from "../../data/products";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic Downloads",
  description:
    "Download or request access to Growblic live products, mobile apps, SaaS platforms, and business tools.",
  path: "/downloads",
});

const liveProducts = products.slice(0, 6);
const mobileApps = companyApps.slice(0, 8);
const saasProducts = products.filter((product) =>
  ["SaaS", "Sales", "Client Experience", "Business Intelligence"].includes(product.category),
);
const otherProducts = products.filter((product) =>
  ["Automation", "Operations", "Hospitality", "Retail"].includes(product.category),
);

function isRealPlayStoreLink(link?: string) {
  return Boolean(link?.startsWith("https://play.google.com/store/apps/details"));
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
        {title}
      </h2>
      <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function ProductDownloadCard({
  product,
  primaryLabel = "View Product",
}: {
  product: (typeof products)[number];
  primaryLabel?: string;
}) {
  const image = product.imageSlides[0] ?? "/growblic-website01/images/products/client-login.svg";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white shadow-xl shadow-blue-100/45 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70">
      <div className="relative h-52 bg-blue-50">
        <Image
          src={image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
          unoptimized
        />
        <span className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-black text-blue-700 shadow-lg backdrop-blur">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-black leading-tight text-slate-950">
            {product.title}
          </h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
            {product.status}
          </span>
        </div>
        <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-slate-600">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/start-project"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:text-blue-700"
          >
            Request Access
          </Link>
        </div>
      </div>
    </article>
  );
}

function MobileAppCard({ app }: { app: (typeof companyApps)[number] }) {
  const hasDownload = isRealPlayStoreLink(app.playStore);

  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-100/45 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70">
      <div className="flex items-start gap-4">
        <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-blue-100/70">
          <Image
            src={app.logo}
            alt={app.name}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        </span>
        <div>
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
            {app.category}
          </span>
          <h3 className="mt-3 text-2xl font-black leading-tight text-slate-950">
            {app.name}
          </h3>
        </div>
      </div>

      <p className="mt-5 line-clamp-4 text-sm font-semibold leading-7 text-slate-600">
        {app.short}
      </p>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
        {app.status}
      </p>

      <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
        {hasDownload ? (
          <a
            href={app.playStore}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Download
          </a>
        ) : (
          <Link
            href="/start-project"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Request Access
          </Link>
        )}
        <Link
          href={`/apps/${app.slug}`}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:text-blue-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default function DownloadsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%),linear-gradient(180deg,rgba(239,246,255,0.55),rgba(255,255,255,0.95)_46%,rgba(239,246,255,0.35))]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                Growblic Downloads
              </p>
              <h1 className="mt-5 max-w-5xl text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
                Growblic Downloads
              </h1>
              <p className="mt-7 max-w-3xl text-xl font-semibold leading-9 text-slate-600">
                Access Growblic live products, mobile apps, SaaS platforms, and
                business tools from one place.
              </p>
            </div>

            <div className="rounded-[2rem] border border-blue-100 bg-white/90 p-6 shadow-2xl shadow-blue-100/60">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                Download directory
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-black text-slate-700">
                {["Live Products", "Mobile Apps", "SaaS", "Business Tools"].map((item) => (
                  <a
                    key={item}
                    href={`#${item === "SaaS" ? "saas-products" : item === "Business Tools" ? "other-categories" : item.toLowerCase().replace(" ", "-")}`}
                    className="rounded-2xl border border-blue-100 bg-blue-50/55 px-4 py-3 transition hover:bg-blue-600 hover:text-white"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <section id="live-products" className="mt-20 scroll-mt-24">
            <SectionHeader
              eyebrow="Live Products"
              title="Production-ready product systems"
              description="Explore live Growblic product concepts and business platforms. Product systems can be opened for details or requested for access/demo."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {liveProducts.map((product) => (
                <ProductDownloadCard key={product.slug} product={product} />
              ))}
            </div>
          </section>

          <section id="mobile-apps" className="mt-20 scroll-mt-24">
            <SectionHeader
              eyebrow="Mobile Apps"
              title="Growblic mobile apps"
              description="Use real Play Store links where available. If a store link is not available or not verified, request access through Growblic."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {mobileApps.map((app) => (
                <MobileAppCard key={app.slug} app={app} />
              ))}
            </div>
          </section>

          <section id="saas-products" className="mt-20 scroll-mt-24">
            <SectionHeader
              eyebrow="SaaS Products"
              title="SaaS, CRM, portals, and dashboards"
              description="These systems are available as product concepts, client-ready builds, or custom SaaS implementations."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {saasProducts.map((product) => (
                <ProductDownloadCard key={product.slug} product={product} primaryLabel="Request Demo" />
              ))}
            </div>
          </section>

          <section id="other-categories" className="mt-20 scroll-mt-24">
            <SectionHeader
              eyebrow="Other Categories"
              title="Automation, analytics, retail, and business tools"
              description="For tools without a public download, request access or view product details to plan a similar system for your business."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {otherProducts.map((product) => (
                <ProductDownloadCard key={product.slug} product={product} primaryLabel="Request Access" />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
