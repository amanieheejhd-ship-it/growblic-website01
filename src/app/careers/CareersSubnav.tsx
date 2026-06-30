"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const mainLinks = [
  { label: "Openings", href: "/careers/openings" },
  { label: "Perks", href: "/careers/perks" },
  { label: "Values", href: "/careers/values" },
];

const cultureLinks = [
  { label: "Culture", href: "/careers/culture" },
  { label: "Insights", href: "/careers/insights" },
  { label: "Humans", href: "/careers/humans" },
];

const cultureHrefs = cultureLinks.map((item) => item.href);

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function CareersSubnav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isCultureActive = cultureHrefs.some((href) => isActive(pathname, href));

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative max-w-full"
      onMouseLeave={() => setIsOpen(false)}
    >
      <nav className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-blue-100/80 bg-white/78 p-1.5 text-xs font-black uppercase tracking-[0.14em] text-slate-700 shadow-lg shadow-blue-100/45 backdrop-blur-xl">
        {mainLinks.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-4 py-2 transition hover:bg-blue-50 hover:text-blue-700 ${
                active ? "bg-blue-600 text-white shadow-md shadow-blue-200/70 hover:bg-blue-600 hover:text-white" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          className={`shrink-0 rounded-full px-4 py-2 transition hover:bg-blue-50 hover:text-blue-700 ${
            isCultureActive ? "bg-blue-600 text-white shadow-md shadow-blue-200/70 hover:bg-blue-600 hover:text-white" : ""
          }`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => setIsOpen((current) => !current)}
          onMouseEnter={() => setIsOpen(true)}
        >
          Culture
        </button>
      </nav>

      <div
        className={`absolute right-0 top-full z-50 w-44 pt-2 transition duration-150 ease-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        onMouseEnter={() => setIsOpen(true)}
      >
        <div
          className="rounded-2xl border border-blue-100/90 bg-white/92 p-1.5 text-xs font-black uppercase tracking-[0.14em] text-slate-700 shadow-xl shadow-blue-100/60 backdrop-blur-2xl"
          role="menu"
        >
          {cultureLinks.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 transition hover:bg-blue-50 hover:text-blue-700 ${
                  active ? "bg-blue-600 text-white shadow-md shadow-blue-200/70 hover:bg-blue-600 hover:text-white" : ""
                }`}
                aria-current={active ? "page" : undefined}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
