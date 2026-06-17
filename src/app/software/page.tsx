import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function SoftwarePage() {
  return (
    <ServicePageTemplate
      eyebrow="Software"
      title="Custom software built for your business."
      description="Growblic builds dashboards, internal tools, admin panels, workflow systems, and business platforms that help teams work faster and smarter."
      image="/images/business/web-1.jpg"
      points={[
        "Admin dashboards",
        "Internal tools",
        "Workflow systems",
        "Role-based access",
        "Reports and analytics",
        "Scalable architecture",
      ]}
    />
  );
}
