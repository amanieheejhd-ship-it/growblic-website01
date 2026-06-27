import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function AnalyticsPage() {
  return (
    <ServicePageTemplate
      eyebrow="Analytics"
      title="Analytics dashboards that make data clear."
      description="We create clean dashboards with charts, filters, reports, summaries, and insights that help businesses understand performance."
      image="/growblic-website01/images/products/analytics-1.jpg"
      points={[
        "KPI dashboards",
        "Charts and graphs",
        "Filters",
        "Reports",
        "Business insights",
        "Export-ready data",
      ]}
    />
  );
}
