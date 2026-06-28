import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import { blogPostMap } from "../blogData";

const post = blogPostMap["business-dashboard-features"];

export const metadata: Metadata = {
  title: `${post.title} | Growblic Blog`,
  description: post.excerpt,
};

export default function BusinessDashboardFeaturesBlogPage() {
  return <BlogArticlePage post={post} />;
}
