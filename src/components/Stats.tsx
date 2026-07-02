"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 35,
    suffix: "+",
    label: "Live Software & Apps",
  },
  {
    value: 50,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    value: 10,
    suffix: "+",
    label: "Business Categories",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Support Ready",
  },
];

function AnimatedNumber({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
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
    <section className="relative px-5 py-14 sm:px-6">
      <div className="growblic-reveal-grid mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:gap-6">
        {stats.map((item) => (
          <article
            key={item.label}
            className="group rounded-[1.8rem] border border-blue-100 bg-white/85 p-7 shadow-xl shadow-blue-100/50 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70 sm:p-5"
          >
            <p className="text-5xl font-black tracking-tight text-blue-950 sm:text-5xl">
              <AnimatedNumber value={item.value} suffix={item.suffix} />
            </p>

            <p className="mt-8 text-sm font-black text-slate-500 sm:text-base">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
