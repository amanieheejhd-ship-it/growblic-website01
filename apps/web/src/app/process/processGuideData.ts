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

export type ProcessGuideCard = {
  title: string;
  body: string;
};

export type ProcessGuideSnapshotItem = {
  label: "Input" | "Action" | "Review" | "Output";
  value: string;
};

export type ProcessGuideFaq = {
  question: string;
  answer: string;
};

export type ProcessGuideRelatedStep = {
  title: string;
  href:
    | "/process/understand"
    | "/process/design"
    | "/process/build"
    | "/process/launch"
    | "/process/improve";
  description: string;
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
  outcomes: ProcessGuideCard[];
  snapshot: ProcessGuideSnapshotItem[];
  faqs: ProcessGuideFaq[];
  relatedSteps: ProcessGuideRelatedStep[];
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
    outcomes: [
      {
        title: "Clear product direction",
        body: "A focused path for what the product should do, who it serves, and what should happen first.",
      },
      {
        title: "User flow mapping",
        body: "The main journeys are organized so design and development can support real user behavior.",
      },
      {
        title: "Feature priority list",
        body: "Core, optional, and later-stage features are separated to keep the first build practical.",
      },
    ],
    snapshot: [
      { label: "Input", value: "Business idea" },
      { label: "Action", value: "Map goals" },
      { label: "Review", value: "Scope clarity" },
      { label: "Output", value: "Product direction" },
    ],
    faqs: [
      {
        question: "What if my idea is not fully clear?",
        answer:
          "That is exactly where this phase helps. Growblic can turn rough notes, references, and business goals into a clearer product direction.",
      },
      {
        question: "Can Growblic help define features?",
        answer:
          "Yes. Features can be grouped by priority, user value, launch need, and what should wait for later versions.",
      },
      {
        question: "Is this needed before design?",
        answer:
          "It is highly useful because design decisions become easier when the product goals, users, and workflows are already mapped.",
      },
    ],
    relatedSteps: [
      {
        title: "Design",
        href: "/process/design",
        description: "Turn the plan into clean screens and user journeys.",
      },
      {
        title: "Build",
        href: "/process/build",
        description: "Move from approved direction into working software.",
      },
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
    outcomes: [
      {
        title: "Wireframes and UI direction",
        body: "Key screens get structure, visual hierarchy, and a premium interface direction before build.",
      },
      {
        title: "Responsive screen planning",
        body: "Layouts are planned for mobile, tablet, and desktop so the experience stays consistent.",
      },
      {
        title: "Cleaner product journeys",
        body: "Navigation, actions, and screen order are refined to reduce user confusion.",
      },
    ],
    snapshot: [
      { label: "Input", value: "Product plan" },
      { label: "Action", value: "Create screens" },
      { label: "Review", value: "User flow" },
      { label: "Output", value: "Approved UI" },
    ],
    faqs: [
      {
        question: "Do I need wireframes before development?",
        answer:
          "Wireframes are strongly recommended because they clarify layout, flow, and feature placement before development time is spent.",
      },
      {
        question: "Can designs be changed later?",
        answer:
          "Yes. Designs can be adjusted as the product becomes clearer, though approving the main direction first keeps development smoother.",
      },
      {
        question: "Will it work on mobile?",
        answer:
          "Yes. Responsive planning is part of this phase so important screens can work cleanly across device sizes.",
      },
    ],
    relatedSteps: [
      {
        title: "Understand",
        href: "/process/understand",
        description: "Clarify goals and scope before visual decisions.",
      },
      {
        title: "Build",
        href: "/process/build",
        description: "Convert approved screens into working product modules.",
      },
      {
        title: "Launch",
        href: "/process/launch",
        description: "Prepare the finished product for release.",
      },
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
    outcomes: [
      {
        title: "Frontend and backend foundation",
        body: "The visible product and supporting business logic are built as one connected system.",
      },
      {
        title: "API and database structure",
        body: "Data, actions, and integrations are organized around the workflows the product needs.",
      },
      {
        title: "Admin and automation modules",
        body: "Internal tools, roles, dashboards, and repeatable tasks can be included where needed.",
      },
    ],
    snapshot: [
      { label: "Input", value: "Approved design" },
      { label: "Action", value: "Develop modules" },
      { label: "Review", value: "Test features" },
      { label: "Output", value: "Working product" },
    ],
    faqs: [
      {
        question: "Do you build frontend and backend?",
        answer:
          "Yes. Growblic can build user-facing interfaces, backend logic, databases, APIs, and the product modules that connect them.",
      },
      {
        question: "Can admin panels be included?",
        answer:
          "Yes. Admin panels, role-based access, content controls, reports, and internal workflows can be planned into the build.",
      },
      {
        question: "Can APIs and automation be added?",
        answer:
          "Yes. APIs, third-party integrations, notifications, workflow automation, and data actions can be added when the product requires them.",
      },
    ],
    relatedSteps: [
      {
        title: "Design",
        href: "/process/design",
        description: "Review the approved UI direction before development.",
      },
      {
        title: "Launch",
        href: "/process/launch",
        description: "Test, polish, and deploy the working product.",
      },
      {
        title: "Improve",
        href: "/process/improve",
        description: "Add upgrades and optimize after release.",
      },
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
    outcomes: [
      {
        title: "Testing and bug fixes",
        body: "Important user paths, screen sizes, forms, and flows are checked before release.",
      },
      {
        title: "Deployment checklist",
        body: "Hosting, build settings, production readiness, and release tasks are reviewed.",
      },
      {
        title: "Release-ready product",
        body: "The product is prepared for real users with final polish and launch support.",
      },
    ],
    snapshot: [
      { label: "Input", value: "Final product" },
      { label: "Action", value: "QA checks" },
      { label: "Review", value: "Fix issues" },
      { label: "Output", value: "Live release" },
    ],
    faqs: [
      {
        question: "Do you test on mobile and desktop?",
        answer:
          "Yes. Responsive checks cover mobile, tablet, and desktop behavior for the key product screens and workflows.",
      },
      {
        question: "Can you help with hosting?",
        answer:
          "Yes. Growblic can support hosting setup, deployment configuration, production builds, and launch preparation.",
      },
      {
        question: "Do you support Play Store launch?",
        answer:
          "Yes. For mobile app projects, Growblic can help prepare the app release process and required launch assets where applicable.",
      },
    ],
    relatedSteps: [
      {
        title: "Build",
        href: "/process/build",
        description: "Review the working product before release checks.",
      },
      {
        title: "Improve",
        href: "/process/improve",
        description: "Plan the next upgrades after launch.",
      },
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
    outcomes: [
      {
        title: "Feedback-based upgrades",
        body: "User requests, team needs, and product usage are turned into practical improvement priorities.",
      },
      {
        title: "Performance and SEO improvements",
        body: "Speed, discoverability, technical quality, and conversion paths can be refined over time.",
      },
      {
        title: "Growth roadmap",
        body: "New modules, automations, integrations, and product opportunities are organized into a clear path.",
      },
    ],
    snapshot: [
      { label: "Input", value: "User feedback" },
      { label: "Action", value: "Prioritize updates" },
      { label: "Review", value: "Measure impact" },
      { label: "Output", value: "Better product" },
    ],
    faqs: [
      {
        question: "Can features be added after launch?",
        answer:
          "Yes. New features, modules, admin tools, and customer-facing improvements can be planned after the first release.",
      },
      {
        question: "Can performance be improved later?",
        answer:
          "Yes. Performance can be reviewed and improved through technical fixes, lighter flows, better assets, and cleaner implementation.",
      },
      {
        question: "Can SEO and automation be added?",
        answer:
          "Yes. SEO improvements, reporting, integrations, automations, and operational workflows can be added as the product grows.",
      },
    ],
    relatedSteps: [
      {
        title: "Understand",
        href: "/process/understand",
        description: "Revisit goals when planning the next product stage.",
      },
      {
        title: "Build",
        href: "/process/build",
        description: "Turn priority upgrades into reliable product modules.",
      },
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
