import type { Metadata } from "next";
import BlogArticlePage from "@/components/BlogArticlePage";
import { createPageMetadata } from "@/app/seo";
import { blogPostMap } from "../blogData";

const post = blogPostMap["custom-software"];

export const metadata: Metadata = createPageMetadata({
  title: `${post.title} - Growblic Blog`,
  description: post.excerpt,
  path: post.href,
  image: post.coverImage,
  type: "article",
});

export default function CustomSoftwareBlogPage() {
  return <BlogArticlePage post={post} />;
}
