import ServicePageTemplate from "@/components/ServicePageTemplate";

export default function HrSystemPage() {
  return (
    <ServicePageTemplate
      eyebrow="HR System"
      title="HR systems for teams and operations."
      description="We build HR dashboards for employees, attendance, payroll views, leave management, onboarding, and internal company workflows."
      image="/growblic-website01/images/products/hr-1.jpg"
      points={[
        "Employee profiles",
        "Attendance views",
        "Leave management",
        "Payroll dashboard",
        "Onboarding flows",
        "HR reports",
      ]}
    />
  );
}
