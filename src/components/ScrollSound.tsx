"use client";

import { useEffect, useRef } from "react";

const AMBIENT_SOUND = "/sounds/growblic-ambient.mp3";
const MAX_VOLUME = 0.075;
const SCROLL_IDLE_MS = 220;
const FADE_IN_MS = 900;
const FADE_OUT_MS = 800;

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export default function ScrollSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio(AMBIENT_SOUND);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const cancelFade = () => {
      if (fadeFrameRef.current !== null) {
        window.cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
    };

    const fadeAmbientTo = (targetVolume: number, durationMs: number) => {
      const activeAudio = audioRef.current;
      if (!activeAudio) return;

      cancelFade();

      const safeTarget = clampVolume(targetVolume);
      const startVolume = clampVolume(activeAudio.volume);
      const startedAt = performance.now();

      const tick = (now: number) => {
        const rawProgress = (now - startedAt) / durationMs;
        const progress = Math.min(1, Math.max(0, rawProgress));
        const eased = 1 - Math.pow(1 - progress, 3);

        const nextVolume = clampVolume(
          startVolume + (safeTarget - startVolume) * eased
        );

        activeAudio.volume = nextVolume;

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        activeAudio.volume = safeTarget;
        fadeFrameRef.current = null;

        if (safeTarget === 0) {
          activeAudio.pause();
        }
      };

      fadeFrameRef.current = window.requestAnimationFrame(tick);
    };

    const startScrollSound = () => {
      const activeAudio = audioRef.current;
      if (!activeAudio) return;

      void activeAudio
        .play()
        .then(() => {
          fadeAmbientTo(MAX_VOLUME, FADE_IN_MS);
        })
        .catch(() => {
          // Browser autoplay block kare to silently ignore.
        });

      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = window.setTimeout(() => {
        fadeAmbientTo(0, FADE_OUT_MS);
      }, SCROLL_IDLE_MS);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const scrollKeys = new Set([
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar",
      ]);

      if (scrollKeys.has(event.key)) {
        startScrollSound();
      }
    };

    window.addEventListener("wheel", startScrollSound, { passive: true });
    window.addEventListener("scroll", startScrollSound, { passive: true });
    window.addEventListener("touchmove", startScrollSound, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", startScrollSound);
      window.removeEventListener("scroll", startScrollSound);
      window.removeEventListener("touchmove", startScrollSound);
      window.removeEventListener("keydown", onKeyDown);

      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
      }

      cancelFade();

      audio.pause();
      audio.src = "";
    };
  }, []);

  return null;
}
