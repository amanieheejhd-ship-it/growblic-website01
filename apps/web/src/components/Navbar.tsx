"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  {
    label: "Home",
    href: "/",
    children: [
      { label: "Home Page", href: "/#top" },
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
      { label: "Price Calculator", href: "/price-calculator" },
      { label: "Email Growblic", href: "mailto:hello@growblic.com" },
      { label: "PairupChat", href: "https://web.growblic.com" },
    ],
  },
  {
    label: "Contact",
    href: "/#contact",
    children: [
      { label: "Support", href: "/support" },
      { label: "Email Growblic", href: "mailto:hello@growblic.com" },
      { label: "PairupChat", href: "https://web.growblic.com" },
      { label: "Price Calculator", href: "/price-calculator" },
    ],
  },
];

type MobileAccordionLabel = "Products" | "Services" | "About";
type NavChild = { label: string; href: string };

const mobileProductsLinks: NavChild[] = [
  { label: "All Products", href: "/products" },
  { label: "CRM Platform", href: "/products/crm-platform" },
  { label: "School Software", href: "/products/school-software" },
  { label: "HR Payroll", href: "/products/hr-payroll" },
  { label: "Client Login", href: "/client-login" },
];

const mobileAboutLinks: NavChild[] = [
  { label: "About Growblic", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Support", href: "/support" },
  { label: "Price Calculator", href: "/price-calculator" },
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

function MobileAccordion({
  label,
  href,
  links,
  active,
  expanded,
  onToggle,
  onClose,
}: {
  label: MobileAccordionLabel;
  href: string;
  links: NavChild[];
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-blue-100 bg-white shadow-sm ring-1 ring-white/80">
      <div
        className={`flex min-h-12 w-full items-stretch justify-between gap-2 transition ${
          active
            ? "bg-slate-950 text-white"
            : "bg-white text-slate-800 hover:bg-blue-50 hover:text-blue-700"
        }`}
      >
        <Link
          href={href}
          onClick={onClose}
          className="flex min-w-0 flex-1 items-center px-4 py-3 text-sm font-black"
        >
          <span className="min-w-0 break-words">{label}</span>
        </Link>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${label} menu`}
          onClick={onToggle}
          className="flex min-h-12 w-12 shrink-0 items-center justify-center rounded-l-2xl transition hover:bg-blue-100/50"
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-2 border-t border-blue-100 bg-[#fbfdff] p-2">
            {links.map((child) => (
              <Link
                key={`${label}-${child.href}-${child.label}`}
                href={child.href}
                onClick={onClose}
                className="flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-black leading-5 text-slate-700 transition hover:bg-white hover:text-blue-700 hover:shadow-sm"
              >
                <span className="min-w-0 break-words">{child.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-blue-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] =
    useState<MobileAccordionLabel | null>("Products");

  const navbarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  const pathname = usePathname();

  const servicesLinks = navLinks.find((item) => item.label === "Services")?.children || [];

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileAccordion(null);
  }

  function toggleMobileAccordion(label: MobileAccordionLabel) {
    setMobileAccordion((current) => (current === label ? null : label));
  }

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 overflow-x-clip border-b border-blue-100/80 bg-[#fbfdff]/90 backdrop-blur-2xl"
    >
      <nav
        className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:gap-5"
      >
        <Link
          href="/"
          className="group flex min-w-0 max-w-[calc(100vw-7rem)] items-center gap-2 rounded-full pr-2 transition hover:bg-white/70 sm:max-w-none sm:gap-3 sm:pr-3"
          onClick={closeMobileMenu}
        >
          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-blue-100 bg-white shadow-md shadow-blue-100/70 sm:h-11 sm:w-11">
            <Image
              src="/images/brand/growblic-logo.png"
              alt="Growblic"
              fill
              sizes="44px"
              priority
              className="rounded-full object-cover"
            />
          </span>
          <span className="min-w-0 truncate text-lg font-black tracking-tight text-slate-950 transition group-hover:text-blue-700 sm:text-2xl">
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

                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 translate-y-2 rounded-[1.5rem] border border-blue-100 bg-white p-3 opacity-0 shadow-2xl shadow-blue-100/70 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
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

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/55 transition hover:border-blue-200 hover:text-blue-700 sm:px-4 lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="growblic-mobile-menu"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <div
          id="growblic-mobile-menu"
          className="fixed inset-x-0 top-[65px] z-[60] max-h-[calc(100dvh-65px)] overflow-y-auto overscroll-contain border-t border-blue-100/80 bg-[#fbfdff]/96 px-3 py-4 shadow-2xl shadow-blue-100/60 backdrop-blur-2xl sm:top-[73px] sm:max-h-[calc(100dvh-73px)] sm:px-5 sm:py-5 lg:hidden"
        >
          <div className="mx-auto grid max-w-2xl gap-3 rounded-[1.75rem] border border-white/80 bg-white/80 p-3 shadow-[0_24px_80px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/70 backdrop-blur-2xl">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-[1.35rem] border px-4 py-3 text-sm font-black shadow-sm transition ${
                isActive(pathname, "/")
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-blue-100 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <span className="min-w-0 break-words">Home</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            <MobileAccordion
              label="Products"
              href="/products"
              links={mobileProductsLinks}
              active={
                isActive(pathname, "/products") ||
                mobileProductsLinks.some((child) => isActive(pathname, child.href))
              }
              expanded={mobileAccordion === "Products"}
              onToggle={() => toggleMobileAccordion("Products")}
              onClose={closeMobileMenu}
            />
            <MobileAccordion
              label="Services"
              href="/services"
              links={servicesLinks}
              active={
                isActive(pathname, "/services") ||
                servicesLinks.some((child) => isActive(pathname, child.href))
              }
              expanded={mobileAccordion === "Services"}
              onToggle={() => toggleMobileAccordion("Services")}
              onClose={closeMobileMenu}
            />
            <MobileAccordion
              label="About"
              href="/about"
              links={mobileAboutLinks}
              active={
                isActive(pathname, "/about") ||
                mobileAboutLinks.some((child) => isActive(pathname, child.href))
              }
              expanded={mobileAccordion === "About"}
              onToggle={() => toggleMobileAccordion("About")}
              onClose={closeMobileMenu}
            />

            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className={`flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-[1.35rem] border px-4 py-3 text-sm font-black shadow-sm transition ${
                isActive(pathname, "/contact")
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-blue-100 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <span className="min-w-0 break-words">Contact</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            <Link
              href="/start-project"
              onClick={closeMobileMenu}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-black text-white shadow-xl shadow-slate-950/15 transition hover:bg-blue-700"
            >
              Start Project →
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
