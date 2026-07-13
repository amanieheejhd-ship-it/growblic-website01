import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function MobileAppsPage() {
  return (
    <ServicePageTemplate
      eyebrow="Mobile Apps"
      title="Premium mobile apps for modern users."
      description="We create smooth mobile app experiences with clean screens, simple flows, onboarding, booking journeys, and production-ready UI."
      image="/images/business/mobile-1.jpg"
      points={[
        "iOS and Android UI",
        "Login and onboarding",
        "Booking flows",
        "Customer dashboards",
        "Push-ready screens",
        "Clean app structure",
      ]}
    />
  );
}
