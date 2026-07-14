"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

type Props = {
  internshipTitle: string;
};

type FeePlan = {
  days: number;
  amount: number;
  label: string;
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

const internshipPaymentUri =
  "upi://pay?pa=6284613537@fam&pn=Gautam&am=1.00&cu=INR&tn=Growblic%20Internship%20Test%20Payment";

export default function InternshipFeePanel({
  internshipTitle,
}: Props) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [paymentStepOpen, setPaymentStepOpen] = useState(false);

  const selectedPlan =
    feePlans.find((plan) => plan.days === selectedDays) ?? null;

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
      document.getElementById("internship-payment-qr")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
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
          Choose your preferred duration. All payments will be charged in
          Indian Rupees.
        </p>
      </div>

      <div className="p-5 sm:p-8 lg:p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feePlans.map((plan) => {
            const selected = selectedDays === plan.days;

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

                <p className="mt-6 text-2xl font-black">
                  {inrFormatter.format(plan.amount)}
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
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-black text-slate-950">
                  No plan selected
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Select one internship plan to continue.
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
            id="internship-payment-qr"
            className="mt-8 scroll-mt-8 overflow-hidden rounded-[32px] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 shadow-[0_24px_70px_rgba(37,99,235,0.13)]"
          >
            <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
                  Scan and pay
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                  Complete your payment
                </h3>

                <div className="mt-6 space-y-3 rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-500">
                      Internship
                    </span>

                    <span className="text-right text-sm font-black text-slate-950">
                      Internship
                    </span>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-500">
                      Duration
                    </span>

                    <span className="text-sm font-black text-slate-950">
                      {selectedPlan.days} days
                    </span>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-500">
                      Amount
                    </span>

                    <span className="text-xl font-black text-blue-600">
                      {inrFormatter.format(selectedPlan.amount)}
                    </span>
                  </div>
                </div>

                
              </div>

              <div className="mx-auto w-full max-w-[300px] rounded-[30px] border border-blue-200 bg-white p-5 shadow-[0_20px_60px_rgba(37,99,235,0.18)]">
                <div className="flex aspect-square w-full items-center justify-center rounded-[22px] border-2 border-dashed border-blue-300 bg-[linear-gradient(135deg,#eff6ff,#ecfeff)] p-6 text-center">
                  <QRCodeSVG
                    value={internshipPaymentUri}
                    aria-label="Growblic internship test payment QR code"
                    className="h-auto w-full"
                    level="M"
                    marginSize={2}
                  />
                </div>

                <p className="mt-4 text-center text-xs font-bold text-slate-500">
                  Scan using any supported UPI application
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
