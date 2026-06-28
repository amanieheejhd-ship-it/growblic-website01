import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import { blogPostMap } from "../blogData";

const post = blogPostMap["custom-software"];

export const metadata: Metadata = {
  title: `${post.title} | Growblic Blog`,
  description: post.excerpt,
};

export default function CustomSoftwareBlogPage() {
  return <BlogArticlePage post={post} />;
}
