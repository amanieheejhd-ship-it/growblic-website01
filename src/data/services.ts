import {
  Bot,
  Code2,
  Globe2,
  Megaphone,
  MousePointerClick,
  Search,
  Smartphone,
  Star,
  Workflow,
} from "lucide-react";

export const services = [
  {
    title: "Website Development",
    description:
      "Launch a fast, premium website that builds trust and converts visitors into qualified leads.",
    features: ["Premium business UI", "SEO-ready pages", "Lead-focused structure"],
    href: "/start-project",
    icon: Globe2,
  },
  {
    title: "Software Development",
    description:
      "Build custom software that matches your real operations, reduces manual work, and scales with your team.",
    features: ["Workflow systems", "Role-based access", "Reports and dashboards"],
    href: "/software",
    icon: Code2,
  },
  {
    title: "Mobile App Development",
    description:
      "Create polished mobile apps that make booking, ordering, tracking, and customer engagement easier.",
    features: ["iOS and Android apps", "Clean app journeys", "Launch-ready builds"],
    href: "/mobile-apps",
    icon: Smartphone,
  },
  {
    title: "SaaS Product Development",
    description:
      "Turn a product idea into a scalable SaaS platform with onboarding, accounts, and business-ready modules.",
    features: ["User onboarding", "Admin controls", "Scalable product base"],
    href: "/saas",
    icon: Workflow,
  },
  {
    title: "AI Automation",
    description:
      "Automate repetitive tasks, responses, follow-ups, and internal workflows with practical AI systems.",
    features: ["AI workflows", "Smart task routing", "Team productivity tools"],
    href: "/ai-automation",
    icon: Bot,
  },
  {
    title: "SEO Services",
    description:
      "Improve discoverability with search-friendly pages, cleaner structure, and content built around buyer intent.",
    features: ["Technical SEO setup", "Keyword-led pages", "Local search basics"],
    href: "/start-project",
    icon: Search,
  },
  {
    title: "Google Ads Management",
    description:
      "Run focused Google Ads campaigns that send the right traffic to landing pages built to convert.",
    features: ["Campaign setup", "Conversion tracking", "Lead-focused landing flow"],
    href: "/start-project",
    icon: MousePointerClick,
  },
  {
    title: "Meta Ads Management",
    description:
      "Reach customers across Facebook and Instagram with clear creative, targeting, and campaign structure.",
    features: ["Audience planning", "Creative direction", "Campaign optimization"],
    href: "/start-project",
    icon: Megaphone,
  },
  {
    title: "GMB Rating & Reviews",
    description:
      "Strengthen local credibility with a cleaner Google Business presence and review-growth support.",
    features: ["Profile improvement", "Review strategy", "Local trust signals"],
    href: "/start-project",
    icon: Star,
  },
];
