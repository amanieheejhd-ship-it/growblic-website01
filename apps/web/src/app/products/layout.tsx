import type { ReactNode } from "react";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Products - Software Systems Growblic Can Build",
  description:
    "Explore Growblic product examples for CRM platforms, school software, HR systems, fintech apps, analytics dashboards, client portals, SaaS products, and automation systems.",
  path: "/products",
});

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
