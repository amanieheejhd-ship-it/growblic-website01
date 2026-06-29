"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type SpotlightImageRevealProps = {
  baseImage: string;
  revealImage: string;
  alt: string;
  title?: string;
  eyebrow?: string;
  description?: string;
};

const DEFAULT_POSITION = { x: 50, y: 50 };
const TOUCH_QUERY = "(hover: none), (pointer: coarse)";

function subscribeToTouchPreference(callback: () => void) {
  const mediaQuery = window.matchMedia(TOUCH_QUERY);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getTouchPreference() {
  return window.matchMedia(TOUCH_QUERY).matches;
}

export default function SpotlightImageReveal({
  baseImage,
  revealImage,
  alt,
  title,
  eyebrow,
  description,
}: SpotlightImageRevealProps) {
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef(DEFAULT_POSITION);
  const currentRef = useRef(DEFAULT_POSITION);
  const [spotlight, setSpotlight] = useState({ ...DEFAULT_POSITION, active: false });
  const isTouch = useSyncExternalStore(subscribeToTouchPreference, getTouchPreference, () => false);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const moveSpotlight = () => {
    currentRef.current = {
      x: currentRef.current.x + (targetRef.current.x - currentRef.current.x) * 0.18,
      y: currentRef.current.y + (targetRef.current.y - currentRef.current.y) * 0.18,
    };

    setSpotlight((current) => ({
      ...current,
      x: currentRef.current.x,
      y: currentRef.current.y,
    }));

    frameRef.current = window.requestAnimationFrame(moveSpotlight);
  };

  const startFrame = () => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(moveSpotlight);
    }
  };

  const stopFrame = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-6 py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_84%_12%,rgba(6,182,212,0.10),transparent_26%),linear-gradient(180deg,rgba(239,246,255,0.7),rgba(255,255,255,0.92))]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          {eyebrow ? (
            <p className="inline-flex rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-700 shadow-lg shadow-blue-100/50">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              {description}
            </p>
          ) : null}

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["Strategy", "AI layer", "Launch"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-blue-100 bg-white/88 p-4 text-sm font-black text-slate-700 shadow-lg shadow-blue-100/40"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          className="group relative min-h-[360px] overflow-hidden rounded-[2.6rem] border border-blue-100/80 bg-white p-3 shadow-2xl shadow-blue-100/70 sm:min-h-[520px]"
          onPointerMove={(event) => {
            if (isTouch) return;

            const bounds = event.currentTarget.getBoundingClientRect();
            targetRef.current = {
              x: ((event.clientX - bounds.left) / bounds.width) * 100,
              y: ((event.clientY - bounds.top) / bounds.height) * 100,
            };
            setSpotlight((current) => ({ ...current, active: true }));
            startFrame();
          }}
          onPointerLeave={() => {
            setSpotlight((current) => ({ ...current, active: false }));
            stopFrame();
          }}
        >
          <div className="absolute inset-0 rounded-[2.6rem] bg-gradient-to-br from-blue-100/80 via-white to-cyan-100/70" />
          <Image
            src={baseImage}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 760px"
            className="rounded-[2.25rem] object-cover p-3"
            priority
            unoptimized
          />
          <Image
            src={revealImage}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 760px"
            aria-hidden="true"
            className="rounded-[2.25rem] object-cover p-3 transition-opacity duration-500"
            style={{
              opacity: isTouch || spotlight.active ? 1 : 0,
              WebkitMaskImage: isTouch
                ? "linear-gradient(135deg, transparent 0%, black 42%, black 100%)"
                : `radial-gradient(circle 155px at ${spotlight.x}% ${spotlight.y}%, black 0%, black 42%, rgba(0,0,0,0.58) 58%, transparent 76%)`,
              maskImage: isTouch
                ? "linear-gradient(135deg, transparent 0%, black 42%, black 100%)"
                : `radial-gradient(circle 155px at ${spotlight.x}% ${spotlight.y}%, black 0%, black 42%, rgba(0,0,0,0.58) 58%, transparent 76%)`,
            }}
            unoptimized
          />

          <div className="pointer-events-none absolute inset-3 rounded-[2.25rem] ring-1 ring-inset ring-white/70" />
          <div className="pointer-events-none absolute bottom-8 left-8 right-8 rounded-[1.7rem] border border-white/70 bg-white/78 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
              Cursor reveal
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              Move to reveal the premium intelligence layer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
