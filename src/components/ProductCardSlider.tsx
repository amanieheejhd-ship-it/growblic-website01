"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Slide =
  | string
  | {
      title?: string;
      label?: string;
      image?: string;
      src?: string;
      url?: string;
    };

const defaultImages = [
  "/growblic-website01/images/products/school-1.jpg",
  "/growblic-website01/images/products/crm-1.jpg",
  "/growblic-website01/images/products/hr-1.jpg",
  "/growblic-website01/images/products/analytics-1.jpg",
];

function getSlideImage(slide: Slide | undefined) {
  if (!slide) return undefined;
  if (typeof slide === "string") {
    return slide.startsWith("/") ? slide : undefined;
  }
  return slide.image || slide.src || slide.url;
}

function getSlideTitle(slide: Slide | undefined, index: number) {
  if (!slide) return `Product Preview ${index + 1}`;
  if (typeof slide === "string") return `Product Preview ${index + 1}`;
  return slide.title || slide.label || `Product Preview ${index + 1}`;
}

export default function ProductCardSlider({
  slides = [],
  className = "",
}: {
  slides?: Slide[];
  className?: string;
}) {
  const safeSlides = useMemo<Slide[]>(() => {
    const validSlides = slides.filter((slide) => {
      const image = getSlideImage(slide);
      return image && image.startsWith("/");
    });

    if (validSlides.length > 0) return validSlides;

    return defaultImages.map((image, index) => ({
      image,
      title: `Growblic Product Preview ${index + 1}`,
    }));
  }, [slides]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || safeSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeSlides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [paused, safeSlides.length]);

  const current = safeSlides[index];
  const image = getSlideImage(current) || defaultImages[index % defaultImages.length];
  const title = getSlideTitle(current, index);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-gradient-to-br from-blue-50 via-white to-violet-50 p-3 shadow-inner ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={image}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="relative h-full min-h-[180px] overflow-hidden rounded-[1.4rem] bg-[#fbfdff] shadow-sm"
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="will-change-transform object-cover"
            unoptimized
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-[#fbfdff]/90 px-2 py-1 shadow">
        {safeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-blue-600" : "w-1.5 bg-slate-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
