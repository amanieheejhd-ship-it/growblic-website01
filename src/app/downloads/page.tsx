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
const mobileApps = companyApps;
const saasProducts = products.filter((product) =>
 ["SaaS", "Sales", "Client Experience", "Business Intelligence"].includes(product.category),
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
   <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.28em]">
    {eyebrow}
   </p>
   <h2 className="mt-4 break-words text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
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
  <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[2rem] border border-blue-100/80 bg-white shadow-xl shadow-blue-100/45 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70">
   <div className="relative h-52 bg-blue-50">
    <Image
     src={image}
     alt={product.title}
     fill
     sizes="(max-width: 768px) 100vw, 420px"
     className="object-cover"
     unoptimized
    />
    <span className="absolute left-4 right-4 top-4 max-w-[calc(100%-2rem)] rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-black text-blue-700 shadow-lg backdrop-blur sm:left-5 sm:right-auto sm:top-5">
     {product.category}
    </span>
   </div>

   <div className="flex flex-1 flex-col p-6">
    <div className="flex min-w-0 flex-col gap-3 min-[420px]:flex-row min-[420px]:justify-between">
     <h3 className="min-w-0 break-words text-2xl font-black leading-tight text-slate-950">
      {product.title}
     </h3>
     <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
      {product.status}
     </span>
    </div>
    <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-slate-600">
     {product.shortDescription}
    </p>

    <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
     <Link
      href={`/products/${product.slug}`}
      className="inline-flex min-h-11 flex-1 items-stretch justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
     >
      {primaryLabel}
     </Link>
     <Link
      href="/start-project"
      className="inline-flex min-h-11 flex-1 items-stretch justify-center rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:text-blue-700"
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
  <article className="group relative isolate flex h-full min-h-[26rem] min-w-0 overflow-hidden rounded-[2rem] border border-white/75 bg-white/62 p-5 shadow-[0_24px_70px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl transition duration-300 before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.72)_42%,rgba(219,234,254,0.58))] after:absolute after:-left-24 after:top-0 after:h-full after:w-20 after:-skew-x-12 after:bg-white/45 after:opacity-0 after:blur-sm after:transition-all after:duration-700 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-blue-200/90 hover:shadow-[0_32px_90px_rgba(37,99,235,0.24)] hover:after:left-[118%] hover:after:opacity-100 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 sm:p-6">
   <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
   <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-blue-300/24 blur-3xl transition duration-500 group-hover:bg-cyan-300/30" />
   <div className="pointer-events-none absolute -bottom-16 left-8 h-40 w-40 rounded-full bg-sky-100/70 blur-3xl" />

   <div className="relative flex h-full flex-col">
    <div className="flex min-w-0 gap-4">
     <span className="relative grid h-20 w-20 shrink-0 place-items-stretch overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_40px_rgba(37,99,235,0.18)] ring-1 ring-blue-100/80 backdrop-blur-xl">
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.95),transparent_34%),linear-gradient(135deg,rgba(219,234,254,0.42),transparent)]" />
      <Image
       src={app.logo}
       alt={app.name}
       fill
       sizes="80px"
       className="object-cover"
       unoptimized
      />
     </span>
     <div className="min-w-0">
      <span className="inline-flex max-w-full break-words rounded-full border border-white/80 bg-white/55 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm shadow-blue-100/60 backdrop-blur-xl">
       {app.category}
      </span>
      <h3 className="mt-3 break-words text-2xl font-black leading-tight text-slate-950">
       {app.name}
      </h3>
     </div>
    </div>

    <p className="mt-5 line-clamp-4 text-sm font-semibold leading-7 text-slate-600">
     {app.short}
    </p>
    <p className="mt-4 inline-flex w-fit rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 shadow-sm backdrop-blur">
     {app.status}
    </p>

    <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
     {hasDownload ? (
      <a
       href={app.playStore}
       target="_blank"
       rel="noopener noreferrer"
       className="relative inline-flex min-h-11 flex-1 items-stretch justify-center overflow-hidden rounded-full bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/25"
      >
       <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
       Download
      </a>
     ) : (
      <Link
       href="/start-project"
       className="relative inline-flex min-h-11 flex-1 items-stretch justify-center overflow-hidden rounded-full bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/25"
      >
       <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
       Request Access
      </Link>
     )}
     <Link
      href={`/apps/${app.slug}`}
      className="inline-flex min-h-11 flex-1 items-stretch justify-center rounded-full border border-white/80 bg-white/55 px-5 py-3 text-sm font-black text-slate-950 shadow-sm shadow-blue-100/60 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white/85 hover:text-blue-700"
     >
      View Details
     </Link>
    </div>
   </div>
  </article>
 );
}

export default function DownloadsPage() {
 return (
  <main className="min-h-screen bg-[#fbfdff]">
   <section className="relative px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
    <div className="relative mx-auto max-w-7xl min-w-0">
     <BackButton />

     <div className="mt-8 grid min-w-0 gap-8 sm:mt-10 lg:gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
      <div className="min-w-0">
       <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.28em]">
        Growblic Downloads
       </p>
       <h1 className="mt-5 max-w-5xl break-words text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
        Growblic Downloads
       </h1>
       <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
        Access Growblic live products, mobile apps, SaaS platforms, and
        business tools from one place.
       </p>
      </div>

      <div className="h-fit min-w-0 self-start rounded-[1.7rem] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,0.10)] sm:p-6">
       <p className="break-words text-xs font-black uppercase tracking-[0.18em] text-blue-700 sm:tracking-[0.28em]">
        Download Directory
       </p>

       <div className="mt-5 divide-y divide-blue-100 overflow-hidden rounded-[1.35rem] border border-blue-100 bg-white shadow-sm">
        {[
         { label: "Live Products", detail: "Production-ready systems", href: "#live-products" },
         { label: "Mobile Apps", detail: "Growblic apps and tools", href: "#mobile-apps" },
         { label: "SaaS Products", detail: "Business product modules", href: "#saas-products" },
        ].map((item) => (
         <a
          key={item.label}
          href={item.href}
          className="group flex min-w-0 items-center justify-between gap-5 px-5 py-4 transition hover:bg-blue-50/70"
         >
          <span className="min-w-0">
           <span className="block break-words text-base font-black text-slate-950">
            {item.label}
           </span>
           <span className="mt-1 block break-words text-sm font-bold text-slate-500">
            {item.detail}
           </span>
          </span>

          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
           →
          </span>
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
      <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
      <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
      <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
       {saasProducts.map((product) => (
        <ProductDownloadCard key={product.slug} product={product} primaryLabel="Request Demo" />
       ))}
      </div>
     </section>

    </div>
   </section>
  </main>
 );
}
