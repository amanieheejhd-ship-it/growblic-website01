import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function AiAutomationPage() {
  return (
    <ServicePageTemplate
      eyebrow="AI Automation"
      title="Smart automation that reduces manual work."
      description="We create automation flows that connect daily business tasks, reduce repetitive work, and help your team move faster with better consistency."
      image="/images/business/ai-1.jpg"
      points={[
        "Workflow automation",
        "AI assisted support",
        "CRM automation",
        "Task systems",
        "Reports and alerts",
        "Manual work reduction",
      ]}
    />
  );
}
