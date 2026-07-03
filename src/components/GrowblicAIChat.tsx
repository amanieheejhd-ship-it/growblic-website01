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

const quickPrompts = [
  "Growblic kya services deta hai?",
  "Mujhe website banwani hai",
  "Project ka estimate kaise milega?",
  "Cloud deployment me help karte ho?",
];

export default function GrowblicAIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, main Growblic AI hoon. Aap services, apps, pricing guidance, cloud deployment, ya project start karne ke baare me pooch sakte ho.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function sendMessage(customMessage?: string) {
    const finalMessage = (customMessage || message).trim();
    if (!finalMessage || loading) return;

    setMessage("");
    setLoading(true);
    setMessages((items) => [...items, { role: "user", content: finalMessage }]);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: finalMessage }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = (await response.json()) as { reply?: string };
      const reply =
        data.reply ||
        "Main abhi reply nahi de pa raha. Aap Start Project page se enquiry bhej sakte ho.";

      setMessages((items) => [...items, { role: "assistant", content: reply }]);
    } catch {
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content:
            "Mujhe abhi connect karne me problem aa rahi hai. Aap Start Project page se enquiry bhej sakte ho, team aapko guide kar degi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] font-sans sm:bottom-6 sm:right-6">
      {open ? (
        <div className="mb-4 w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-[1.7rem] border border-blue-100/80 bg-white/92 shadow-[0_30px_110px_rgba(37,99,235,0.22)] ring-1 ring-white/80 backdrop-blur-2xl">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#1d4ed8_48%,#06b6d4)] p-5 text-white">
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/30 blur-3xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 shadow-xl ring-1 ring-white/20 backdrop-blur-xl">
                  <Bot className="h-6 w-6" />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-base font-black">
                    Growblic AI <Sparkles className="h-4 w-4 text-cyan-200" />
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-blue-50">
                    Ask about services, apps, pricing, cloud setup, or starting a project.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close Growblic AI chat"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[330px] space-y-3 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ${
                    item.role === "user"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "border border-blue-100 bg-blue-50/70 text-slate-700"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-slate-700">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Thinking...
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-blue-100 bg-white/80 p-4">
            <div className="mb-3 grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-2xl border border-blue-100 bg-white px-3 py-2 text-left text-xs font-extrabold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask Growblic AI..."
                className="min-w-0 flex-1 rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading || !message.trim()}
                className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>

            <p className="mt-3 text-center text-[11px] font-medium leading-5 text-slate-400">
              Growblic AI helps with Growblic services and project guidance.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-label="Open Growblic AI chat"
        onClick={() => setOpen((value) => !value)}
        className="group flex items-center gap-3 rounded-full border border-blue-100 bg-white/90 px-4 py-3 text-sm font-black text-slate-900 shadow-[0_18px_60px_rgba(37,99,235,0.20)] ring-1 ring-white/80 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-blue-300"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition group-hover:bg-slate-950">
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </span>
        <span>Ask Growblic AI</span>
        <ArrowRight className="h-4 w-4 text-blue-600 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
