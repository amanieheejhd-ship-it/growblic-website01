"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, Ref } from "react";
import type { GlobeMethods, GlobeProps } from "react-globe.gl";
import {
  CheckCircle2,
  CloudCog,
  Database,
  Globe2,
  MapPin,
  Navigation,
  Radar,
  ServerCog,
} from "lucide-react";

type CoverageTone = "planning" | "dependent" | "launch";

type CoverageLocation = {
  name: string;
  lat: number;
  lng: number;
  note: string;
  tone: CoverageTone;
};

type DeploymentRegion = {
  name: string;
  summary: string;
  supportAreas: string[];
  providers: string[];
  camera: { lat: number; lng: number; altitude: number };
  locations: CoverageLocation[];
  featured?: boolean;
};

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-[24rem] place-items-center rounded-[1.45rem] bg-[radial-gradient(circle_at_50%_40%,rgba(219,234,254,0.9),rgba(255,255,255,0.78))]">
      <div className="flex items-center gap-3 rounded-full border border-blue-100 bg-white/86 px-4 py-3 text-sm font-bold text-slate-600 shadow-lg shadow-blue-100/40">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.45)]" />
        Preparing interactive globe...
      </div>
    </div>
  ),
}) as ComponentType<GlobeProps & { ref?: Ref<GlobeMethods> }>;

const deploymentRegions: DeploymentRegion[] = [
  {
    name: "North America",
    summary: "Cloud provider region planning for SaaS, APIs, and customer-facing apps across North American provider locations.",
    supportAreas: ["Static websites", "Node.js APIs", "Database hosting", "Monitoring setup"],
    providers: ["Render", "Vercel", "AWS-ready planning", "Managed PostgreSQL"],
    camera: { lat: 43, lng: -98, altitude: 1.9 },
    locations: [
      { name: "US East (Northern Virginia)", lat: 39.04, lng: -77.49, note: "Common launch path for SaaS and API workloads.", tone: "planning" },
      { name: "US East (Ohio)", lat: 40.42, lng: -82.91, note: "Provider-dependent backend and database planning.", tone: "dependent" },
      { name: "US West (Northern California)", lat: 37.77, lng: -122.42, note: "Frontend and product launch support.", tone: "launch" },
      { name: "Canada (Central)", lat: 45.5, lng: -73.57, note: "Regional app hosting and monitoring setup.", tone: "planning" },
      { name: "Canada West (Calgary)", lat: 51.04, lng: -114.07, note: "Provider-dependent deployment planning.", tone: "dependent" },
      { name: "Mexico (Central)", lat: 19.43, lng: -99.13, note: "Customer-facing app launch guidance.", tone: "launch" },
    ],
  },
  {
    name: "Europe",
    summary: "Deployment planning for business portals, web platforms, and privacy-aware hosting choices across Europe.",
    supportAreas: ["Frontend hosting", "API deployment", "PostgreSQL setup", "Domain guidance"],
    providers: ["Vercel", "Render", "Managed PostgreSQL", "Cloud storage"],
    camera: { lat: 48, lng: 12, altitude: 1.85 },
    locations: [
      { name: "London", lat: 51.51, lng: -0.13, note: "Business website and SaaS launch planning.", tone: "planning" },
      { name: "Frankfurt", lat: 50.11, lng: 8.68, note: "Database and backend provider planning.", tone: "dependent" },
      { name: "Paris", lat: 48.86, lng: 2.35, note: "Frontend hosting and domain setup guidance.", tone: "launch" },
      { name: "Milan", lat: 45.46, lng: 9.19, note: "Regional web app deployment support.", tone: "planning" },
      { name: "Stockholm", lat: 59.33, lng: 18.07, note: "Provider-dependent app hosting path.", tone: "dependent" },
      { name: "Spain", lat: 40.42, lng: -3.7, note: "Launch checks for customer-facing products.", tone: "launch" },
    ],
  },
  {
    name: "Middle East",
    summary: "Launch path planning for regional apps, service platforms, admin dashboards, and API backends.",
    supportAreas: ["Business websites", "Backend APIs", "Database planning", "Security setup"],
    providers: ["AWS-ready planning", "Managed PostgreSQL", "Node.js APIs", "Cloud storage"],
    camera: { lat: 25, lng: 48, altitude: 1.85 },
    locations: [
      { name: "Bahrain", lat: 26.07, lng: 50.56, note: "Regional backend and launch planning.", tone: "planning" },
      { name: "UAE", lat: 25.2, lng: 55.27, note: "Business platform deployment guidance.", tone: "launch" },
      { name: "Saudi Arabia", lat: 24.71, lng: 46.67, note: "Provider-dependent hosting and database setup.", tone: "dependent" },
      { name: "Qatar", lat: 25.29, lng: 51.53, note: "App launch checks and monitoring setup.", tone: "launch" },
    ],
  },
  {
    name: "Asia Pacific",
    summary: "Provider location planning for high-growth products serving customers across Asia Pacific.",
    supportAreas: ["SaaS platforms", "Mobile app backends", "Monitoring setup", "Cloud storage"],
    providers: ["Vercel", "Render", "AWS-ready planning", "Managed PostgreSQL"],
    camera: { lat: 13, lng: 116, altitude: 1.8 },
    locations: [
      { name: "Singapore", lat: 1.35, lng: 103.82, note: "Popular API and SaaS deployment planning path.", tone: "planning" },
      { name: "Tokyo", lat: 35.68, lng: 139.76, note: "Provider-dependent frontend and backend setup.", tone: "dependent" },
      { name: "Seoul", lat: 37.57, lng: 126.98, note: "Launch support for regional customer apps.", tone: "launch" },
      { name: "Sydney", lat: -33.87, lng: 151.21, note: "Frontend and backend deployment planning.", tone: "planning" },
      { name: "Jakarta", lat: -6.21, lng: 106.85, note: "Mobile app backend launch guidance.", tone: "launch" },
      { name: "Hong Kong", lat: 22.32, lng: 114.17, note: "Provider-dependent hosting and monitoring setup.", tone: "dependent" },
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
    camera: { lat: 21, lng: 78, altitude: 1.72 },
    locations: [
      { name: "Mumbai", lat: 19.08, lng: 72.88, note: "India-first launch support for business platforms.", tone: "planning" },
      { name: "Hyderabad", lat: 17.39, lng: 78.49, note: "Backend API and database setup planning.", tone: "dependent" },
      { name: "Chennai", lat: 13.08, lng: 80.27, note: "Mobile app backend launch checks.", tone: "launch" },
      { name: "Bengaluru", lat: 12.97, lng: 77.59, note: "SaaS and admin dashboard deployment support.", tone: "planning" },
      { name: "Delhi NCR", lat: 28.61, lng: 77.21, note: "Local service platform launch planning.", tone: "launch" },
    ],
    featured: true,
  },
  {
    name: "Australia",
    summary: "Deployment guidance for provider locations suited to Australian customers and regional apps.",
    supportAreas: ["Static websites", "API hosting", "Database setup", "Launch checks"],
    providers: ["Vercel", "Render", "Managed PostgreSQL", "Cloud storage"],
    camera: { lat: -27, lng: 135, altitude: 1.78 },
    locations: [
      { name: "Sydney", lat: -33.87, lng: 151.21, note: "Common planning path for Australian customer-facing apps.", tone: "planning" },
      { name: "Melbourne", lat: -37.81, lng: 144.96, note: "Business website and API deployment guidance.", tone: "launch" },
      { name: "Perth", lat: -31.95, lng: 115.86, note: "Provider-dependent regional hosting path.", tone: "dependent" },
      { name: "Brisbane", lat: -27.47, lng: 153.03, note: "Launch checks and monitoring setup.", tone: "launch" },
    ],
  },
];

const legendItems = [
  { label: "Available planning", className: "bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.45)]" },
  { label: "Provider dependent", className: "bg-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.45)]" },
  { label: "Launch support", className: "bg-violet-500 shadow-[0_0_18px_rgba(139,92,246,0.42)]" },
];

function getPointColor(location: CoverageLocation) {
  if (location.tone === "launch") {
    return "#8b5cf6";
  }

  if (location.tone === "dependent") {
    return "#06b6d4";
  }

  return "#2563eb";
}

function getPointLabel(location: CoverageLocation, regionName: string) {
  return `
    <div style="
      min-width: 220px;
      max-width: 280px;
      border: 1px solid rgba(191, 219, 254, 0.9);
      background: rgba(255, 255, 255, 0.95);
      color: #0f172a;
      padding: 12px 14px;
      border-radius: 18px;
      box-shadow: 0 18px 48px rgba(37, 99, 235, 0.18);
      backdrop-filter: blur(16px);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div style="font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #2563eb;">
        ${regionName}
      </div>
      <div style="margin-top: 6px; font-size: 15px; line-height: 1.25; font-weight: 800;">
        ${location.name}
      </div>
      <div style="margin-top: 7px; font-size: 12px; line-height: 1.55; font-weight: 600; color: #64748b;">
        ${location.note}
      </div>
    </div>
  `;
}

export default function DatacenterCoverage() {
  const globeRef = useRef<GlobeMethods | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState("India");
  const [hoveredLocation, setHoveredLocation] = useState<CoverageLocation | null>(null);
  const [globeSize, setGlobeSize] = useState({ width: 640, height: 520 });

  const selectedRegion = useMemo(
    () =>
      deploymentRegions.find((region) => region.name === selectedRegionName) ??
      deploymentRegions[0],
    [selectedRegionName],
  );

  const ringData = useMemo(
    () => selectedRegion.locations.filter((location) => location.tone !== "dependent"),
    [selectedRegion],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setGlobeSize({
        width: Math.max(320, Math.round(rect.width)),
        height: Math.max(420, Math.round(rect.height)),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    globeRef.current?.pointOfView(selectedRegion.camera, 1100);
  }, [selectedRegion]);

  function handleGlobeReady() {
    const controls = globeRef.current?.controls();

    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.45;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 230;
      controls.maxDistance = 520;
    }

    globeRef.current?.pointOfView(selectedRegion.camera, 0);
  }

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

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-100/80 bg-white/82 p-4 shadow-sm shadow-blue-100/30">
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    <Globe2 className="h-4 w-4 text-blue-600" strokeWidth={1.9} />
                    Active planning locations
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">
                    {selectedRegion.locations.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100/80 bg-white/82 p-4 shadow-sm shadow-blue-100/30">
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    <Navigation className="h-4 w-4 text-blue-600" strokeWidth={1.9} />
                    Current focus
                  </p>
                  <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                    {hoveredLocation?.name ?? selectedRegion.locations[0]?.name}
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
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 top-16 h-44 w-44 rounded-full bg-violet-100/45 blur-3xl" />
            <div className="relative flex h-full min-h-[34rem] flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-700">
                    Deployment coverage globe
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Drag to explore. Hover a location for details.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/86 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                  <Radar className="h-4 w-4 text-blue-600" strokeWidth={1.9} />
                  Active view: {selectedRegion.name}
                </span>
              </div>

              <div
                ref={containerRef}
                className="relative flex-1 overflow-hidden rounded-[1.45rem] border border-blue-100/80 bg-[radial-gradient(circle_at_50%_42%,rgba(219,234,254,0.86),rgba(255,255,255,0.76)_52%,rgba(239,246,255,0.94))] shadow-inner shadow-blue-100/60"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-60" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border border-blue-200/70 shadow-[0_0_70px_rgba(37,99,235,0.16)]" />
                <div className="absolute inset-0">
                  <Globe
                    ref={globeRef}
                    width={globeSize.width}
                    height={globeSize.height}
                    backgroundColor="rgba(0,0,0,0)"
                    showAtmosphere
                    atmosphereColor="#bfdbfe"
                    atmosphereAltitude={0.22}
                    showGraticules
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    pointsData={selectedRegion.locations}
                    pointLat="lat"
                    pointLng="lng"
                    pointAltitude={(location: object) =>
                      hoveredLocation?.name === (location as CoverageLocation).name ? 0.075 : 0.045
                    }
                    pointRadius={(location: object) =>
                      hoveredLocation?.name === (location as CoverageLocation).name ? 0.78 : 0.46
                    }
                    pointResolution={28}
                    pointColor={(location: object) => getPointColor(location as CoverageLocation)}
                    pointLabel={(location: object) =>
                      getPointLabel(location as CoverageLocation, selectedRegion.name)
                    }
                    onPointHover={(location) => setHoveredLocation((location as CoverageLocation | null) ?? null)}
                    ringsData={ringData}
                    ringLat="lat"
                    ringLng="lng"
                    ringColor={(location: object) => {
                      const point = location as CoverageLocation;
                      const color = getPointColor(point);
                      return (time: number) => {
                        const alpha = Math.max(0, 1 - time);
                        return `${color}${Math.round(alpha * 150)
                          .toString(16)
                          .padStart(2, "0")}`;
                      };
                    }}
                    ringMaxRadius={3.8}
                    ringPropagationSpeed={1.2}
                    ringRepeatPeriod={1400}
                    onGlobeReady={handleGlobeReady}
                    animateIn
                  />
                </div>

                <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-2xl border border-white/80 bg-white/82 p-3 shadow-lg shadow-blue-100/40 backdrop-blur-xl">
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
