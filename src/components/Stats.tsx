"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "35+", label: "Live Software & Apps" },
  { value: "50+", label: "Projects Delivered" },
  { value: "10+", label: "Business Categories" },
  { value: "24/7", label: "Support Ready" },
];

export default function Stats() {
  return (
    <section className="relative bg-[#f5f7fb] px-6 py-20">
      <div className="mx-auto grid max-w-7xl auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.07 }}
            className="soft-gradient-border flex min-h-[154px] flex-col justify-between rounded-[1.5rem] bg-[#fbfdff] p-6 shadow-xl shadow-slate-900/6"
          >
            <p className="premium-gradient-text text-4xl font-black leading-none sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-4 text-sm font-bold leading-6 text-[#5f6673]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
