import type { Metadata, Viewport } from "next";
import SmoothScroll from "../components/SmoothScroll";
import "./globals.css";
import OpeningSplash from "../components/OpeningSplash";
import { absoluteUrl, createPageMetadata, defaultSeo, siteUrl } from "./seo";

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
        alt: "Growblic software development company",
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
