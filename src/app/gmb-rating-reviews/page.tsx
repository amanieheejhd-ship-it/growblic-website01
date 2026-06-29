import { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "GMB Rating & Reviews | Growblic",
  description: "Growblic helps local businesses improve their Google presence with review strategy, profile polish, trust-building assets, and local visibility support.",
};

export default function GmbRatingReviewsPage() {
  return (
    <ServicePageTemplate
      eyebrow="GMB Rating & Reviews"
      title="Google Business Profile growth support for local trust."
      description="Growblic helps local businesses improve their Google presence with review strategy, profile polish, trust-building assets, and local visibility support."
      image="/growblic-website01/images/process/growth-unique.jpg"
      points={[
        "Profile optimization",
        "Review strategy",
        "Local trust building",
        "Business information cleanup",
        "Rating growth guidance",
        "Local visibility support",
      ]}
    />
  );
}
