"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Cloud,
  Database,
  Layers3,
  MapPin,
  Radar,
  Server,
} from "lucide-react";
import { feature } from "topojson-client";
import * as THREE from "three";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

type SupportPoint = {
  name: string;
  lat: number;
  lng: number;
  type: "Available planning" | "Provider dependent" | "Launch support";
  note: string;
};

type Region = {
  name: string;
  summary: string;
  focus: string;
  setupPaths: string[];
  stackOptions: string[];
  points: SupportPoint[];
};

const deploymentRegions: Region[] = [
  {
    name: "North America",
    summary:
      "Deployment planning for SaaS platforms, APIs, and customer-facing products across major North American provider locations.",
    focus: "SaaS, APIs, dashboards",
    setupPaths: ["Static websites", "Node.js APIs", "Database hosting", "Monitoring setup"],
    stackOptions: ["Render", "Vercel", "AWS-ready planning", "Managed PostgreSQL"],
    points: [
      { name: "US East (Northern Virginia)", lat: 39.04, lng: -77.49, type: "Available planning", note: "Common path for web apps and APIs." },
      { name: "US East (Ohio)", lat: 40.41, lng: -82.91, type: "Provider dependent", note: "Useful for US customer coverage." },
      { name: "US West (Northern California)", lat: 37.77, lng: -122.41, type: "Launch support", note: "West coast deployment planning." },
      { name: "Canada (Central)", lat: 45.5, lng: -73.56, type: "Available planning", note: "Canada-focused hosting planning." },
      { name: "Canada West (Calgary)", lat: 51.04, lng: -114.07, type: "Provider dependent", note: "Provider-dependent setup path." },
      { name: "Mexico (Central)", lat: 19.43, lng: -99.13, type: "Launch support", note: "Mexico launch readiness planning." },
    ],
  },
  {
    name: "Europe",
    summary:
      "Cloud region planning for GDPR-aware product launches, business websites, dashboards, and backend services.",
    focus: "EU websites and SaaS",
    setupPaths: ["Business websites", "SaaS platforms", "Admin dashboards", "Logs and monitoring"],
    stackOptions: ["Vercel", "Render", "PostgreSQL", "Cloud storage"],
    points: [
      { name: "London", lat: 51.5, lng: -0.12, type: "Available planning", note: "UK launch planning." },
      { name: "Frankfurt", lat: 50.11, lng: 8.68, type: "Provider dependent", note: "EU infrastructure setup path." },
      { name: "Paris", lat: 48.85, lng: 2.35, type: "Launch support", note: "France customer coverage planning." },
      { name: "Milan", lat: 45.46, lng: 9.19, type: "Available planning", note: "Italy deployment planning." },
      { name: "Stockholm", lat: 59.33, lng: 18.06, type: "Provider dependent", note: "Nordic launch support." },
      { name: "Spain", lat: 40.41, lng: -3.7, type: "Launch support", note: "Spain launch readiness planning." },
    ],
  },
  {
    name: "Middle East",
    summary:
      "Provider-dependent hosting and backend planning for products serving GCC and nearby business regions.",
    focus: "GCC launch support",
    setupPaths: ["Business websites", "Backend APIs", "Database planning", "Domain and HTTPS setup"],
    stackOptions: ["Render", "Managed database", "Cloud storage", "DNS setup"],
    points: [
      { name: "Bahrain", lat: 26.06, lng: 50.55, type: "Available planning", note: "GCC provider planning path." },
      { name: "UAE", lat: 25.2, lng: 55.27, type: "Launch support", note: "Dubai/Abu Dhabi launch guidance." },
      { name: "Saudi Arabia", lat: 24.71, lng: 46.67, type: "Provider dependent", note: "Provider-dependent deployment path." },
      { name: "Qatar", lat: 25.28, lng: 51.52, type: "Launch support", note: "Regional launch planning." },
    ],
  },
  {
    name: "Asia Pacific",
    summary:
      "Provider location planning for high-growth products serving customers across Asia Pacific.",
    focus: "APAC product launches",
    setupPaths: ["SaaS platforms", "Mobile app backends", "Monitoring setup", "Cloud storage"],
    stackOptions: ["Vercel", "Render", "AWS-ready planning", "Managed PostgreSQL"],
    points: [
      { name: "Singapore", lat: 1.35, lng: 103.81, type: "Available planning", note: "Popular APAC deployment planning." },
      { name: "Tokyo", lat: 35.67, lng: 139.65, type: "Provider dependent", note: "Japan-focused setup path." },
      { name: "Seoul", lat: 37.56, lng: 126.97, type: "Launch support", note: "Korea launch support planning." },
      { name: "Sydney", lat: -33.86, lng: 151.2, type: "Available planning", note: "Australia/APAC launch readiness." },
      { name: "Jakarta", lat: -6.2, lng: 106.81, type: "Provider dependent", note: "Indonesia customer coverage planning." },
      { name: "Hong Kong", lat: 22.31, lng: 114.16, type: "Launch support", note: "Regional provider planning." },
    ],
  },
  {
    name: "India",
    summary:
      "India-first launch support for business websites, mobile app backends, admin dashboards, and local service platforms.",
    focus: "India-first launch support",
    setupPaths: ["Business websites", "Mobile app backends", "Admin dashboards", "Local service platforms"],
    stackOptions: ["GitHub Pages", "Render", "Vercel", "Managed PostgreSQL"],
    points: [
      { name: "Mumbai", lat: 19.07, lng: 72.87, type: "Available planning", note: "India product launch planning." },
      { name: "Hyderabad", lat: 17.38, lng: 78.48, type: "Provider dependent", note: "Backend and database setup planning." },
      { name: "Chennai", lat: 13.08, lng: 80.27, type: "Launch support", note: "South India launch support." },
      { name: "Bengaluru", lat: 12.97, lng: 77.59, type: "Available planning", note: "Startup and SaaS setup planning." },
      { name: "Delhi NCR", lat: 28.61, lng: 77.2, type: "Launch support", note: "Business website and app launch planning." },
    ],
  },
  {
    name: "Australia",
    summary:
      "Launch planning and provider selection for websites, SaaS products, and backend services across Australia.",
    focus: "Australia launch planning",
    setupPaths: ["Static websites", "SaaS platforms", "Mobile backends", "Monitoring"],
    stackOptions: ["Vercel", "Render", "Cloud storage", "Managed database"],
    points: [
      { name: "Sydney", lat: -33.86, lng: 151.2, type: "Available planning", note: "Primary Australia launch planning." },
      { name: "Melbourne", lat: -37.81, lng: 144.96, type: "Launch support", note: "Victoria customer coverage planning." },
      { name: "Perth", lat: -31.95, lng: 115.86, type: "Provider dependent", note: "Western Australia provider planning." },
      { name: "Brisbane", lat: -27.47, lng: 153.02, type: "Launch support", note: "Queensland launch readiness." },
    ],
  },
];


const stylizedGlobeTexture =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512">
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eff6ff"/>
          <stop offset="38%" stop-color="#dff7ff"/>
          <stop offset="70%" stop-color="#bfdbfe"/>
          <stop offset="100%" stop-color="#e0f2fe"/>
        </linearGradient>
        <radialGradient id="glow" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.92"/>
          <stop offset="45%" stop-color="#dbeafe" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#93c5fd" stop-opacity="0.18"/>
        </radialGradient>
      </defs>
      <rect width="1024" height="512" fill="url(#ocean)"/>
      <rect width="1024" height="512" fill="url(#glow)"/>
      <g stroke="#60a5fa" stroke-width="1" opacity="0.22">
        <path d="M0 64H1024M0 128H1024M0 192H1024M0 256H1024M0 320H1024M0 384H1024M0 448H1024"/>
        <path d="M128 0V512M256 0V512M384 0V512M512 0V512M640 0V512M768 0V512M896 0V512"/>
      </g>
    </svg>
  `);

const pointColors: Record<SupportPoint["type"], string> = {
  "Available planning": "#2563eb",
  "Provider dependent": "#06b6d4",
  "Launch support": "#8b5cf6",
};

export function DatacenterCoverage() {
  const [activeRegion, setActiveRegion] = useState(deploymentRegions[0]);
  const [countries, setCountries] = useState<object[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<SupportPoint | null>(null);
  const globeRef = useRef<any>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [globeSize, setGlobeSize] = useState(520);

  useEffect(() => {
    const updateSize = () => {
      const width = wrapRef.current?.clientWidth || 520;
      setGlobeSize(Math.max(320, Math.min(width - 24, 560)));
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    if (wrapRef.current) observer.observe(wrapRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((world) => {
        if (cancelled) return;

        const geo = feature(world, world.objects.countries) as any;
        setCountries(geo.features || []);
      })
      .catch(() => {
        setCountries([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const mainPoint = activeRegion.points[0];
    globe.pointOfView(
      {
        lat: mainPoint.lat,
        lng: mainPoint.lng,
        altitude: 1.85,
      },
      900
    );
  }, [activeRegion]);

  const ringsData = useMemo(
    () =>
      activeRegion.points.map((point) => ({
        ...point,
        color: pointColors[point.type],
      })),
    [activeRegion]
  );

  const activePointNames = useMemo(
    () => new Set(activeRegion.points.map((point) => point.name)),
    [activeRegion]
  );

  const selectedRegionLabel = hoveredPoint
    ? `${hoveredPoint.name} • ${hoveredPoint.type}`
    : activeRegion.focus;

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[2.25rem] border border-blue-100 bg-white/70 p-5 shadow-[0_30px_100px_rgba(37,99,235,0.10)] backdrop-blur-2xl sm:p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.45em] text-blue-600">
              Growblic Global Deployment Coverage
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 lg:text-5xl">
              Plan launches across cloud regions without overcomplicating the stack.
            </h2>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-slate-600">
              Growblic helps choose hosting paths, backend regions, databases, monitoring, and deployment workflows based on your product audience.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] border border-blue-100/80 bg-white/75 p-5 shadow-[0_22px_75px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-wrap gap-2">
              {deploymentRegions.map((region) => (
                <button
                  key={region.name}
                  type="button"
                  onClick={() => setActiveRegion(region)}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeRegion.name === region.name
                      ? "border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-[0_18px_45px_rgba(37,99,235,0.24)]"
                      : "border-blue-100 bg-white/80 text-slate-600 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-5 shadow-inner">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-[0_16px_35px_rgba(37,99,235,0.25)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
                    Deployment planning region
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    {activeRegion.name}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                    {activeRegion.summary}
                  </p>
                  <div className="mt-4 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    {activeRegion.points.length} planning locations • {selectedRegionLabel}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                    <Layers3 className="h-4 w-4 text-blue-600" />
                    Supported setup paths
                  </p>
                  <div className="space-y-2">
                    {activeRegion.setupPaths.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-black text-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                    <Database className="h-4 w-4 text-cyan-600" />
                    Provider / stack options
                  </p>
                  <div className="space-y-2">
                    {activeRegion.stackOptions.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-black text-slate-700"
                      >
                        <Server className="h-4 w-4 text-cyan-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-blue-100/80 bg-white/75 p-4 shadow-[0_22px_75px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">
                  Deployment coverage globe
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Drag to explore. Hover a location for details.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
                <Radar className="h-4 w-4 text-blue-600" />
                Active view: {activeRegion.name}
              </div>
            </div>

            <div
              ref={wrapRef}
              className="relative min-h-[430px] overflow-hidden rounded-[1.7rem] border border-blue-100 bg-[radial-gradient(circle_at_50%_45%,rgba(219,234,254,0.95),rgba(240,249,255,0.85)_42%,rgba(255,255,255,0.92)_70%)] shadow-inner"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/25 blur-3xl" />

              <div className="relative z-10 flex min-h-[430px] items-center justify-center">
                <Globe
                  ref={globeRef}
                  width={globeSize}
                  height={globeSize}
                  backgroundColor="rgba(0,0,0,0)"
                  showAtmosphere
                  atmosphereColor="#7dd3fc"
                  atmosphereAltitude={0.22}
                  globeImageUrl={stylizedGlobeTexture}
                  bumpImageUrl={undefined}
                  polygonsData={countries}
                  polygonAltitude={(feature: any) => {
                    const centroidName = String(feature?.properties?.name || "");
                    return centroidName ? 0.008 : 0.006;
                  }}
                  polygonCapColor={() => "rgba(14, 165, 233, 0.42)"}
                  polygonSideColor={() => "rgba(59, 130, 246, 0.18)"}
                  polygonStrokeColor={() => "rgba(37, 99, 235, 0.62)"}
                  polygonsTransitionDuration={300}
                  pointsData={activeRegion.points}
                  pointLat="lat"
                  pointLng="lng"
                  pointAltitude={0.045}
                  pointRadius={(point: object) => {
                    const supportPoint = point as SupportPoint;
                    return hoveredPoint?.name === supportPoint.name ? 0.72 : 0.48;
                  }}
                  pointColor={(point: object) => {
                    const supportPoint = point as SupportPoint;
                    return pointColors[supportPoint.type];
                  }}
                  pointResolution={24}
                  pointLabel={(point: object) => {
                    const supportPoint = point as SupportPoint;
                    return `
                    <div style="
                      padding: 12px 14px;
                      border-radius: 16px;
                      background: rgba(255,255,255,0.94);
                      border: 1px solid rgba(147,197,253,0.75);
                      box-shadow: 0 18px 45px rgba(15,23,42,0.16);
                      color: #0f172a;
                      font-family: Inter, ui-sans-serif, system-ui;
                      min-width: 190px;
                    ">
                      <div style="font-size: 12px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; color: ${pointColors[supportPoint.type]};">
                        ${supportPoint.type}
                      </div>
                      <div style="margin-top: 5px; font-size: 16px; font-weight: 900;">
                        ${supportPoint.name}
                      </div>
                      <div style="margin-top: 4px; font-size: 13px; font-weight: 700; color: #64748b;">
                        ${activeRegion.name}
                      </div>
                      <div style="margin-top: 8px; font-size: 12px; line-height: 1.55; color: #475569;">
                        ${supportPoint.note}
                      </div>
                    </div>
                  `;
                  }}
                  onPointHover={(point: object | null) =>
                    setHoveredPoint(point ? (point as SupportPoint) : null)
                  }
                  ringsData={ringsData}
                  ringLat="lat"
                  ringLng="lng"
                  ringColor={(point: object) => {
                    const supportPoint = point as SupportPoint & { color: string };
                    return () => supportPoint.color;
                  }}
                  ringMaxRadius={3.2}
                  ringPropagationSpeed={1.2}
                  ringRepeatPeriod={1400}
                  onGlobeReady={() => {
                    const globe = globeRef.current;
                    if (!globe) return;

                    const material = globe.globeMaterial() as THREE.MeshPhongMaterial;
                    material.color = new THREE.Color("#ffffff");
                    material.emissive = new THREE.Color("#c7f9ff");
                    material.emissiveIntensity = 0.42;
                    material.shininess = 18;
                    material.transparent = true;
                    material.opacity = 1;
                    material.needsUpdate = true;

                    const controls = globe.controls();
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = 0.55;
                    controls.enableZoom = false;

                    const firstPoint = activeRegion.points[0];
                    globe.pointOfView(
                      {
                        lat: firstPoint.lat,
                        lng: firstPoint.lng,
                        altitude: 1.85,
                      },
                      500
                    );
                  }}
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-xs font-black text-slate-600 shadow-sm backdrop-blur-xl">
                {Object.entries(pointColors).map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm font-semibold leading-7 text-slate-500">
              Coverage depends on selected cloud and hosting provider. Growblic helps
              plan and configure deployments; it does not operate physical cloud regions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DatacenterCoverage;
