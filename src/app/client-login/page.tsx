"use client";

import Image from "next/image";
import { useState } from "react";
import BackButton from "../../components/BackButton";

const features = [
  "Project status tracking",
  "File delivery updates",
  "Support tickets",
  "Meeting notes",
  "Invoice updates",
  "Direct communication",
];

export default function ClientLoginPage() {
  const [mode, setMode] = useState<"login" | "create">("login");

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfdff]">
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_84%_80%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.07),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <BackButton />

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-600">
                Client Portal
              </p>

              <h1 className="mt-5 text-6xl font-black leading-[0.94] tracking-tight text-slate-950 md:text-8xl">
                Growblic client portal.
              </h1>

              <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
                Login or create a new client account to manage project updates,
                delivery tracking, support requests, invoices, files, and direct
                Growblic communication.
              </p>

              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
                {features.slice(0, 4).map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-100/70 bg-white p-4 shadow-lg shadow-blue-100/50"
                  >
                    <span className="text-xs font-black text-blue-600">
                      0{index + 1}
                    </span>
                    <p className="mt-2 text-sm font-black text-slate-800">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[3rem] border border-blue-100/70 bg-white/90 p-5 shadow-2xl shadow-blue-100/60 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-blue-50/70 to-cyan-50/60 p-8">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/60 blur-3xl" />
                <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan-200/50 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-4">
                    <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-full shadow-xl shadow-blue-100">
                      <Image
                        src="/growblic-website01/images/brand/growblic-logo.png"
                        alt="Growblic"
                        fill
                        sizes="64px"
                        className="rounded-full object-cover"
                      />
                    </span>

                    <div>
                      <h2 className="text-3xl font-black text-slate-950">
                        {mode === "login" ? "Client Login" : "Create Account"}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {mode === "login"
                          ? "Access your Growblic project"
                          : "Create your Growblic client access"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 rounded-full border border-blue-100 bg-white p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className={`rounded-full px-5 py-3 text-sm font-black transition-all ${
                        mode === "login"
                          ? "bg-gradient-to-r from-slate-950 to-blue-950 text-white shadow-lg"
                          : "text-slate-500 hover:text-blue-600"
                      }`}
                    >
                      Login
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("create")}
                      className={`rounded-full px-5 py-3 text-sm font-black transition-all ${
                        mode === "create"
                          ? "bg-gradient-to-r from-slate-950 to-blue-950 text-white shadow-lg"
                          : "text-slate-500 hover:text-blue-600"
                      }`}
                    >
                      Create New
                    </button>
                  </div>

                  <form className="mt-8 grid gap-5">
                    {mode === "create" && (
                      <>
                        <div>
                          <label className="text-sm font-black text-slate-700">
                            Full name
                          </label>
                          <input
                            type="text"
                            placeholder="Your name"
                            className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold text-slate-800 outline-none transition-all focus:border-blue-300 focus:shadow-lg"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-black text-slate-700">
                            Company name
                          </label>
                          <input
                            type="text"
                            placeholder="Your company"
                            className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold text-slate-800 outline-none transition-all focus:border-blue-300 focus:shadow-lg"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-sm font-black text-slate-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        placeholder="client@example.com"
                        className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold text-slate-800 outline-none transition-all focus:border-blue-300 focus:shadow-lg"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-black text-slate-700">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold text-slate-800 outline-none transition-all focus:border-blue-300 focus:shadow-lg"
                      />
                    </div>

                    {mode === "create" && (
                      <div>
                        <label className="text-sm font-black text-slate-700">
                          Confirm password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm password"
                          className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-5 py-4 font-semibold text-slate-800 outline-none transition-all focus:border-blue-300 focus:shadow-lg"
                        />
                      </div>
                    )}

                    {mode === "login" && (
                      <div className="flex items-center justify-between gap-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                          <input type="checkbox" className="h-4 w-4 rounded" />
                          Remember me
                        </label>

                        <button type="button" className="text-sm font-black text-blue-600">
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      className="absolute right-4 md:right-6 top-1/2 z-40 flex !h-11 !w-11 md:!h-12 md:!w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 !text-slate-900 shadow-[0_16px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-slate-950 hover:!text-white"
                    >
                      {mode === "login" ? "Login to Portal →" : "Create Client Account →"}
                    </button>
                  </form>

                  <p className="mt-6 rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm font-semibold leading-6 text-slate-500">
                    This is a frontend preview. Real login and account creation
                    can be connected later with backend authentication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((item, index) => (
              <div
                key={item}
                className="rounded-[2rem] border border-blue-100/70 bg-white p-7 shadow-xl shadow-blue-100/50 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-blue-200"
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-2xl font-black text-slate-950">
                  {item}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Clean client portal experience for Growblic project management.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
