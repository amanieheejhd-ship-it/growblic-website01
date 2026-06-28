import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import { blogPostMap } from "../blogData";

const post = blogPostMap["scalable-business-website"];

export const metadata: Metadata = {
  title: `${post.title} | Growblic Blog`,
  description: post.excerpt,
};

export default function ScalableBusinessWebsiteBlogPage() {
  return <BlogArticlePage post={post} />;
}
