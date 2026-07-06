"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Loader2,
  MessageCircle,
  Mic,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_GROWBLIC_API_URL || "https://growblic-api.onrender.com";
const FETCH_TIMEOUT_MS = 7000;

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hello, I’m Growblic Assistant. I can help you explore Growblic services, products, pricing guidance, cloud deployment, and starting a project.",
  },
];

const quickPrompts = [
  "Help me find the right service",
  "I want to build a website",
  "Show Growblic apps/products",
  "How does pricing work?",
];

export default function GrowblicAIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const hasUserMessage = messages.some((item) => item.role === "user");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") resetChat();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function resetChat() {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setOpen(false);
    setMessage("");
    setLoading(false);
    setMessages(initialMessages);
  }

  async function sendMessage(customMessage?: string) {
    const finalMessage = (customMessage || message).trim();
    if (!finalMessage || loading) return;

    setMessage("");
    setLoading(true);
    const controller = new AbortController();

    let timedOut = false;
    requestControllerRef.current?.abort();
    requestControllerRef.current = controller;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, FETCH_TIMEOUT_MS);

    setMessages((items) => [...items, { role: "user", content: finalMessage }]);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalMessage,
          history: messages.slice(-10),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = (await response.json()) as { reply?: string };
      if (data.reply) {
        setMessages((items) => [...items, { role: "assistant", content: data.reply || "" }]);
      }
    } catch {
      if (controller.signal.aborted && !timedOut) return;
    } finally {
      window.clearTimeout(timeout);
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setLoading(false);
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <>
      <style jsx>{`
        @keyframes growblicDrawerIn {
          from {
            opacity: 0;
            transform: translateX(28px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes growblicSheetIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes growblicMessageIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {open ? (
        <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden font-sans">
          <div className="absolute inset-0 bg-slate-950/[0.03] backdrop-blur-[1px]" />

          <section
            aria-label="Growblic Assistant chat drawer"
            className="pointer-events-auto absolute inset-x-2 bottom-2 flex h-[calc(100dvh-16px)] max-h-[calc(100dvh-16px)] min-w-0 animate-[growblicSheetIn_260ms_cubic-bezier(0.16,1,0.3,1)] flex-col overflow-hidden rounded-[22px] border border-white/80 bg-white/92 shadow-[0_32px_100px_rgba(15,23,42,0.24),0_12px_44px_rgba(14,165,233,0.12)] ring-1 ring-slate-900/[0.04] backdrop-blur-2xl min-[380px]:inset-x-3 min-[380px]:bottom-3 min-[380px]:h-[calc(100dvh-24px)] min-[380px]:max-h-[calc(100dvh-24px)] min-[380px]:rounded-[26px] sm:bottom-3 sm:left-auto sm:right-3 sm:top-3 sm:h-auto sm:max-h-none sm:w-[min(440px,calc(100vw-24px))] sm:animate-[growblicDrawerIn_260ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-[32px] lg:w-[456px]"
          >
            <header className="relative overflow-hidden border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,248,255,0.92))] px-4 py-4 sm:px-6 sm:py-5">
              <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-cyan-200/28 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 top-8 h-44 w-44 rounded-full bg-blue-200/20 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="min-w-0 break-words text-base font-black tracking-normal text-slate-950">
                      Growblic Assistant
                    </h2>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50/90 px-2.5 py-1 text-[11px] font-extrabold text-sky-700 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Guide
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                    Premium project guidance for Growblic services.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close Growblic Assistant chat"
                  onClick={resetChat}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white/86 text-slate-600 shadow-sm ring-1 ring-white/80 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:text-slate-950 hover:shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mt-4 flex min-w-0 items-start gap-3 rounded-2xl border border-sky-100/80 bg-white/82 p-3 shadow-[0_12px_34px_rgba(15,23,42,0.06)] ring-1 ring-white/80 backdrop-blur-xl sm:mt-5 sm:items-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#06b6d4)] text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)]">
                  <Bot className="h-5 w-5" />
                </span>
                <p className="min-w-0 break-words text-xs font-bold leading-5 text-slate-600">
                  Ask about services, apps, pricing, cloud setup, or starting a project.
                </p>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,250,252,0.76),rgba(255,255,255,0.94))] px-4 py-5 sm:px-6"
            >
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`flex animate-[growblicMessageIn_190ms_ease-out_both] ${
                    item.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] min-w-0 break-words px-4 py-3 text-sm font-semibold leading-6 shadow-sm ${
                      item.role === "user"
                        ? "rounded-[20px] rounded-br-md bg-[linear-gradient(135deg,#2563eb,#0891b2)] text-white shadow-[0_12px_30px_rgba(37,99,235,0.22)]"
                        : "rounded-[20px] rounded-bl-md border border-slate-200/80 bg-white text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-white/80"
                    }`}
                  >
                    {item.content}
                  </div>
                </div>
              ))}

              {!hasUserMessage && !loading ? (
                <div className="animate-[growblicMessageIn_220ms_ease-out_both] space-y-2 pt-1">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-transparent bg-white/64 px-3.5 py-3 text-left text-sm font-bold leading-5 text-slate-600 shadow-sm ring-1 ring-slate-200/70 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-sky-100 hover:bg-white hover:text-blue-700 hover:shadow-[0_14px_34px_rgba(14,165,233,0.12)]"
                    >
                      <span className="min-w-0 break-words">{prompt}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              ) : null}

              {loading ? (
                <div className="flex justify-start">
                  <div className="inline-flex animate-[growblicMessageIn_190ms_ease-out_both] items-center gap-2 rounded-[20px] rounded-bl-md border border-slate-200/80 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-white/80">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    • Thinking...
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-200/70 bg-white/90 px-3 py-3 shadow-[0_-18px_46px_rgba(255,255,255,0.80)] backdrop-blur-2xl sm:px-5 sm:py-4">
              <form
                onSubmit={handleSubmit}
                className="flex min-w-0 items-center gap-1.5 rounded-[24px] border border-slate-200/90 bg-white p-1.5 shadow-[0_14px_38px_rgba(15,23,42,0.08)] ring-1 ring-white/80 transition focus-within:border-sky-200 focus-within:ring-4 focus-within:ring-sky-100 sm:gap-2"
              >
                <button
                  type="button"
                  aria-label="Voice input unavailable"
                  disabled
                  className="grid h-9 w-9 shrink-0 cursor-not-allowed place-items-center rounded-full text-slate-300 sm:h-10 sm:w-10"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask Growblic Assistant…"
                  className="min-w-0 flex-1 bg-transparent px-1 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={loading || !message.trim()}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#2563eb,#06b6d4)] text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(37,99,235,0.32)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:translate-y-0 sm:h-10 sm:w-10"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>

              <p className="mt-3 text-center text-[11px] font-semibold leading-5 text-slate-400">
                Growblic Assistant helps with Growblic services and project guidance.
              </p>
            </div>
          </section>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          aria-label="Open Growblic Assistant chat"
          onClick={() => setOpen(true)}
          className="group fixed bottom-3 right-3 z-[90] flex max-w-[calc(100vw-24px)] items-center gap-2 rounded-full border border-white/70 bg-white/82 p-2.5 font-sans text-sm font-black text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.16),0_10px_34px_rgba(14,165,233,0.18)] ring-1 ring-sky-100/80 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-white/92 hover:shadow-[0_24px_76px_rgba(15,23,42,0.20),0_16px_44px_rgba(14,165,233,0.22)] sm:bottom-6 sm:right-6 sm:gap-3 sm:px-4 sm:py-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#2563eb,#06b6d4)] text-white shadow-[0_12px_28px_rgba(37,99,235,0.28)] ring-1 ring-white/50 transition duration-300 group-hover:scale-105">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="hidden whitespace-nowrap sm:inline">Ask Growblic Assistant</span>
          <span className="hidden h-7 w-7 place-items-center rounded-full bg-sky-50 text-blue-600 ring-1 ring-sky-100 transition duration-300 group-hover:translate-x-0.5 group-hover:bg-blue-50 sm:grid">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      ) : null}
    </>
  );
}
