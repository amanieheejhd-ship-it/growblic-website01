/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Ban,
  Brush,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Layers3,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const logoUrl =
  "https://play-lh.googleusercontent.com/g0grr8jGzVcS1_uUzh05Ht2a7w7PcavodUBDgK7XOel8DwYKNSVtNZaF6HmqUFPK37xlr4WafEddfvWeyeDSKA=w240-h480-rw";

const navItems = [
  { label: "Logos", href: "#logos" },
  { label: "Colors", href: "#colors" },
  { label: "Icon", href: "#icon" },
  { label: "Partnerships", href: "#partnerships" },
  { label: "Pairing", href: "#pairing" },
  { label: "Usage", href: "#usage" },
];

const logoCards = [
  {
    title: "Growblic mark",
    text: "Use the mark when the Growblic name is already clear.",
    preview: "mark",
  },
  {
    title: "Growblic wordmark",
    text: "Use the wordmark for headlines, documents, and brand-first layouts.",
    preview: "wordmark",
  },
  {
    title: "Primary lockup",
    text: "Use the lockup when space allows the clearest brand recognition.",
    preview: "lockup",
  },
];

const colors = [
  { hex: "#0F172A", name: "Growblic Navy / Ink", className: "bg-slate-950 text-white" },
  { hex: "#2563EB", name: "Growblic Blue", className: "bg-blue-600 text-white" },
  { hex: "#E0F2FE", name: "Soft Sky", className: "bg-sky-100 text-slate-950" },
  { hex: "#FFFFFF", name: "White", className: "bg-white text-slate-950" },
  { hex: "#475569", name: "Slate Text", className: "bg-slate-600 text-white" },
];

const misuseItems = [
  {
    title: "Never stretch or distort the logo",
    variant: "stretch",
  },
  {
    title: "Never rotate or skew the logo",
    variant: "rotate",
  },
  {
    title: "Never recolor the logo without approval",
    variant: "recolor",
  },
  {
    title: "Never place logo on low contrast backgrounds",
    variant: "contrast",
  },
  {
    title: "Never outline the mark",
    variant: "outline",
  },
  {
    title: "Never combine Growblic with another brand without spacing",
    variant: "spacing",
  },
  {
    title: "Never use unofficial typefaces",
    variant: "typeface",
  },
  {
    title: "Never modify the icon shape",
    variant: "shape",
  },
  {
    title: "Never crop or partially hide the logo",
    variant: "crop",
  },
];

const usageCards = [
  {
    title: "Use clear space",
    text: "Keep enough spacing around Growblic marks so the brand feels clean and premium.",
    icon: Layers3,
  },
  {
    title: "Keep contrast strong",
    text: "Use the mark on clean light or dark surfaces where it remains easy to recognize.",
    icon: ShieldCheck,
  },
  {
    title: "Use approved colors",
    text: "Keep the Growblic brand in the navy, blue, sky, white, and slate system.",
    icon: Palette,
  },
];

function LogoPreview({ type }: { type: string }) {
  if (type === "mark") {
    return (
      <div className="grid h-full place-items-center rounded-[1.6rem] bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="grid h-24 w-24 place-items-center rounded-[1.4rem] border border-blue-100 bg-white shadow-[0_22px_60px_rgba(37,99,235,0.14)]">
          <img src={logoUrl} alt="Growblic mark" className="h-16 w-16 rounded-xl object-cover" />
        </div>
      </div>
    );
  }

  if (type === "wordmark") {
    return (
      <div className="grid h-full place-items-center rounded-[1.6rem] bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="rounded-3xl border border-blue-100 bg-white px-10 py-5 text-4xl font-black tracking-[-0.05em] text-slate-950 shadow-[0_22px_60px_rgba(37,99,235,0.12)]">
          Growblic
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full place-items-center rounded-[1.6rem] bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="flex items-center gap-4 rounded-3xl border border-blue-100 bg-white px-8 py-5 shadow-[0_22px_60px_rgba(37,99,235,0.12)]">
        <img src={logoUrl} alt="Growblic lockup" className="h-12 w-12 rounded-xl object-cover" />
        <span className="text-3xl font-black tracking-[-0.05em] text-slate-950">Growblic</span>
      </div>
    </div>
  );
}



function MisusePreview({ variant }: { variant: string }) {
  const baseLogo = (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-xl font-black tracking-[-0.04em] text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-blue-100">
      <img src={logoUrl} alt="Growblic" className="h-9 w-9 rounded-lg object-cover" />
      <span>Growblic</span>
    </div>
  );

  const markOnly = (
    <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-blue-100">
      <img src={logoUrl} alt="Growblic mark" className="h-12 w-12 rounded-xl object-cover" />
    </div>
  );

  const previewContent =
    variant === "outline" ? (
      <div className="grid h-24 w-24 place-items-center rounded-2xl border-4 border-blue-600 bg-white">
        <img src={logoUrl} alt="Outlined Growblic mark" className="h-12 w-12 rounded-xl object-cover" />
      </div>
    ) : variant === "recolor" ? (
      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-600 shadow-[0_18px_45px_rgba(37,99,235,0.18)]">
        <img src={logoUrl} alt="Recolored Growblic mark" className="h-12 w-12 rounded-xl object-cover mix-blend-screen" />
      </div>
    ) : variant === "contrast" ? (
      <div className="flex h-full w-full items-center justify-center rounded-[1.2rem] bg-sky-200">
        <div className="opacity-55">{baseLogo}</div>
      </div>
    ) : variant === "typeface" ? (
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 text-2xl font-serif tracking-wide text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-blue-100">
        <img src={logoUrl} alt="Growblic wrong typeface" className="h-9 w-9 rounded-lg object-cover" />
        <span>Growblic</span>
      </div>
    ) : variant === "spacing" ? (
      <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3 text-xl font-black text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-blue-100">
        <img src={logoUrl} alt="Growblic spacing misuse" className="h-9 w-9 rounded-lg object-cover" />
        <span>Growblic</span>
        <span className="text-slate-400">Partner</span>
      </div>
    ) : variant === "shape" ? (
      <div className="grid h-20 w-28 place-items-center rounded-full bg-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-blue-100">
        <img src={logoUrl} alt="Modified Growblic shape" className="h-12 w-16 rounded-full object-cover" />
      </div>
    ) : variant === "crop" ? (
      <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-blue-100">
        <img src={logoUrl} alt="Cropped Growblic logo" className="h-20 w-20 translate-x-5 translate-y-4 rounded-xl object-cover" />
      </div>
    ) : variant === "rotate" ? (
      <div className="-rotate-12 skew-x-6">{baseLogo}</div>
    ) : variant === "stretch" ? (
      <div className="scale-x-125">{baseLogo}</div>
    ) : (
      markOnly
    );

  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-[1.35rem] border border-blue-100 bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:26px_26px]" />
      <div className="relative">{previewContent}</div>
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-[74%] -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] rounded-full bg-red-500 shadow-[0_0_22px_rgba(239,68,68,0.35)]" />
    </div>
  );
}

export default function BrandPage() {
  return (
    <main className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_6%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_92%_70%,rgba(6,182,212,0.12),transparent_30%),linear-gradient(180deg,#ffffff,rgba(239,246,255,0.62),#ffffff)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-5 py-2 text-xs font-black uppercase tracking-[0.34em] text-blue-700 shadow-[0_14px_35px_rgba(37,99,235,0.10)]">
            Growblic Brand
          </p>

          <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.075em] text-slate-950 sm:text-6xl lg:text-7xl">
            Brand and trademark guidelines for Growblic.
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg font-semibold leading-9 text-slate-600">
            A clean system for using the Growblic name, logo, colors, icon, and brand assets across websites, apps, documents, and partnerships.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#usage"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Read guidelines <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@growblic.com"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white/90 px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/55 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
            >
              Request assets <Download className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav className="sticky top-4 z-20 mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2 rounded-full border border-blue-100 bg-white/84 p-2 shadow-[0_18px_60px_rgba(37,99,235,0.12)] backdrop-blur-2xl">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-slate-600 transition hover:bg-blue-600 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section id="logos" className="mt-16 scroll-mt-28">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">Logos</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
                Essential brand assets.
              </h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-7 text-slate-600">
              Use these core Growblic assets consistently across digital and print surfaces.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {logoCards.map((card) => (
              <article
                key={card.title}
                className="group overflow-hidden rounded-[2rem] border border-blue-100 bg-white/80 p-5 shadow-[0_24px_80px_rgba(37,99,235,0.10)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_34px_100px_rgba(37,99,235,0.15)]"
              >
                <div className="h-56">
                  <LogoPreview type={card.preview} />
                </div>
                <div className="p-2 pt-6">
                  <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="colors" className="mt-16 scroll-mt-28">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">Colors</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
            Brand color system.
          </h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {colors.map((color) => (
              <div
                key={color.hex}
                className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-white shadow-[0_20px_60px_rgba(37,99,235,0.08)] transition hover:-translate-y-1 hover:border-blue-300"
              >
                <div className={`h-36 p-5 text-sm font-black ${color.className}`}>{color.hex}</div>
                <div className="p-5">
                  <p className="font-black text-slate-950">{color.name}</p>
                  <button className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="icon" className="mt-16 grid gap-8 scroll-mt-28 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">Icon</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
              App icon and product mark.
            </h2>
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-slate-600">
              Use the Growblic mark in clean square or rounded-square containers with enough clear space.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/80 p-8 shadow-[0_28px_90px_rgba(37,99,235,0.12)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.16),transparent_36%)]" />
            <div className="relative mx-auto grid h-72 max-w-xl place-items-center rounded-[1.8rem] bg-gradient-to-br from-blue-50 via-white to-cyan-50">
              <div className="grid h-36 w-36 place-items-center rounded-[2rem] border border-blue-100 bg-white shadow-[0_30px_80px_rgba(37,99,235,0.18)]">
                <img src={logoUrl} alt="Growblic icon" className="h-24 w-24 rounded-2xl object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section id="partnerships" className="mt-16 scroll-mt-28">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">Partnerships</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
            Co-branding examples.
          </h2>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600">
            Keep both marks balanced, aligned, and with enough clear space.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {["Client", "Partner", "Community"].map((item) => (
              <div
                key={item}
                className="rounded-[1.8rem] border border-blue-100 bg-white/80 p-6 shadow-[0_24px_80px_rgba(37,99,235,0.09)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-center gap-5 rounded-[1.4rem] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-6 py-10">
                  <span className="rounded-2xl bg-white px-6 py-4 text-xl font-black text-slate-950 shadow-md">Growblic</span>
                  <span className="text-2xl font-black text-blue-600">×</span>
                  <span className="rounded-2xl bg-white px-6 py-4 text-xl font-black text-slate-500 shadow-md">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pairing" className="mt-16 scroll-mt-28">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">Pairing logos</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
            Correct logo pairings.
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {["Growblic | Partner", "Partner | Growblic", "Growblic + Product"].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-blue-100 bg-white/86 px-8 py-8 text-center text-2xl font-black tracking-[-0.04em] text-slate-950 shadow-[0_20px_60px_rgba(37,99,235,0.08)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="usage" className="mt-16 scroll-mt-28">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">Usage</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
            Use the Growblic brand correctly.
          </h2>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {usageCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="rounded-[1.7rem] border border-blue-100 bg-white/82 p-6 shadow-[0_22px_70px_rgba(37,99,235,0.09)] backdrop-blur-xl"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.04em] text-slate-950">{card.title}</h3>
                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{card.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {misuseItems.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[1.8rem] border border-red-100 bg-white/86 p-5 shadow-[0_22px_70px_rgba(239,68,68,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-white hover:shadow-[0_32px_90px_rgba(239,68,68,0.12)]"
              >
                <MisusePreview variant={item.variant} />

                <div className="mt-5 flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-500 text-white shadow-[0_10px_28px_rgba(239,68,68,0.25)]">
                    <Ban className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm font-black leading-7 text-slate-750">
                    {item.title}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2rem] border border-blue-100 bg-white/84 p-8 shadow-[0_28px_90px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-700">Trademark and permissions</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">
                Using Growblic brand assets.
              </h2>
              <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-slate-600">
                Growblic name, logo, and brand assets should not be misused. Permission for partnerships, press, or co-branding can be requested at hello@growblic.com. Abuse or impersonation can be reported at abuse@growblic.com.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="mailto:hello@growblic.com"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Contact Growblic <FileText className="h-4 w-4" />
              </a>
              <a
                href="mailto:abuse@growblic.com"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-xl shadow-blue-100/55 transition hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600"
              >
                Report Abuse <BadgeCheck className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
