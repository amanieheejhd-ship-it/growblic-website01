"use client";

import { useEffect, useState } from "react";
import InternshipConfirmationFlow from "./InternshipConfirmationFlow";
import {
  canRevealPaidAssets,
  nextPaymentFlow,
  type PaymentFlowState,
} from "./internship-payment-flow";

type Props = { internshipTitle: string; applicationReference: string };
type FeePlan = { days: number; amount: number; label: string };
type PaymentSession = {
  paymentId: string;
  accessToken: string;
  razorpayKeyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  name: string;
  email: string;
  contact: string;
  durationDays: number;
};
type PaymentStatus = {
  status: "CREATED" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  durationDays: number;
  certificateEligible: boolean;
  invoiceAvailable: boolean;
  invoiceNumber?: string;
  fullName?: string;
  program?: string;
};
type RazorpayResult = { razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string; amount: number; currency: string; name: string; description: string;
  order_id: string; prefill: { name: string; email: string; contact: string };
  handler: (result: RazorpayResult) => void;
};

declare global {
  interface Window { Razorpay?: new (options: RazorpayOptions) => { open(): void } }
}

const feePlans: FeePlan[] = [
  { days: 30, amount: 3000, label: "Starter" },
  { days: 45, amount: 4000, label: "Foundation" },
  { days: 60, amount: 5000, label: "Growth" },
  { days: 90, amount: 7000, label: "Professional" },
  { days: 180, amount: 12000, label: "Advanced" },
];
const inrFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://growblic-api.onrender.com").replace(/\/$/, "");

async function responseJson<T>(response: Response) {
  const data = await response.json().catch(() => null) as T | null;
  if (!response.ok || !data) throw new Error("The payment request could not be completed.");
  return data;
}

async function loadRazorpayCheckout() {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-growblic-razorpay="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Checkout could not load.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.growblicRazorpay = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Checkout could not load."));
    document.head.appendChild(script);
  });
}

export default function InternshipFeePanel({ internshipTitle, applicationReference }: Props) {
  const storageKey = `growblic-internship-payment:${applicationReference}`;
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [paymentStepOpen, setPaymentStepOpen] = useState(false);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [flow, setFlow] = useState<PaymentFlowState>("idle");
  const selectedPlan = feePlans.find((plan) => plan.days === selectedDays) ?? null;
  const paid = canRevealPaidAssets(flow);

  function transition(event: Parameters<typeof nextPaymentFlow>[1]) {
    setFlow((current) => nextPaymentFlow(current, event));
  }

  async function refreshStatus(active = session) {
    if (!active) return;
    const response = await fetch(`${apiBase}/internship-payments/${encodeURIComponent(active.paymentId)}/status`, {
      headers: { "x-payment-access-token": active.accessToken },
    });
    const current = await responseJson<PaymentStatus>(response);
    if (current.status !== "PAID") {
      setStatus(current);
      transition({ type: "server-status", ...current });
      return;
    }
    const eligibilityResponse = await fetch(`${apiBase}/internship-payments/${encodeURIComponent(active.paymentId)}/certificate-eligibility`, {
      headers: { "x-payment-access-token": active.accessToken },
    });
    const eligibility = await responseJson<{ eligible: true; invoiceNumber: string; fullName: string; program: string; durationDays: number }>(eligibilityResponse);
    const confirmed = { ...current, ...eligibility, certificateEligible: eligibility.eligible };
    setStatus(confirmed);
    transition({ type: "server-status", ...confirmed });
  }

  useEffect(() => {
    if (!applicationReference) return;
    const timeout = window.setTimeout(() => {
      setSession(null);
      setStatus(null);
      setSelectedDays(null);
      setPaymentStepOpen(false);
      setError("");
      transition({ type: "application-changed" });
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      try {
        const restored = JSON.parse(raw) as PaymentSession;
        setSession(restored);
        setSelectedDays(restored.durationDays);
        setPaymentStepOpen(true);
        transition({ type: "session-restored" });
        void refreshStatus(restored).catch(() => {
          transition({ type: "request-failed" });
          setStatus(null);
          setError("Payment status could not be restored.");
        });
      } catch { window.localStorage.removeItem(storageKey); }
    }, 0);
    return () => window.clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationReference, storageKey]);

  function selectPlan(days: number) {
    if (session) return;
    setSelectedDays(days);
    setPaymentStepOpen(false);
    setStatus(null);
    setError("");
    transition({ type: "plan-selected" });
  }

  async function continueToPayment() {
    if (!selectedPlan || !applicationReference) return;
    setBusy(true);
    setError("");
    transition({ type: "order-started" });
    try {
      let active = session;
      if (!active) {
        const response = await fetch(`${apiBase}/internship-payments/orders`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ applicationReference, duration: selectedPlan.days }),
        });
        const created = await responseJson<Omit<PaymentSession, "durationDays">>(response);
        active = { ...created, durationDays: selectedPlan.days };
        setSession(active);
        window.localStorage.setItem(storageKey, JSON.stringify(active));
      }
      transition({ type: "order-created" });
      setPaymentStepOpen(true);
      await openCheckout(active);
      window.setTimeout(() => document.getElementById("internship-payment-checkout")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    } catch (caught) {
      transition({ type: "request-failed" });
      setStatus(null);
      setError(caught instanceof Error ? caught.message : "The payment request could not be completed.");
    } finally { setBusy(false); }
  }

  async function openCheckout(active: PaymentSession) {
    transition({ type: "order-created" });
    await loadRazorpayCheckout();
    if (!window.Razorpay) throw new Error("Checkout could not load.");
    new window.Razorpay({
      key: active.razorpayKeyId,
      amount: active.amount,
      currency: active.currency,
      name: "Growblic",
      description: `${internshipTitle} internship - ${active.durationDays} days`,
      order_id: active.razorpayOrderId,
      prefill: { name: active.name, email: active.email, contact: active.contact },
      handler: (result) => void verifyPayment(active, result),
    }).open();
  }

  async function verifyPayment(active: PaymentSession, result: RazorpayResult) {
    setBusy(true);
    setError("");
    setStatus(null);
    transition({ type: "verification-started" });
    try {
      const response = await fetch(`${apiBase}/internship-payments/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          paymentId: active.paymentId,
          accessToken: active.accessToken,
          razorpayPaymentId: result.razorpay_payment_id,
          razorpaySignature: result.razorpay_signature,
        }),
      });
      await responseJson<PaymentStatus>(response);
      await refreshStatus(active);
    } catch (caught) {
      transition({ type: "request-failed" });
      setStatus(null);
      setError(caught instanceof Error ? caught.message : "Payment verification failed.");
    }
    finally { setBusy(false); }
  }

  async function downloadInvoice() {
    if (!session || !paid) return;
    setBusy(true);
    try {
      const response = await fetch(`${apiBase}/internship-payments/${encodeURIComponent(session.paymentId)}/invoice`, {
        headers: { "x-payment-access-token": session.accessToken },
      });
      if (!response.ok) throw new Error("The invoice could not be downloaded.");
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      const disposition = response.headers.get("content-disposition") ?? "";
      const serverFilename = /filename="?([^";]+)"?/i.exec(disposition)?.[1];
      anchor.href = url;
      anchor.download = serverFilename || "Growblic-Payment-Receipt.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "The invoice could not be downloaded."); }
    finally { setBusy(false); }
  }

  return (
    <section id="internship-fee-panel" className="mt-10 scroll-mt-8 overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-[0_30px_100px_rgba(37,99,235,0.14)]">
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-8 sm:px-10">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">Internship duration and fee</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Select your internship plan</h2>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">Choose your preferred duration. All payments will be charged in Indian Rupees.</p>
      </div>
      <div className="p-5 sm:p-8 lg:p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feePlans.map((plan) => {
            const selected = selectedDays === plan.days;
            return <button type="button" key={plan.days} onClick={() => selectPlan(plan.days)} disabled={Boolean(session)} aria-pressed={selected} className={selected ? "relative overflow-hidden rounded-[28px] border-2 border-blue-600 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-left text-white shadow-[0_22px_55px_rgba(37,99,235,0.30)] transition" : "relative overflow-hidden rounded-[28px] border border-blue-100 bg-slate-50/70 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]"}>
              {selected && <span className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black text-blue-600">✓</span>}
              <p className={selected ? "text-xs font-black uppercase tracking-[0.2em] text-blue-100" : "text-xs font-black uppercase tracking-[0.2em] text-blue-600"}>{plan.label}</p>
              <h3 className="mt-4 text-3xl font-black">{plan.days} days</h3>
              <p className="mt-6 text-2xl font-black">{inrFormatter.format(plan.amount)}</p>
            </button>;
          })}
        </div>
        <div className="mt-7 flex flex-col gap-4 rounded-[28px] border border-blue-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>{selectedPlan ? <><p className="text-sm font-black text-slate-950">Selected: {selectedPlan.days} days</p><p className="mt-1 text-sm font-semibold text-slate-500">Payable amount: {inrFormatter.format(selectedPlan.amount)}</p></> : <><p className="text-sm font-black text-slate-950">No plan selected</p><p className="mt-1 text-sm font-semibold text-slate-500">Select one internship plan to continue.</p></>}</div>
          <button type="button" disabled={!selectedPlan || busy || paid} onClick={() => void continueToPayment()} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none">{busy ? "Please wait..." : session ? "Resume payment →" : "Continue →"}</button>
        </div>
        {error && <p role="alert" className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
        {paymentStepOpen && selectedPlan && <section id="internship-payment-checkout" className="mt-8 scroll-mt-8 overflow-hidden rounded-[32px] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-[0_24px_70px_rgba(37,99,235,0.13)]">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">Secure payment</p><h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{paid ? "Payment successful" : "Complete your payment"}</h3>
              {paid && status?.invoiceNumber && <p className="mt-2 text-sm font-bold text-emerald-700">Invoice: {status.invoiceNumber}</p>}
              <div className="mt-6 space-y-3 rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-500">Internship</span><span className="text-right text-sm font-black text-slate-950">Internship</span></div><div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-500">Duration</span><span className="text-sm font-black text-slate-950">{selectedPlan.days} days</span></div><div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-500">Amount</span><span className="text-xl font-black text-blue-600">{inrFormatter.format(selectedPlan.amount)}</span></div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[300px] rounded-[30px] border border-blue-200 bg-white p-5 text-center shadow-[0_20px_60px_rgba(37,99,235,0.18)]">
              <div className="flex aspect-square items-center justify-center rounded-[22px] border-2 border-dashed border-blue-300 bg-[linear-gradient(135deg,#eff6ff,#ecfeff)] p-6"><span className="text-6xl" aria-hidden="true">{paid ? "✓" : "₹"}</span></div>
              {paid ? <button type="button" onClick={() => void downloadInvoice()} disabled={busy} className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white">Download invoice</button> : <button type="button" onClick={() => session && void openCheckout(session)} className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white">Open secure checkout</button>}
              <p className="mt-4 text-xs font-bold text-slate-500">Payment status is verified securely by Growblic.</p>
            </div>
          </div>
        </section>}
        {paid && session && status?.fullName && status.program && <InternshipConfirmationFlow durationDays={status.durationDays} initialFullName={status.fullName} initialProgram={status.program} />}
      </div>
    </section>
  );
}
