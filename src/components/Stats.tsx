"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 35, suffix: "+", label: "Live Software & Apps" },
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 10, suffix: "+", label: "Business Categories" },
  { value: 24, suffix: "/7", label: "Support Ready" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      const resetFrame = requestAnimationFrame(() => setCount(0));
      return () => cancelAnimationFrame(resetFrame);
    }

    const start = performance.now();
    const duration = 1100;
    let frame = 0;
    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative bg-[#f5f7fb] px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.07 }}
            className="soft-gradient-border rounded-[1.5rem] bg-[#fbfdff] p-6 shadow-xl shadow-slate-900/6"
          >
            <p className="premium-gradient-text text-4xl font-semibold">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-sm font-medium text-[#5f6673]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
