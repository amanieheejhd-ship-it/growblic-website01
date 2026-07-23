"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  bridgeIntoInternshipPortal,
  getSession,
  logoutUser,
  type PublicUser,
} from "@/lib/accounts";

const navLinks = [
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

// Where the header "Log in" links to — the public accounts-service login.
const LOGIN_HREF = "/login";
// The public profile page (accounts-service user), and the SEPARATE internship
// applicant portal. The profile menu links to the portal for convenience; the
// two systems are independent and share no session.
const ACCOUNT_HREF = "/account";
const INTERNSHIP_PORTAL_HREF = "/internship-portal";

// Soft light halo hugging each nav item's glyphs — the text-level readability
// treatment for the permanently background-free header (never a full-width
// layer behind the nav).
const NAV_TEXT_HALO =
  "[text-shadow:0_1px_2px_rgba(251,253,255,0.9),0_0_12px_rgba(251,253,255,0.8)]";

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

// A single desktop nav dropdown. Controlled open state (not pure CSS) so it can
// combine hover-intent, click/tap toggle, and keyboard — and it's left-aligned
// to its trigger so the leftmost menu is never cut off at the viewport edge.
function NavDropdown({
  item,
  active,
}: {
  item: (typeof navLinks)[number];
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelClose = () => {
    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  };
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  // Close on pointer-leave after a short grace period so the pointer can travel
  // from the trigger onto the panel without the menu vanishing.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        // Tabbing focus out of the whole group closes it.
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center py-2 text-[11px] font-bold uppercase tracking-[0.18em] outline-none transition focus-visible:text-slate-950 ${NAV_TEXT_HALO} ${
          open || active ? "text-slate-950" : "text-slate-500 hover:text-slate-950"
        }`}
      >
        {item.label}
      </button>

      {/* The pt-3 is part of this positioned wrapper (a DOM descendant of the
          container), so the trigger→panel path is one continuous hover region
          with no dead gap. left-0 anchors the panel under the trigger — it can
          never render off-screen left like the old centred version. `invisible`
          when closed removes it from hit-testing. */}
      <div
        className={`absolute left-0 top-full z-[60] pt-3 transition-[opacity,transform] duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div
          role="menu"
          aria-label={item.label}
          className="w-72 max-w-[calc(100vw-2rem)] rounded-[1.5rem] border border-blue-100 bg-white p-3 shadow-2xl shadow-blue-100/70"
        >
          <div className="grid gap-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 outline-none transition hover:bg-blue-50 hover:text-blue-700 focus-visible:bg-blue-50 focus-visible:text-blue-700"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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

// Client-resolved public-user auth. "loading" is the pre-hydration default so
// the static-export HTML (always logged-out) and the first client render match;
// the real state is filled in by a session check after mount.
type PublicAuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: PublicUser }
  | { status: "anonymous"; user: null };

function accountDisplayName(user: PublicUser) {
  return user.displayName?.trim() || user.email;
}

function accountInitial(user: PublicUser) {
  const source = user.displayName?.trim() || user.email || "";
  return source.charAt(0).toUpperCase() || "?";
}

// Circle avatar showing the user's initial on a subtle brand-tinted disc.
function AccountAvatar({
  user,
  size = "sm",
}: {
  user: PublicUser;
  size?: "sm" | "lg";
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-black text-blue-700 ring-1 ring-inset ring-blue-200/70 ${
        size === "lg" ? "h-10 w-10 text-base" : "h-7 w-7 text-xs"
      }`}
    >
      {accountInitial(user)}
    </span>
  );
}

// Desktop profile control + dropdown. Reuses the nav-menu open/close robustness:
// click/tap toggle, outside-pointerdown + Escape (refocus trigger) close, group
// onBlur close, aria-haspopup/aria-expanded, focus-visible. The panel is a DOM
// descendant (pt-3 spacer, no dead gap) and `right-0` anchored so it clamps to
// the right edge and never overflows. lg-only; mobile uses the menu section.
function ProfileMenu({
  user,
  onLogout,
  loggingOut,
  onInternship,
}: {
  user: PublicUser;
  onLogout: () => void;
  loggingOut: boolean;
  onInternship: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const name = accountDisplayName(user);
  const itemClass =
    "block rounded-2xl px-4 py-2.5 text-sm font-black text-slate-700 outline-none transition hover:bg-blue-50 hover:text-blue-700 focus-visible:bg-blue-50 focus-visible:text-blue-700";

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:block"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 shadow-sm outline-none transition focus-visible:ring-4 focus-visible:ring-blue-100 ${
          open
            ? "border-blue-200 bg-white text-blue-700"
            : "border-blue-100 bg-white/80 text-slate-700 hover:border-blue-200 hover:text-blue-700"
        }`}
      >
        <AccountAvatar user={user} />
        <span className="max-w-[7.5rem] truncate text-[11px] font-bold uppercase tracking-[0.16em]">
          {name}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute right-0 top-full z-[70] pt-3 transition-[opacity,transform] duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div
          role="menu"
          aria-label="Account"
          className="w-64 max-w-[calc(100vw-2rem)] rounded-[1.5rem] border border-blue-100 bg-white p-3 shadow-2xl shadow-blue-100/70"
        >
          <div className="flex items-center gap-3 px-2 pb-3">
            <AccountAvatar user={user} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-900">{name}</p>
              <p className="truncate text-xs font-semibold text-slate-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="h-px bg-blue-100" />

          <div className="grid gap-1 py-1">
            <Link
              href={ACCOUNT_HREF}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              Your account
            </Link>
            {/* Internship uses the SSO bridge: a logged-in public user is
                logged into their matching internship account (if any) before
                the portal opens — otherwise the portal shows its normal login.
                A button (not a Link) because it runs an async handoff first. */}
            <button
              type="button"
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false);
                onInternship();
              }}
              className={`${itemClass} w-full text-left`}
            >
              Internship
            </button>
          </div>

          <div className="h-px bg-blue-100" />

          <button
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            disabled={loggingOut}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="mt-1 block w-full rounded-2xl px-4 py-2.5 text-left text-sm font-black text-red-600 outline-none transition hover:bg-red-50 focus-visible:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] =
    useState<MobileAccordionLabel | null>("Products");

  const router = useRouter();
  const [auth, setAuth] = useState<PublicAuthState>({
    status: "loading",
    user: null,
  });
  const [loggingOut, setLoggingOut] = useState(false);
  const [internshipPending, setInternshipPending] = useState(false);

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

  // Resolve public-user auth on the client (static-export-safe — no SSR call).
  // Re-checks on every route change so login/logout reflect without a hard
  // refresh. It never resets to "loading" on re-check, so navigating between
  // pages doesn't flash the logged-out control. Any failure (including the
  // service being down) resolves to logged-out — the safe default.
  useEffect(() => {
    let active = true;
    getSession()
      .then((user) => {
        if (!active) return;
        setAuth(
          user
            ? { status: "authenticated", user }
            : { status: "anonymous", user: null },
        );
      })
      .catch(() => {
        if (active) setAuth({ status: "anonymous", user: null });
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  const servicesLinks = navLinks.find((item) => item.label === "Services")?.children || [];

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileAccordion(null);
  }

  function toggleMobileAccordion(label: MobileAccordionLabel) {
    setMobileAccordion((current) => (current === label ? null : label));
  }

  // Only reachable while logged in as a public user (the Internship control
  // lives inside the profile UI). Try the SSO handoff first — if the public
  // email matches an internship applicant account, a portal session is minted
  // server-side — then open the portal. On no match / any failure the portal
  // simply shows its normal login. Always navigates, even if the bridge fails.
  async function handleInternship() {
    if (internshipPending) return;
    setInternshipPending(true);
    try {
      await bridgeIntoInternshipPortal();
    } catch {
      // Ignore — navigate regardless; the portal decides dashboard vs login.
    }
    setInternshipPending(false);
    closeMobileMenu();
    router.push(INTERNSHIP_PORTAL_HREF);
  }

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // Best-effort: clear local state even if the request failed; the next
      // route-change session check reconciles the UI with the server.
    }
    setAuth({ status: "anonymous", user: null });
    setLoggingOut(false);
    closeMobileMenu();
    router.push("/");
  }

  return (
    // border-transparent (not border-0): the divider line disappears but its
    // 1px stays in the layout, keeping the measured 69/77/87px header heights —
    // and therefore the hero's min-h calc() offsets — byte-identical.
    //
    // The header is PERMANENTLY background-free — no fill, tint, blur, border,
    // shadow or mask at any scroll position: nav text floats over the page.
    // Readability comes from per-item text halos (see navTextHalo), never from
    // a full-width layer.
    // No overflow clip here: it would clip the dropdown panels out of paint AND
    // hit-testing (they escape the header's box downward). Page-level horizontal
    // overflow is already prevented by `body { overflow-x: hidden }`.
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 border-b border-transparent"
    >
      {/* Three-region grid keeps the wordmark truly centered regardless of how
          wide the side regions are. All three cells always render (inner
          content hides responsively) so the column assignment never shifts.
          Heights: the Menu button drives <lg and an explicit lg:min-h on the
          left cell replaces the removed pill capsule at lg, so the sticky
          header stays 69 / 77 / 87px and the hero's calc() offsets hold. */}
      <nav
        className="grid w-full min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:gap-4"
      >
        {/* lg:min-h-[54px] replaces the removed pill capsule as the lg height
            driver, so the header stays 87px tall and the hero's calc() offset
            holds. Below lg the Menu button still drives the height. */}
        <div className="flex min-w-0 items-center justify-self-start lg:min-h-[54px]">
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((item) => (
              <NavDropdown
                key={item.label}
                item={item}
                active={
                  isActive(pathname, item.href) ||
                  item.children.some((child) => isActive(pathname, child.href))
                }
              />
            ))}
          </div>
        </div>

        <Link
          href="/"
          aria-label="Growblic — go to top"
          onClick={(event) => {
            closeMobileMenu();
            // Already on the homepage: scroll to the very top instead of a
            // reload/navigation. Uses Lenis when the site's scroller exposes
            // one; otherwise native smooth scroll. Reduced motion jumps
            // instantly.
            if (pathname === "/") {
              event.preventDefault();
              const reduce = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
              ).matches;
              const lenis = (
                window as { lenis?: { scrollTo?: (target: number, opts?: object) => void } }
              ).lenis;
              if (!reduce && lenis?.scrollTo) {
                lenis.scrollTo(0);
              } else {
                // "instant" (not "auto") forces an immediate jump — "auto"
                // resolves to the page's CSS scroll-behavior, which is smooth.
                window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
              }
            }
          }}
          className={`justify-self-center whitespace-nowrap rounded-full px-2 text-2xl font-black tracking-tight text-slate-950 outline-none transition hover:text-blue-700 focus-visible:ring-4 focus-visible:ring-blue-100 sm:text-3xl ${NAV_TEXT_HALO}`}
        >
          Growblic
        </Link>

        <div className="flex min-w-0 items-center justify-self-end gap-3">
          {auth.status === "authenticated" ? (
            <ProfileMenu
              user={auth.user}
              onLogout={handleLogout}
              loggingOut={loggingOut}
              onInternship={handleInternship}
            />
          ) : (
            // Loading and logged-out both show LOG IN — so the static-export
            // HTML and the first client render match (hydration-safe) and the
            // wordmark stays centered until a logged-in session swaps this slot.
            <Link
              href={LOGIN_HREF}
              className="hidden items-center rounded-full border border-blue-100 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 lg:inline-flex"
            >
              Log in
            </Link>
          )}

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

            {/* Auth section — the profile control in the mobile nav pattern.
                Same items as the desktop dropdown; logged-out shows Log in. */}
            <div className="mt-2 border-t border-blue-100 pt-3">
              {auth.status === "authenticated" ? (
                <div className="grid gap-2">
                  <div className="flex items-center gap-3 rounded-[1.35rem] border border-blue-100 bg-white px-3 py-3 shadow-sm">
                    <AccountAvatar user={auth.user} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-900">
                        {accountDisplayName(auth.user)}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-400">
                        {auth.user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={ACCOUNT_HREF}
                    onClick={closeMobileMenu}
                    className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span className="min-w-0 break-words">Your account</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-blue-500" />
                  </Link>
                  <button
                    type="button"
                    disabled={internshipPending}
                    onClick={handleInternship}
                    className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="min-w-0 break-words">
                      {internshipPending ? "Opening…" : "Internship"}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-blue-500" />
                  </button>
                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="flex min-h-12 items-center justify-center rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-black text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loggingOut ? "Logging out…" : "Log out"}
                  </button>
                </div>
              ) : (
                <Link
                  href={LOGIN_HREF}
                  onClick={closeMobileMenu}
                  className="flex min-h-12 items-center justify-center rounded-full border border-blue-100 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
