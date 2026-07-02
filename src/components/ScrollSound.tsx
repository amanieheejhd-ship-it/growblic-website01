"use client";

import { useEffect, useRef } from "react";

const BASE_PATH = "/growblic-website01";
const AMBIENT_SOUND = "/sounds/growblic-ambient.mp3";
const CLICK_SOUND = "/sounds/growblic-click.wav";
const AMBIENT_TARGET_VOLUME = 0.2;
const CLICK_VOLUME = 0.28;
const SCROLL_IDLE_DELAY_MS = 220;
const FADE_UP_MS = 260;
const FADE_DOWN_MS = 360;
const CLICKABLE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary';
const SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
]);

function withRuntimeBasePath(path: string) {
  if (window.location.pathname.startsWith(BASE_PATH)) {
    return `${BASE_PATH}${path}`;
  }

  return path;
}

export default function ScrollSound() {
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const ambient = new Audio(withRuntimeBasePath(AMBIENT_SOUND));
    ambient.loop = true;
    ambient.preload = "auto";
    ambient.volume = 0;

    const click = new Audio(withRuntimeBasePath(CLICK_SOUND));
    click.preload = "auto";
    click.volume = CLICK_VOLUME;

    ambientRef.current = ambient;
    clickRef.current = click;

    const cancelFade = () => {
      if (fadeFrameRef.current !== null) {
        window.cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
    };

    const fadeAmbientTo = (targetVolume: number, durationMs: number) => {
      cancelFade();

      const audio = ambientRef.current;
      if (!audio) return;

      const startVolume = audio.volume;
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / durationMs, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        audio.volume = targetVolume;
        fadeFrameRef.current = null;

        if (targetVolume === 0) {
          audio.pause();
        }
      };

      fadeFrameRef.current = window.requestAnimationFrame(tick);
    };

    const queueAmbientStop = () => {
      if (stopTimerRef.current !== null) {
        window.clearTimeout(stopTimerRef.current);
      }

      stopTimerRef.current = window.setTimeout(() => {
        fadeAmbientTo(0, FADE_DOWN_MS);
      }, SCROLL_IDLE_DELAY_MS);
    };

    const startAmbient = () => {
      const audio = ambientRef.current;
      if (!audio) return;

      if (audio.paused) {
        audio.currentTime = 0;
      }

      audio
        .play()
        .then(() => {
          fadeAmbientTo(AMBIENT_TARGET_VOLUME, FADE_UP_MS);
        })
        .catch(() => {
          // Autoplay restrictions can block audio before a user gesture.
        });

      queueAmbientStop();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;

      startAmbient();
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest(CLICKABLE_SELECTOR)) return;

      const audio = clickRef.current;
      if (!audio) return;

      audio.volume = CLICK_VOLUME;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Autoplay restrictions can still block in some browser states.
      });
    };

    window.addEventListener("wheel", startAmbient, { passive: true });
    window.addEventListener("touchmove", startAmbient, { passive: true });
    window.addEventListener("scroll", startAmbient, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("wheel", startAmbient);
      window.removeEventListener("touchmove", startAmbient);
      window.removeEventListener("scroll", startAmbient);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);

      if (stopTimerRef.current !== null) {
        window.clearTimeout(stopTimerRef.current);
      }

      cancelFade();
      ambient.pause();
      click.pause();
      ambientRef.current = null;
      clickRef.current = null;
    };
  }, []);

  return null;
}
