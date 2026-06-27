import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function CrmPlatformPage() {
  return (
    <ServicePageTemplate
      eyebrow="CRM Platform"
      title="CRM systems that keep sales organized."
      description="We build CRM platforms for leads, customers, follow-ups, pipeline stages, team activity, reports, and business growth."
      image="/growblic-website01/images/products/crm-1.jpg"
      points={[
        "Lead management",
        "Customer profiles",
        "Sales pipeline",
        "Follow-up reminders",
        "Team activity",
        "CRM reports",
      ]}
    />
  );
}
