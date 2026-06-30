"use client";

import { useEffect, useRef, useState } from "react";
import { AppWindow, BriefcaseBusiness, Headphones, Layers3 } from "lucide-react";

const stats = [
  {
    value: 35,
    suffix: "+",
    label: "Live Software & Apps",
    icon: AppWindow,
  },
  {
    value: 50,
    suffix: "+",
    label: "Projects Delivered",
    icon: BriefcaseBusiness,
  },
  {
    value: 10,
    suffix: "+",
    label: "Business Categories",
    icon: Layers3,
  },
  {
    value: 24,
    suffix: "/7",
    label: "Support Ready",
    icon: Headphones,
  },
];

function AnimatedNumber({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(value);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const totalFrames = 45;

    const timer = window.setInterval(() => {
      frame += 1;

      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(value * eased);

      setCount(nextValue);

      if (frame >= totalFrames) {
        setCount(value);
        window.clearInterval(timer);
      }
    }, 22);

    return () => window.clearInterval(timer);
  }, [started, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_82%_70%,rgba(6,182,212,0.08),transparent_26%)]" />
      <div className="growblic-reveal-grid mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
          <article
            key={item.label}
            className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white/86 p-7 shadow-[0_24px_80px_rgba(37,99,235,0.10)] ring-1 ring-white/70 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_32px_110px_rgba(37,99,235,0.15)] sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-200" />
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-cyan-100/80" />

            <div className="relative flex items-start justify-between gap-4">
              <p className="text-5xl font-black tracking-tight text-blue-950 sm:text-6xl">
              <AnimatedNumber value={item.value} suffix={item.suffix} />
            </p>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/15 transition group-hover:bg-blue-600">
                <Icon className="h-5 w-5" />
              </span>
            </div>

            <p className="relative mt-8 text-sm font-black uppercase tracking-[0.14em] text-slate-500 sm:text-base">
              {item.label}
            </p>
          </article>
          );
        })}
      </div>
    </section>
  );
}
