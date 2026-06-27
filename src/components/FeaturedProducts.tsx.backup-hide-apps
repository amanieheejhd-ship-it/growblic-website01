"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { companyApps } from "../data/companyApps";

export default function FeaturedProducts() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const hoverMoveRef = useRef<number | null>(null);
  const autoMoveRef = useRef<number | null>(null);

  const appsLoop = [...companyApps, ...companyApps, ...companyApps];

  const resetInfinitePosition = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const oneSetWidth = slider.scrollWidth / 3;

    if (slider.scrollLeft >= oneSetWidth * 2) {
      slider.scrollTo({ left: oneSetWidth, behavior: "auto" });
    }

    if (slider.scrollLeft <= oneSetWidth * 0.15) {
      slider.scrollTo({ left: oneSetWidth, behavior: "auto" });
    }
  };

  const startHoverMove = (direction: "left" | "right") => {
    stopHoverMove();

    hoverMoveRef.current = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      resetInfinitePosition();

      slider.scrollBy({
        left: direction === "right" ? 42 : -42,
        behavior: "auto",
      });
    }, 16);
  };

  const stopHoverMove = () => {
    if (hoverMoveRef.current) {
      window.clearInterval(hoverMoveRef.current);
      hoverMoveRef.current = null;
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const startMiddle = window.setTimeout(() => {
      slider.scrollTo({
        left: slider.scrollWidth / 3,
        behavior: "auto",
      });
    }, 150);

    autoMoveRef.current = window.setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      resetInfinitePosition();

      slider.scrollBy({
        left: 1.2,
        behavior: "auto",
      });
    }, 18);

    return () => {
      window.clearTimeout(startMiddle);

      if (autoMoveRef.current) {
        window.clearInterval(autoMoveRef.current);
      }

      stopHoverMove();
    };
  }, []);

  return (
    <section id="products" className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
              Growblic Apps
            </p>

            <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
              Our live apps and digital products.
            </h2>
          </div>

          <p className="max-w-xl text-lg font-semibold leading-8 text-slate-600 lg:justify-self-end">
            Explore real apps built by Growblic. Each product card opens a
            dedicated app website page with details, features, and Play Store link.
          </p>
        </div>

        <div className="relative overflow-hidden py-8">
          <button
            onMouseEnter={() => startHoverMove("left")}
            onMouseLeave={stopHoverMove}
            onTouchStart={() => startHoverMove("left")}
            onTouchEnd={stopHoverMove}
            className="app-side-hover-btn left-4"
            aria-label="Move apps left"
          >
            ‹
          </button>

          <button
            onMouseEnter={() => startHoverMove("right")}
            onMouseLeave={stopHoverMove}
            onTouchStart={() => startHoverMove("right")}
            onTouchEnd={stopHoverMove}
            className="app-side-hover-btn right-4"
            aria-label="Move apps right"
          >
            ›
          </button>

          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-[#fbfdff] via-[#fbfdff]/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-[#fbfdff] via-[#fbfdff]/80 to-transparent" />

          <div
            ref={sliderRef}
            className="app-hover-slider flex gap-6 overflow-x-auto pb-6"
          >
            {appsLoop.map((app, index) => (
              <Link
                href={`/apps/${app.slug}`}
                key={`${app.slug}-${index}`}
                className="app-hover-card group"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[2.4rem] border border-blue-100/80 bg-white/90 p-7 shadow-xl shadow-blue-100/45 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-3 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-200/60">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(37,99,235,0.10),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(6,182,212,0.08),transparent_32%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between gap-5">
                    <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-[1.8rem] bg-white shadow-xl shadow-blue-100/70">
                      <img
                        src={app.logo}
                        alt={app.name}
                        className="h-full w-full object-cover"
                      />
                    </span>

                    <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
                      Live
                    </span>
                  </div>

                  <div className="relative mt-8">
                    <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
                      {app.category}
                    </span>

                    <h3 className="mt-6 min-h-[92px] text-3xl font-black leading-tight tracking-tight text-slate-950">
                      {app.name}
                    </h3>

                    <p className="mt-5 line-clamp-4 text-base font-semibold leading-7 text-slate-600">
                      {app.short}
                    </p>
                  </div>

                  <div className="relative mt-auto flex items-center justify-between pt-8">
                    <span className="text-sm font-black text-slate-950">
                      View Product
                    </span>

                    <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-xl font-black text-white transition-all duration-500 group-hover:rotate-[-35deg] group-hover:bg-blue-700">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
