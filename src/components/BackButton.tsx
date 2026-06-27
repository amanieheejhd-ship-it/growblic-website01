"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute left-4 md:left-6 top-1/2 z-40 flex !h-11 !w-11 md:!h-12 md:!w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 !text-slate-900 shadow-[0_16px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-slate-950 hover:!text-white"
    >
      ← Back
    </button>
  );
}
