import type { Metadata, Viewport } from "next";
import GlobalBackgroundMount from "../components/GlobalBackgroundMount";
import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";
import OpeningSplash from "../components/OpeningSplash";
import ScrollSoundExperience from "../components/ScrollSoundExperience";
import { absoluteUrl, createPageMetadata, defaultSeo, siteUrl } from "./seo";
import ScrollSound from "@/components/ScrollSound";
import GrowblicAIChat from "@/components/GrowblicAIChat";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  ...createPageMetadata({
    title: defaultSeo.title,
    description: defaultSeo.description,
    path: "/",
  }),
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: defaultSeo.title,
    template: "%s | Growblic",
  },
  description: defaultSeo.description,
  keywords: defaultSeo.keywords,
  authors: [{ name: "Growblic", url: siteUrl }],
  creator: "Growblic",
  publisher: "Growblic",
  category: "software development",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: defaultSeo.title,
    description: defaultSeo.description,
    url: siteUrl,
    siteName: "Growblic",
    type: "website",
    images: [
      {
        url: absoluteUrl(defaultSeo.image),
        width: 1200,
        height: 630,
        alt: "Growblic - Software, Websites, Apps and AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
    images: [absoluteUrl(defaultSeo.image)],
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
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      {/* body/html are transparent (globals.css) — GlobalBackgroundMount paints
          the page base colour plus the site-wide mouse-reactive field. */}
      <body className="min-h-full flex flex-col text-[#050505]">
        <GlobalBackgroundMount />
        <ScrollSound />
        <OpeningSplash />
        <SmoothScroll />
        <ScrollSoundExperience />
        {children}
              <GrowblicAIChat />
      </body>
    </html>
  );
}
