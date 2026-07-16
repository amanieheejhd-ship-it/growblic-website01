"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import InternshipConfirmationFlow, {
  type ConfirmationDownloadResult,
} from "./InternshipConfirmationFlow";
import { canContinueToInternshipPayment } from "./internship-application-flow";
import {
  canRevealPaidAssets,
  initialSuccessOverlayState,
  isDemoPaymentGatewayEnabled,
  nextPaymentFlow,
  nextSuccessOverlay,
  scheduleSuccessOverlayDismiss,
  shouldRenderRealPaymentQr,
  type PaymentFlowState,
} from "./internship-payment-flow";

type Props = { internshipTitle: string; applicationReference: string };
type FeePlan = { days: number; amount: number; label: string };
type PaymentSession = {
  paymentId: string;
  accessToken: string;
  durationDays: number;
};
type PaymentStatus = {
  paymentId: string;
  status: "CREATED" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  amount: number;
  currency: string;
  durationDays: number;
  certificateEligible: boolean;
  invoiceAvailable: boolean;
  invoiceNumber?: string;
};
type CertificateEligibility = {
  eligible: true;
  invoiceNumber: string;
  fullName: string;
  program: string;
  durationDays: number;
  confirmation: { status: "PAID" };
};

const feePlans: FeePlan[] = [
  { days: 30, amount: 3000, label: "Starter" },
  { days: 45, amount: 4000, label: "Foundation" },
  { days: 60, amount: 5000, label: "Growth" },
  { days: 90, amount: 7000, label: "Professional" },
  { days: 180, amount: 12000, label: "Advanced" },
];
const inrFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const upiUri = "upi://pay?pa=7021617045@pthdfc&pn=MADHUBALA%20SINGH&am=1&cu=INR";
const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://growblic-api.onrender.com").replace(/\/$/, "");
const pollingIntervalMs = 3_000;
const maximumPollingFailures = 3;
const demoGatewayEnabled =
  isDemoPaymentGatewayEnabled(process.env.NEXT_PUBLIC_DEMO_PAYMENT_GATEWAY);

export default function InternshipFeePanel({ applicationReference }: Props) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [paymentStepOpen, setPaymentStepOpen] = useState(false);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [eligibility, setEligibility] = useState<CertificateEligibility | null>(null);
  const [flow, setFlow] = useState<PaymentFlowState>("idle");
  const [pollingUnavailable, setPollingUnavailable] = useState(false);
  const [letterBusy, setLetterBusy] = useState(false);
  const [continueBusy, setContinueBusy] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);
  const [demoReady, setDemoReady] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [successOverlay, setSuccessOverlay] = useState(initialSuccessOverlayState);
  const lastBackendStatusRef = useRef<string | null>(null);
  const selectedPlan = feePlans.find((plan) => plan.days === selectedDays) ?? null;
  const canContinue = canContinueToInternshipPayment(
    selectedDays,
    applicationReference,
  );
  const activeSession = session?.durationDays === selectedDays ? session : null;
  const paid = canRevealPaidAssets(flow);
  const confirmationAvailable =
    paid &&
    Boolean(
      activeSession?.paymentId.trim() &&
      activeSession.accessToken.trim(),
    );

  function transition(event: Parameters<typeof nextPaymentFlow>[1]) {
    setFlow((current) => nextPaymentFlow(current, event));
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSession(null);
      setEligibility(null);
      setPollingUnavailable(false);
      setDemoReady(false);
      setPaymentError("");
      setFlow("idle");
      setSuccessOverlay(initialSuccessOverlayState());
      lastBackendStatusRef.current = null;

      const storageKey = `growblic-internship-payment:${applicationReference}`;
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;

      try {
        const candidate = JSON.parse(raw) as Partial<PaymentSession>;
        if (
          typeof candidate.paymentId !== "string" ||
          !candidate.paymentId.trim() ||
          typeof candidate.accessToken !== "string" ||
          !candidate.accessToken.trim() ||
          typeof candidate.durationDays !== "number"
        ) {
          throw new Error("Invalid payment session");
        }
        setSession({
          paymentId: candidate.paymentId,
          accessToken: candidate.accessToken,
          durationDays: candidate.durationDays,
        });
        setFlow((current) =>
          nextPaymentFlow(current, { type: "session-restored" }),
        );
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [applicationReference]);

  useEffect(() => {
    if (!paymentStepOpen || !activeSession || paid) return;

    const verifiedSession = activeSession;
    let cancelled = false;
    let failureCount = 0;
    let nextPoll: number | undefined;
    const controller = new AbortController();

    async function poll() {
      let continuePolling = true;

      try {
        const response = await fetch(
          `${apiBase}/internship-payments/${encodeURIComponent(verifiedSession.paymentId)}/status`,
          {
            headers: {
              "x-payment-access-token": verifiedSession.accessToken,
            },
            signal: controller.signal,
          },
        );
        const current = (await response.json().catch(() => null)) as PaymentStatus | null;
        if (
          !response.ok ||
          !current ||
          current.paymentId !== verifiedSession.paymentId ||
          typeof current.status !== "string" ||
          !Number.isFinite(current.amount) ||
          current.amount < 0 ||
          typeof current.currency !== "string"
        ) {
          throw new Error("Payment status request failed");
        }
        if (cancelled) return;

        failureCount = 0;
        setPollingUnavailable(false);
        setPaymentStatus(current);
        if (demoGatewayEnabled && current.status === "PENDING") {
          setDemoReady(true);
        }
        setSuccessOverlay((previous) =>
          nextSuccessOverlay(previous, {
            type: "trusted-status",
            previousStatus: lastBackendStatusRef.current,
            currentStatus: current.status,
            paymentId: current.paymentId,
            amountPaise: current.amount,
          }),
        );
        lastBackendStatusRef.current = current.status;
        setFlow((previous) =>
          nextPaymentFlow(previous, { type: "server-status", ...current }),
        );

        if (current.status === "PAID") {
          continuePolling = false;
          const eligibilityResponse = await fetch(
            `${apiBase}/internship-payments/${encodeURIComponent(verifiedSession.paymentId)}/certificate-eligibility`,
            {
              headers: {
                "x-payment-access-token": verifiedSession.accessToken,
              },
              signal: controller.signal,
            },
          );
          const eligibilityResult = (await eligibilityResponse
            .json()
            .catch(() => null)) as CertificateEligibility | null;
          if (
            !cancelled &&
            eligibilityResponse.ok &&
            eligibilityResult?.eligible === true
          ) {
            setEligibility(eligibilityResult);
          }
        }
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        failureCount += 1;
        if (failureCount >= maximumPollingFailures) {
          continuePolling = false;
          setPollingUnavailable(true);
          setFlow((previous) =>
            nextPaymentFlow(previous, { type: "request-failed" }),
          );
        }
      }

      if (continuePolling && !cancelled) {
        nextPoll = window.setTimeout(() => void poll(), pollingIntervalMs);
      }
    }

    void poll();

    return () => {
      cancelled = true;
      controller.abort();
      if (nextPoll !== undefined) window.clearTimeout(nextPoll);
    };
  }, [activeSession, paid, paymentStepOpen]);

  useEffect(() => {
    if (!successOverlay.visible) return;

    const timeout = scheduleSuccessOverlayDismiss(
      window.setTimeout.bind(window),
      () => {
        setSuccessOverlay((current) =>
          nextSuccessOverlay(current, { type: "dismiss" }),
        );
      },
    );

    return () => window.clearTimeout(timeout);
  }, [successOverlay.visible]);

  function selectPlan(days: number) {
    setSelectedDays(days);
    setPaymentStepOpen(false);
    setEligibility(null);
    setPollingUnavailable(false);
    setDemoReady(false);
    setPaymentError("");
    setSuccessOverlay(initialSuccessOverlayState());
    lastBackendStatusRef.current = null;
    transition({ type: "plan-selected" });
  }

  async function continueToPayment() {
    if (!selectedPlan || !canContinue) return;

    setPaymentError("");
    setContinueBusy(true);
    try {
      if (demoGatewayEnabled && !activeSession) {
        transition({ type: "order-started" });
        const response = await fetch(
          `${apiBase}/internship-payments/demo-sessions`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              applicationReference,
              duration: selectedPlan.days,
            }),
          },
        );
        const created = (await response.json().catch(() => null)) as {
          paymentId?: unknown;
          accessToken?: unknown;
          durationDays?: unknown;
          status?: unknown;
          amount?: unknown;
          currency?: unknown;
        } | null;
        if (!response.ok) {
          const backendMessage =
            created &&
            typeof created === "object" &&
            "error" in created &&
            created.error &&
            typeof created.error === "object" &&
            "message" in created.error &&
            typeof created.error.message === "string"
              ? created.error.message
              : `Demo session failed with HTTP ${response.status}`;

          throw new Error(backendMessage);
        }

        if (
          typeof created?.paymentId !== "string" ||
          !created.paymentId.trim() ||
          typeof created.accessToken !== "string" ||
          !created.accessToken.trim() ||
          created.durationDays !== selectedPlan.days ||
          created.status !== "PENDING" ||
          created.amount !== 100 ||
          created.currency !== "INR"
        ) {
          throw new Error("The demo payment session response was invalid.");
        }
        const nextSession: PaymentSession = {
          paymentId: created.paymentId,
          accessToken: created.accessToken,
          durationDays: selectedPlan.days,
        };
        setSession(nextSession);
        window.localStorage.setItem(
          `growblic-internship-payment:${applicationReference}`,
          JSON.stringify(nextSession),
        );
        transition({ type: "order-created" });
      }

      setPaymentStepOpen(true);
      window.setTimeout(
        () =>
          document
            .getElementById("internship-payment-checkout")
            ?.scrollIntoView({ behavior: "smooth", block: "center" }),
        120,
      );
    } catch (error) {
      transition({ type: "request-failed" });
      setPaymentError(
        error instanceof Error
          ? error.message
          : "The payment session could not be created.",
      );
    } finally {
      setContinueBusy(false);
    }
  }

  function openPaymentLink() {
    transition({ type: "payment-link-opened" });
    window.location.href = upiUri;
  }

  async function completeDemoPayment() {
    if (!demoGatewayEnabled || !activeSession || !demoReady || demoBusy || paid) {
      return;
    }
    transition({ type: "demo-complete-requested" });
    setDemoBusy(true);
    setPaymentError("");
    try {
      const response = await fetch(
        `${apiBase}/internship-payments/${encodeURIComponent(activeSession.paymentId)}/demo-complete`,
        {
          method: "POST",
          headers: {
            "x-payment-access-token": activeSession.accessToken,
          },
        },
      );
      if (!response.ok) {
        throw new Error("The demo payment could not be completed.");
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "The demo payment could not be completed.",
      );
    } finally {
      setDemoBusy(false);
    }
  }

  async function downloadConfirmationLetter(
    joiningDate: string,
  ): Promise<ConfirmationDownloadResult> {
    if (
      letterBusy ||
      !confirmationAvailable ||
      !activeSession
    ) {
      return {
        ok: false,
        error: "The confirmation letter is not available yet.",
      };
    }

    setLetterBusy(true);
    try {
      const response = await fetch(
        `${apiBase}/internship-payments/${encodeURIComponent(activeSession.paymentId)}/confirmation-letter`,
        {
          method: "POST",
          headers: {
            "x-payment-access-token": activeSession.accessToken,
            "content-type": "application/json",
          },
          body: JSON.stringify({ joiningDate }),
        },
      );
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          message?: unknown;
        } | null;
        return {
          ok: false,
          error:
            typeof result?.message === "string" && result.message
              ? result.message
              : "The confirmation letter could not be prepared.",
        };
      }

      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      const disposition = response.headers.get("content-disposition") ?? "";
      const serverFilename = /filename="?([^";]+)"?/i.exec(disposition)?.[1];
      anchor.href = url;
      anchor.download =
        serverFilename || "growblic-internship-confirmation.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: "The confirmation letter could not be prepared.",
      };
    } finally {
      setLetterBusy(false);
    }
  }

  return (
    <>
      <section id="internship-fee-panel" className="mt-10 scroll-mt-8 overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-[0_30px_100px_rgba(37,99,235,0.14)]">
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-8 sm:px-10">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">Internship duration and fee</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Select your internship plan</h2>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">Choose your preferred duration. All payments will be charged in Indian Rupees.</p>
      </div>
      <div className="p-5 sm:p-8 lg:p-10">
        <p role="status" aria-live="polite" className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">Application submitted successfully. Please select your internship plan.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feePlans.map((plan) => {
            const selected = selectedDays === plan.days;
            return <button type="button" key={plan.days} onClick={() => selectPlan(plan.days)} aria-pressed={selected} className={selected ? "relative overflow-hidden rounded-[28px] border-2 border-blue-600 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-left text-white shadow-[0_22px_55px_rgba(37,99,235,0.30)] transition" : "relative overflow-hidden rounded-[28px] border border-blue-100 bg-slate-50/70 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]"}>
              {selected && <span className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black text-blue-600">✓</span>}
              <p className={selected ? "text-xs font-black uppercase tracking-[0.2em] text-blue-100" : "text-xs font-black uppercase tracking-[0.2em] text-blue-600"}>{plan.label}</p>
              <h3 className="mt-4 text-3xl font-black">{plan.days} days</h3>
              <p className="mt-6 text-2xl font-black">{inrFormatter.format(plan.amount)}</p>
            </button>;
          })}
        </div>
        <div className="mt-7 flex flex-col gap-4 rounded-[28px] border border-blue-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>{selectedPlan ? <><p className="text-sm font-black text-slate-950">Selected: {selectedPlan.days} days</p><p className="mt-1 text-sm font-semibold text-slate-500">Payable amount: {inrFormatter.format(selectedPlan.amount)}</p></> : <><p className="text-sm font-black text-slate-950">No plan selected</p><p className="mt-1 text-sm font-semibold text-slate-500">Select one internship plan to continue.</p></>}</div>
          <button type="button" disabled={!canContinue || continueBusy} onClick={() => void continueToPayment()} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none">{continueBusy ? "Please wait..." : "Continue →"}</button>
        </div>
        {paymentError && !paymentStepOpen && <p role="alert" className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{paymentError}</p>}
        {paymentStepOpen && selectedPlan && <section id="internship-payment-checkout" className="mt-8 scroll-mt-8 overflow-hidden rounded-[32px] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-[0_24px_70px_rgba(37,99,235,0.13)]">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">Secure payment</p><h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{paid ? "Payment successful" : "Complete your payment"}</h3>
              <div className="mt-6 space-y-3 rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-500">Internship</span><span className="text-right text-sm font-black text-slate-950">Internship</span></div><div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-500">Duration</span><span className="text-sm font-black text-slate-950">{selectedPlan.days} days</span></div><div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-500">Amount</span><span className="text-xl font-black text-blue-600">{inrFormatter.format(1)}</span></div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[300px] rounded-[30px] border border-blue-200 bg-white p-5 text-center shadow-[0_20px_60px_rgba(37,99,235,0.18)]">
              {demoGatewayEnabled ? (
                <div className="flex aspect-square flex-col items-center justify-center rounded-[22px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">TEST MODE</span>
                  <p className="mt-4 text-lg font-black text-slate-950">Demo payment only</p>
                  <p className="mt-3 text-sm font-bold text-slate-600">Selected duration: {selectedPlan.days} days</p>
                  <p className="mt-2 text-2xl font-black text-blue-600">Demo amount: ₹1</p>
                  {!paid && <button type="button" disabled={!demoReady || demoBusy} onClick={() => void completeDemoPayment()} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60">{demoBusy ? "Processing..." : "Pay ₹1 (Demo)"}</button>}
                  <p className="mt-4 text-[11px] font-black leading-5 text-amber-800">TEST MODE — No real payment will be charged.</p>
                </div>
              ) : shouldRenderRealPaymentQr(flow, demoGatewayEnabled) ? (
                <div className="flex aspect-square items-center justify-center rounded-[22px] border-2 border-dashed border-blue-300 bg-[linear-gradient(135deg,#eff6ff,#ecfeff)] p-6"><QRCodeSVG value={upiUri} size={192} level="H" marginSize={4} title="UPI payment QR code for Gautam" className="h-auto w-full max-w-full" /></div>
              ) : null}
              {!paid && !demoGatewayEnabled ? (
                <button
                  type="button"
                  onClick={openPaymentLink}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white"
                >
                  Open secure checkout
                </button>
              ) : null}
              <p className="mt-4 text-xs font-bold text-slate-500">
                {paid
                  ? "Your payment has been verified securely."
                  : activeSession
                    ? pollingUnavailable
                      ? "Automatic payment verification is temporarily unavailable."
                      : "Waiting for payment confirmation..."
                    : "Automatic verification will be available after secure payment verification is configured."}
              </p>
              {paymentError && <p role="alert" className="mt-4 text-xs font-bold text-rose-700">{paymentError}</p>}
            </div>
          </div>
        </section>}
        {confirmationAvailable && (
          <InternshipConfirmationFlow
            downloading={letterBusy}
            onDownload={downloadConfirmationLetter}
          />
        )}
        <style jsx>{`
          .payment-success-scale {
            animation: payment-success-scale-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .payment-success-check {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: payment-success-check-draw 520ms ease-out 220ms both;
          }
          .payment-success-ripple {
            animation: payment-success-ripple 900ms ease-out 120ms both;
          }
          @keyframes payment-success-scale-in {
            from { opacity: 0; transform: scale(0.78); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes payment-success-check-draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes payment-success-ripple {
            from { opacity: 0.7; transform: scale(0.82); }
            to { opacity: 0; transform: scale(1.18); }
          }
          @media (prefers-reduced-motion: reduce) {
            .payment-success-scale,
            .payment-success-check,
            .payment-success-ripple {
              animation: none;
            }
            .payment-success-check {
              stroke-dashoffset: 0;
            }
            .payment-success-ripple {
              opacity: 0;
            }
          }
        `}</style>
      </div>
      </section>
      {successOverlay.visible && successOverlay.amountPaise !== null && (
        <div role="dialog" aria-modal="true" aria-label="Verified payment confirmation" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-[2px]">
          <div role="status" aria-live="polite" className="w-full max-w-sm rounded-[30px] border border-emerald-100 bg-white p-8 text-center shadow-[0_28px_90px_rgba(15,23,42,0.22),0_0_48px_rgba(16,185,129,0.18)]">
            <div className="payment-success-scale relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.30)]">
              <span aria-hidden="true" className="payment-success-ripple absolute -inset-3 rounded-full border border-emerald-300" />
              <svg aria-hidden="true" viewBox="0 0 64 64" className="relative h-12 w-12 fill-none text-white">
                <path className="payment-success-check" d="M17 33.5 27.5 44 48 22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-950">Payment successful</h3>
            <p className="mt-3 text-lg font-black text-emerald-600">{inrFormatter.format(successOverlay.amountPaise / 100)} received</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">Your payment has been verified securely.</p>
          </div>
        </div>
      )}
    </>
  );
}
