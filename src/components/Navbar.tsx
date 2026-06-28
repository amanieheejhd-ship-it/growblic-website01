"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href.startsWith("/#")) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-[#fbfdff]/90 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-full pr-3 transition hover:bg-white/70"
          onClick={() => setMobileOpen(false)}
        >
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-blue-100 bg-white shadow-md shadow-blue-100/70">
            <img
              src="/growblic-website01/images/brand/growblic-logo.png"
              alt="Growblic"
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-blue-700">
            Growblic
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-blue-100/80 bg-white/86 p-1.5 shadow-xl shadow-blue-100/45 lg:flex">
          {navLinks.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-4 py-2.5 text-sm font-black transition ${
                  active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-950/12"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/start-project"
            className="hidden min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-700 md:inline-flex"
          >
            Start Project →
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/55 transition hover:border-blue-200 hover:text-blue-700 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-blue-100/80 bg-[#fbfdff]/96 px-5 py-5 shadow-2xl shadow-blue-100/60 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-3">
            {navLinks.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-base font-black shadow-sm transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-blue-100 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={active ? "text-white" : "text-blue-600"}>→</span>
                </Link>
              );
            })}

            <Link
              href="/start-project"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:bg-blue-700"
            >
              Start Project →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
