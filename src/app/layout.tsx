import type { Metadata, Viewport } from "next";
import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";
import OpeningSplash from "../components/OpeningSplash";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Growblic - Software Development, Apps, Websites & AI Automation",
    template: "%s | Growblic",
  },
  description:
    "Growblic builds modern websites, mobile apps, SaaS platforms, dashboards, SEO solutions, digital marketing systems, and AI automation tools for growing businesses.",
  keywords: [
    "Growblic",
    "software development company",
    "website development",
    "mobile app development",
    "SaaS development",
    "AI automation",
    "SEO services",
    "Google Ads",
    "Meta Ads",
  ],
  openGraph: {
    title: "Growblic - Software Development, Apps, Websites & AI Automation",
    description:
      "Modern websites, mobile apps, SaaS platforms, dashboards, SEO solutions, digital marketing systems, and AI automation tools.",
    url: "https://www.growblic.com",
    siteName: "Growblic",
    type: "website",
  },
  icons: {
    icon: "/growblic-website01/images/brand/growblic-logo.png",
    apple: "/growblic-website01/images/brand/growblic-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fbfdff] text-[#050505]">
        <OpeningSplash />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
