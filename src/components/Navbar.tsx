"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  {
    label: "Home",
    href: "/",
    children: [
      { label: "Home Page", href: "/" },
      { label: "Why Growblic", href: "/why-growblic" },
      { label: "Process", href: "/process" },
    ],
  },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "CRM Platform", href: "/products/crm-automation-platform" },
      { label: "School Software", href: "/products/school-management-software" },
      { label: "HR Payroll", href: "/products/hr-payroll-system" },
      { label: "Client Login", href: "/client-login" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services" },
      { label: "Website Development", href: "/website-development" },
      { label: "Software Development", href: "/software" },
      { label: "Mobile Apps", href: "/mobile-apps" },
      { label: "SaaS Products", href: "/saas" },
      { label: "AI Automation", href: "/ai-automation" },
      { label: "SEO Services", href: "/seo-services" },
      { label: "Google Ads", href: "/google-ads-management" },
      { label: "Meta Ads", href: "/meta-ads-management" },
      { label: "GMB Rating & Reviews", href: "/gmb-rating-reviews" },
      { label: "Price Calculator", href: "/price-calculator" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Growblic", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    label: "Contact",
    href: "/#contact",
    children: [
      { label: "Start Project", href: "/start-project" },
      { label: "Contact Section", href: "/#contact" },
      { label: "Support", href: "/support" },
    ],
  },
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
  const [mobileOpen, setMobileOpen] = useState(false)

  const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navDropdownRef = useRef<HTMLDivElement | null>(null);

  const cancelDropdownClose = () => {
    if (dropdownCloseTimer.current) {
      clearTimeout(dropdownCloseTimer.current);
      dropdownCloseTimer.current = null;
    }
  };

  const scheduleDropdownClose = () => {
    cancelDropdownClose();
    dropdownCloseTimer.current = setTimeout(() => {
      setMobileOpen(false);
    }, 220);
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!navDropdownRef.current?.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelDropdownClose();
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
;
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-[#fbfdff]/90 backdrop-blur-2xl">
      <nav ref={navDropdownRef} onMouseEnter={cancelDropdownClose} onMouseLeave={scheduleDropdownClose} className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-full pr-3 transition hover:bg-white/70"
          onClick={() => setMobileOpen(false)}
        >
          <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-blue-100 bg-white shadow-md shadow-blue-100/70">
            <Image
              src="/growblic-website01/images/brand/growblic-logo.png"
              alt="Growblic"
              fill
              sizes="44px"
              priority
              className="rounded-full object-cover"
            />
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-950 transition group-hover:text-blue-700">
            Growblic
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-blue-100/80 bg-white/86 p-1.5 shadow-xl shadow-blue-100/45 lg:flex">
          {navLinks.map((item) => {
            const active =
              isActive(pathname, item.href) ||
              item.children.some((child) => isActive(pathname, child.href));

            return (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`inline-flex rounded-full px-5 py-2.5 text-sm font-black transition ${
                    active
                      ? "bg-slate-950 text-white shadow-lg shadow-slate-950/12"
                      : "text-slate-700 hover:bg-slate-950 hover:text-white hover:shadow-lg hover:shadow-slate-950/12"
                  }`}
                >
                  {item.label}
                </Link>

                <div onMouseEnter={cancelDropdownClose} onMouseLeave={scheduleDropdownClose} className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 translate-y-2 rounded-[1.5rem] border border-blue-100 bg-white p-3 opacity-0 shadow-2xl shadow-blue-100/70 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <div className="dropdown-hover-bridge absolute -top-4 left-0 h-4 w-full" aria-hidden="true" />
                  <div className="grid gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
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
              const active =
                isActive(pathname, item.href) ||
                item.children.some((child) => isActive(pathname, child.href));

              return (
                <div key={item.label} className="grid gap-2">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-base font-black shadow-sm transition ${
                      active
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-blue-100 bg-white text-slate-800 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={active ? "text-white" : "text-blue-600"}>→</span>
                  </Link>

                  <div className="ml-4 grid gap-2 border-l border-blue-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
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
