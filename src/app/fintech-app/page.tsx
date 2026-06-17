import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function FinTechAppPage() {
  return (
    <ServicePageTemplate
      eyebrow="FinTech App"
      title="Finance apps with clean and trusted UI."
      description="Growblic designs finance and wallet-style interfaces with clear transaction flows, dashboards, reports, and secure-looking product experiences."
      image="/images/products/fintech-1.jpg"
      points={[
        "Wallet UI",
        "Transaction screens",
        "Finance dashboard",
        "Reports",
        "User flows",
        "Secure interface",
      ]}
    />
  );
}
