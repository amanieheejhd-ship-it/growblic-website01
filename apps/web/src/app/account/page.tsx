"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import {
  getProfile,
  logoutUser,
  updateProfile,
  type PublicUser,
} from "@/lib/accounts";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inputClass =
  "h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
const readOnlyInputClass =
  "h-14 w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 font-semibold text-slate-500 outline-none";
const labelClass = "text-sm font-black text-slate-700";

export default function AccountPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

  // Session guard: check the profile once on mount. `active` prevents state
  // updates after unmount, and the redirect happens inside the effect so no
  // protected content flashes before the check resolves.
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const user = await getProfile();
        if (!active) return;
        if (!user) {
          router.replace("/login");
          return;
        }
        setEmail(user.email ?? "");
        setDisplayName(user.displayName ?? "");
        setFullName(user.fullName ?? "");
        setPhone(user.phone ?? "");
        setCompany(user.company ?? "");
        setStatus("ready");
      } catch {
        if (!active) return;
        // Treat an unreachable session check as unauthenticated.
        router.replace("/login");
      }
    })();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setSavedMessage("");
    try {
      const updated: PublicUser = await updateProfile({
        displayName: displayName.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        company: company.trim(),
      });
      setDisplayName(updated.displayName ?? "");
      setFullName(updated.fullName ?? "");
      setPhone(updated.phone ?? "");
      setCompany(updated.company ?? "");
      setSavedMessage("Your profile has been saved.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // Even if the request fails, send the user back to the login screen.
    } finally {
      router.replace("/login");
    }
  }

  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="flex min-h-screen items-center px-4 py-28 sm:px-6">
        <section className="mx-auto w-full max-w-2xl">
          {status === "loading" ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-[2rem] border border-blue-100 bg-white/92 p-8 text-center shadow-[0_26px_90px_rgba(15,23,42,0.12)]"
            >
              <p className="text-base font-bold text-slate-500">
                Loading your account...
              </p>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-blue-100 bg-white/92 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="flex flex-col gap-4 border-b border-blue-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <UserRound size={22} />
                  </span>
                  <div>
                    <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
                      Your account
                    </h1>
                    <p className="text-sm font-bold text-slate-500">
                      Manage your Growblic profile.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>

              <form onSubmit={handleSave} className="mt-6 grid gap-5" noValidate>
                <label className="space-y-2">
                  <span className={labelClass}>Email</span>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className={readOnlyInputClass}
                  />
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>Display name</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={inputClass}
                    placeholder="How should we address you?"
                  />
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>Full name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className={labelClass}>Phone</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      placeholder="Your phone number"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className={labelClass}>Company</span>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className={inputClass}
                      placeholder="Your company"
                    />
                  </label>
                </div>

                {savedMessage ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
                  >
                    {savedMessage}
                  </div>
                ) : null}

                {error ? (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
