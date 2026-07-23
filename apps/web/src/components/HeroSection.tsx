"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

// The mouse-reactive background is now site-wide: a single GlobalBackground
// canvas mounted once in the root layout sits fixed behind every page, so the
// hero paints no background of its own.

// Expo-out: the entrance easing used across the hero.
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// The navbar is `sticky top-0`, so it occupies flow above the hero instead of
// overlapping it. Subtracting its height (the same breakpoints the navbar uses
// for its own offsets) makes the hero exactly one viewport tall, which keeps the
// scroll cue and marquee above the fold. Top padding stays small for the same
// reason — there is nothing to clear.
const HERO_SECTION_CLASS =
  "relative flex min-h-[calc(100svh-65px)] flex-col overflow-hidden " +
  "px-4 pb-8 pt-10 sm:min-h-[calc(100svh-73px)] sm:px-6 sm:pb-10 sm:pt-12 " +
  "lg:min-h-[calc(100svh-87px)]";

const HEADLINE_LINES = [
  [{ text: "Ideas, engineered" }],
  [{ text: "into software" }],
  [{ text: "people ", accent: false }, { text: "love to use", accent: true }, { text: "." }],
] satisfies { text: string; accent?: boolean }[][];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // Parallax is driven by the native scroll position of the hero section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Reduced motion keeps the same markup (no hydration mismatch) but maps every
  // scroll transform to an identity value, so nothing moves.
  const contentY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 110]);
  const contentScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 0.965]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    reduceMotion ? [1, 1] : [1, 0],
  );

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.06,
      },
    },
  };

  // Headline lines ride up from below their own overflow-hidden mask.
  const line: Variants = {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration: reduceMotion ? 0 : 1, ease: EXPO_OUT },
    },
  };

  // Everything below the headline fades and rises slightly after it lands.
  const rise: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.75, ease: EXPO_OUT },
    },
  };

  return (
    <section
      ref={sectionRef}
      className={HERO_SECTION_CLASS}
    >
      <motion.div
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1800px] flex-1 flex-col justify-center"
      >
        {/* Fully centered composition: badge, headline, sub-headline and CTAs
            all sit on the page's center axis. */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="flex flex-col items-center text-center"
        >
          <div className="overflow-hidden">
            <motion.div variants={rise}>
              <span className="inline-flex max-w-full items-center gap-3 rounded-full border border-blue-100 bg-[#fbfdff]/90 px-3 py-2 text-xs font-black leading-5 text-slate-700 shadow-lg shadow-blue-100/70 backdrop-blur sm:px-4 sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.8)]" />
                Premium digital products for modern businesses
              </span>
            </motion.div>
          </div>

          {/* Headline text ships in the HTML — only transform/opacity animate. */}
          {/* Sized so the whole hero — including the scroll cue and marquee —
              still fits inside 100svh on a 1440x900 laptop. */}
          <h1 className="mt-6 max-w-5xl text-[clamp(2.5rem,6vw,5.25rem)] font-black leading-[1.04] tracking-tight text-slate-950 sm:mt-8">
            {HEADLINE_LINES.map((parts) => (
              <span
                key={parts.map((part) => part.text).join("")}
                className="block overflow-hidden pb-[0.09em] [margin-bottom:-0.09em]"
              >
                <motion.span className="block" variants={line}>
                  {parts.map((part) =>
                    part.accent ? (
                      <span
                        key={part.text}
                        className="bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent"
                      >
                        {part.text}
                      </span>
                    ) : (
                      <span key={part.text}>{part.text}</span>
                    ),
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8"
          >
            Growblic designs and develops websites, mobile apps, SaaS platforms,
            dashboards, and AI automation — with premium interfaces and engineering
            you can rely on.
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4"
          >
            <MagneticCta reduceMotion={reduceMotion}>
              <Link
                href="/start-project"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-center text-sm font-black text-white shadow-xl transition-shadow duration-500 ease-out hover:shadow-2xl sm:w-auto"
              >
                Start a Project →
              </Link>
            </MagneticCta>

            <Link
              href="/products"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-blue-100/70 bg-[#fbfdff] px-8 py-4 text-center text-sm font-black text-slate-800 shadow-lg transition-all duration-500 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:w-auto"
            >
              Explore Products
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Pulls the primary CTA gently toward the cursor. Fine pointers only — touch
// devices and reduced-motion users get a plain button.
function MagneticCta({
  reduceMotion,
  children,
}: {
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (reduceMotion || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.28);
      y.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.5);
    },
    [reduceMotion, x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className="w-full sm:w-auto"
    >
      {children}
    </motion.div>
  );
}
