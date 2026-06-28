import type { Metadata } from "next";

export const siteUrl = "https://amanieheejhd-ship-it.github.io/growblic-website01";

export const defaultSeo = {
  title: "Growblic - Software Development Company",
  description:
    "Growblic builds premium websites, mobile apps, SaaS products, dashboards, AI automation systems, and business software for modern companies.",
  keywords: [
    "website development",
    "software development",
    "mobile app development",
    "SaaS development",
    "AI automation",
    "business dashboards",
    "Growblic",
  ],
  image: "/og-growblic.svg",
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) {
    return path;
  }

  const cleanPath = path.startsWith("/growblic-website01/")
    ? path.replace("/growblic-website01", "")
    : path;

  return `${siteUrl}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}

export function createPageMetadata({
  title,
  description = defaultSeo.description,
  path = "/",
  image = defaultSeo.image,
  keywords = defaultSeo.keywords,
  type = "website",
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Growblic",
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Growblic software development company",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
