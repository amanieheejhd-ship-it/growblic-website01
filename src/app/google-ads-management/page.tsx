import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Google Ads | Growblic",
  description: "Growblic helps businesses plan landing pages, ad structure, conversion flow, and campaign messaging so paid traffic has a clear path to enquiry.",
};

export default function GoogleAdsManagementPage() {
  return (
    <ServicePageTemplate
      eyebrow="Google Ads"
      title="Google Ads campaigns focused on qualified leads."
      description="Growblic helps businesses plan landing pages, ad structure, conversion flow, and campaign messaging so paid traffic has a clear path to enquiry."
      image="/growblic-website01/images/business/analytics-2.jpg"
      points={[
        "Campaign planning",
        "Landing page alignment",
        "Search ads",
        "Lead-focused copy",
        "Conversion tracking guidance",
        "Performance review",
      ]}
    />
  );
}
