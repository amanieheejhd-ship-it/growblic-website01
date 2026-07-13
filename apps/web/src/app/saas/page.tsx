import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function SaasPage() {
  return (
    <ServicePageTemplate
      eyebrow="SaaS"
      title="SaaS products designed for growth."
      description="Growblic builds SaaS platforms with role-based dashboards, subscription-ready flows, admin controls, and scalable frontend systems."
      image="/images/business/saas-1.jpg"
      points={[
        "Multi-role dashboards",
        "Tenant-ready structure",
        "Subscription modules",
        "Admin controls",
        "Billing flow planning",
        "Scalable frontend",
      ]}
    />
  );
}
