import {
  Bot,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  School,
  ShoppingBag,
  UsersRound,
} from "lucide-react";

export type ProductMockup = {
  label: string;
  metric: string;
  tone: "blue" | "violet" | "cyan" | "emerald" | "slate";
};

export type Product = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  status: "Live" | "Beta" | "Roadmap";
  icon: typeof UsersRound;
  imageSlides: string[];
  screenshots: ProductMockup[];
  features: string[];
  modules: string[];
  benefits: string[];
  useCases: string[];
};

const sharedBenefits = [
  "Reduce manual work across daily operations.",
  "Give teams one clean system for action and reporting.",
  "Launch with a scalable foundation that can grow later.",
];

export const products: Product[] = [
  {
    slug: "crm-automation-platform",
    title: "CRM Automation Platform",
    category: "Sales",
    shortDescription: "Lead capture, pipelines, reminders, customer timelines, and sales reporting in one system.",
    longDescription:
      "A premium CRM workspace for teams that need visibility from first lead to closed deal, with automation built into every follow-up.",
    status: "Live",
    icon: UsersRound,
    imageSlides: ["/images/products/crm-1.jpg", "/images/products/crm-2.jpg", "/images/products/crm-3.jpg"],
    screenshots: [
      { label: "Pipeline", metric: "248 active leads", tone: "blue" },
      { label: "Automation", metric: "74 follow-ups today", tone: "violet" },
      { label: "Accounts", metric: "96% response tracked", tone: "cyan" },
      { label: "Forecast", metric: "$1.2M weighted", tone: "emerald" },
    ],
    features: ["Visual deal pipeline", "Lead source tracking", "Automated reminders", "Team performance analytics"],
    modules: ["Contacts", "Deals", "Tasks", "Reports", "Automations"],
    benefits: sharedBenefits,
    useCases: ["Sales teams", "Agencies", "Real estate teams", "B2B operations"],
  },
  {
    slug: "school-management-software",
    title: "School Management Software",
    category: "Education",
    shortDescription: "Admissions, attendance, fees, exams, transport, and parent communication workflows.",
    longDescription:
      "A complete school operating platform that connects administrators, teachers, students, and parents in one reliable digital system.",
    status: "Live",
    icon: School,
    imageSlides: ["/images/products/school-1.jpg", "/images/products/school-2.jpg", "/images/products/school-3.jpg"],
    screenshots: [
      { label: "Attendance", metric: "94% present", tone: "emerald" },
      { label: "Fees", metric: "1,240 receipts", tone: "blue" },
      { label: "Exams", metric: "38 assessments", tone: "violet" },
      { label: "Parents", metric: "820 messages", tone: "cyan" },
    ],
    features: ["Student records", "Attendance tracking", "Fee collection", "Exam and result workflows"],
    modules: ["Admissions", "Attendance", "Fees", "Exams", "Transport"],
    benefits: sharedBenefits,
    useCases: ["Schools", "Colleges", "Training centers", "Administration teams"],
  },
  {
    slug: "hr-payroll-system",
    title: "HR & Payroll System",
    category: "Operations",
    shortDescription: "Employee records, payroll cycles, leaves, performance tracking, and compliance reporting.",
    longDescription:
      "A modern HR operations hub that helps businesses manage people, payroll, attendance, documents, and approvals with less friction.",
    status: "Live",
    icon: ReceiptText,
    imageSlides: ["/images/products/hr-1.jpg", "/images/products/hr-2.jpg", "/images/products/hr-3.jpg"],
    screenshots: [
      { label: "Payroll", metric: "428 slips ready", tone: "blue" },
      { label: "Leaves", metric: "18 pending", tone: "cyan" },
      { label: "People", metric: "612 profiles", tone: "violet" },
      { label: "Compliance", metric: "100% mapped", tone: "emerald" },
    ],
    features: ["Payroll automation", "Leave approvals", "Attendance logs", "Employee document vault"],
    modules: ["Employees", "Payroll", "Leaves", "Attendance", "Reviews"],
    benefits: sharedBenefits,
    useCases: ["SMBs", "HR teams", "Finance teams", "Multi-location teams"],
  },
  {
    slug: "fintech-management-app",
    title: "Fintech App",
    category: "Finance",
    shortDescription: "A secure operations layer for payments, ledgers, approvals, settlements, and finance visibility.",
    longDescription:
      "A finance control center for teams that need secure workflows, clear approvals, settlement visibility, and executive-grade reporting.",
    status: "Live",
    icon: Landmark,
    imageSlides: ["/images/products/fintech-1.jpg", "/images/products/fintech-2.jpg", "/images/products/fintech-3.jpg"],
    screenshots: [
      { label: "Ledger", metric: "$4.8M tracked", tone: "slate" },
      { label: "Approvals", metric: "32 queued", tone: "blue" },
      { label: "Settlement", metric: "99.8% matched", tone: "emerald" },
      { label: "Risk", metric: "12 alerts", tone: "violet" },
    ],
    features: ["Secure approvals", "Ledger dashboards", "Settlement tracking", "Role-based access"],
    modules: ["Payments", "Ledger", "Approvals", "Settlements", "Risk"],
    benefits: sharedBenefits,
    useCases: ["Finance teams", "Payment operations", "Account managers", "Founders"],
  },
  {
    slug: "client-login-portal",
    title: "Client Login Portal",
    category: "Client Experience",
    shortDescription: "Secure client access for documents, requests, updates, invoices, and support workflows.",
    longDescription:
      "A polished portal experience that gives clients one simple place to log in, track requests, view documents, and stay connected with your team.",
    status: "Live",
    icon: LayoutDashboard,
    imageSlides: ["/images/products/client-login.svg", "/images/products/crm-2.jpg", "/images/products/analytics-2.jpg"],
    screenshots: [
      { label: "Clients", metric: "420 active", tone: "blue" },
      { label: "Requests", metric: "86 open", tone: "cyan" },
      { label: "Documents", metric: "1.2k shared", tone: "violet" },
      { label: "Support", metric: "94% tracked", tone: "emerald" },
    ],
    features: ["Secure client login", "Request tracking", "Document sharing", "Support history"],
    modules: ["Login", "Requests", "Files", "Invoices", "Support"],
    benefits: sharedBenefits,
    useCases: ["Agencies", "Service teams", "B2B portals", "Customer success"],
  },
  {
    slug: "saas-products",
    title: "SaaS Products",
    category: "SaaS",
    shortDescription: "Subscription-ready product systems with onboarding, dashboards, plans, and admin controls.",
    longDescription:
      "A scalable SaaS foundation for businesses that need accounts, product modules, team roles, subscription journeys, and a clean management layer.",
    status: "Live",
    icon: LayoutDashboard,
    imageSlides: ["/images/products/saas-products.svg", "/images/business/saas-1.jpg", "/images/products/analytics-1.jpg"],
    screenshots: [
      { label: "Accounts", metric: "2.4k users", tone: "blue" },
      { label: "Plans", metric: "5 tiers", tone: "violet" },
      { label: "Modules", metric: "12 active", tone: "cyan" },
      { label: "Retention", metric: "91% tracked", tone: "emerald" },
    ],
    features: ["User onboarding", "Plan management", "Admin controls", "Module dashboards"],
    modules: ["Accounts", "Plans", "Teams", "Billing", "Admin"],
    benefits: sharedBenefits,
    useCases: ["Startup SaaS", "Internal products", "Subscription tools", "Product teams"],
  },
  {
    slug: "ecommerce-mobile-app",
    title: "E-commerce Mobile App",
    category: "Retail",
    shortDescription: "A mobile storefront with catalog flows, checkout, offers, order tracking, and admin controls.",
    longDescription:
      "A polished commerce app experience for brands that need fast discovery, smooth checkout, and practical back-office controls.",
    status: "Live",
    icon: ShoppingBag,
    imageSlides: ["/images/products/ecommerce-1.jpg", "/images/products/ecommerce-2.jpg", "/images/products/ecommerce-3.jpg"],
    screenshots: [
      { label: "Catalog", metric: "1,840 SKUs", tone: "violet" },
      { label: "Checkout", metric: "2.1 min avg", tone: "blue" },
      { label: "Orders", metric: "620 today", tone: "emerald" },
      { label: "Offers", metric: "18 live", tone: "cyan" },
    ],
    features: ["Mobile catalog", "Cart and checkout", "Order tracking", "Offer management"],
    modules: ["Catalog", "Cart", "Checkout", "Orders", "Admin"],
    benefits: sharedBenefits,
    useCases: ["D2C brands", "Retailers", "Marketplaces", "Store operators"],
  },
  {
    slug: "real-estate-crm",
    title: "Real Estate CRM",
    category: "Property",
    shortDescription: "Property inventory, broker collaboration, site visits, deal stages, and follow-up automation.",
    longDescription:
      "A property-first CRM designed for inventory-heavy teams that need lead routing, site visit control, and broker performance clarity.",
    status: "Live",
    icon: Building2,
    imageSlides: ["/images/products/realestate-1.jpg", "/images/products/realestate-2.jpg", "/images/products/realestate-3.jpg"],
    screenshots: [
      { label: "Inventory", metric: "312 units", tone: "blue" },
      { label: "Visits", metric: "46 scheduled", tone: "cyan" },
      { label: "Brokers", metric: "28 active", tone: "violet" },
      { label: "Deals", metric: "19 closing", tone: "emerald" },
    ],
    features: ["Property inventory", "Visit scheduling", "Broker pipelines", "Follow-up automation"],
    modules: ["Properties", "Leads", "Visits", "Brokers", "Deals"],
    benefits: sharedBenefits,
    useCases: ["Developers", "Broker teams", "Property consultants", "Sales offices"],
  },
  {
    slug: "booking-management-app",
    title: "Booking Management App",
    category: "Hospitality",
    shortDescription: "Scheduling, availability, payments, customer notifications, and service team coordination.",
    longDescription:
      "A scheduling and booking platform for service businesses that need real-time availability, payments, reminders, and staff workflows.",
    status: "Live",
    icon: CalendarClock,
    imageSlides: ["/images/products/booking-1.jpg", "/images/products/booking-2.jpg", "/images/products/booking-3.jpg"],
    screenshots: [
      { label: "Calendar", metric: "186 bookings", tone: "cyan" },
      { label: "Availability", metric: "72 slots open", tone: "blue" },
      { label: "Payments", metric: "98% captured", tone: "emerald" },
      { label: "Teams", metric: "24 assigned", tone: "violet" },
    ],
    features: ["Booking calendar", "Availability rules", "Payments", "Customer reminders"],
    modules: ["Calendar", "Customers", "Payments", "Staff", "Notifications"],
    benefits: sharedBenefits,
    useCases: ["Clinics", "Salons", "Hospitality", "Service businesses"],
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    category: "Business Intelligence",
    shortDescription: "Executive dashboards with connected metrics, filters, alerts, and visual performance stories.",
    longDescription:
      "A business intelligence layer that turns scattered operational data into clean metrics, trends, and decisions for leadership.",
    status: "Live",
    icon: ChartNoAxesCombined,
    imageSlides: ["/images/products/analytics-1.jpg", "/images/products/analytics-2.jpg", "/images/products/analytics-3.jpg"],
    screenshots: [
      { label: "Revenue", metric: "+28% growth", tone: "blue" },
      { label: "Cohorts", metric: "14 segments", tone: "violet" },
      { label: "Alerts", metric: "9 active", tone: "cyan" },
      { label: "Reports", metric: "52 saved", tone: "slate" },
    ],
    features: ["Metric dashboards", "Custom filters", "Automated alerts", "Export-ready reporting"],
    modules: ["Overview", "Reports", "Segments", "Alerts", "Exports"],
    benefits: sharedBenefits,
    useCases: ["Founders", "Operations heads", "Finance teams", "Growth teams"],
  },
  {
    slug: "ai-chat-support-system",
    title: "AI Chat Support System",
    category: "Automation",
    shortDescription: "AI-assisted support with knowledge routing, escalation, transcripts, and actionable insights.",
    longDescription:
      "An AI support workspace that handles common questions, routes complex issues, and helps teams learn from every conversation.",
    status: "Live",
    icon: Bot,
    imageSlides: ["/images/products/ai-1.jpg", "/images/products/ai-2.jpg", "/images/products/ai-3.jpg"],
    screenshots: [
      { label: "AI Inbox", metric: "1.8k chats", tone: "violet" },
      { label: "Resolution", metric: "67% automated", tone: "emerald" },
      { label: "Escalation", metric: "22 urgent", tone: "blue" },
      { label: "Knowledge", metric: "340 articles", tone: "cyan" },
    ],
    features: ["AI chat assistant", "Knowledge base routing", "Human handoff", "Transcript insights"],
    modules: ["Inbox", "AI Agent", "Knowledge", "Escalations", "Insights"],
    benefits: sharedBenefits,
    useCases: ["Support teams", "SaaS products", "E-commerce brands", "Internal helpdesks"],
  },
];

export const productCategories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
