import Image from "next/image";
import BackButton from "../../components/BackButton";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Growblic Brand Guidelines",
  description:
    "Brand, logo, color, partnership, and trademark usage guidelines for Growblic.",
  path: "/brand",
});

const logoCards = [
  {
    title: "Growblic mark",
    description: "Use the mark when the Growblic name is already clear.",
    variant: "mark",
  },
  {
    title: "Growblic wordmark",
    description: "Use the wordmark for headlines, documents, and brand-first layouts.",
    variant: "wordmark",
  },
  {
    title: "Primary lockup",
    description: "Use the lockup when space allows the clearest brand recognition.",
    variant: "lockup",
  },
];

const colors = [
  { name: "Growblic Navy / Ink", hex: "#0F172A", className: "bg-slate-950 text-white" },
  { name: "Growblic Blue", hex: "#2563EB", className: "bg-blue-600 text-white" },
  { name: "Soft Sky", hex: "#E0F2FE", className: "bg-sky-100 text-slate-950" },
  { name: "White", hex: "#FFFFFF", className: "bg-white text-slate-950" },
  { name: "Slate Text", hex: "#475569", className: "bg-slate-600 text-white" },
];

const partnershipCards = [
  ["Growblic", "Client"],
  ["Growblic", "Partner"],
  ["Growblic", "Community"],
];

const pairingExamples = [
  "Growblic | Partner",
  "Partner | Growblic",
  "Growblic + Product",
];

const misuseCards = [
  "Never stretch or distort the logo",
  "Never rotate or skew the logo",
  "Never recolor the logo without approval",
  "Never place logo on low contrast backgrounds",
  "Never outline the mark",
  "Never combine Growblic with another brand without spacing",
  "Never use unofficial typefaces for the Growblic wordmark",
  "Never modify the icon shape",
];

const navItems = [
  { label: "Logos", href: "#logos" },
  { label: "Colors", href: "#colors" },
  { label: "Icon", href: "#icon" },
  { label: "Partnerships", href: "#partnerships" },
  { label: "Pairing logos", href: "#pairing-logos" },
  { label: "Usage", href: "#usage" },
];

function LogoPreview({ variant }: { variant: string }) {
  if (variant === "mark") {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-[1.8rem] border border-blue-100 bg-white shadow-xl shadow-blue-100/70">
        <Image
          src="/growblic-website01/images/brand/growblic-logo.png"
          alt="Growblic mark"
          fill
          sizes="96px"
          className="object-cover p-3"
        />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className="rounded-[1.8rem] border border-blue-100 bg-white px-7 py-5 shadow-xl shadow-blue-100/70">
        <span className="text-4xl font-black tracking-tight text-slate-950">Growblic</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-[1.8rem] border border-blue-100 bg-white px-6 py-5 shadow-xl shadow-blue-100/70">
      <span className="relative h-16 w-16 overflow-hidden rounded-2xl border border-blue-100 bg-white">
        <Image
          src="/growblic-website01/images/brand/growblic-logo.png"
          alt="Growblic"
          fill
          sizes="64px"
          className="object-cover p-2"
        />
      </span>
      <span className="text-3xl font-black tracking-tight text-slate-950">Growblic</span>
    </div>
  );
}

function MisuseMockup({ label, index }: { label: string; index: number }) {
  return (
    <article className="relative overflow-hidden rounded-[1.8rem] border border-red-100 bg-white p-5 shadow-xl shadow-blue-100/40">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-50 blur-2xl" />
      <div className="relative grid h-32 place-items-center rounded-[1.3rem] border border-blue-100 bg-blue-50/50">
        <div
          className={[
            "relative flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-blue-100/60",
            index === 0 ? "scale-x-125" : "",
            index === 1 ? "rotate-6 skew-x-3" : "",
            index === 2 ? "text-cyan-500" : "text-slate-950",
            index === 3 ? "bg-blue-100 text-blue-100" : "",
            index === 4 ? "bg-transparent text-transparent ring-2 ring-blue-600" : "",
            index === 7 ? "rounded-full" : "",
          ].join(" ")}
        >
          <span className="relative h-8 w-8 overflow-hidden rounded-lg border border-blue-100 bg-white">
            <Image
              src="/growblic-website01/images/brand/growblic-logo.png"
              alt=""
              fill
              sizes="32px"
              className="object-cover p-1"
            />
          </span>
          <span className="text-lg font-black">Growblic</span>
          {index === 5 ? <span className="text-lg font-black text-slate-400">Partner</span> : null}
        </div>
        <span className="absolute h-1 w-40 rotate-[-28deg] rounded-full bg-red-500" />
      </div>
      <p className="mt-4 text-sm font-black leading-6 text-slate-700">{label}</p>
    </article>
  );
}

export default function BrandPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mx-auto mt-12 max-w-5xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Brand
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
              Growblic brand and trademark guidelines
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg font-semibold leading-9 text-slate-600 sm:text-xl">
              Guidelines for using the Growblic name, logo, icon, and brand assets
              consistently across websites, apps, documents, and partnerships.
            </p>
            <a
              href="#logos"
              className="mt-9 inline-flex rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Read the brand guidelines ↓
            </a>
          </div>

          <nav className="sticky top-4 z-20 mx-auto mt-12 flex max-w-4xl gap-2 overflow-x-auto rounded-full border border-blue-100/80 bg-white/88 p-2 shadow-xl shadow-blue-100/55 backdrop-blur-xl">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600 transition hover:bg-blue-600 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <section id="logos" className="mt-16 scroll-mt-28">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                Logos
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Essentials
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {logoCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50"
                >
                  <div className="grid min-h-52 place-items-center rounded-[1.6rem] bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
                    <LogoPreview variant={card.variant} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="colors" className="mt-20 scroll-mt-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Colors
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Brand color system
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {colors.map((color) => (
                <article
                  key={color.name}
                  className="overflow-hidden rounded-[1.7rem] border border-blue-100 bg-white shadow-xl shadow-blue-100/45"
                >
                  <div className={`h-32 p-4 ${color.className}`}>
                    <p className="text-sm font-black">{color.hex}</p>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-black text-slate-950">{color.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="icon" className="mt-20 grid scroll-mt-28 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                Icon
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                App icon / Product icon
              </h2>
              <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
                Use the icon only where the Growblic name is already clear or in compact
                product spaces.
              </p>
            </div>
            <div className="grid place-items-center rounded-[2.4rem] border border-blue-100 bg-white p-10 shadow-2xl shadow-blue-100/60">
              <div className="relative h-48 w-48 overflow-hidden rounded-[3rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-100 p-5 shadow-2xl shadow-blue-200/70">
                <Image
                  src="/growblic-website01/images/brand/growblic-logo.png"
                  alt="Growblic product icon"
                  fill
                  sizes="192px"
                  className="object-cover p-7"
                />
              </div>
            </div>
          </section>

          <section id="partnerships" className="mt-20 scroll-mt-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Partnerships
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Co-branding examples
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              Keep both marks balanced, aligned, and with enough clear space.
            </p>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {partnershipCards.map(([left, right]) => (
                <article
                  key={`${left}-${right}`}
                  className="rounded-[2rem] border border-blue-100 bg-white p-7 shadow-xl shadow-blue-100/50"
                >
                  <div className="flex items-center justify-center gap-4 rounded-[1.5rem] bg-blue-50/60 p-8">
                    <span className="rounded-2xl bg-white px-5 py-4 text-lg font-black text-slate-950 shadow-lg">
                      {left}
                    </span>
                    <span className="text-2xl font-black text-blue-600">×</span>
                    <span className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-black text-slate-500 shadow-lg">
                      {right}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="pairing-logos" className="mt-20 scroll-mt-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Pairing logos
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Correct logo pairings
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              Use spacing, equal visual weight, and consistent alignment when pairing
              Growblic with partners or product names.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {pairingExamples.map((example) => (
                <div
                  key={example}
                  className="rounded-[1.8rem] border border-blue-100 bg-white p-8 text-center text-2xl font-black text-slate-950 shadow-xl shadow-blue-100/45"
                >
                  {example}
                </div>
              ))}
            </div>
          </section>

          <section id="usage" className="mt-20 scroll-mt-28">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
              Usage
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Do not misuse the Growblic brand
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {misuseCards.map((label, index) => (
                <MisuseMockup key={label} label={label} index={index} />
              ))}
            </div>
          </section>

          <section className="mt-20 overflow-hidden rounded-[2.4rem] border border-blue-100 bg-white shadow-2xl shadow-blue-100/60">
            <div className="relative p-8 sm:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(37,99,235,0.12),transparent_30%),linear-gradient(135deg,rgba(239,246,255,0.72),rgba(255,255,255,0.96))]" />
              <div className="relative max-w-4xl">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">
                  Trademark and permissions
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                  Using Growblic brand assets
                </h2>
                <p className="mt-5 text-base font-semibold leading-8 text-slate-600">
                  Growblic name, logo, and brand assets should not be misused. Permission
                  for partnerships, press, or co-branding can be requested at
                  hello@growblic.com. Abuse or impersonation can be reported at
                  abuse@growblic.com.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="mailto:hello@growblic.com?subject=Growblic Brand Permission"
                    className="rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Contact Growblic
                  </a>
                  <a
                    href="mailto:abuse@growblic.com?subject=Growblic Brand Abuse Report"
                    className="rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/60 transition hover:-translate-y-0.5 hover:text-blue-700"
                  >
                    Report Abuse
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
