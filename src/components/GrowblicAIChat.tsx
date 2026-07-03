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
const QUICK_FALLBACK_TIMEOUT_MS = 2500;

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hello, I’m Growblic Assistant. I can help you explore Growblic services, products, pricing guidance, cloud deployment, and starting a project.",
  },
];

const liveProducts = [
  "Bill Vault",
  "Chess Offline",
  "Classta",
  "Classta Admin",
  "Classta Mentor",
  "ColorCraft ASMR",
  "Dexa Sheet",
  "Docura",
  "Event Sync",
  "EventSync Organizer",
  "Fresh Fade",
  "Fresh Fade Business",
  "Fresh Fade IN",
  "Fresh Fold",
  "Fresh Fold Vendor",
  "Growblic Captain",
  "Growblic Earn Money Online",
  "GST Billing Management",
  "INS PETRO",
  "Jeev Setu",
  "Kheti Hub",
  "Kumbha",
  "LockVault",
  "Myniq",
  "Myniq Admin",
  "Nil",
  "PairUp Meet",
  "PayRoll+HR",
  "PivotOS Minimalist Launcher",
  "Presenta",
  "Project Pipeline",
  "Property Dost",
  "Qmail",
  "SocioConnect",
  "Sociva",
  "TapMystic",
  "True Auth",
];

const services = [
  "Website Development",
  "Software Development",
  "Mobile App Development",
  "SaaS Product Development",
  "AI Automation",
  "SEO Services",
  "Google Ads",
  "Meta Ads",
  "GMB Rating & Reviews",
  "Price Calculator",
  "Start Project",
  "Support",
];

const quickPrompts = [
  "What services does Growblic offer?",
  "I want to build a website",
  "Show Growblic apps/products",
  "How does pricing work?",
];

const businessFeatureProfiles = [
  {
    match: /\b(shoe|shoes|footwear|sneaker|sneakers|slipper|slippers|sandals?)\b/i,
    label: "footwear",
    features: [
      "product catalog",
      "size and color variants",
      "cart and checkout",
      "secure payments",
      "inventory/admin controls",
      "offers and order tracking",
    ],
  },
  {
    match: /\b(restaurant|cafe|hotel|food|kitchen|bakery|cloud kitchen)\b/i,
    label: "restaurant",
    features: [
      "menu pages",
      "table booking",
      "online ordering",
      "location and hours",
      "offers",
      "order/admin management",
    ],
  },
  {
    match: /\b(school|college|academy|institute|tuition|coaching)\b/i,
    label: "school",
    features: [
      "student and teacher profiles",
      "attendance",
      "notices",
      "fees",
      "classes",
      "admin dashboard",
    ],
  },
  {
    match: /\b(doctor|clinic|hospital|dentist|healthcare|medical)\b/i,
    label: "doctor/clinic",
    features: [
      "appointment booking",
      "patient records",
      "availability slots",
      "reminders",
      "prescriptions",
      "staff/admin controls",
    ],
  },
  {
    match: /\b(gym|fitness|trainer|yoga|sports club)\b/i,
    label: "gym",
    features: [
      "membership plans",
      "attendance",
      "payments",
      "trainer management",
      "renewal reminders",
      "reports",
    ],
  },
  {
    match: /\b(real estate|property|broker|realtor|builder|apartment|plots?|rental)\b/i,
    label: "real estate",
    features: [
      "property listings",
      "search filters",
      "photo galleries",
      "lead forms",
      "location maps",
      "agent/admin dashboard",
    ],
  },
  {
    match: /\b(laundry|dry clean|dry cleaning|wash|ironing)\b/i,
    label: "laundry",
    features: [
      "pickup scheduling",
      "delivery tracking",
      "service pricing",
      "order status",
      "payments",
      "vendor/admin management",
    ],
  },
  {
    match: /\b(ecommerce|e-commerce|online store|store|shop|marketplace)\b/i,
    label: "ecommerce",
    features: [
      "catalog",
      "cart",
      "checkout",
      "payment integration",
      "stock management",
      "admin dashboard",
    ],
  },
];

const solutionIntentPattern =
  /\b(website|web app|app|mobile app|software|dashboard|ecommerce|e-commerce|booking|system|platform|portal|marketplace)\b/i;
const mobileAppDevelopmentIntentPattern =
  /\b(app banwani hai|mobile app chahiye|android app|ios app|build app)\b/i;

function getSolutionLabel(text: string) {
  const match = text.match(solutionIntentPattern);
  return match?.[0]?.replace("e-commerce", "ecommerce") || "digital product";
}

function extractBusinessIdea(input: string) {
  const normalized = input.toLowerCase();
  const profile = businessFeatureProfiles.find((item) => item.match.test(normalized));

  if (profile) {
    return profile;
  }

  const solutionMatch = normalized.match(solutionIntentPattern);
  if (!solutionMatch?.index) return null;

  const beforeIntent = normalized
    .slice(0, solutionMatch.index)
    .replace(/\b(i|we|want|need|to|build|make|create|develop|a|an|the|for|my|our|new)\b/g, " ")
    .replace(/[^a-z0-9\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!beforeIntent || beforeIntent.length < 3) return null;

  return {
    label: beforeIntent,
    features: [
      "clear service or product pages",
      "lead capture forms",
      "customer workflow",
      "admin dashboard",
      "analytics",
      "deployment-ready setup",
    ],
  };
}

function buildBusinessIdeaReply(input: string) {
  if (!solutionIntentPattern.test(input)) return null;

  const idea = extractBusinessIdea(input);
  if (!idea) return null;

  const solutionLabel = getSolutionLabel(input.toLowerCase());
  const featureList = idea.features.join(", ");

  return `That sounds like a ${idea.label} ${solutionLabel}. A strong version could include ${featureList}. Growblic can design, develop, and deploy it with a premium frontend, backend/admin panel, integrations, and launch support. Do you want this mainly for lead generation, online sales/bookings, or internal operations?`;
}

function buildFallbackReply(input: string) {
  const text = input.toLowerCase();
  const productList = liveProducts.join(", ");
  const serviceList = services.join(", ");
  const asksForProductList =
    (/\b(apps?|products?|portfolio|live apps?|live products?|tools)\b/i.test(text) &&
      /\b(growblic|kon|kaun|kaunse|konsa|kaun kaun|which|list|naam|names)\b/i.test(text)) ||
    /\bgrowblic\b.*\bapps?\b.*\b(kon|kaun|kaunse|konsa|kaun kaun|which|list|naam|names)\b/i.test(
      text,
    ) ||
    /\bapps?\b.*\b(kon|kaun|kaunse|konsa|kaun kaun|which|list|naam|names)\b/i.test(text);

  if (/\b(hi|hello|hey|namaste|sat sri akal)\b/i.test(text)) {
    return "Hello, I’m Growblic Assistant. I can help with Growblic services, products, pricing guidance, cloud deployment, and project planning. What would you like to build or explore?";
  }

  if (asksForProductList) {
    return `Growblic live apps/products are: ${productList}.`;
  }

  if (/\b(cloud|deploy|deployment|datacenter|data center|server|render|vercel|postgres|database)\b/i.test(text)) {
    return "Growblic helps with cloud-ready deployment planning: Vercel, Render, Node.js APIs, PostgreSQL, HTTPS, environment variables, logs, backups, monitoring, and launch checks. Growblic does not own AWS-like physical datacenters. What stack is your project using?";
  }

  if (/\b(service|services|seo|ads|automation|gmb|reviews|support)\b/i.test(text)) {
    return `Growblic services include: ${serviceList}. Which service would you like details on?`;
  }

  if (/\b(price|pricing|cost|budget|estimate|kitna|charges|rate)\b/i.test(text)) {
    return "Pricing depends on scope: features, design depth, backend/admin needs, integrations, platform, screens, timeline, and maintenance. For a practical estimate, use the Price Calculator or Start Project form. What type of project are you planning?";
  }

  if (/\b(website|web|site|landing|ecommerce|e-commerce)\b/i.test(text)) {
    return "Growblic website development covers premium business websites, landing pages, ecommerce flows, SEO-ready pages, forms, analytics, and launch setup. Do you need a simple website or one with a dashboard/backend?";
  }

  if (mobileAppDevelopmentIntentPattern.test(text)) {
    return "Growblic mobile app development covers Android/iOS apps, backend APIs, admin panels, authentication, payments, notifications, and launch support. Is it a customer app or an internal business app?";
  }

  const businessIdeaReply = buildBusinessIdeaReply(input);
  if (businessIdeaReply) {
    return businessIdeaReply;
  }

  if (/\b(saas|software|dashboard|admin|api|backend|platform|system)\b/i.test(text)) {
    return "Growblic builds SaaS platforms, dashboards, backend APIs, admin panels, and automation systems, from idea to design, development, deployment, and launch support. What core features do you need?";
  }

  return "I can help with Growblic services and project guidance. Share your project type, features, timeline, budget range, or platform, and I’ll suggest a strong next step.";
}

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
    
    const requestTimeout = window.setTimeout(() => controller.abort(), 15000);
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
          history: messages.slice(-8),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = (await response.json()) as { reply?: string };
      const reply =
        data.reply ||
        "Hm, I’m having trouble connecting right now. Please try again in a moment, or use the Start Project page to contact Growblic.";

      setMessages((items) => [...items, { role: "assistant", content: reply }]);
    } catch {
if (controller.signal.aborted && !timedOut) return;
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content: buildFallbackReply(finalMessage),
        },
      ]);
    } finally {
      window.clearTimeout(requestTimeout);
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
                    Growblic Assistant <Sparkles className="h-4 w-4 text-cyan-200" />
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-blue-50">
                    Ask about services, apps, pricing, cloud setup, or starting a project.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close Growblic Assistant chat"
                onClick={resetChat}
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
                  Typing…
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-blue-100 bg-white/80 p-4">
            {!hasUserMessage && !loading ? (
              <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-2xl border border-blue-100 bg-white px-3 py-2 text-left text-xs font-extrabold leading-5 text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
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
                placeholder="Ask Growblic Assistant..."
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
        className="group flex items-center gap-3 rounded-full border border-blue-100 bg-white/90 px-4 py-3 text-sm font-black text-slate-900 shadow-[0_18px_60px_rgba(37,99,235,0.20)] ring-1 ring-white/80 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-blue-300"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition group-hover:bg-slate-950">
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </span>
        <span>Ask Growblic Assistant</span>
        <ArrowRight className="h-4 w-4 text-blue-600 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
