"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";

import { companyApps } from "../data/companyApps";

// Expo-out — the entrance easing used across the site.
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// The sticky band sits under the sticky navbar (same measured heights the hero
// uses), so pinned cards can never slide beneath the nav.
const STICKY_BAND_CLASS =
  "sticky top-[65px] h-[calc(100svh-65px)] sm:top-[73px] sm:h-[calc(100svh-73px)] " +
  "lg:top-[87px] lg:h-[calc(100svh-87px)]";

// Scrub phases: heading alone → heading exits FAST while the first cards
// stream in — fully gone (including spring lag) before the first card's
// leading edge crosses a third of the viewport → train.
const HEADING_FADE = [0.045, 0.095] as const;
const TRAVEL = [0.08, 1] as const;

type CompanyApp = (typeof companyApps)[number];
type CardVariant = "large" | "medium" | "small";

// FRAME TEMPLATE — an exact copy of the reference composition, tiled across
// the track. Each 100vw frame holds five slots; the LARGE seam anchor bleeds
// across frame boundaries, so every frame shows a big card half-cut at each
// edge exactly like the reference. Positions are per-slot literals:
//   x     — left edge in vw, frame-local (negative = bleeds off the left)
//   edge  — which band edge the card is pinned to ("top" | "bottom")
//   inset — distance from that edge as % of the usable band, so vertical
//           composition scales with any viewport height
// Slot geometry (adapted from the measured reference within a few %, adjusted
// for our taller cards so no pair can collide even at the shortest target
// band, 1512×820): A/F seam anchor = L low-tall bleeding the edges; B = S
// upper-left; C = M low-centre; D = S upper right-centre; E = S low
// centre-right. Whitespace pockets between slots are intentional — no filler.
type Slot = {
  tier: CardVariant;
  x: number;
  edge: "top" | "bottom";
  inset: number;
  caption: boolean;
};

const FRAME_SLOTS: Slot[] = [
  { tier: "large", x: -12, edge: "bottom", inset: 4, caption: false }, // A/F seam anchor
  { tier: "small", x: 22, edge: "top", inset: 8, caption: true }, // B
  { tier: "medium", x: 41, edge: "bottom", inset: 14, caption: true }, // C
  { tier: "small", x: 70, edge: "top", inset: 13, caption: true }, // D
  { tier: "small", x: 62, edge: "bottom", inset: 5, caption: true }, // E
];

const APPS_PER_FRAME = FRAME_SLOTS.length;
const FRAME_WIDTH_VW = 100;
const GALLERY_FRAMES = Math.ceil(companyApps.length / APPS_PER_FRAME);
// The last frame only extends as far as its own cards need.
const TRACK_WIDTH_VW = (GALLERY_FRAMES - 1) * FRAME_WIDTH_VW + 60;

// Narrowed size spread so no tier ever reads bare.
const GALLERY_WIDTH_CLASS: Record<CardVariant, string> = {
  large: "w-[25vw] min-w-[380px] max-w-[500px]",
  medium: "w-[19vw] min-w-[290px] max-w-[400px]",
  small: "w-[15.5vw] min-w-[250px] max-w-[330px]",
};

// CHANGE 4 — one identical icon treatment everywhere; only the size varies by
// tier (64 / 56 / 48px). Same radius, ring, shadow, fit, and slot in the card.
const ICON_SIZE_CLASS: Record<CardVariant, string> = {
  large: "h-16 w-16",
  medium: "h-14 w-14",
  small: "h-12 w-12",
};
const ICON_FRAME_CLASS =
  "relative grid shrink-0 place-items-center overflow-hidden rounded-2xl " +
  "bg-white shadow-md shadow-blue-100/60 ring-1 ring-blue-100/70";

// The apps section: a scroll-pinned horizontal gallery on motion-safe desktop,
// falling back to the vertical zigzag collage on mobile and whenever the user
// prefers reduced motion. Both variants render and CSS picks one, so the
// choice is hydration-safe and needs no JS.
export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  // The comet's rAF loop only runs while the section is on screen.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="relative">
      <div className="hidden motion-safe:md:block">
        <PinnedGallery inView={inView} />
      </div>

      <div className="motion-safe:md:hidden">
        <CollageSection />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------- *
 * Pinned horizontal gallery (desktop, motion-safe)
 * ------------------------------------------------------------------------- */

function PinnedGallery({ inView }: { inView: boolean }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // The train starts entirely off-screen RIGHT and ends with its tail filling
  // the viewport, so we need both the track width and the viewport width.
  const [dims, setDims] = useState({ trackW: 0, vw: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () =>
      setDims({ trackW: track.scrollWidth, vw: window.innerWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Cards enter from the RIGHT edge and travel LEFTWARD. The start position
  // adds 12vw beyond the viewport because frame 0's seam anchor sits at
  // -12vw frame-local — without the extra shift it would peek in during the
  // heading-only intro. Scrub-linked and fully reversible.
  const rawX = useTransform(
    scrollYProgress,
    [...TRAVEL],
    [dims.vw * 1.12, -Math.max(dims.trackW - dims.vw, 0)],
  );
  const x = useSpring(rawX, { stiffness: 300, damping: 42, mass: 0.3 });

  // When the measurement lands, snap the spring to its target so the track
  // never visibly sweeps into place.
  useEffect(() => {
    if (dims.trackW > 0) x.jump(rawX.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.trackW, dims.vw]);

  // Heading-only intro: centered block that fades/drifts away as the cards
  // arrive. The opacity is routed through a stiff spring: a lone opacity
  // binding otherwise qualifies for framer's hardware-accelerated
  // ScrollTimeline path, which miscomputes its range inside this sticky
  // section. Springs stay JS-driven, so the mapping is applied faithfully.
  const headingOpacity = useSpring(
    useTransform(scrollYProgress, [...HEADING_FADE], [1, 0]),
    { stiffness: 380, damping: 40, mass: 0.3 },
  );
  const headingY = useTransform(scrollYProgress, [...HEADING_FADE], [0, -48]);
  const headingScale = useTransform(scrollYProgress, [...HEADING_FADE], [1, 0.96]);

  return (
    <div ref={outerRef} className="relative h-[calc(100svh+300vh)]">
      <div className={`${STICKY_BAND_CLASS} overflow-x-clip`}>
        {/* CHANGE 2 — the playful cursor-chasing comet, this section only. */}
        <CometLayer active={inView} />

        {/* Phase A/B: the heading owns the viewport, then fades as the train
            arrives. Below the cards so arriving cards pass over its remnant. */}
        <motion.div
          style={{ opacity: headingOpacity, y: headingY, scale: headingScale }}
          className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-6"
        >
          <div className="max-w-3xl text-center">
            <SectionHeading centered compact />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
              Scroll to explore ↓
            </p>
          </div>
        </motion.div>

        {/* The card train: absolutely positioned frame tiles. App 01 lives in
            the first frame, which leads in from the right edge as the track
            moves left. Hidden until the travel distance is measured (no
            pre-measure flash). */}
        <motion.div
          ref={trackRef}
          style={{
            x,
            width: `${TRACK_WIDTH_VW}vw`,
            visibility: dims.trackW > 0 ? "visible" : "hidden",
          }}
          className="relative z-10 h-full will-change-transform"
        >
          {companyApps.map((app, index) => (
            <GalleryItem
              key={app.slug}
              app={app}
              index={index}
              progress={scrollYProgress}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function GalleryItem({
  app,
  index,
  progress,
}: {
  app: CompanyApp;
  index: number;
  progress: MotionValue<number>;
}) {
  const frame = Math.floor(index / APPS_PER_FRAME);
  const slot = FRAME_SLOTS[index % APPS_PER_FRAME];

  // Subtle depth, capped to a few px — far smaller than any slot separation.
  const depthX = useTransform(progress, [0, 1], [0, index % 2 ? -4 : 3]);

  return (
    <div
      className={["absolute", GALLERY_WIDTH_CLASS[slot.tier]].join(" ")}
      style={{
        left: `${frame * FRAME_WIDTH_VW + slot.x}vw`,
        [slot.edge]: `${slot.inset}%`,
      }}
    >
      <motion.div style={{ x: depthX }} className="w-full">
        {slot.caption ? (
          // Reference-style caption above the card: category only, no number.
          <p className="mb-2 truncate px-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            {app.category}
          </p>
        ) : null}
        <AppCard app={app} variant={slot.tier} />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * Cursor-chasing comet (this section only)
 * ------------------------------------------------------------------------- */

// A little spirit that darts around the pinned viewport: a leading glow dot
// chased by trailing sparks on progressively softer springs. It chases the
// cursor with springy lag, orbits the pointer when it rests, and falls back
// to a deterministic lissajous wander when the pointer leaves (or on touch).
// rAF-driven target + spring-driven rendering — no layout writes, no thrash.
const COMET_IDLE_MS = 900;
const COMET_ORBIT_RADIUS = 38;
const COMET_SPARKS = [
  { size: 7, opacity: 0.75, stiffness: 150, damping: 16 },
  { size: 6, opacity: 0.6, stiffness: 120, damping: 15 },
  { size: 5, opacity: 0.45, stiffness: 95, damping: 14 },
  { size: 4, opacity: 0.32, stiffness: 75, damping: 13 },
  { size: 3, opacity: 0.2, stiffness: 60, damping: 12 },
] as const;

function CometLayer({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  // Leader: pronounced lag/overshoot so it "runs after" the pointer.
  const leadX = useSpring(targetX, { stiffness: 110, damping: 13, mass: 0.6 });
  const leadY = useSpring(targetY, { stiffness: 110, damping: 13, mass: 0.6 });
  // Trailing sparks: each follows the previous with a softer spring, forming a
  // short fading trail. (Hooks are called statically, one pair per spark.)
  const s1x = useSpring(leadX, COMET_SPARKS[0]);
  const s1y = useSpring(leadY, COMET_SPARKS[0]);
  const s2x = useSpring(s1x, COMET_SPARKS[1]);
  const s2y = useSpring(s1y, COMET_SPARKS[1]);
  const s3x = useSpring(s2x, COMET_SPARKS[2]);
  const s3y = useSpring(s2y, COMET_SPARKS[2]);
  const s4x = useSpring(s3x, COMET_SPARKS[3]);
  const s4y = useSpring(s3y, COMET_SPARKS[3]);
  const s5x = useSpring(s4x, COMET_SPARKS[4]);
  const s5y = useSpring(s4y, COMET_SPARKS[4]);
  const sparkValues = [
    [s1x, s1y],
    [s2x, s2y],
    [s3x, s3y],
    [s4x, s4y],
    [s5x, s5y],
  ] as const;

  useEffect(() => {
    if (!active || reduceMotion) return;
    if (document.visibilityState !== "visible") return;

    let frameId = 0;
    let orbitAngle = 0;
    let lastTime = performance.now();
    const pointer = { x: 0, y: 0, seen: false, movedAt: 0 };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return; // touch: autonomous wander
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.seen = true;
      pointer.movedAt = performance.now();
    };

    const frame = (now: number) => {
      const root = rootRef.current;
      if (root) {
        const rect = root.getBoundingClientRect();
        const deltaT = Math.min(now - lastTime, 64);
        lastTime = now;
        const inside =
          pointer.seen &&
          pointer.x >= rect.left &&
          pointer.x <= rect.right &&
          pointer.y >= rect.top &&
          pointer.y <= rect.bottom;

        if (inside) {
          const localX = pointer.x - rect.left;
          const localY = pointer.y - rect.top;
          if (now - pointer.movedAt > COMET_IDLE_MS) {
            // Pointer resting: circle it playfully.
            orbitAngle += deltaT * 0.0028;
            targetX.set(localX + Math.cos(orbitAngle) * COMET_ORBIT_RADIUS);
            targetY.set(localY + Math.sin(orbitAngle) * COMET_ORBIT_RADIUS);
          } else {
            targetX.set(localX);
            targetY.set(localY);
          }
        } else {
          // Deterministic lissajous wander (time-based, no randomness).
          targetX.set(rect.width * (0.5 + 0.34 * Math.sin(now * 0.00023)));
          targetY.set(rect.height * (0.5 + 0.3 * Math.sin(now * 0.00031 + 1.3)));
        }
      }
      frameId = requestAnimationFrame(frame);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(frameId);
      if (document.visibilityState === "visible") {
        lastTime = performance.now();
        frameId = requestAnimationFrame(frame);
      }
    };

    frameId = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [active, reduceMotion, targetX, targetY]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      // Hidden under reduced motion at the CSS level too, so no comet renders
      // even before the JS hook syncs.
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden"
    >
      {/* Trailing sparks (rendered under the leader). */}
      {COMET_SPARKS.map((spark, index) => (
        <motion.span
          key={spark.size}
          data-comet={`spark-${index + 1}`}
          style={{
            x: sparkValues[index][0],
            y: sparkValues[index][1],
            width: spark.size,
            height: spark.size,
            marginLeft: -spark.size / 2,
            marginTop: -spark.size / 2,
            opacity: spark.opacity,
          }}
          className="absolute left-0 top-0 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 blur-[1px]"
        />
      ))}

      {/* Leading glow dot. */}
      <motion.span
        data-comet="lead"
        style={{ x: leadX, y: leadY, marginLeft: -5, marginTop: -5 }}
        className="absolute left-0 top-0 h-[10px] w-[10px] rounded-full bg-gradient-to-br from-blue-500 to-violet-500 shadow-[0_0_14px_5px_rgba(99,102,241,0.35)]"
      />
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * Vertical zigzag collage (mobile + reduced-motion fallback)
 * ------------------------------------------------------------------------- */

function CollageSection() {
  return (
    <div className="relative overflow-x-clip px-6 py-24 pb-40">
      <div className="relative z-10 mx-auto max-w-[1800px]">
        <div className="mb-12">
          <SectionHeading />
        </div>

        {/* Tighter vertical rhythm — same "no big dead bands" spirit as the
            gallery. */}
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 md:gap-x-16 md:gap-y-4">
          {companyApps.map((app, index) => (
            <CollageItem key={app.slug} app={app} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CollageItem({ app, index }: { app: CompanyApp; index: number }) {
  const reduceMotion = useReducedMotion() ?? false;
  // First card slides in from the RIGHT, matching the gallery's direction.
  const fromRight = index % 2 === 0;
  const isFeature = index % 3 === 0;

  const reveal: Variants = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : fromRight ? 74 : -74 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.82,
        ease: EXPO_OUT,
        delay: reduceMotion ? 0 : (index % 2) * 0.09,
      },
    },
  };

  return (
    <motion.div
      variants={reveal}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
      className={[
        "min-w-0",
        // CSS-level reduced-motion guarantee: important beats framer's inline
        // styles, so the collage is statically visible under reduce even
        // before the JS hook has synced on first render.
        "motion-reduce:transform-none! motion-reduce:opacity-100!",
        fromRight ? "md:mt-20" : "",
        isFeature ? "" : "md:px-6",
      ].join(" ")}
    >
      <AppCard app={app} variant={isFeature ? "large" : "medium"} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------------- *
 * Shared pieces
 * ------------------------------------------------------------------------- */

function SectionHeading({
  compact = false,
  centered = false,
}: {
  compact?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "flex flex-col items-center" : undefined}>
      <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
        Growblic Apps
      </p>

      <h2
        className={[
          "mt-4 font-black leading-[0.95] tracking-tight text-slate-950",
          compact ? "text-4xl xl:text-6xl" : "text-5xl md:text-6xl xl:text-7xl",
        ].join(" ")}
      >
        Our live apps and digital products.
      </h2>

      <p
        className={[
          "mt-6 max-w-xl font-semibold text-slate-600",
          compact ? "text-base leading-7" : "text-lg leading-8",
        ].join(" ")}
      >
        Explore real apps built by Growblic. Each product card opens a dedicated
        app website page with details, features, and Play Store link.
      </p>
    </div>
  );
}

// The app card — no numbering, no external caption. One design language
// scaled across all three tiers, matched to the site's established surfaces:
// soft large radius, top-lit white gradient, hairline border, layered
// blue-tinted shadow, glowing icon, quiet category pill, muted description,
// and a footer row whose arrow nudges right on hover. The whole card lifts on
// a spring when hovered.
function AppCard({ app, variant }: { app: CompanyApp; variant: CardVariant }) {
  const large = variant === "large";
  const medium = variant === "medium";

  return (
    <Link href={`/apps/${app.slug}`} className="group block min-w-0">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={[
          "relative flex h-full flex-col overflow-hidden border border-blue-100/60",
          "bg-gradient-to-b from-white via-white to-[#f4f8ff]",
          "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-16px_rgba(37,99,235,0.18)]",
          "transition-shadow duration-500 ease-out",
          "group-hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_28px_56px_-20px_rgba(37,99,235,0.28)]",
          large ? "rounded-[2.4rem] p-7 sm:p-8" : medium ? "rounded-[2rem] p-5" : "rounded-[2rem] p-4",
        ].join(" ")}
      >
        <div className="relative flex items-start justify-between gap-3">
          {/* Icon with a faint brand-tinted glow behind its frame. */}
          <span className="relative shrink-0">
            <span
              aria-hidden
              className="absolute -inset-2 rounded-[1.6rem] bg-gradient-to-br from-blue-400/25 via-cyan-300/15 to-violet-400/20 blur-md"
            />
            <span className={`${ICON_FRAME_CLASS} ${ICON_SIZE_CLASS[variant]}`}>
              <Image
                src={app.logo}
                alt={app.name}
                fill
                sizes={large ? "64px" : medium ? "56px" : "48px"}
                className="object-cover"
                unoptimized
              />
            </span>
          </span>

          <span
            className={[
              "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50/90 font-black text-emerald-600 ring-1 ring-emerald-100",
              large ? "px-3.5 py-1.5 text-xs" : "px-3 py-1 text-[10px]",
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>

        <div className={large ? "relative mt-6" : "relative mt-4"}>
          <span
            className={[
              "inline-block max-w-full truncate rounded-full bg-blue-50/80 font-black text-blue-600",
              large ? "px-3.5 py-1.5 text-[11px]" : "px-3 py-1 text-[10px]",
            ].join(" ")}
          >
            {app.category}
          </span>

          <h3
            className={[
              "font-black leading-tight tracking-tight text-slate-950",
              large ? "mt-4 text-3xl" : medium ? "mt-3 text-xl" : "mt-2.5 text-lg",
            ].join(" ")}
          >
            {app.name}
          </h3>

          {large ? (
            <p className="mt-3 line-clamp-3 text-base font-semibold leading-7 text-slate-500">
              {app.short}
            </p>
          ) : (
            <p
              className={[
                "mt-2 text-slate-500",
                medium
                  ? "line-clamp-2 text-sm font-semibold leading-6"
                  : "line-clamp-1 text-xs font-medium leading-5",
              ].join(" ")}
            >
              {app.short}
            </p>
          )}
        </div>

        {/* Tidy footer row, separated by a hairline. */}
        <div
          className={[
            "relative mt-auto flex items-center justify-between border-t border-slate-100",
            large ? "pt-5" : "pt-4",
          ].join(" ")}
        >
          <span
            className={[
              "font-black text-slate-950",
              variant === "small" ? "text-xs" : "text-sm",
            ].join(" ")}
          >
            View Product
          </span>

          <span
            className={[
              "grid place-items-center rounded-full bg-slate-950 font-black text-white transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:bg-blue-700",
              large ? "h-11 w-11 text-lg" : medium ? "h-9 w-9 text-base" : "h-8 w-8 text-sm",
            ].join(" ")}
          >
            →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
