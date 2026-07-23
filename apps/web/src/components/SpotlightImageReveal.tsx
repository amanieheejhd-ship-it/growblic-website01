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
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToTouchPreference(callback: () => void) {
  const mediaQuery = window.matchMedia(TOUCH_QUERY);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getTouchPreference() {
  return window.matchMedia(TOUCH_QUERY).matches;
}

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionPreference() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
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
  const hasInteractedRef = useRef(false);
  const [spotlight, setSpotlight] = useState({ ...DEFAULT_POSITION, active: false });
  const [hasInteracted, setHasInteracted] = useState(false);
  const isTouch = useSyncExternalStore(subscribeToTouchPreference, getTouchPreference, () => false);
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  );

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
    if (reduceMotion) return;

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
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 py-14 sm:px-6 sm:py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_84%_12%,rgba(6,182,212,0.10),transparent_26%),linear-gradient(180deg,rgba(239,246,255,0.7),rgba(255,255,255,0.92))]" />

      <div className="relative mx-auto grid max-w-[1800px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
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
            if (isTouch || reduceMotion) return;

            const bounds = event.currentTarget.getBoundingClientRect();
            targetRef.current = {
              x: ((event.clientX - bounds.left) / bounds.width) * 100,
              y: ((event.clientY - bounds.top) / bounds.height) * 100,
            };
            if (!hasInteractedRef.current) {
              hasInteractedRef.current = true;
              setHasInteracted(true);
            }
            setSpotlight((current) => ({
              ...current,
              active: true,
              x: frameRef.current === null ? targetRef.current.x : current.x,
              y: frameRef.current === null ? targetRef.current.y : current.y,
            }));
            startFrame();
          }}
          onPointerEnter={() => {
            if (isTouch || reduceMotion) return;
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
              opacity: isTouch ? 1 : spotlight.active ? 1 : 0,
              WebkitMaskImage: isTouch
                ? "linear-gradient(112deg, transparent 0%, transparent 43%, black 44%, black 100%)"
                : `radial-gradient(circle 235px at ${spotlight.x}% ${spotlight.y}%, black 0%, black 46%, rgba(0,0,0,0.62) 66%, transparent 82%)`,
              maskImage: isTouch
                ? "linear-gradient(112deg, transparent 0%, transparent 43%, black 44%, black 100%)"
                : `radial-gradient(circle 235px at ${spotlight.x}% ${spotlight.y}%, black 0%, black 46%, rgba(0,0,0,0.62) 66%, transparent 82%)`,
            }}
            unoptimized
          />

          {!isTouch && !reduceMotion ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60 opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-100"
              style={{
                left: `${spotlight.x}%`,
                top: `${spotlight.y}%`,
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.85) inset, 0 0 46px rgba(37,99,235,0.32), 0 0 110px rgba(6,182,212,0.24)",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(59,130,246,0.13) 44%, rgba(6,182,212,0.08) 60%, transparent 72%)",
              }}
            />
          ) : null}

          {!isTouch && !hasInteracted && !reduceMotion ? (
            <div className="pointer-events-none absolute left-[54%] top-[42%] h-6 w-6 rounded-full bg-blue-600 shadow-[0_0_0_12px_rgba(37,99,235,0.13),0_0_34px_rgba(37,99,235,0.55)] animate-pulse" />
          ) : null}

          <div className="pointer-events-none absolute inset-3 rounded-[2.25rem] ring-1 ring-inset ring-white/70" />
          <div className="pointer-events-none absolute left-7 top-7 rounded-full border border-blue-100 bg-white/86 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-xl shadow-blue-100/60 backdrop-blur-xl">
            Move cursor over the product preview
          </div>
          <div className="pointer-events-none absolute bottom-8 left-8 right-8 rounded-[1.7rem] border border-white/70 bg-white/82 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
              {isTouch ? "Split reveal" : "Cursor reveal"}
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              {isTouch
                ? "A static split shows the premium intelligence layer on mobile."
                : "Move to reveal the premium intelligence layer."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
