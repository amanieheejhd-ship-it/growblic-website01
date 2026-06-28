import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Website Development | Growblic",
  description: "Growblic designs and builds fast, responsive, SEO-ready websites that help businesses look professional, explain their services clearly, and generate real enquiries.",
};

export default function WebsiteDevelopmentPage() {
  return (
    <ServicePageTemplate
      eyebrow="Website Development"
      title="Premium websites built to convert visitors into leads."
      description="Growblic designs and builds fast, responsive, SEO-ready websites that help businesses look professional, explain their services clearly, and generate real enquiries."
      image="/growblic-website01/images/business/web-1.jpg"
      points={[
        "Business websites",
        "Landing pages",
        "Service pages",
        "Responsive design",
        "SEO-ready structure",
        "Lead-focused CTA sections",
      ]}
    />
  );
}
