
export function getProductSlides(name?: string) {
  const key = (name || "").toLowerCase().trim();

  if (key.includes("real estate crm")) return [
    { image: "/growblic-website01/images/products/realestate-1.jpg", title: "Real estate CRM 1" },
    { image: "/growblic-website01/images/products/realestate-2.jpg", title: "Real estate CRM 2" },
    { image: "/growblic-website01/images/products/realestate-3.jpg", title: "Real estate CRM 3" },
  ];

  if (key.includes("crm automation platform")) return [
    { image: "/growblic-website01/images/products/crm-1.jpg", title: "CRM 1" },
    { image: "/growblic-website01/images/products/crm-2.jpg", title: "CRM 2" },
    { image: "/growblic-website01/images/products/crm-3.jpg", title: "CRM 3" },
  ];

  if (key.includes("school management software")) return [
    { image: "/growblic-website01/images/products/school-1.jpg", title: "School 1" },
    { image: "/growblic-website01/images/products/school-2.jpg", title: "School 2" },
    { image: "/growblic-website01/images/products/school-3.jpg", title: "School 3" },
  ];

  if (key.includes("hr") || key.includes("payroll")) return [
    { image: "/growblic-website01/images/products/hr-1.jpg", title: "HR 1" },
    { image: "/growblic-website01/images/products/hr-2.jpg", title: "HR 2" },
    { image: "/growblic-website01/images/products/hr-3.jpg", title: "HR 3" },
  ];

  if (key.includes("fintech management app")) return [
    { image: "/growblic-website01/images/products/fintech-1.jpg", title: "FinTech 1" },
    { image: "/growblic-website01/images/products/fintech-2.jpg", title: "FinTech 2" },
    { image: "/growblic-website01/images/products/fintech-3.jpg", title: "FinTech 3" },
  ];

  if (key.includes("e-commerce mobile app")) return [
    { image: "/growblic-website01/images/products/ecommerce-1.jpg", title: "Ecommerce 1" },
    { image: "/growblic-website01/images/products/ecommerce-2.jpg", title: "Ecommerce 2" },
    { image: "/growblic-website01/images/products/ecommerce-3.jpg", title: "Ecommerce 3" },
  ];

  if (key.includes("booking management app")) return [
    { image: "/growblic-website01/images/products/booking-1.jpg", title: "Booking 1" },
    { image: "/growblic-website01/images/products/booking-2.jpg", title: "Booking 2" },
    { image: "/growblic-website01/images/products/booking-3.jpg", title: "Booking 3" },
  ];

  if (key.includes("analytics dashboard")) return [
    { image: "/growblic-website01/images/products/analytics-1.jpg", title: "Analytics 1" },
    { image: "/growblic-website01/images/products/analytics-2.jpg", title: "Analytics 2" },
    { image: "/growblic-website01/images/products/analytics-3.jpg", title: "Analytics 3" },
  ];

  if (key.includes("ai chat support system")) return [
    { image: "/growblic-website01/images/products/ai-1.jpg", title: "AI 1" },
    { image: "/growblic-website01/images/products/ai-2.jpg", title: "AI 2" },
    { image: "/growblic-website01/images/products/ai-3.jpg", title: "AI 3" },
  ];

  return [
    { image: "/growblic-website01/images/products/crm-1.jpg", title: "Fallback 1" },
    { image: "/growblic-website01/images/products/crm-2.jpg", title: "Fallback 2" },
    { image: "/growblic-website01/images/products/crm-3.jpg", title: "Fallback 3" },
  ];
}

export function getBusinessSlides(name?: string) {
  const key = (name || "").toLowerCase().trim();

  if (key.includes("web platforms")) return [
    { image: "/growblic-website01/images/business/web-1.jpg", title: "Web 1" },
    { image: "/growblic-website01/images/business/web-2.jpg", title: "Web 2" },
    { image: "/growblic-website01/images/business/web-3.jpg", title: "Web 3" },
  ];

  if (key.includes("mobile apps")) return [
    { image: "/growblic-website01/images/business/mobile-1.jpg", title: "Mobile 1" },
    { image: "/growblic-website01/images/business/mobile-2.jpg", title: "Mobile 2" },
    { image: "/growblic-website01/images/business/mobile-3.jpg", title: "Mobile 3" },
  ];

  if (key.includes("saas products")) return [
    { image: "/growblic-website01/images/business/saas-1.jpg", title: "SaaS 1" },
    { image: "/growblic-website01/images/business/saas-2.jpg", title: "SaaS 2" },
    { image: "/growblic-website01/images/business/saas-3.jpg", title: "SaaS 3" },
  ];

  if (key.includes("ai automations")) return [
    { image: "/growblic-website01/images/business/ai-1.jpg", title: "AI 1" },
    { image: "/growblic-website01/images/business/ai-2.jpg", title: "AI 2" },
    { image: "/growblic-website01/images/business/ai-3.jpg", title: "AI 3" },
  ];

  if (key.includes("business dashboards")) return [
    { image: "/growblic-website01/images/business/dashboard-1.jpg", title: "Dashboard 1" },
    { image: "/growblic-website01/images/business/dashboard-2.jpg", title: "Dashboard 2" },
    { image: "/growblic-website01/images/business/dashboard-3.jpg", title: "Dashboard 3" },
  ];

  return [
    { image: "/growblic-website01/images/business/web-1.jpg", title: "Fallback 1" },
    { image: "/growblic-website01/images/business/web-2.jpg", title: "Fallback 2" },
    { image: "/growblic-website01/images/business/web-3.jpg", title: "Fallback 3" },
  ];
}
