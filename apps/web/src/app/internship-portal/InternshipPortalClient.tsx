"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { fetchGrowblicApi, growblicApiUrl, LOCAL_BACKEND_CONNECTION_ERROR } from "@/lib/api";
import {
  applicantDashboardLayout,
  buildApplicantDashboardView,
  friendlyStatus,
  isInternshipDemoPaymentEnabled,
  type DisplayRow,
} from "./applicant-dashboard-view";

type Props = {
  applicationReference: string;
  duration: string;
  resetToken: string;
  verifyToken: string;
  flowToken: string;
  authError: string;
};

type Dashboard = {
  account: {
    email: string;
    lastLoginAt: string | null;
    status: string;
    emailVerifiedAt: string | null;
    emailVerified: boolean;
    createdAt: string;
    failedLoginCount: number;
    provider: string | null;
    providers: string[];
  };
  application: {
    id: string;
    reference: string;
    status: string;
    submittedAt: string;
  } | null;
  applicant: {
    name: string;
    email: string;
    phone: string;
    originalApplicationDetails: Record<string, string | number | null>;
  } | null;
  internship: {
    selectedPlan: string;
    durationDays: number | null;
    status: string;
    startedAt: string | null;
    expectedCompletionAt: string | null;
    totalDays: number | null;
    elapsedDays: number | null;
    remainingDays: number | null;
    progressPercentage: number | null;
  } | null;
  payment: {
    paymentId: string | null;
    status: string;
    method: string | null;
    paidAt: string | null;
    amountPaise: number | null;
    currency: string;
    safeReference: string | null;
  } | null;
  offerLetter: {
    available: boolean;
    generatedAt: string | null;
  } | null;
  certificate: {
    eligible: boolean;
    available: boolean;
    availableAt: string | null;
    status: string;
    generatedAt: string | null;
  } | null;
  demoPayment?: {
    enabled: boolean;
  };
};

type PaymentSession = {
  paymentId: string;
  accessToken: string | null;
  durationDays: number;
};

const demoPaymentEnabled =
  isInternshipDemoPaymentEnabled(
    process.env.NEXT_PUBLIC_ENABLE_INTERNSHIP_DEMO_PAYMENT,
    process.env.NEXT_PUBLIC_ENABLE_DEMO_PAYMENT,
  );
const upiUri = "upi://pay?pa=7021617045@pthdfc&pn=MADHUBALA%20SINGH&am=1&cu=INR";
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function InternshipPortalClient({
  applicationReference,
  duration,
  resetToken,
  verifyToken,
  flowToken,
  authError,
}: Props) {
  const [mode, setMode] = useState<"register" | "sign-in" | "forgot" | "reset">(
    resetToken ? "reset" : "register",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [demoCompletionBusy, setDemoCompletionBusy] = useState(false);
  const [resetHandled, setResetHandled] = useState(false);
  const [dashboardStep, setDashboardStep] = useState<"summary" | "payment">("summary");
  const paymentSectionRef = useRef<HTMLElement | null>(null);

  const dashboardPath = useMemo(() => {
    const query = new URLSearchParams();
    if (applicationReference) query.set("applicationReference", applicationReference);
    if (duration) query.set("duration", duration);
    return `/internship-portal/dashboard${query.size ? `?${query}` : ""}`;
  }, [applicationReference, duration]);

  const refreshDashboard = useCallback(async () => {
    const response = await fetchGrowblicApi(dashboardPath, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (response.status === 401) {
      setDashboard(null);
      return;
    }
    const data = (await response.json().catch(() => null)) as Dashboard | null;
    if (!response.ok || !data) {
      throw new Error(safeError(data, "The dashboard could not be loaded."));
    }
    setDashboard(data);
    if (data.payment?.status === "PAID") setDashboardStep("payment");
  }, [dashboardPath]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refreshDashboard().catch(() => undefined);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [refreshDashboard]);

  useEffect(() => {
    if (!verifyToken || resetHandled) return;
    setResetHandled(true);
    void fetchGrowblicApi("/internship-portal/auth/verify-email", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ token: verifyToken }),
    })
      .then(async (response) => {
        const result = (await response.json().catch(() => null)) as unknown;
        setMessage(safeError(result, response.ok ? "Your email address has been verified." : "Email verification failed."));
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : LOCAL_BACKEND_CONNECTION_ERROR));
  }, [resetHandled, verifyToken]);

  useEffect(() => {
    if (dashboardStep !== "payment") return;
    const timeout = window.setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(timeout);
  }, [dashboardStep]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "register" && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetchGrowblicApi(
        mode === "register"
          ? "/internship-portal/auth/register"
          : mode === "reset"
            ? "/internship-portal/auth/reset-password"
            : mode === "forgot"
              ? "/internship-portal/auth/forgot-password"
              : "/internship-portal/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json", Accept: "application/json" },
          body: JSON.stringify(
            mode === "reset"
              ? { token: resetToken, password }
              : mode === "forgot"
                ? { email }
                : { email, password },
          ),
        },
      );
      const result = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) throw new Error(safeError(result, "Authentication failed."));
      if (mode === "forgot" || mode === "reset") {
        setMessage(safeError(result, mode === "reset" ? "Password reset complete." : "If an account exists for this email, a password reset link has been sent."));
        if (mode === "reset") setMode("sign-in");
      } else {
        await refreshDashboard();
        setMessage("");
      }
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : LOCAL_BACKEND_CONNECTION_ERROR,
      );
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetchGrowblicApi("/internship-portal/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setDashboard(null);
      setSession(null);
      setDashboardStep("summary");
    } finally {
      setBusy(false);
    }
  }

  function startSocialLogin(provider: "google" | "github") {
    if (!flowToken) return;
    const query = new URLSearchParams({ flowToken });
    window.location.href = growblicApiUrl(
      `/internship-portal/auth/oauth/${provider}/start?${query.toString()}`,
    );
  }

  async function requestDemoSession() {
    if (!dashboard?.internship?.durationDays) {
      throw new Error("Select an internship duration before starting payment.");
    }
    const response = await fetchGrowblicApi(
      "/internship-portal/payments/demo-session",
      {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          applicationReference,
          duration: dashboard.internship.durationDays,
        }),
      },
    );
    const result = (await response.json().catch(() => null)) as PaymentSession & {
      status?: string;
      amount?: number;
      currency?: string;
    };
    if (!response.ok) throw new Error(safeError(result, "Demo session could not be created."));
    if (!result.paymentId || !result.durationDays) {
      throw new Error("Demo session response was invalid.");
    }
    const nextSession = {
      paymentId: result.paymentId,
      accessToken: result.accessToken ?? null,
      durationDays: result.durationDays,
    };
    setSession(nextSession);
    return nextSession;
  }

  async function runDemoPayment() {
    if (paymentBusy || paid) return;
    setPaymentBusy(true);
    setMessage("");
    try {
      const activeSession = session?.accessToken ? session : await requestDemoSession();
      if (!activeSession.accessToken) {
        throw new Error("This application is already paid.");
      }
      const response = await fetchGrowblicApi(
        `/internship-payments/${encodeURIComponent(activeSession.paymentId)}/demo-complete`,
        {
          method: "POST",
          headers: { "x-payment-access-token": activeSession.accessToken },
        },
      );
      const result = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) throw new Error(safeError(result, "The demo payment could not be completed."));
      setSession(null);
      setMessage("Payment successful. Your internship is now active.");
      await refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : LOCAL_BACKEND_CONNECTION_ERROR);
    } finally {
      setPaymentBusy(false);
    }
  }

  async function completeDemoInternship() {
    if (demoCompletionBusy || !paid || dashboard?.payment?.method !== "DEMO") return;
    setDemoCompletionBusy(true);
    setMessage("");
    try {
      const response = await fetchGrowblicApi(
        "/internship-portal/certificate/demo-complete",
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ applicationReference }),
        },
      );
      const result = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) {
        throw new Error(safeError(result, "The demo internship could not be completed."));
      }
      setMessage("Demo internship completed.");
      await refreshDashboard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : LOCAL_BACKEND_CONNECTION_ERROR);
    } finally {
      setDemoCompletionBusy(false);
    }
  }

  async function download(path: string) {
    const response = await fetch(growblicApiUrl(path), {
      credentials: "include",
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as unknown;
      setMessage(safeError(data, "The document is not available yet."));
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const anchor = document.createElement("a");
    const disposition = response.headers.get("content-disposition") ?? "";
    anchor.href = url;
    anchor.download = /filename="?([^";]+)"?/i.exec(disposition)?.[1] ?? "growblic-document.pdf";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!dashboard && flowToken && !resetToken) {
    return (
      <main className="min-h-screen px-5 py-12 text-slate-950 sm:px-8">
        <section className="mx-auto max-w-2xl rounded-[36px] border border-blue-100 bg-white p-6 shadow-[0_30px_100px_rgba(37,99,235,0.14)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">
            Internship applicant portal
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Sign in to continue
          </h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
            Use the same verified email address submitted in your internship application.
          </p>

          <div className="mt-7 grid grid-cols-2 rounded-full border border-blue-100 bg-blue-50 p-1">
            <button type="button" onClick={() => setMode("register")} className={tabClass(mode === "register")}>
              Create account
            </button>
            <button type="button" onClick={() => setMode("sign-in")} className={tabClass(mode === "sign-in" || mode === "forgot")}>
              Sign in
            </button>
          </div>

          <form onSubmit={(event) => void submitAuth(event)} className="mt-7 grid gap-5">
            {mode !== "forgot" ? (
              <label className="text-sm font-black text-slate-800">
                Email address
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  className={fieldClass}
                />
              </label>
            ) : (
              <label className="text-sm font-black text-slate-800">
                Email address
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  className={fieldClass}
                />
              </label>
            )}
            {mode !== "forgot" ? (
              <label className="text-sm font-black text-slate-800">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  className={fieldClass}
                />
              </label>
            ) : null}
            {mode === "register" ? (
              <label className="text-sm font-black text-slate-800">
                Confirm password
                <input
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={fieldClass}
                />
              </label>
            ) : null}
            <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {busy
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Sign in"}
            </button>
            {mode === "sign-in" ? (
              <button type="button" onClick={() => setMode("forgot")} className="justify-self-center text-sm font-black text-blue-700">
                Forgot password?
              </button>
            ) : null}
            {mode === "forgot" ? (
              <button type="button" onClick={() => setMode("sign-in")} className="justify-self-center text-sm font-black text-blue-700">
                Back to sign in
              </button>
            ) : null}
          </form>

          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-blue-100" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              or continue with
            </span>
            <span className="h-px flex-1 bg-blue-100" />
          </div>
          <div className="mt-7 grid gap-4">
            <button type="button" onClick={() => startSocialLogin("google")} className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700">
              Continue with Google
            </button>
            <button type="button" onClick={() => startSocialLogin("github")} className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700">
              Continue with GitHub
            </button>
          </div>
          {(authError || message) && <p role="alert" className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{authError || message}</p>}
        </section>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="min-h-screen px-5 py-12 text-slate-950 sm:px-8">
        <section className="mx-auto max-w-2xl rounded-[36px] border border-blue-100 bg-white p-6 shadow-[0_30px_100px_rgba(37,99,235,0.14)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">
            Internship applicant portal
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Growblic Account
          </h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
            Create your Growblic account or sign in to manage your internship journey.
          </p>

          <div className="mt-7 grid grid-cols-2 rounded-full border border-blue-100 bg-blue-50 p-1">
            <button type="button" onClick={() => setMode("register")} className={tabClass(mode === "register")}>
              Create account
            </button>
            <button type="button" onClick={() => setMode("sign-in")} className={tabClass(mode === "sign-in")}>
              Sign in
            </button>
          </div>

          <form onSubmit={(event) => void submitAuth(event)} className="mt-7 grid gap-5">
            {mode !== "reset" ? (
              <label className="text-sm font-black text-slate-800">
                Email address
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  required
                  className={fieldClass}
                />
              </label>
            ) : null}
            {mode !== "forgot" ? (
              <label className="text-sm font-black text-slate-800">
                {mode === "reset" ? "New password" : "Password"}
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  autoComplete={mode === "register" || mode === "reset" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  className={fieldClass}
                />
              </label>
            ) : null}
            {mode === "register" ? (
              <label className="text-sm font-black text-slate-800">
                Confirm password
                <input
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={fieldClass}
                />
              </label>
            ) : null}
            <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              {busy
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : mode === "forgot"
                    ? "Send reset link"
                    : mode === "reset"
                      ? "Reset password"
                      : "Sign in"}
            </button>
            {mode === "sign-in" ? (
              <button type="button" onClick={() => setMode("forgot")} className="justify-self-center text-sm font-black text-blue-700">
                Forgot password?
              </button>
            ) : null}
            {mode === "forgot" || mode === "reset" ? (
              <button type="button" onClick={() => setMode("sign-in")} className="justify-self-center text-sm font-black text-blue-700">
                Back to sign in
              </button>
            ) : null}
          </form>
          {message && <p role="alert" className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{message}</p>}
        </section>
      </main>
    );
  }

  const hasApplication = Boolean(dashboard.application && dashboard.applicant && dashboard.internship && dashboard.payment);
  const paid = dashboard.payment?.status === "PAID";
  const demoControlsEnabled = demoPaymentEnabled && dashboard.demoPayment?.enabled === true;
  const amount = dashboard.payment?.amountPaise === 100 && dashboard.payment.method === "DEMO"
    ? 1
    : (dashboard.payment?.amountPaise ?? 0) / 100;
  const dashboardView = hasApplication ? buildApplicantDashboardView(dashboard) : null;

  return (
    <main className="min-h-screen px-5 py-10 text-slate-950 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-[32px] border border-blue-100 bg-white p-6 shadow-[0_24px_80px_rgba(37,99,235,0.12)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
              Signed in as
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight">
              {dashboard.account.email}
            </h1>
            <p className="mt-2 text-sm font-bold text-slate-500">
              Account {friendlyStatus(dashboard.account.status)} · {dashboard.account.emailVerified ? "Email verified" : "Email not verified"}
              {dashboard.account.provider ? ` · ${humanize(dashboard.account.provider)}` : ""}
            </p>
          </div>
          <button type="button" disabled={busy} onClick={() => void logout()} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
            Logout
          </button>
        </div>

        {!hasApplication ? (
          <section className="mt-8 rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black tracking-tight">Applicant dashboard</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Summary label="Signed-in email" value={dashboard.account.email} />
              <Summary label="Account status" value={friendlyStatus(dashboard.account.status)} />
              <Summary label="Email verification" value={dashboard.account.emailVerified ? "Verified" : "Not verified"} />
              <Summary label="Account created" value={formatDate(dashboard.account.createdAt)} />
            </div>
            <div className="mt-8 rounded-[28px] border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-black text-blue-800">No internship application is linked to this account yet.</p>
              <a href="/internships" className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20">
                Apply for Internship
              </a>
            </div>
          </section>
        ) : (
        <>
        <div className="mt-8 space-y-6" data-payment-layout={applicantDashboardLayout.paymentPlacement}>
          <div className="space-y-5">
            <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                    Applicant dashboard
                  </p>
                  <h2 className="mt-2 break-words text-2xl font-black tracking-tight">
                    {dashboardView?.applicantName}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge label={dashboardView?.applicationStatus ?? "New"} />
                  <StatusBadge label={dashboardView?.paymentStatus ?? "Not started"} tone={paid ? "success" : "neutral"} />
                  <StatusBadge label={dashboardView?.internshipStatus ?? "Not started"} />
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <CompactMetric label="Application status" value={dashboardView?.applicationStatus ?? "New"} />
                <CompactMetric label="Payment" value={dashboardView?.paymentStatus ?? "Not started"} />
                <CompactMetric label="Internship status" value={dashboardView?.internshipStatus ?? "Not started"} />
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <DashboardGroup title="Applicant Details" rows={dashboardView?.applicantRows ?? []} />
              <DashboardGroup title="Internship Details" rows={dashboardView?.internshipRows ?? []} />
            </div>

            {dashboardView?.instituteRows.length ? (
              <DashboardGroup title="Institute Details" rows={dashboardView.instituteRows} />
            ) : null}

            {!paid && dashboardStep === "summary" ? (
              <div className="flex justify-end">
                <button type="button" onClick={() => setDashboardStep("payment")} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700">
                  Continue
                </button>
              </div>
            ) : null}
          </div>

          {(dashboardStep === "payment" || paid) ? <section ref={paymentSectionRef} data-payment-side-by-side={String(applicantDashboardLayout.paymentSideBySide)} data-payment-density={applicantDashboardLayout.paymentDensity} className="scroll-mt-8 rounded-[28px] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 shadow-[0_18px_50px_rgba(37,99,235,0.12)] sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
              Secure payment
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              {paid ? "Payment successful" : "Complete your payment"}
            </h2>
            <div data-payment-card-layout={applicantDashboardLayout.paymentCardLayout} className="mt-4 grid gap-4 rounded-[22px] border border-blue-100 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(260px,304px)] md:items-start">
              <div data-payment-details-placement="left" className="rounded-[18px] border border-slate-100 bg-slate-50/70 px-4 py-2">
                <PaymentDetail label="Duration" value={dashboard.internship?.durationDays ? `${dashboard.internship.durationDays} days` : "—"} />
                <PaymentDetail label="Amount" value={amount ? inrFormatter.format(amount) : "—"} />
                <PaymentDetail label="Payment status" value={dashboardView?.paymentStatus ?? "Not started"} />
              </div>
              <div data-qr-placement={applicantDashboardLayout.qrPlacement} className="mx-auto w-full max-w-[304px] rounded-[22px] border border-blue-200 bg-white p-4 text-center shadow-[0_12px_36px_rgba(37,99,235,0.12)] md:mt-0">
                <div className="mx-auto flex aspect-square max-w-[220px] items-center justify-center rounded-[20px] border-2 border-dashed border-blue-300 bg-[linear-gradient(135deg,#eff6ff,#ecfeff)] p-3">
                  <QRCodeSVG value={upiUri} size={204} level="H" marginSize={3} title="UPI payment QR code" className="h-auto w-full max-w-full" />
                </div>
                {demoControlsEnabled && !paid ? (
                <div data-demo-button-placement={applicantDashboardLayout.demoButtonPlacement} className="mt-3">
                  <p className="mb-2 text-[11px] font-bold text-slate-500">
                    {applicantDashboardLayout.demoTestModeLabel}
                  </p>
                  <button
                    type="button"
                    disabled={paymentBusy}
                    onClick={() => void runDemoPayment()}
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {paymentBusy ? "Processing demo payment..." : "Demo ₹1 Payment"}
                  </button>
                </div>
              ) : null}
              {!paid ? (
                <button type="button" onClick={() => { window.location.href = upiUri; }} className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white">
                  Open secure checkout
                </button>
              ) : null}
              </div>
            </div>
            {paid ? (
              <div data-payment-success-placement={applicantDashboardLayout.paymentSuccessPlacement} className="mx-auto mt-4 max-w-2xl rounded-[24px] border border-emerald-100 bg-emerald-50 p-4 text-center">
                <p className="text-sm font-black text-emerald-800">Payment successful</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <CompactMetric label="Duration" value={dashboard.internship?.durationDays ? `${dashboard.internship.durationDays} days` : "—"} />
                  <CompactMetric label={dashboard.payment?.method === "DEMO" ? "Demo amount paid" : "Paid amount"} value={amount ? inrFormatter.format(amount) : "—"} />
                  <CompactMetric label="Start date" value={formatDate(dashboard.internship?.startedAt ?? null)} />
                  <CompactMetric label="Completion date" value={formatDate(dashboard.internship?.expectedCompletionAt ?? null)} />
                  <CompactMetric label="Payment status" value="Paid" />
                </div>
              </div>
            ) : null}
          </section> : null}
        </div>

        {paid && (
          <section className="mt-6 rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black tracking-tight">Documents</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {dashboard.offerLetter?.available ? (
                <>
                <button type="button" onClick={() => void download("/internship-portal/offer-letter/download")} className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20">
                  Download Internship Letter
                </button>
                <a href={growblicApiUrl("/internship-portal/offer-letter")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-black text-emerald-700">
                  View Internship Letter
                </a>
                </>
              ) : null}
              {demoControlsEnabled && dashboard.payment?.method === "DEMO" && !dashboard.certificate?.available ? (
                <button
                  type="button"
                  disabled={demoCompletionBusy}
                  onClick={() => void completeDemoInternship()}
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {demoCompletionBusy ? "Completing demo internship..." : "Complete Demo Internship"}
                </button>
              ) : null}
            </div>

            {dashboardView?.progress ? (
              <section data-progress-placement={applicantDashboardLayout.progressPlacement} className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                      Internship started
                    </p>
                    <h3 className="mt-1 text-lg font-black tracking-tight">
                      {dashboardView.progress.status}
                    </h3>
                  </div>
                  <p className="text-sm font-black text-blue-700">
                    {dashboardView.progress.progressPercentage}%
                  </p>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${dashboardView.progress.progressPercentage}%` }}
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  <CompactMetric label="Start date" value={dashboardView.progress.startDate} />
                  <CompactMetric label="Completion date" value={dashboardView.progress.completionDate} />
                  <CompactMetric label="Total duration" value={dashboardView.progress.totalDuration ?? "—"} />
                  <CompactMetric label="Elapsed days" value={dashboardView.progress.elapsedDays ?? "—"} />
                  <CompactMetric label="Remaining days" value={dashboardView.progress.remainingDays ?? "—"} />
                  <CompactMetric label="Progress percentage" value={`${dashboardView.progress.progressPercentage}%`} />
                </div>
              </section>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              {dashboard.certificate?.available ? (
                <>
                <a href={growblicApiUrl("/internship-portal/certificate")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-black text-blue-700">
                  View Certificate
                </a>
                <button type="button" onClick={() => void download("/internship-portal/certificate/download")} className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20">
                  Download Your Internship Certificate
                </button>
                </>
              ) : (
                <p className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                  {dashboard.certificate?.eligible
                    ? "Certificate is pending admin details and approval."
                    : `Certificate will be available after internship completion${dashboard.certificate?.availableAt ? ` on ${formatDate(dashboard.certificate.availableAt)}` : ""}.`}
                </p>
              )}
            </div>
          </section>
        )}
        </>
        )}

        {message && <p role="status" className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</p>}
      </section>
    </main>
  );
}

const fieldClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm shadow-blue-100/40 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100";

function tabClass(active: boolean) {
  return active
    ? "rounded-full bg-white px-4 py-2.5 text-sm font-black text-blue-700 shadow-sm"
    : "rounded-full px-4 py-2.5 text-sm font-black text-slate-500";
}

function safeError(value: unknown, fallback: string) {
  if (!value || typeof value !== "object") return fallback;
  const data = value as { message?: unknown; error?: { message?: unknown } };
  const message =
    typeof data.error?.message === "string"
      ? data.error.message
      : typeof data.message === "string"
        ? data.message
        : "";
  return message.trim() || fallback;
}

function DashboardGroup({ title, rows }: { title: string; rows: DisplayRow[] }) {
  if (!rows.length) return null;
  return (
    <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">
        {title}
      </h3>
      <dl className="mt-4 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[0.9fr_1.1fr] sm:gap-4">
            <dt className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
              {row.label}
            </dt>
            <dd className="break-words text-sm font-bold text-slate-900">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function CompactMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-slate-50/70 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success";
}) {
  const className = tone === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-blue-100 bg-blue-50 text-blue-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-black ${className}`}>
      {label}
    </span>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-slate-50/70 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function PaymentDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-base font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function humanize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
