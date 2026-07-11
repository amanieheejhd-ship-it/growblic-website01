"use client";

import { useEffect, useState } from "react";

type Props = {
  internshipTitle: string;
};

type FeePlan = {
  days: number;
  amount: number;
  label: string;
};

type ExchangeRateResponse = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

const feePlans: FeePlan[] = [
  { days: 30, amount: 3000, label: "Starter" },
  { days: 45, amount: 4000, label: "Foundation" },
  { days: 60, amount: 5000, label: "Growth" },
  { days: 90, amount: 7000, label: "Professional" },
  { days: 180, amount: 12000, label: "Advanced" },
];

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function InternshipFeePanel({
  internshipTitle,
}: Props) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState("");
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState(false);
  const [paymentStepOpen, setPaymentStepOpen] = useState(false);

  const selectedPlan =
    feePlans.find((plan) => plan.days === selectedDays) ?? null;

  useEffect(() => {
    const controller = new AbortController();

    async function loadExchangeRate() {
      try {
        setRateLoading(true);
        setRateError(false);

        const response = await fetch(
          "https://api.frankfurter.dev/v2/rate/INR/USD",
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Exchange-rate request failed");
        }

        const data = (await response.json()) as ExchangeRateResponse;

        if (!Number.isFinite(data.rate) || data.rate <= 0) {
          throw new Error("Invalid exchange rate");
        }

        setUsdRate(data.rate);
        setRateDate(data.date);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setRateError(true);
        }
      } finally {
        setRateLoading(false);
      }
    }

    loadExchangeRate();

    return () => controller.abort();
  }, []);

  function selectPlan(days: number) {
    setSelectedDays(days);
    setPaymentStepOpen(false);
  }

  function continueToPayment() {
    if (!selectedPlan) {
      return;
    }

    setPaymentStepOpen(true);

    window.setTimeout(() => {
      document.getElementById("payment-setup-placeholder")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }

  return (
    <section
      id="internship-fee-panel"
      className="mt-10 scroll-mt-8 overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-[0_30px_100px_rgba(37,99,235,0.14)]"
    >
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-6 py-8 sm:px-10">
        <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">
          Internship duration and fee
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Select your internship plan
        </h2>

        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
          Choose the duration that suits you. The final payment will always be
          charged in Indian Rupees.
        </p>

        <div className="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />

          {rateLoading && "Loading current USD reference rate..."}

          {!rateLoading && !rateError && rateDate && (
            <>
              USD reference rate updated: {rateDate}
            </>
          )}

          {!rateLoading && rateError && (
            <>USD conversion temporarily unavailable</>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-8 lg:p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feePlans.map((plan) => {
            const selected = selectedDays === plan.days;
            const usdAmount =
              usdRate !== null ? plan.amount * usdRate : null;

            return (
              <button
                type="button"
                key={plan.days}
                onClick={() => selectPlan(plan.days)}
                aria-pressed={selected}
                className={
                  selected
                    ? "relative overflow-hidden rounded-[28px] border-2 border-blue-600 bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-left text-white shadow-[0_22px_55px_rgba(37,99,235,0.30)] transition"
                    : "relative overflow-hidden rounded-[28px] border border-blue-100 bg-slate-50/70 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]"
                }
              >
                {selected && (
                  <span className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black text-blue-600">
                    ✓
                  </span>
                )}

                <p
                  className={
                    selected
                      ? "text-xs font-black uppercase tracking-[0.2em] text-blue-100"
                      : "text-xs font-black uppercase tracking-[0.2em] text-blue-600"
                  }
                >
                  {plan.label}
                </p>

                <h3 className="mt-4 text-3xl font-black">
                  {plan.days} days
                </h3>

                <p className="mt-5 text-2xl font-black">
                  {inrFormatter.format(plan.amount)}
                </p>

                <p
                  className={
                    selected
                      ? "mt-2 text-sm font-bold text-blue-100"
                      : "mt-2 text-sm font-bold text-slate-500"
                  }
                >
                  {rateLoading && "Calculating USD..."}

                  {!rateLoading && usdAmount !== null && (
                    <>Approximately {usdFormatter.format(usdAmount)}</>
                  )}

                  {!rateLoading && usdAmount === null && (
                    <>USD currently unavailable</>
                  )}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col gap-4 rounded-[28px] border border-blue-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            {selectedPlan ? (
              <>
                <p className="text-sm font-black text-slate-950">
                  Selected: {selectedPlan.days} days
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Payable amount: {inrFormatter.format(selectedPlan.amount)}
                  {usdRate !== null && (
                    <>
                      {" "}
                      · Approximately{" "}
                      {usdFormatter.format(
                        selectedPlan.amount * usdRate,
                      )}
                    </>
                  )}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-black text-slate-950">
                  No plan selected
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Select one duration to continue.
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            disabled={!selectedPlan}
            onClick={continueToPayment}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            Continue →
          </button>
        </div>

        {paymentStepOpen && selectedPlan && (
          <section
            id="payment-setup-placeholder"
            className="mt-7 scroll-mt-8 overflow-hidden rounded-[30px] border border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                  Payment setup
                </p>

                <h3 className="mt-3 text-2xl font-black text-slate-950">
                  QR payment will appear here
                </h3>

                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
                  Selected plan: {selectedPlan.days} days for{" "}
                  {inrFormatter.format(selectedPlan.amount)}. The payment QR,
                  backend verification and invoice will be connected later.
                  No payment is being charged right now.
                </p>

                <p className="mt-3 text-sm font-bold text-slate-500">
                  Internship: {internshipTitle}
                </p>
              </div>

              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[24px] border border-blue-200 bg-white text-center text-xs font-black leading-5 text-blue-600 shadow-sm">
                QR
                <br />
                Coming
                <br />
                Later
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
