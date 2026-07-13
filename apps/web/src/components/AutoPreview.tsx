"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export type AutoPreviewSlide = {
  title: string;
  subtitle?: string;
  metric?: string;
  image?: string;
  type?: "dashboard" | "mobile" | "workflow" | "chat" | "report";
  tone?: "blue" | "violet" | "cyan" | "emerald" | "slate";
};

const toneMap = {
  blue: "from-blue-500/18 via-blue-100 to-cyan-50",
  violet: "from-violet-500/18 via-violet-100 to-blue-50",
  cyan: "from-cyan-500/18 via-cyan-100 to-blue-50",
  emerald: "from-emerald-500/18 via-emerald-100 to-cyan-50",
  slate: "from-slate-500/16 via-slate-100 to-blue-50",
};

function MockUi({ slide }: { slide: AutoPreviewSlide }) {
  const tone = slide.tone ?? "blue";

  if (slide.type === "mobile") {
    return (
      <div className={`relative h-full overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${toneMap[tone]} p-4`}>
        <div className="mx-auto h-full max-w-[150px] rounded-[1.8rem] border border-blue-100/70 bg-[#fbfdff] p-3 shadow-2xl shadow-slate-900/12">
          <div className="mx-auto h-1 w-10 rounded-full bg-slate-200" />
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-500/16 to-violet-500/14 p-4">
            <p className="text-xs font-semibold text-slate-500">{slide.title}</p>
            <p className="mt-2 text-xl font-semibold text-[#111827]">{slide.metric}</p>
          </div>
          <div className="mt-4 grid gap-2">
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-blue-500/10" />
            <div className="h-10 rounded-xl bg-violet-500/10" />
          </div>
        </div>
      </div>
    );
  }

  if (slide.type === "workflow" || slide.type === "chat") {
    return (
      <div className={`relative h-full overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${toneMap[tone]} p-4`}>
        <div className="grid h-full grid-cols-3 gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex flex-col justify-between rounded-2xl border border-white/80 bg-[#fbfdff]/76 p-3 shadow-xl shadow-slate-900/8">
              <span className="h-2 w-14 rounded-full bg-slate-200" />
              <span className="h-11 rounded-xl bg-gradient-to-r from-blue-500/12 to-cyan-500/14" />
              <span className="h-2 w-10 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050505] shadow-2xl shadow-slate-950/20" />
      </div>
    );
  }

  return (
    <div className={`relative h-full overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${toneMap[tone]} p-4`}>
      <div className="relative h-full rounded-[1rem] border border-white/80 bg-[#fbfdff]/78 p-4 shadow-xl shadow-slate-900/8 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{slide.title}</p>
            <p className="mt-2 text-2xl font-semibold text-[#111827]">{slide.metric ?? "Live view"}</p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
        </div>
        <div className="mt-7 grid grid-cols-5 items-end gap-2">
          {[44, 68, 52, 88, 74].map((height, index) => (
            <div key={height + index} className="rounded-t-xl bg-gradient-to-t from-blue-500/28 to-cyan-300/20" style={{ height }} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-blue-500/10" />
          <div className="h-10 rounded-xl bg-violet-500/10" />
        </div>
      </div>
    </div>
  );
}

export default function AutoPreview({ slides, className = "" }: { slides: AutoPreviewSlide[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [paused, slides.length]);

  const current = slides[active];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, scale: 0.985, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.015, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <MockUi slide={current} />
          {current.image && !failedImages[current.image] ? (
            <Image
              src={current.image}
              alt={`${current.title} preview`}
              fill
              sizes="(min-width: 1024px) 32vw, 92vw"
              className="absolute inset-0 object-cover"
              onError={() => setFailedImages((images) => ({ ...images, [current.image as string]: true }))}
            />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/92 via-white/18 to-transparent p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{current.title}</p>
            {current.metric ? <p className="mt-1 text-lg font-semibold text-[#111827]">{current.metric}</p> : null}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-[#fbfdff]/75 px-2 py-1 shadow-sm backdrop-blur-xl">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Show ${slide.title}`}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${active === index ? "w-5 bg-blue-600" : "w-1.5 bg-slate-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
