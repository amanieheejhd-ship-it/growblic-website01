export type ProcessVisualType =
  | "understand"
  | "design"
  | "build"
  | "launch"
  | "improve";

export type ProcessGuideSection = {
  heading: string;
  body: string;
  points: string[];
};

export type ProcessGuide = {
  stepNumber: string;
  breadcrumb: string;
  title: string;
  subtitle: string;
  tags: string[];
  accent: string;
  visualType: ProcessVisualType;
  bestFor: string[];
  sections: ProcessGuideSection[];
};

export const processGuides = {
  understand: {
    stepNumber: "01",
    breadcrumb: "Understand",
    title: "Understand the business before building the product",
    subtitle:
      "Every strong product starts with clear goals, user needs, workflows, and the right product direction.",
    tags: ["Planning", "User Flow", "Product Strategy"],
    accent: "from-blue-600 via-cyan-500 to-sky-400",
    visualType: "understand",
    bestFor: [
      "New product ideas that need clear direction.",
      "Founders planning an MVP or internal tool.",
      "Teams replacing manual workflows with software.",
    ],
    sections: [
      {
        heading: "Why this step matters",
        body: "A product works better when the business goals, audience, and day-to-day workflow are clear before design or development starts.",
        points: [
          "Define the business goals the product should support.",
          "Understand target users and the actions they need to complete.",
          "Map the product direction before screens and code begin.",
        ],
      },
      {
        heading: "What Growblic does",
        body: "Growblic studies the idea as a working business system, not only as a list of pages or screens.",
        points: [
          "Core features, user flows, and operational workflows.",
          "Competitors, priorities, and practical launch scope.",
          "The right direction for website, app, SaaS, or automation work.",
        ],
      },
      {
        heading: "Output of this phase",
        body: "This phase creates a clear plan that helps the next steps move faster and avoid confusion.",
        points: [
          "Product goals, feature direction, and workflow notes.",
          "A cleaner scope for design, development, and launch.",
          "A shared understanding of what should be built first.",
        ],
      },
    ],
  },
  design: {
    stepNumber: "02",
    breadcrumb: "Design",
    title: "Design clean screens and product flows",
    subtitle:
      "We shape the product experience with premium UI, clear journeys, and screens that users can understand quickly.",
    tags: ["UI Design", "UX Flow", "Wireframes"],
    accent: "from-violet-600 via-blue-500 to-cyan-400",
    visualType: "design",
    bestFor: [
      "Products that need clearer user journeys.",
      "Websites, apps, dashboards, and SaaS screens.",
      "Teams that want design clarity before development.",
    ],
    sections: [
      {
        heading: "Why this step matters",
        body: "Design turns the strategy into visible product screens, flows, and interface decisions that feel clear and premium.",
        points: [
          "Wireframes for key pages, dashboards, and user journeys.",
          "Mobile flows and responsive layouts for real devices.",
          "A visual direction that matches the brand and product purpose.",
        ],
      },
      {
        heading: "What Growblic does",
        body: "Good design reduces confusion, makes actions easier, and helps users trust the product faster.",
        points: [
          "Clear navigation, readable screens, and focused layouts.",
          "Premium UI styling without unnecessary clutter.",
          "Responsive interface planning before development begins.",
        ],
      },
      {
        heading: "Output of this phase",
        body: "The design phase gives development a clear visual and functional reference.",
        points: [
          "Approved UI direction, wireframes, and core screens.",
          "Dashboard, website, and mobile flow references.",
          "Design decisions ready for build handoff.",
        ],
      },
    ],
  },
  build: {
    stepNumber: "03",
    breadcrumb: "Build",
    title: "Build reliable websites, apps, dashboards, and SaaS systems",
    subtitle:
      "Growblic turns approved designs into working software with clean frontend, backend, APIs, and automation.",
    tags: ["Development", "APIs", "SaaS"],
    accent: "from-slate-950 via-blue-700 to-cyan-500",
    visualType: "build",
    bestFor: [
      "Custom websites, dashboards, apps, and SaaS systems.",
      "Products that need APIs, databases, or admin panels.",
      "Businesses moving from design into real software.",
    ],
    sections: [
      {
        heading: "Why this step matters",
        body: "The build phase converts planned screens and workflows into usable software that can support real business operations.",
        points: [
          "Frontend interfaces for websites, apps, and dashboards.",
          "Backend logic, databases, APIs, and admin panels.",
          "Authentication, roles, automation, and integrations where needed.",
        ],
      },
      {
        heading: "What Growblic does",
        body: "Growblic keeps development structured so the product remains maintainable as features and users grow.",
        points: [
          "Clean components, reusable modules, and practical architecture.",
          "Secure data flows and dependable backend behavior.",
          "Scalable foundations for SaaS and business dashboards.",
        ],
      },
      {
        heading: "Output of this phase",
        body: "This phase creates the working product foundation for review, testing, and launch preparation.",
        points: [
          "Functional frontend, backend, APIs, and database structure.",
          "Admin panels, automation flows, and core modules.",
          "A product ready for testing and final polish.",
        ],
      },
    ],
  },
  launch: {
    stepNumber: "04",
    breadcrumb: "Launch",
    title: "Launch with testing, polish, and deployment support",
    subtitle:
      "Before release, we test the product, improve performance, fix issues, and prepare it for real users.",
    tags: ["Testing", "Deployment", "Release"],
    accent: "from-emerald-500 via-cyan-500 to-blue-600",
    visualType: "launch",
    bestFor: [
      "Products preparing for customers or internal teams.",
      "Web apps, mobile apps, and SaaS launches.",
      "Teams that need final QA and deployment support.",
    ],
    sections: [
      {
        heading: "Why this step matters",
        body: "Launch preparation makes sure the product is stable, responsive, and ready for customers or internal teams.",
        points: [
          "Final polish, responsive testing, and bug fixes.",
          "Hosting, deployment, and release checklist support.",
          "Play Store support where mobile app release is required.",
        ],
      },
      {
        heading: "What Growblic does",
        body: "Growblic reviews important user paths, device behavior, and performance before release.",
        points: [
          "Mobile, tablet, and desktop responsiveness.",
          "Forms, login flows, dashboards, and core actions.",
          "Performance, usability, and deployment readiness.",
        ],
      },
      {
        heading: "Output of this phase",
        body: "The product is prepared for real users with a cleaner release process and fewer surprises.",
        points: [
          "A tested production build or release package.",
          "Deployment support for hosting, web, or app release.",
          "A launch-ready product with final checks completed.",
        ],
      },
    ],
  },
  improve: {
    stepNumber: "05",
    breadcrumb: "Improve",
    title: "Improve the product after launch",
    subtitle:
      "After launch, Growblic helps improve features, track feedback, optimize performance, and support business growth.",
    tags: ["Support", "Analytics", "Growth"],
    accent: "from-cyan-500 via-blue-600 to-violet-600",
    visualType: "improve",
    bestFor: [
      "Products that need updates after launch.",
      "Teams improving conversion, workflows, or support.",
      "Businesses planning new modules and growth features.",
    ],
    sections: [
      {
        heading: "Why this step matters",
        body: "Real products improve as users respond, business needs change, and new opportunities appear.",
        points: [
          "Plan new features based on feedback and priority.",
          "Improve performance, SEO, automation, and product flow.",
          "Keep support available as the product grows.",
        ],
      },
      {
        heading: "What Growblic does",
        body: "Growblic can help refine the product experience, add business tools, and keep the system moving forward.",
        points: [
          "Analytics, upgrades, reports, and admin improvements.",
          "SEO, automation, conversion, and workflow optimization.",
          "New modules, integrations, and support updates.",
        ],
      },
      {
        heading: "Output of this phase",
        body: "This phase keeps the product useful, current, and aligned with business growth.",
        points: [
          "A practical improvement roadmap after launch.",
          "Ongoing fixes, upgrades, and support where needed.",
          "Better workflows, faster product experience, and growth support.",
        ],
      },
    ],
  },
} satisfies Record<string, ProcessGuide>;
