"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Loader2,
  MessageCircle,
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
  "What services does Growblic offer?",
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
    <div className="fixed bottom-3 right-3 z-[90] font-sans sm:bottom-6 sm:right-6">
      {open ? (
        <div className="mb-3 w-[calc(100vw-24px)] max-w-[410px] origin-bottom-right animate-[growblicChatIn_220ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_34px_120px_rgba(15,23,42,0.24),0_12px_44px_rgba(14,165,233,0.18)] ring-1 ring-sky-100/70 backdrop-blur-2xl sm:mb-4">
          <style jsx>{`
            @keyframes growblicChatIn {
              from {
                opacity: 0;
                transform: translateY(14px) scale(0.97);
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
          <div className="relative overflow-hidden bg-[linear-gradient(140deg,#07111f_0%,#0f3f8f_48%,#0891b2_100%)] px-5 py-5 text-white sm:px-6">
            <div className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-sky-300/24 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 top-1 h-36 w-36 rounded-full bg-cyan-200/32 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.20),transparent_26%),radial-gradient(circle_at_82%_4%,rgba(34,211,238,0.26),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.10),transparent_62%)]" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_14px_32px_rgba(8,47,73,0.28)] ring-1 ring-white/30 backdrop-blur-xl">
                  <Bot className="h-6 w-6 drop-shadow-sm" />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-base font-black tracking-normal">
                    Growblic Assistant
                    <Sparkles className="h-4 w-4 shrink-0 text-cyan-100" />
                  </p>
                  <p className="mt-1 max-w-[270px] text-xs font-semibold leading-5 text-sky-50/90">
                    Ask about services, apps, pricing, cloud setup, or starting a project.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close Growblic Assistant chat"
                onClick={resetChat}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] ring-1 ring-white/20 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white/22 hover:ring-white/35"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[360px] space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(248,250,252,0.90),rgba(255,255,255,0.82))] px-4 py-5 sm:px-5"
          >
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex animate-[growblicMessageIn_180ms_ease-out_both] ${
                  item.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[86%] px-4 py-3 text-sm font-semibold leading-6 shadow-sm ${
                    item.role === "user"
                      ? "rounded-[20px] rounded-br-md bg-[linear-gradient(135deg,#2563eb,#0891b2)] text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)]"
                      : "rounded-[20px] rounded-bl-md border border-sky-100/90 bg-white/82 text-slate-700 shadow-[0_10px_32px_rgba(15,23,42,0.07)] ring-1 ring-white/70 backdrop-blur-xl"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="inline-flex animate-[growblicMessageIn_180ms_ease-out_both] items-center gap-2 rounded-[20px] rounded-bl-md border border-sky-100 bg-white/86 px-4 py-3 text-sm font-bold text-slate-700 shadow-[0_10px_32px_rgba(15,23,42,0.07)] ring-1 ring-white/70 backdrop-blur-xl">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Typing…
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-sky-100/80 bg-white/88 p-4 shadow-[0_-18px_46px_rgba(255,255,255,0.76)] backdrop-blur-2xl sm:p-5">
            {!hasUserMessage && !loading ? (
              <div className="mb-3 grid grid-cols-1 gap-2 min-[390px]:grid-cols-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-2xl border border-sky-100/90 bg-white/82 px-3 py-2.5 text-left text-xs font-extrabold leading-5 text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ring-1 ring-white/70 backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:text-blue-700 hover:shadow-[0_14px_34px_rgba(14,165,233,0.14)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask Growblic Assistant…"
                className="min-w-0 flex-1 rounded-full border border-sky-100 bg-white/92 px-4 py-3 text-sm font-semibold text-slate-800 shadow-inner shadow-slate-100/70 outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading || !message.trim()}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#2563eb,#06b6d4)] text-white shadow-[0_14px_32px_rgba(37,99,235,0.26)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(37,99,235,0.34)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>

            <p className="mt-3 text-center text-[11px] font-semibold leading-5 text-slate-400">
              Growblic Assistant helps with Growblic services and project guidance.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open Growblic Assistant chat"
        onClick={() => {
          if (open) {
            resetChat();
            return;
          }

          setOpen(true);
        }}
        className="group flex items-center gap-3 rounded-full border border-white/70 bg-white/82 px-3.5 py-3 text-sm font-black text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.16),0_10px_34px_rgba(14,165,233,0.18)] ring-1 ring-sky-100/80 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-white/92 hover:shadow-[0_24px_76px_rgba(15,23,42,0.20),0_16px_44px_rgba(14,165,233,0.22)] sm:px-4"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#2563eb,#06b6d4)] text-white shadow-[0_12px_28px_rgba(37,99,235,0.28)] ring-1 ring-white/50 transition duration-300 group-hover:scale-105">
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </span>
        <span className="whitespace-nowrap">Ask Growblic Assistant</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-50 text-blue-600 ring-1 ring-sky-100 transition duration-300 group-hover:translate-x-0.5 group-hover:bg-blue-50">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
}
