"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const menus = [
  {
    label: "Home",
    image: "/growblic-website01/images/business/dashboard-1.jpg",
    eyebrow: "Launch Site",
    title: "Home",
    text: "Explore Growblic's premium product, service, and company experience.",
    links: [
      { label: "Product universe", href: "/products" },
      { label: "Stats", href: "/#stats" },
      { label: "Product engine", href: "/#engine" },
      { label: "Business systems", href: "/#systems" },
    ] },
  {
    label: "Products",
    image: "/growblic-website01/images/products/analytics-1.jpg",
    eyebrow: "Product Suite",
    title: "Products",
    text: "Ready-made product directions Growblic can build and scale for your business.",
    links: [
      { label: "Explore Products", href: "/products" },
      { label: "CRM Platform", href: "/crm-platform" },
      { label: "FinTech App", href: "/fintech-app" },
      { label: "HR System", href: "/hr-system" },
      { label: "Analytics", href: "/analytics" },
    ] },
  {
    label: "Services",
    image: "/growblic-website01/images/business/web-1.jpg",
    eyebrow: "Build Services",
    title: "Services",
    text: "Websites, apps, SaaS products, and automation built with premium UI.",
    links: [
      { label: "Software", href: "/software" },
      { label: "Mobile Apps", href: "/mobile-apps" },
      { label: "SaaS", href: "/saas" },
      { label: "AI Automation", href: "/ai-automation" },
      { label: "Support", href: "/support" },
    ] },
  {
    label: "About",
    image: "/growblic-website01/images/business/saas-1.jpg",
    eyebrow: "Company",
    title: "About",
    text: "Growblic is focused on premium software, smooth product design, and scalable builds.",
    links: [
      { label: "About Growblic", href: "/about" },
      { label: "Why Growblic", href: "/why-growblic" },
      { label: "Process", href: "/process" },
      { label: "Client Login", href: "/client-login" },
    ] },
  {
    label: "Contact",
    image: "/growblic-website01/images/business/mobile-1.jpg",
    eyebrow: "Start Now",
    title: "Contact",
    text: "Start your project, book consultation, or connect with Growblic directly.",
    links: [
      { label: "Start a Project", href: "/start-project" },
      { label: "Book Free Consultation", href: "/start-project" },
      { label: "Support", href: "/support" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/bintu-malik-6b7917387/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3Bn%2F%2B36pheQBKUivaxal4GUQ%3D%3D" },
    ] },
];

const allLinks = menus.flatMap((menu) =>
  menu.links.map((link) => ({
    ...link,
    group: menu.label }))
);

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeMenu = menus.find((menu) => menu.label === active) ?? menus[0];

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return activeMenu.links.map((link) => ({
        ...link,
        group: activeMenu.label }));
    }

    return allLinks.filter(
      (item) =>
        item.label.toLowerCase().includes(value) ||
        item.group.toLowerCase().includes(value)
    );
  }, [query, activeMenu]);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/70/80 bg-[#f8fbff]/90 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full shadow-md shadow-slate-200">
            <img
              src="/growblic-website01/images/brand/growblic-logo.png"
              alt="Growblic"
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-950">
            Growblic
          </span>
        </Link>

        <div
          className="group hidden lg:block"
          onMouseLeave={() => {
            setQuery("");
          }}
        >
          <div className="flex items-center gap-3 rounded-full border border-blue-100/80 bg-[#fbfdff]/80 p-2 shadow-xl shadow-blue-100/50">
            {menus.map((menu) => (
              <button
                key={menu.label}
                onMouseEnter={() => setActive(menu.label)}
                className={`rounded-full px-6 py-3 text-sm font-black transition-all duration-500 ease-out ${
                  active === menu.label
                    ? "bg-gradient-to-r from-slate-950 to-blue-950 text-white shadow-lg shadow-blue-200/50"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {menu.label} <span className="ml-2 opacity-60">⌄</span>
              </button>
            ))}
          </div>

          <div className="invisible absolute left-1/2 top-[84px] w-[min(1180px,calc(100vw-48px))] -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="overflow-hidden rounded-[2.6rem] border border-blue-100/70 bg-[#fbfdff]/95 p-4 shadow-2xl shadow-blue-100/70 backdrop-blur-2xl">
              <div className="grid gap-5 lg:grid-cols-[0.95fr_1fr_0.9fr]">
                <div className="relative min-h-[330px] overflow-hidden rounded-[2rem]">
                  <img
                    src={activeMenu.image}
                    alt={activeMenu.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/86 via-slate-950/28 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                      {activeMenu.eyebrow}
                    </p>
                    <h2 className="mt-3 text-5xl font-black tracking-tight">
                      {activeMenu.title}
                    </h2>
                    <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-white/75">
                      {activeMenu.text}
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-blue-100/70 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/50 p-8">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                    Quick links
                  </p>

                  <div className="mt-7 grid gap-3">
                    {activeMenu.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group/link flex items-center justify-between rounded-2xl border border-blue-50 bg-[#fbfdff]/90 px-5 py-4 text-lg font-black text-slate-800 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 hover:shadow-xl"
                      >
                        <span>{link.label}</span>
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-blue-100/70 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-8 shadow-inner">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                    Search
                  </p>

                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search page, service, product..."
                    className="mt-5 w-full rounded-2xl border border-blue-100 bg-[#fbfdff] px-5 py-4 text-sm font-bold text-slate-800 outline-none transition-all duration-500 ease-out focus:border-blue-300 focus:bg-[#fbfdff] focus:shadow-lg"
                  />

                  <div className="mt-5 max-h-[220px] space-y-3 overflow-y-auto pr-1">
                    {results.length > 0 ? (
                      results.slice(0, 6).map((item) => (
                        <Link
                          key={`${item.group}-${item.label}`}
                          href={item.href}
                          className="block rounded-2xl border border-blue-50 bg-[#fbfdff]/90 px-4 py-3 transition-all duration-500 ease-out hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50"
                        >
                          <p className="text-sm font-black text-slate-900">
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            {item.group}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-slate-100 bg-blue-50/45 px-4 py-5">
                        <p className="text-sm font-black text-slate-500">
                          No result found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-blue-100/50 lg:hidden"
        >
          {mobileOpen ? "Close" : "Menu"} ☰
        </button>

        <Link
          href="/start-project"
          className="hidden rounded-full bg-gradient-to-r from-slate-950 to-blue-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-200/50 transition-all duration-500 ease-out hover:-translate-y-1.5 md:inline-flex"
        >
          Start Project →
        </Link>
      </nav>
    
      {mobileOpen && (
        <div className="border-t border-blue-100 bg-[#f8fbff]/95 px-4 py-5 shadow-2xl shadow-blue-100/60 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-3">
            {allLinks.slice(0, 14).map((item) => (
              <Link
                key={`${item.group}-${item.label}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-5 py-4 text-base font-black text-slate-800 shadow-sm"
              >
                <span>{item.label}</span>
                <span className="text-blue-600">→</span>
              </Link>
            ))}

            <Link
              href="/start-project"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-gradient-to-r from-slate-950 to-blue-950 px-6 py-4 text-center text-sm font-black text-white shadow-xl shadow-blue-100/70"
            >
              Start Project →
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
