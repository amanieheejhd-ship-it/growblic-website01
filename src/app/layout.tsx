import type { Metadata } from "next";
import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";
import OpeningSplash from "../components/OpeningSplash";


export const metadata: Metadata = {
  title: {
    default: "Growblic | Premium Software Development Company",
    template: "%s | Growblic",
  },
  description:
    "Growblic builds premium websites, mobile apps, SaaS products, dashboards, CRM platforms, and AI automation systems for modern businesses.",
  keywords: [
    "Growblic",
    "software development company",
    "website development",
    "mobile app development",
    "SaaS development",
    "AI automation",
    "CRM platform",
    "dashboard development",
  ],
  openGraph: {
    title: "Growblic | Premium Software Development Company",
    description:
      "Websites, mobile apps, SaaS products, dashboards, and AI automation systems.",
    url: "https://www.growblic.com",
    siteName: "Growblic",
    type: "website",
  },
  icons: {
    icon: "/images/brand/growblic-logo.png",
    apple: "/images/brand/growblic-logo.png",
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
