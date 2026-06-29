import type { MetadataRoute } from "next";
import { blogPosts } from "./blog/blogData";
import { absoluteUrl } from "./seo";
import { products } from "@/data/products";

export const dynamic = "force-static";

const corePages = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.85 },
  { path: "/services", priority: 0.95 },
  { path: "/website-development", priority: 0.86 },
  { path: "/software", priority: 0.86 },
  { path: "/custom-software", priority: 0.84 },
  { path: "/mobile-apps", priority: 0.86 },
  { path: "/saas", priority: 0.84 },
  { path: "/saas-products", priority: 0.84 },
  { path: "/ai-automation", priority: 0.86 },
  { path: "/crm-platform", priority: 0.8 },
  { path: "/hr-system", priority: 0.8 },
  { path: "/fintech-app", priority: 0.8 },
  { path: "/analytics", priority: 0.78 },
  { path: "/seo-services", priority: 0.82 },
  { path: "/google-ads-management", priority: 0.78 },
  { path: "/meta-ads-management", priority: 0.78 },
  { path: "/gmb-rating-reviews", priority: 0.76 },
  { path: "/products", priority: 0.9 },
  { path: "/downloads", priority: 0.84 },
  { path: "/blog", priority: 0.85 },
  { path: "/developer", priority: 0.66 },
  { path: "/brand", priority: 0.62 },
  { path: "/legal", priority: 0.58 },
  { path: "/security", priority: 0.62 },
  { path: "/meetup", priority: 0.62 },
  { path: "/start-project", priority: 0.95 },
  { path: "/price-calculator", priority: 0.88 },
  { path: "/support", priority: 0.7 },
  { path: "/client-login", priority: 0.64 },
  { path: "/careers/culture", priority: 0.76 },
  { path: "/careers/humans", priority: 0.7 },
  { path: "/careers/insights", priority: 0.74 },
  { path: "/careers/values", priority: 0.76 },
  { path: "/careers/perks", priority: 0.76 },
  { path: "/careers/openings", priority: 0.78 },
  { path: "/careers/apply", priority: 0.76 },
  { path: "/careers", priority: 0.82 },
  { path: "/why-growblic", priority: 0.75 },
  { path: "/process", priority: 0.68 },
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
