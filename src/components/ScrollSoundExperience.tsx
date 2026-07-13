"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/sounds/growblic-ambient.mp3";
const CALM_VOLUME = 0.18;
const SLOW_VOLUME = 0.26;
const FAST_VOLUME = 0.38;
const CALM_RATE = 0.92;
const SLOW_RATE = 1;
const FAST_RATE = 1.08;
const SCROLL_THROTTLE_MS = 48;

function volumeForEnergy(energy: number) {
  if (energy < 0.5) {
    return CALM_VOLUME + (SLOW_VOLUME - CALM_VOLUME) * (energy / 0.5);
  }

  return SLOW_VOLUME + (FAST_VOLUME - SLOW_VOLUME) * ((energy - 0.5) / 0.5);
}

function playbackRateForEnergy(energy: number) {
  if (energy < 0.5) {
    return CALM_RATE + (SLOW_RATE - CALM_RATE) * (energy / 0.5);
  }

  return SLOW_RATE + (FAST_RATE - SLOW_RATE) * ((energy - 0.5) / 0.5);
}

export default function ScrollSoundExperience() {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioMissing, setAudioMissing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const scrollEnergyRef = useRef(0);
  const currentEnergyRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const lastHandledScrollTimeRef = useRef(0);
  const mutedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;

    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();
    lastHandledScrollTimeRef.current = 0;

    const handleScroll = () => {
      const now = performance.now();
      if (now - lastHandledScrollTimeRef.current < SCROLL_THROTTLE_MS) {
        return;
      }

      const currentY = window.scrollY;
      const distance = Math.abs(currentY - lastScrollYRef.current);
      const elapsed = Math.max(now - lastScrollTimeRef.current, 16);
      const scrollSpeed = Math.min(distance / elapsed, 3.4);
      const energy = Math.min(scrollSpeed / 3.4, 1);

      scrollEnergyRef.current = Math.max(scrollEnergyRef.current, energy);
      lastScrollYRef.current = currentY;
      lastScrollTimeRef.current = now;
      lastHandledScrollTimeRef.current = now;
    };

    const animate = () => {
      const audio = audioRef.current;

      scrollEnergyRef.current *= 0.9;
      if (scrollEnergyRef.current < 0.004) {
        scrollEnergyRef.current = 0;
      }

      currentEnergyRef.current += (scrollEnergyRef.current - currentEnergyRef.current) * 0.055;

      if (audio) {
        const energy = Math.min(Math.max(currentEnergyRef.current, 0), 1);
        const targetVolume = mutedRef.current ? 0 : volumeForEnergy(energy);
        const targetRate = playbackRateForEnergy(energy);

        audio.volume += (targetVolume - audio.volume) * 0.08;
        audio.playbackRate += (targetRate - audio.playbackRate) * 0.06;
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  const startAudio = async () => {
    if (enabled && audioRef.current) {
      setMuted((current) => !current);
      return;
    }

    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = CALM_VOLUME;
    audio.playbackRate = CALM_RATE;
    audio.muted = false;

    audio.addEventListener(
      "error",
      () => {
        setAudioMissing(true);
        console.info(
          "Growblic ambient sound file was not found. Add public/sounds/growblic-ambient.mp3 to enable the premium audio track.",
        );
      },
      { once: true },
    );

    audioRef.current = audio;

    try {
      await audio.play();
      setAudioMissing(false);
      setEnabled(true);
      setMuted(false);
    } catch {
      setAudioMissing(true);
      audioRef.current = null;
      console.info(
        "Growblic ambient sound could not start. Add public/sounds/growblic-ambient.mp3 and start audio from a user click.",
      );
    }
  };

  const label = !enabled ? "Sound" : muted ? "Off" : "On";
  const ariaLabel = !enabled
    ? "Enable ambient music"
    : muted
      ? "Unmute ambient music"
      : "Mute ambient music";
  const stateText = audioMissing
    ? "Add audio"
    : !enabled && reducedMotion
      ? "Sound"
      : label;

  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden sm:bottom-5 sm:left-5">
      <button
        type="button"
        onClick={startAudio}
        aria-pressed={enabled && !muted}
        aria-label={ariaLabel}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-100/80 bg-white/88 px-2.5 py-2 text-slate-950 shadow-[0_12px_34px_rgba(37,99,235,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className={`relative grid h-6 w-6 place-items-center rounded-full transition ${
            enabled && !muted ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {enabled && !muted ? (
            <span className="absolute h-3.5 w-3.5 rounded-full border border-current opacity-50" />
          ) : null}
        </span>
        <span className="hidden pr-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-800 sm:inline">
          {stateText}
        </span>
      </button>
    </div>
  );
}
