"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CloudCog,
  Database,
  Globe2,
  MapPin,
  Radar,
  ServerCog,
  ShieldCheck,
} from "lucide-react";

type GlobeDot = {
  x: number;
  y: number;
  label: string;
  tone?: "primary" | "secondary" | "launch";
};

type DeploymentRegion = {
  name: string;
  summary: string;
  supportAreas: string[];
  providers: string[];
  dots: GlobeDot[];
  featured?: boolean;
};

const deploymentRegions: DeploymentRegion[] = [
  {
    name: "North America",
    summary: "Cloud provider region planning for SaaS, APIs, and customer-facing apps.",
    supportAreas: ["Static websites", "Node.js APIs", "Database hosting", "Monitoring setup"],
    providers: ["Render", "Vercel", "AWS-ready planning", "Managed PostgreSQL"],
    dots: [
      { x: 24, y: 38, label: "West coast planning", tone: "primary" },
      { x: 32, y: 42, label: "Central app hosting", tone: "secondary" },
      { x: 39, y: 36, label: "East coast launch", tone: "launch" },
    ],
  },
  {
    name: "Europe",
    summary: "Deployment planning for web platforms, business portals, and GDPR-aware hosting choices.",
    supportAreas: ["Frontend hosting", "API deployment", "PostgreSQL setup", "Domain guidance"],
    providers: ["Vercel", "Render", "Managed PostgreSQL", "Cloud storage"],
    dots: [
      { x: 49, y: 34, label: "Western Europe", tone: "primary" },
      { x: 54, y: 32, label: "Central Europe", tone: "secondary" },
      { x: 58, y: 38, label: "Regional launch support", tone: "launch" },
    ],
  },
  {
    name: "Middle East",
    summary: "Launch path planning for regional apps, service platforms, admin dashboards, and API backends.",
    supportAreas: ["Business websites", "Backend APIs", "Database planning", "Security setup"],
    providers: ["AWS-ready planning", "Managed PostgreSQL", "Node.js APIs", "Cloud storage"],
    dots: [
      { x: 60, y: 48, label: "Gulf launch planning", tone: "primary" },
      { x: 56, y: 46, label: "Regional routing", tone: "secondary" },
      { x: 63, y: 43, label: "Provider dependent", tone: "launch" },
    ],
  },
  {
    name: "Asia Pacific",
    summary: "Provider location planning for high-growth products serving customers across Asia Pacific.",
    supportAreas: ["SaaS platforms", "Mobile app backends", "Monitoring setup", "Cloud storage"],
    providers: ["Vercel", "Render", "AWS-ready planning", "Managed PostgreSQL"],
    dots: [
      { x: 73, y: 44, label: "Southeast Asia", tone: "primary" },
      { x: 78, y: 36, label: "East Asia", tone: "secondary" },
      { x: 69, y: 52, label: "Regional launch", tone: "launch" },
    ],
  },
  {
    name: "India",
    summary: "India-first launch support for business websites, mobile app backends, admin dashboards, and local service platforms.",
    supportAreas: [
      "India-first launch support",
      "Business websites",
      "Mobile app backends",
      "Admin dashboards",
      "Local service platforms",
    ],
    providers: ["GitHub Pages", "Render", "Vercel", "Node.js APIs", "Managed PostgreSQL"],
    dots: [
      { x: 66, y: 49, label: "India-first launch", tone: "primary" },
      { x: 64, y: 46, label: "Business platforms", tone: "launch" },
      { x: 68, y: 53, label: "Backend planning", tone: "secondary" },
      { x: 62, y: 51, label: "Admin dashboards", tone: "launch" },
    ],
    featured: true,
  },
  {
    name: "Australia",
    summary: "Deployment guidance for provider locations suited to Australian customers and regional apps.",
    supportAreas: ["Static websites", "API hosting", "Database setup", "Launch checks"],
    providers: ["Vercel", "Render", "Managed PostgreSQL", "Cloud storage"],
    dots: [
      { x: 80, y: 68, label: "East Australia", tone: "primary" },
      { x: 75, y: 71, label: "Regional setup", tone: "secondary" },
      { x: 84, y: 64, label: "Launch support", tone: "launch" },
    ],
  },
];

const legendItems = [
  { label: "Available planning", className: "bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.45)]" },
  { label: "Provider dependent", className: "bg-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.45)]" },
  { label: "Launch support", className: "bg-violet-500 shadow-[0_0_18px_rgba(139,92,246,0.42)]" },
];

function getDotClassName(tone: GlobeDot["tone"]) {
  if (tone === "launch") {
    return "fill-violet-500";
  }

  if (tone === "secondary") {
    return "fill-cyan-500";
  }

  return "fill-blue-600";
}

export default function DatacenterCoverage() {
  const [selectedRegionName, setSelectedRegionName] = useState("India");
  const selectedRegion = useMemo(
    () =>
      deploymentRegions.find((region) => region.name === selectedRegionName) ??
      deploymentRegions[0],
    [selectedRegionName],
  );

  return (
    <section className="relative mt-16 overflow-hidden rounded-[2rem] border border-blue-100/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(248,251,255,0.92)_46%,rgba(236,254,255,0.76))] p-5 shadow-[0_28px_90px_rgba(37,99,235,0.12)] ring-1 ring-white/80 backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-blue-100/75 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="relative">
        <div className="max-w-4xl">
          <p className="inline-flex rounded-full border border-blue-100 bg-white/82 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-blue-700 shadow-sm">
            Deployment coverage
          </p>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-950 lg:text-5xl">
            Growblic Global Deployment Coverage
          </h2>
          <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-slate-600">
            Plan hosting and backend deployments across cloud regions, provider
            locations, and launch environments without overcomplicating the stack.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[1.75rem] border border-blue-100/80 bg-white/84 p-4 shadow-[0_18px_58px_rgba(37,99,235,0.08)] ring-1 ring-white/80 backdrop-blur-xl sm:p-5">
            <div className="flex flex-wrap gap-2">
              {deploymentRegions.map((region) => {
                const isActive = region.name === selectedRegion.name;

                return (
                  <button
                    key={region.name}
                    type="button"
                    onClick={() => setSelectedRegionName(region.name)}
                    className={`rounded-full px-4 py-2 text-xs font-extrabold transition duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                        : "border border-blue-100 bg-white/86 text-slate-600 shadow-sm shadow-blue-100/30 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                    }`}
                    aria-pressed={isActive}
                  >
                    {region.name}
                  </button>
                );
              })}
            </div>

            <div
              key={selectedRegion.name}
              className="mt-5 rounded-[1.5rem] border border-blue-100/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(239,246,255,0.76))] p-5 shadow-inner shadow-blue-100/45 transition duration-500"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <MapPin className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-700">
                    Deployment planning region
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    {selectedRegion.name}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                    {selectedRegion.summary}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                    <ServerCog className="h-4 w-4 text-blue-600" />
                    Supported setup paths
                  </p>
                  <div className="mt-3 grid gap-2">
                    {selectedRegion.supportAreas.map((area) => (
                      <div
                        key={area}
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold ${
                          selectedRegion.featured && area === "India-first launch support"
                            ? "border-blue-200 bg-blue-50 text-blue-800"
                            : "border-blue-100/80 bg-white/82 text-slate-700"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" strokeWidth={1.9} />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                    <CloudCog className="h-4 w-4 text-blue-600" />
                    Provider / stack options
                  </p>
                  <div className="mt-3 grid gap-2">
                    {selectedRegion.providers.map((provider) => (
                      <div
                        key={provider}
                        className="flex items-center gap-2 rounded-2xl border border-blue-100/80 bg-white/82 px-3 py-2 text-sm font-bold text-slate-700"
                      >
                        <Database className="h-4 w-4 shrink-0 text-cyan-600" strokeWidth={1.9} />
                        {provider}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-blue-100/80 bg-white/80 p-4 shadow-[0_22px_70px_rgba(37,99,235,0.10)] ring-1 ring-white/80 backdrop-blur-xl sm:p-5">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="relative flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-700">
                    Deployment coverage map
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Active view: {selectedRegion.name}
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/86 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                  <Radar className="h-4 w-4 text-blue-600" strokeWidth={1.9} />
                  Planning coverage
                </span>
              </div>

              <div className="relative aspect-[1.2] min-h-[22rem] overflow-hidden rounded-[1.45rem] border border-blue-100/80 bg-[radial-gradient(circle_at_50%_44%,rgba(219,234,254,0.92),rgba(255,255,255,0.72)_54%,rgba(239,246,255,0.92))] shadow-inner shadow-blue-100/60">
                <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.95),rgba(191,219,254,0.52)_45%,rgba(165,180,252,0.28)_72%,rgba(6,182,212,0.14))] shadow-[0_0_70px_rgba(37,99,235,0.16)]" />
                <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border border-blue-200/60" />

                <svg
                  viewBox="0 0 100 84"
                  className="absolute inset-0 h-full w-full"
                  role="img"
                  aria-label={`${selectedRegion.name} deployment planning coverage map`}
                >
                  <defs>
                    <linearGradient id="coverageLand" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.95" />
                      <stop offset="58%" stopColor="#bfdbfe" stopOpacity="0.66" />
                      <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.38" />
                    </linearGradient>
                    <radialGradient id="coverageDotGlow">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="38%" stopColor="#60a5fa" stopOpacity="0.52" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id="coverageGlobeClip">
                      <circle cx="50" cy="42" r="33" />
                    </clipPath>
                  </defs>

                  <circle cx="50" cy="42" r="33" fill="rgba(255,255,255,0.4)" />
                  <g clipPath="url(#coverageGlobeClip)">
                    <path
                      d="M15 35 C21 27 31 24 39 29 C45 33 44 41 36 43 C28 45 26 53 18 51 C11 49 9 42 15 35 Z"
                      fill="url(#coverageLand)"
                    />
                    <path
                      d="M43 27 C50 20 63 22 69 30 C74 37 68 43 59 42 C51 41 43 37 43 27 Z"
                      fill="url(#coverageLand)"
                    />
                    <path
                      d="M55 45 C62 39 72 42 77 49 C82 57 75 65 65 62 C57 59 50 52 55 45 Z"
                      fill="url(#coverageLand)"
                    />
                    <path
                      d="M72 58 C80 56 89 61 91 69 C84 75 74 72 70 66 C68 63 68 60 72 58 Z"
                      fill="url(#coverageLand)"
                    />
                    <path
                      d="M35 53 C41 55 45 63 40 70 C32 68 27 60 30 55 C31 53 33 52 35 53 Z"
                      fill="url(#coverageLand)"
                    />
                    {[22, 34, 46, 58, 70].map((x) => (
                      <path
                        key={`longitude-${x}`}
                        d={`M${x} 9 C${x - 10} 28 ${x - 10} 56 ${x} 75`}
                        fill="none"
                        stroke="#60a5fa"
                        strokeOpacity="0.16"
                        strokeWidth="0.4"
                      />
                    ))}
                    {[24, 34, 44, 54, 64].map((y) => (
                      <path
                        key={`latitude-${y}`}
                        d={`M17 ${y} C34 ${y - 6} 66 ${y - 6} 83 ${y}`}
                        fill="none"
                        stroke="#60a5fa"
                        strokeOpacity="0.16"
                        strokeWidth="0.45"
                      />
                    ))}
                  </g>
                  <circle
                    cx="50"
                    cy="42"
                    r="33"
                    fill="none"
                    stroke="#93c5fd"
                    strokeOpacity="0.48"
                    strokeWidth="0.8"
                  />

                  {selectedRegion.dots.map((dot) => (
                    <g key={`${selectedRegion.name}-${dot.label}`}>
                      <circle cx={dot.x} cy={dot.y} r="5.3" fill="url(#coverageDotGlow)" className="animate-ping" />
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r="1.8"
                        className={`${getDotClassName(dot.tone)} drop-shadow-sm`}
                      />
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r="3.1"
                        fill="none"
                        stroke="#ffffff"
                        strokeOpacity="0.78"
                        strokeWidth="0.55"
                      />
                    </g>
                  ))}
                </svg>

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/80 bg-white/82 p-3 shadow-lg shadow-blue-100/40 backdrop-blur-xl">
                  <div className="grid gap-2 sm:grid-cols-3">
                    {legendItems.map((item) => (
                      <span
                        key={item.label}
                        className="flex items-center gap-2 text-xs font-bold text-slate-600"
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${item.className}`} />
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="rounded-2xl border border-blue-100 bg-white/82 px-4 py-3 text-xs font-semibold leading-6 text-slate-500 shadow-sm shadow-blue-100/30">
                Coverage depends on selected cloud and hosting provider. Growblic
                helps plan and configure deployments; it does not operate physical
                cloud regions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
