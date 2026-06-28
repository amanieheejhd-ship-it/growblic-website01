import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import { blogPostMap } from "../blogData";

const post = blogPostMap["mobile-apps-customer-experience"];

export const metadata: Metadata = {
  title: `${post.title} | Growblic Blog`,
  description: post.excerpt,
};

export default function MobileAppsCustomerExperienceBlogPage() {
  return <BlogArticlePage post={post} />;
}
