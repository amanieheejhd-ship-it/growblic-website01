"use client";

import { useEffect, useRef, useState } from "react";

type SoundEngine = {
  context: AudioContext;
  oscillator: OscillatorNode;
  gain: GainNode;
  filter: BiquadFilterNode;
};

const MAX_VOLUME = 0.045;
const IDLE_FADE = 0.88;
const SCROLL_DECAY = 0.82;

function createSoundEngine(): SoundEngine {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error("Web Audio API is not available in this browser.");
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.value = 172;
  filter.type = "lowpass";
  filter.frequency.value = 720;
  filter.Q.value = 0.45;
  gain.gain.value = 0;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start();

  return { context, oscillator, gain, filter };
}

export default function ScrollSoundExperience() {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const engineRef = useRef<SoundEngine | null>(null);
  const frameRef = useRef<number | null>(null);
  const targetVolumeRef = useRef(0);
  const targetFrequencyRef = useRef(172);
  const currentVolumeRef = useRef(0);
  const currentFrequencyRef = useRef(172);
  const scrollEnergyRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const lastHandledScrollTimeRef = useRef(0);
  const mutedRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!enabled || unsupported) {
      return undefined;
    }

    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();
    lastHandledScrollTimeRef.current = 0;

    const engine = engineRef.current;
    if (!engine) {
      return undefined;
    }

    const handleScroll = () => {
      const now = performance.now();
      if (now - lastHandledScrollTimeRef.current < 48) {
        return;
      }

      const currentY = window.scrollY;
      const distance = Math.abs(currentY - lastScrollYRef.current);
      const elapsed = Math.max(now - lastScrollTimeRef.current, 16);
      const speed = Math.min(distance / elapsed, 3.2);
      const energy = Math.min(speed / 3.2, 1);

      lastHandledScrollTimeRef.current = now;
      scrollEnergyRef.current = Math.max(scrollEnergyRef.current, energy);
      targetVolumeRef.current = mutedRef.current ? 0 : Math.max(energy * MAX_VOLUME, 0.002);
      targetFrequencyRef.current = 156 + energy * 120;
      lastScrollYRef.current = currentY;
      lastScrollTimeRef.current = now;
    };

    const animate = () => {
      const energy = scrollEnergyRef.current * SCROLL_DECAY;
      scrollEnergyRef.current = energy < 0.004 ? 0 : energy;

      const desiredVolume = mutedRef.current ? 0 : targetVolumeRef.current * (0.25 + energy * 0.75);
      targetVolumeRef.current = desiredVolume * IDLE_FADE;
      currentVolumeRef.current += (desiredVolume - currentVolumeRef.current) * 0.14;
      currentFrequencyRef.current += (targetFrequencyRef.current - currentFrequencyRef.current) * 0.08;
      targetFrequencyRef.current += (172 - targetFrequencyRef.current) * 0.035;

      const safeVolume = Math.min(Math.max(currentVolumeRef.current, 0), MAX_VOLUME);
      const safeFrequency = Math.min(Math.max(currentFrequencyRef.current, 144), 292);

      engine.gain.gain.setTargetAtTime(safeVolume, engine.context.currentTime, 0.08);
      engine.oscillator.frequency.setTargetAtTime(safeFrequency, engine.context.currentTime, 0.08);
      engine.filter.frequency.setTargetAtTime(620 + energy * 520, engine.context.currentTime, 0.12);

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
  }, [enabled, unsupported]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      const engine = engineRef.current;
      if (engine) {
        engine.oscillator.stop();
        void engine.context.close();
        engineRef.current = null;
      }
    };
  }, []);

  const handleToggle = async () => {
    if (unsupported) {
      return;
    }

    if (!enabled) {
      try {
        const engine = createSoundEngine();
        engineRef.current = engine;

        if (engine.context.state === "suspended") {
          await engine.context.resume();
        }

        setEnabled(true);
        setMuted(false);
      } catch {
        setUnsupported(true);
      }

      return;
    }

    setMuted((current) => !current);
  };

  const label = !enabled ? "Enable sound" : muted ? "Unmute sound" : "Mute sound";
  const helperText = unsupported
    ? "Sound unavailable"
    : !enabled && reducedMotion
      ? "Reduced motion respected"
      : enabled
        ? muted
          ? "Sound off"
          : "Scroll audio on"
        : "Subtle scroll audio";

  if (unsupported) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 print:hidden sm:bottom-6 sm:left-6">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={enabled && !muted}
        aria-label={label}
        className="group inline-flex items-center gap-3 rounded-full border border-blue-100/80 bg-white/88 px-3.5 py-2.5 text-left shadow-[0_18px_45px_rgba(37,99,235,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/45 focus:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className={`relative grid h-8 w-8 place-items-center rounded-full transition ${
            enabled && !muted
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-current" />
          {enabled && !muted ? (
            <span className="absolute h-5 w-5 rounded-full border border-current opacity-45" />
          ) : null}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block text-xs font-black uppercase tracking-[0.18em] text-slate-950">
            {label}
          </span>
          <span className="block text-[11px] font-semibold text-slate-500">{helperText}</span>
        </span>
        <span className="sr-only">{helperText}</span>
      </button>
    </div>
  );
}
