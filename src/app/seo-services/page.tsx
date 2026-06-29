import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "SEO Services | Growblic",
  description: "Growblic improves website structure, content clarity, metadata, and search visibility so your business can attract better organic traffic over time.",
};

export default function SeoServicesPage() {
  return (
    <ServicePageTemplate
      eyebrow="SEO Services"
      title="SEO systems that help your business get discovered."
      description="Growblic improves website structure, content clarity, metadata, and search visibility so your business can attract better organic traffic over time."
      image="/growblic-website01/images/products/analytics-1.jpg"
      points={[
        "Technical SEO",
        "On-page optimization",
        "Keyword-focused pages",
        "Metadata setup",
        "Sitemap and robots",
        "Content structure",
      ]}
    />
  );
}
