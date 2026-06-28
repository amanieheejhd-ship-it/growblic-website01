import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import { blogPostMap } from "../blogData";

const post = blogPostMap["ai-automation-saves-time"];

export const metadata: Metadata = {
  title: `${post.title} | Growblic Blog`,
  description: post.excerpt,
};

export default function AiAutomationSavesTimeBlogPage() {
  return <BlogArticlePage post={post} />;
}
