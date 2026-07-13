import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import { createPageMetadata } from "@/app/seo";
import { blogPostMap } from "../blogData";

const post = blogPostMap["business-dashboard-features"];

export const metadata: Metadata = createPageMetadata({
  title: `${post.title} - Growblic Blog`,
  description: post.excerpt,
  path: post.href,
  image: post.coverImage,
  type: "article",
});

export default function BusinessDashboardFeaturesBlogPage() {
  return <BlogArticlePage post={post} />;
}
