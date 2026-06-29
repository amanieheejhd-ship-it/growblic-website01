import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Meta Ads | Growblic",
  description: "Growblic helps create campaign-ready funnels for Facebook and Instagram traffic with clean creatives, clear messaging, and landing pages built to convert.",
};

export default function MetaAdsManagementPage() {
  return (
    <ServicePageTemplate
      eyebrow="Meta Ads"
      title="Meta Ads systems for brand awareness and lead generation."
      description="Growblic helps create campaign-ready funnels for Facebook and Instagram traffic with clean creatives, clear messaging, and landing pages built to convert."
      image="/growblic-website01/images/business/ai-2.jpg"
      points={[
        "Facebook campaigns",
        "Instagram campaigns",
        "Creative planning",
        "Lead funnels",
        "Landing page support",
        "Retargeting strategy",
      ]}
    />
  );
}
