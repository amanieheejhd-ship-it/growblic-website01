"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const dots = Array.from({ length: 18 });

export default function OpeningSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, filter: "blur(14px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#fbfdff]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.16),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.10),transparent_28%),radial-gradient(circle_at_80%_78%,rgba(168,85,247,0.10),transparent_30%)]" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.065)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.065)_1px,transparent_1px)] bg-[size:90px_90px]"
          />

          {dots.map((_, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                x: Math.sin(index) * 260,
                y: Math.cos(index) * 220,
                scale: 0.5,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                x: Math.sin(index * 2.1) * 360,
                y: Math.cos(index * 1.7) * 280,
                scale: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2.6,
                delay: index * 0.06,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.9)]"
            />
          ))}

          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotateX: 24 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[min(520px,90vw)] rounded-[3rem] border border-blue-100/70 bg-white/80 p-8 text-center shadow-2xl shadow-blue-100/70 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.1, delay: 0.25, ease: "easeInOut" }}
              className="absolute left-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-10 rounded-full border-2 border-blue-500/45 shadow-[0_0_60px_rgba(37,99,235,0.22)]"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-20 rounded-full border-2 border-cyan-500/35 shadow-[0_0_80px_rgba(6,182,212,0.18)]"
            />

            <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-[2.2rem] bg-white p-2 shadow-2xl shadow-cyan-400/25">
              <img
                src="/images/brand/growblic-logo.png"
                alt="Growblic"
                className="h-full w-full rounded-[1.7rem] object-cover"
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.45 }}
              className="mt-8 text-6xl font-black tracking-tight text-slate-950 md:text-7xl"
            >
              Growblic
            </motion.h1>

            <div className="mx-auto mt-8 h-1.5 w-72 overflow-hidden rounded-full bg-blue-100">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.1, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-violet-400"
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.65] }}
              transition={{ duration: 1.4, delay: 1.2 }}
              className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-slate-400"
            >
              Loading experience
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "100%", "0%"] }}
            transition={{ duration: 3.2, times: [0, 0.82, 1], ease: "easeInOut" }}
            className="absolute inset-x-0 bottom-0 h-full bg-white"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
