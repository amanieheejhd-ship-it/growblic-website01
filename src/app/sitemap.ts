import type { MetadataRoute } from "next";
import { blogPosts } from "./blog/blogData";
import { absoluteUrl } from "./seo";
import { products } from "@/data/products";

export const dynamic = "force-static";

const corePages = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.85 },
  { path: "/services", priority: 0.95 },
  { path: "/products", priority: 0.9 },
  { path: "/blog", priority: 0.85 },
  { path: "/start-project", priority: 0.95 },
  { path: "/why-growblic", priority: 0.75 },
  { path: "/support", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...corePages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(post.href),
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
  ];
}
