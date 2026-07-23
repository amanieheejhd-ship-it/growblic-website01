"use client";

import { useEffect, useRef } from "react";

// Site-wide mouse-reactive dot/line field. Mounted ONCE (root layout via
// GlobalBackgroundMount) as a fixed, full-viewport layer behind all content —
// it also paints the page base colour, since html/body are transparent so a
// negative-z fixed layer can show through (see globals.css).
//
// Performance/behaviour guardrails:
// - Single canvas + single requestAnimationFrame loop for the whole site.
// - Pointer events only record coordinates; they are consumed once per frame,
//   so pointer handling is effectively rAF-throttled.
// - devicePixelRatio capped at 2; resize rebuilds are debounced (150ms).
// - Loop pauses when the tab is hidden (visibilitychange) and when the window
//   loses focus (blur), resuming on focus.
// - prefers-reduced-motion: reduce → one static frame, no drift, no pointer
//   reactivity.
// - Coarse pointers (touch): no cursor effects, calm auto-drift, and a wider
//   grid spacing so fewer points are simulated.
// - pointer-events: none — the layer can never block clicks or scrolling.

const DOT_SPACING_FINE = 56;
const DOT_SPACING_COARSE = 76;
const DPR_CAP = 2;
const CURSOR_RADIUS = 170;
const LINK_RADIUS = 96;
const GLOW_RADIUS = 240;
const RESIZE_DEBOUNCE_MS = 150;

type GridPoint = {
  baseX: number;
  baseY: number;
  phase: number;
  speed: number;
  amp: number;
  x: number;
  y: number;
  lift: number; // 0..1 proximity to the cursor
};

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return; // the CSS washes below remain as the fallback

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");

    let width = 0;
    let height = 0;
    let points: GridPoint[] = [];
    let frameId = 0;
    let resizeTimer = 0;
    let running = false;
    let tabVisible = document.visibilityState === "visible";
    let windowFocused = document.hasFocus();
    const pointer = { clientX: 0, clientY: 0, active: false };

    const buildPoints = () => {
      points = [];
      const spacing = finePointerQuery.matches ? DOT_SPACING_FINE : DOT_SPACING_COARSE;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          // Deterministic per-cell jitter keeps rebuilds visually stable.
          const seed = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
          const jitter = seed - Math.floor(seed);
          points.push({
            baseX: (col - 0.5) * spacing + (jitter - 0.5) * 18,
            baseY: (row - 0.5) * spacing + (jitter - 0.5) * 14,
            phase: jitter * Math.PI * 2,
            speed: 0.00022 + jitter * 0.00016,
            amp: 5 + jitter * 6,
            x: 0,
            y: 0,
            lift: 0,
          });
        }
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      // The canvas is viewport-fixed, so client coordinates map 1:1.
      const pointerReactive =
        pointer.active && finePointerQuery.matches && !reduceMotionQuery.matches;
      const px = pointer.clientX;
      const py = pointer.clientY;

      if (pointerReactive) {
        const glow = context.createRadialGradient(px, py, 0, px, py, GLOW_RADIUS);
        glow.addColorStop(0, "rgba(37, 99, 235, 0.10)");
        glow.addColorStop(0.55, "rgba(6, 182, 212, 0.05)");
        glow.addColorStop(1, "rgba(37, 99, 235, 0)");
        context.fillStyle = glow;
        context.fillRect(px - GLOW_RADIUS, py - GLOW_RADIUS, GLOW_RADIUS * 2, GLOW_RADIUS * 2);
      }

      const near: GridPoint[] = [];
      for (const point of points) {
        point.x = point.baseX + Math.sin(time * point.speed + point.phase) * point.amp;
        point.y = point.baseY + Math.cos(time * point.speed * 0.9 + point.phase) * point.amp * 0.8;

        let lift = 0;
        if (pointerReactive) {
          const dx = point.x - px;
          const dy = point.y - py;
          const distance = Math.hypot(dx, dy);
          if (distance < CURSOR_RADIUS) {
            lift = 1 - distance / CURSOR_RADIUS;
            near.push(point);
          }
        }
        point.lift = lift;

        const radius = 1.1 + lift * 1.7;
        const alpha = 0.22 + lift * 0.55;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(37, 99, 235, ${alpha})`;
        context.fill();
      }

      for (let a = 0; a < near.length; a += 1) {
        for (let b = a + 1; b < near.length; b += 1) {
          const pa = near[a];
          const pb = near[b];
          const distance = Math.hypot(pa.x - pb.x, pa.y - pb.y);
          if (distance < LINK_RADIUS) {
            const strength = Math.min(pa.lift, pb.lift) * (1 - distance / LINK_RADIUS);
            if (strength > 0.02) {
              context.beginPath();
              context.moveTo(pa.x, pa.y);
              context.lineTo(pb.x, pb.y);
              context.strokeStyle = `rgba(37, 99, 235, ${0.28 * strength})`;
              context.lineWidth = 1;
              context.stroke();
            }
          }
        }
      }
    };

    const frame = (time: number) => {
      draw(time);
      canvas.dataset.pointer = pointer.active
        ? `${Math.round(pointer.clientX)},${Math.round(pointer.clientY)}`
        : "inactive";
      frameId = requestAnimationFrame(frame);
    };

    const syncLoop = () => {
      const shouldRun = tabVisible && windowFocused && !reduceMotionQuery.matches;
      if (shouldRun && !running) {
        running = true;
        frameId = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frameId);
      }
      if (!running) {
        draw(0); // reduced-motion / paused states still show the finished field
      }
      canvas.dataset.state = reduceMotionQuery.matches
        ? "static"
        : running
          ? "running"
          : "paused";
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPoints();
      if (!running) draw(0);
    };

    const debouncedResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, RESIZE_DEBOUNCE_MS);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return; // touch: calm drift only
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.active = true;
    };
    const deactivatePointer = () => {
      pointer.active = false;
    };

    const handleVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      syncLoop();
    };
    const handleBlur = () => {
      windowFocused = false;
      deactivatePointer();
      syncLoop();
    };
    const handleFocus = () => {
      windowFocused = true;
      syncLoop();
    };

    resize();
    syncLoop();
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.documentElement.addEventListener("mouseleave", deactivatePointer);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotionQuery.addEventListener("change", syncLoop);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.documentElement.removeEventListener("mouseleave", deactivatePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotionQuery.removeEventListener("change", syncLoop);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Page base colour + brand washes — html/body are transparent, so this
          layer IS the page background (and the static-export fallback when the
          canvas never runs). */}
      <div className="absolute inset-0 bg-[#fbfdff]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_8%,rgba(37,99,235,0.10),transparent_34%),radial-gradient(circle_at_82%_26%,rgba(6,182,212,0.08),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.06),transparent_32%)]" />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Soft viewport-center wash keeps foreground copy readable everywhere. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_45%,rgba(251,253,255,0.5),transparent_72%)]" />
    </div>
  );
}
