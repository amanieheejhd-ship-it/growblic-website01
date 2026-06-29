"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

export default function Scroll3DSection({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 42, rotateX: 7, scale: 0.985 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ amount: 0.22, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ rotateX: 0, rotateY: 0, y: 0 });
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const updateTransform = () => {
    setTransform(
      `perspective(1000px) translateY(${targetRef.current.y}px) rotateX(${targetRef.current.rotateX}deg) rotateY(${targetRef.current.rotateY}deg)`,
    );
    frameRef.current = null;
  };

  const scheduleUpdate = () => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(updateTransform);
    }
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        transform: reduceMotion ? undefined : transform,
        transformStyle: "preserve-3d",
        transition: "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: reduceMotion ? undefined : "transform",
      }}
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType === "touch") return;

        const card = cardRef.current;
        if (!card) return;

        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        targetRef.current = {
          rotateX: y * -5,
          rotateY: x * 6,
          y: -5,
        };
        scheduleUpdate();
      }}
      onPointerLeave={() => {
        targetRef.current = { rotateX: 0, rotateY: 0, y: 0 };
        scheduleUpdate();
      }}
    >
      {children}
    </div>
  );
}
