"use client";

import { useEffect, useRef, useState } from "react";

type Engine = {
  context: AudioContext;
  masterGain: GainNode;
  filter: BiquadFilterNode;
  baseOsc: OscillatorNode;
  depthOsc: OscillatorNode;
  airOsc: OscillatorNode;
  lfo: OscillatorNode;
};

export default function ScrollSoundExperience() {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);

  const engineRef = useRef<Engine | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const targetRef = useRef(0.12);
  const currentRef = useRef(0.12);

  useEffect(() => {
    lastYRef.current = window.scrollY;
    lastTimeRef.current = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = Math.abs(y - lastYRef.current);
      const dt = Math.max(now - lastTimeRef.current, 16);
      const speed = dy / dt;

      targetRef.current = Math.min(1, 0.12 + speed * 0.9);
      lastYRef.current = y;
      lastTimeRef.current = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!enabled || !engineRef.current) return;

    const engine = engineRef.current;

    const tick = () => {
      const target = muted ? 0 : targetRef.current;
      currentRef.current += (target - currentRef.current) * 0.06;

      const volume = muted ? 0 : 0.018 + currentRef.current * 0.045;
      const brightness = 440 + currentRef.current * 1200;

      engine.masterGain.gain.setTargetAtTime(volume, engine.context.currentTime, 0.12);
      engine.filter.frequency.setTargetAtTime(brightness, engine.context.currentTime, 0.16);
      engine.baseOsc.frequency.setTargetAtTime(92 + currentRef.current * 10, engine.context.currentTime, 0.16);
      engine.depthOsc.frequency.setTargetAtTime(138 + currentRef.current * 14, engine.context.currentTime, 0.16);
      engine.airOsc.frequency.setTargetAtTime(220 + currentRef.current * 18, engine.context.currentTime, 0.16);

      targetRef.current += (0.12 - targetRef.current) * 0.025;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, muted]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const engine = engineRef.current;
      if (!engine) return;

      try {
        engine.baseOsc.stop();
        engine.depthOsc.stop();
        engine.airOsc.stop();
        engine.lfo.stop();
        void engine.context.close();
      } catch {}
    };
  }, []);

  async function startAudio() {
    if (engineRef.current) {
      setMuted((value) => !value);
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    await context.resume();

    const masterGain = context.createGain();
    masterGain.gain.value = 0.02;

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.75;

    const baseOsc = context.createOscillator();
    baseOsc.type = "sine";
    baseOsc.frequency.value = 92;

    const depthOsc = context.createOscillator();
    depthOsc.type = "triangle";
    depthOsc.frequency.value = 138;
    depthOsc.detune.value = -8;

    const airOsc = context.createOscillator();
    airOsc.type = "sine";
    airOsc.frequency.value = 220;
    airOsc.detune.value = 7;

    const baseGain = context.createGain();
    baseGain.gain.value = 0.34;

    const depthGain = context.createGain();
    depthGain.gain.value = 0.18;

    const airGain = context.createGain();
    airGain.gain.value = 0.08;

    const lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;

    const lfoGain = context.createGain();
    lfoGain.gain.value = 22;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    baseOsc.connect(baseGain);
    depthOsc.connect(depthGain);
    airOsc.connect(airGain);

    baseGain.connect(filter);
    depthGain.connect(filter);
    airGain.connect(filter);

    filter.connect(masterGain);
    masterGain.connect(context.destination);

    baseOsc.start();
    depthOsc.start();
    airOsc.start();
    lfo.start();

    engineRef.current = {
      context,
      masterGain,
      filter,
      baseOsc,
      depthOsc,
      airOsc,
      lfo,
    };

    setEnabled(true);
    setMuted(false);
  }

  const label = !enabled ? "Sound" : muted ? "Sound off" : "Sound on";

  return (
    <button
      type="button"
      onClick={startAudio}
      aria-label={label}
      className="fixed bottom-5 left-5 z-[80] flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
    >
      <span className="relative flex size-3 rounded-full bg-blue-600">
        {enabled && !muted ? (
          <span className="absolute inset-0 rounded-full bg-blue-500 opacity-40 animate-ping" />
        ) : null}
      </span>
      {label}
    </button>
  );
}
