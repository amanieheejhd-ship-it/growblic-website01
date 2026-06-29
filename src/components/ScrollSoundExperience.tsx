"use client";

import { useEffect, useRef, useState } from "react";

type AmbientEngine = {
  context: AudioContext;
  oscillators: OscillatorNode[];
  masterGain: GainNode;
  droneGain: GainNode;
  depthGain: GainNode;
  airGain: GainNode;
  filter: BiquadFilterNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

const CALM_VOLUME = 0.012;
const MAX_VOLUME = 0.032;
const CALM_FILTER = 420;
const BRIGHT_FILTER = 1180;
const ENERGY_DECAY = 0.9;
const SCROLL_THROTTLE_MS = 48;

function getAudioContextClass() {
  return (
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

function createAmbientEngine(): AmbientEngine {
  const AudioContextClass = getAudioContextClass();

  if (!AudioContextClass) {
    throw new Error("Web Audio API is not available in this browser.");
  }

  const context = new AudioContextClass();
  const masterGain = context.createGain();
  const droneGain = context.createGain();
  const depthGain = context.createGain();
  const airGain = context.createGain();
  const filter = context.createBiquadFilter();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();

  const baseDrone = context.createOscillator();
  const depthDrone = context.createOscillator();
  const airTone = context.createOscillator();

  baseDrone.type = "sine";
  baseDrone.frequency.value = 92;

  depthDrone.type = "triangle";
  depthDrone.frequency.value = 92.7;
  depthDrone.detune.value = -8;

  airTone.type = "sine";
  airTone.frequency.value = 184;
  airTone.detune.value = 5;

  droneGain.gain.value = 0.46;
  depthGain.gain.value = 0.32;
  airGain.gain.value = 0.12;

  filter.type = "lowpass";
  filter.frequency.value = CALM_FILTER;
  filter.Q.value = 0.65;

  masterGain.gain.value = 0;

  lfo.type = "sine";
  lfo.frequency.value = 0.075;
  lfoGain.gain.value = 58;

  baseDrone.connect(droneGain);
  depthDrone.connect(depthGain);
  airTone.connect(airGain);
  droneGain.connect(filter);
  depthGain.connect(filter);
  airGain.connect(filter);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  filter.connect(masterGain);
  masterGain.connect(context.destination);

  const oscillators = [baseDrone, depthDrone, airTone];
  oscillators.forEach((oscillator) => oscillator.start());
  lfo.start();

  return {
    context,
    oscillators,
    masterGain,
    droneGain,
    depthGain,
    airGain,
    filter,
    lfo,
    lfoGain,
  };
}

export default function ScrollSoundExperience() {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const engineRef = useRef<AmbientEngine | null>(null);
  const frameRef = useRef<number | null>(null);
  const scrollEnergyRef = useRef(0);
  const currentEnergyRef = useRef(0);
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

    const engine = engineRef.current;
    if (!engine) {
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
      scrollEnergyRef.current *= ENERGY_DECAY;
      if (scrollEnergyRef.current < 0.004) {
        scrollEnergyRef.current = 0;
      }

      currentEnergyRef.current += (scrollEnergyRef.current - currentEnergyRef.current) * 0.055;

      const energy = Math.min(Math.max(currentEnergyRef.current, 0), 1);
      const targetVolume = mutedRef.current ? 0 : CALM_VOLUME + energy * (MAX_VOLUME - CALM_VOLUME);
      const targetFilter = CALM_FILTER + energy * (BRIGHT_FILTER - CALM_FILTER);
      const targetAirGain = 0.1 + energy * 0.18;
      const targetLfoDepth = 48 + energy * 82;
      const targetLfoRate = 0.065 + energy * 0.06;

      const now = engine.context.currentTime;

      engine.masterGain.gain.setTargetAtTime(targetVolume, now, mutedRef.current ? 0.1 : 0.38);
      engine.filter.frequency.setTargetAtTime(targetFilter, now, 0.45);
      engine.airGain.gain.setTargetAtTime(targetAirGain, now, 0.6);
      engine.lfoGain.gain.setTargetAtTime(targetLfoDepth, now, 0.75);
      engine.lfo.frequency.setTargetAtTime(targetLfoRate, now, 0.9);

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
        engine.oscillators.forEach((oscillator) => oscillator.stop());
        engine.lfo.stop();
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
        const engine = createAmbientEngine();
        engineRef.current = engine;

        if (engine.context.state === "suspended") {
          await engine.context.resume();
        }

        engine.masterGain.gain.setTargetAtTime(CALM_VOLUME, engine.context.currentTime, 0.45);
        setEnabled(true);
        setMuted(false);
      } catch {
        setUnsupported(true);
      }

      return;
    }

    setMuted((current) => !current);
  };

  const label = !enabled ? "Enable sound" : muted ? "Sound off" : "Sound on";
  const ariaLabel = !enabled
    ? "Enable ambient scroll sound"
    : muted
      ? "Unmute ambient scroll sound"
      : "Mute ambient scroll sound";
  const helperText = !enabled && reducedMotion ? "Off by default" : label;

  if (unsupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden sm:bottom-5 sm:left-5">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={enabled && !muted}
        aria-label={ariaLabel}
        className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-100/80 bg-white/86 px-2.5 py-2 text-slate-950 shadow-[0_12px_34px_rgba(37,99,235,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2"
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
          {helperText}
        </span>
      </button>
    </div>
  );
}
