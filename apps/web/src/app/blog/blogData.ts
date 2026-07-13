export type BlogVisualType =
  | "software"
  | "mobile"
  | "dashboard"
  | "automation"
  | "website"
  | "admin";

export type BlogSection = {
  heading: string;
  eyebrow?: string;
  body: string[];
  points?: string[];
  callout?: string;
};

export type BlogPost = {
  slug: string;
  href: string;
  category: string;
  title: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  publishedAt: string;
  displayDate: string;
  guideLabel: string;
  intro: string;
  tags: string[];
  visualType: BlogVisualType;
  accent: string;
  summary: string[];
  keyTakeaways: string[];
  relatedServices: string[];
  bestFor: string[];
  sections: BlogSection[];
};

export const blogPosts = [
  {
    slug: "custom-software",
    href: "/blog/custom-software",
    category: "Software Development",
    title: "Why custom software is better than one-size-fits-all tools",
    excerpt:
      "Custom software helps businesses build workflows that match real operations, improve productivity, and scale without limitations.",
    coverImage: "/images/blog/custom-software.svg",
    readTime: "5 min read",
    publishedAt: "2026-06-18",
    displayDate: "Jun 18, 2026",
    guideLabel: "Growblic Guide",
    intro:
      "Most growing teams do not need another generic tool. They need a system that mirrors how leads arrive, how work is approved, how teams collaborate, and how managers see progress without hunting through spreadsheets.",
    tags: ["Workflows", "Operations", "Business Tools"],
    visualType: "software",
    accent: "from-blue-600 via-cyan-500 to-violet-500",
    summary: [
      "Custom software should map to the real workflow.",
      "The best first version solves operational friction.",
      "Good architecture leaves room for new modules later.",
    ],
    keyTakeaways: [
      "Start with process mapping before UI design.",
      "Prioritize roles, permissions, reports, and approvals early.",
      "Build the first release around measurable business value.",
    ],
    relatedServices: ["Custom Software", "CRM Platforms", "Admin Panels"],
    bestFor: [
      "Teams outgrowing spreadsheets.",
      "Businesses with repeated manual work.",
      "Companies needing internal tools or portals.",
    ],
    sections: [
      {
        eyebrow: "The core idea",
        heading: "Custom software starts with how your business actually works",
        body: [
          "Generic platforms are useful until your team starts bending the business around the software. That is usually when duplicate entry, missing approvals, unclear reporting, and manual follow-ups become normal.",
          "A custom system flips that relationship. The software is planned around the real workflow, then shaped into screens, data models, dashboards, and automations that support the way the team already needs to operate.",
        ],
        points: [
          "Map every important handoff from request to delivery.",
          "Identify repeated tasks that can become digital workflows.",
          "Design the first version around the highest-friction process.",
        ],
      },
      {
        eyebrow: "Business value",
        heading: "Why one-size-fits-all tools start to slow teams down",
        body: [
          "As operations become more specific, fixed tools create hidden costs. Teams export data, copy information between systems, ask developers for tiny changes, and create workarounds no one trusts.",
          "Purpose-built software can combine intake, task ownership, billing, reporting, and approvals into one cleaner operating layer.",
        ],
        points: [
          "Reduce duplicate entry and scattered information.",
          "Support permissions, reports, and approvals your team needs.",
          "Connect departments with one cleaner operating system.",
        ],
        callout:
          "A good custom system should reduce operational noise, not add another complicated platform to manage.",
      },
      {
        eyebrow: "Planning",
        heading: "What to define before development starts",
        body: [
          "The strongest custom software projects begin with a simple blueprint: users, roles, data, workflows, reports, integrations, and the outcomes the business wants to improve.",
          "This planning keeps the first release focused while still leaving space for modules such as dashboards, customer portals, CRMs, or automation later.",
        ],
        points: [
          "List the daily tasks the software should simplify.",
          "Define roles, permissions, reports, and approval steps early.",
          "Separate launch-critical features from phase-two improvements.",
        ],
      },
      {
        eyebrow: "Growblic approach",
        heading: "What Growblic can build",
        body: [
          "Growblic can design and develop internal tools, CRMs, dashboards, admin panels, portals, reporting systems, approval flows, and automation modules for daily business operations.",
          "The goal is to turn a messy process into a focused digital product that feels simple for the team using it every day.",
        ],
      },
    ],
  },
  {
    slug: "mobile-apps-customer-experience",
    href: "/blog/mobile-apps-customer-experience",
    category: "Mobile Apps",
    title: "How mobile apps improve customer experience",
    excerpt:
      "Mobile apps make customer journeys faster, smoother, and more connected with your business.",
    coverImage: "/images/blog/mobile-apps.svg",
    readTime: "4 min read",
    publishedAt: "2026-06-15",
    displayDate: "Jun 15, 2026",
    guideLabel: "Growblic Guide",
    intro:
      "A mobile app becomes valuable when it gives customers a faster way to do something they already repeat: book, order, pay, track, save preferences, contact support, or return to your service.",
    tags: ["iOS + Android", "Customer Journey", "Retention"],
    visualType: "mobile",
    accent: "from-cyan-500 via-blue-600 to-violet-500",
    summary: [
      "Mobile apps work best for repeat customer actions.",
      "Push updates and account flows improve continuity.",
      "The first release should focus on the journeys users repeat most.",
    ],
    keyTakeaways: [
      "Design around customer tasks, not a feature checklist.",
      "Keep booking, payment, tracking, and support flows fast.",
      "Use notifications carefully so they feel helpful, not noisy.",
    ],
    relatedServices: ["Mobile Apps", "Customer Portals", "SaaS Products"],
    bestFor: [
      "Service businesses with repeat customers.",
      "Brands that need ordering, booking, or tracking.",
      "Teams improving support and customer loyalty.",
    ],
    sections: [
      {
        eyebrow: "Experience",
        heading: "A useful app shortens the path between intent and action",
        body: [
          "Customers do not install an app because a business wants one. They install it when the app gives them a faster, clearer, more reliable way to get something done.",
          "That might mean checking order status, booking a service, receiving timely updates, managing payments, or contacting support without starting from scratch each time.",
        ],
        points: [
          "Give customers a dedicated place to interact with your brand.",
          "Make repeat actions faster than web-only journeys.",
          "Use saved preferences and account flows to remove friction.",
        ],
      },
      {
        eyebrow: "Retention",
        heading: "Mobile apps help businesses stay connected after the first visit",
        body: [
          "A website is often where discovery happens. A mobile app is where repeated engagement can become easier. The difference is continuity: account data, reminders, order history, tracking, and support can all live in one place.",
          "For businesses with regular customer interaction, this can improve loyalty and reduce support pressure.",
        ],
        points: [
          "Send useful booking, payment, and delivery updates.",
          "Make support easier with user history already attached.",
          "Give customers a smoother branded experience after signup.",
        ],
        callout:
          "The best mobile apps feel quiet and useful. They do not need to be large to create a better customer experience.",
      },
      {
        eyebrow: "Product planning",
        heading: "What to decide before building the app",
        body: [
          "Before development begins, define the highest-value journeys, the account data users need, and the moments where mobile access is genuinely better than a website.",
          "A focused first version is usually better than a heavy app with too many unfinished flows.",
        ],
        points: [
          "Map the key customer actions from opening the app to completing a task.",
          "Keep the first release focused on the journeys users repeat most.",
          "Plan notifications, support, and account features with restraint.",
        ],
      },
      {
        eyebrow: "Growblic approach",
        heading: "What Growblic can build",
        body: [
          "Growblic can build customer apps, business apps, booking apps, service apps, delivery flows, reward systems, dashboards, and mobile-first product experiences.",
          "Each app is planned around real user behavior so the interface feels direct, fast, and easy to return to.",
        ],
      },
    ],
  },
  {
    slug: "business-dashboard-features",
    href: "/blog/business-dashboard-features",
    category: "Dashboards",
    title: "What every business dashboard should include",
    excerpt:
      "A good dashboard gives teams clear visibility into sales, leads, operations, reports, and daily performance.",
    coverImage: "/images/blog/business-dashboard.svg",
    readTime: "5 min read",
    publishedAt: "2026-06-12",
    displayDate: "Jun 12, 2026",
    guideLabel: "Growblic Guide",
    intro:
      "Dashboards are useful only when they help people decide what to do next. The best dashboards combine metrics, context, filters, alerts, and operational actions in one clear view.",
    tags: ["Reports", "Analytics", "Operations"],
    visualType: "dashboard",
    accent: "from-violet-600 via-blue-600 to-cyan-400",
    summary: [
      "Dashboards should support decisions, not just display charts.",
      "Metrics need context, filters, and operational detail.",
      "Role-based views keep reporting focused for each team.",
    ],
    keyTakeaways: [
      "Start with decisions the team needs to make every day.",
      "Balance high-level cards with deeper tables and filters.",
      "Connect data to actions whenever possible.",
    ],
    relatedServices: ["Dashboards", "Analytics", "Admin Panels"],
    bestFor: [
      "Sales and operations teams.",
      "Managers tracking daily performance.",
      "Businesses needing reports in one place.",
    ],
    sections: [
      {
        eyebrow: "Visibility",
        heading: "A dashboard should make daily performance easy to understand",
        body: [
          "A dashboard should help a team understand what is happening without digging through scattered files, messages, and tools.",
          "The right interface turns leads, revenue, orders, support, tasks, and alerts into a clear operating picture.",
        ],
        points: [
          "Show the numbers that matter most for daily decisions.",
          "Group metrics by team, workflow, or business outcome.",
          "Make status visible without forcing users into exports.",
        ],
      },
      {
        eyebrow: "Structure",
        heading: "The best dashboards combine quick scanning with deeper reporting",
        body: [
          "Top-level cards are useful for fast scanning, but teams also need charts, tables, filters, and drill-downs to understand why a metric changed.",
          "A dashboard becomes more valuable when the same screen helps the team act on what they see.",
        ],
        points: [
          "Use cards for high-level health and trends.",
          "Use charts for comparisons over time.",
          "Use tables and filters for operational detail.",
        ],
        callout:
          "A dashboard is not finished when it looks impressive. It is finished when the team can use it to make better decisions faster.",
      },
      {
        eyebrow: "Planning",
        heading: "What to define before designing dashboard screens",
        body: [
          "Start with decisions, not charts. Decide what the team needs to know each day, what context each metric needs, and which actions should be available from the same interface.",
          "This keeps the dashboard practical instead of decorative.",
        ],
        points: [
          "Prioritize metrics that support real decisions.",
          "Group charts, tables, filters, and alerts by user role.",
          "Make reports easy to scan before adding deeper analysis.",
        ],
      },
      {
        eyebrow: "Growblic approach",
        heading: "What Growblic can build",
        body: [
          "Growblic can build sales dashboards, admin dashboards, analytics panels, reporting systems, CRM views, finance dashboards, and custom role-based business views.",
          "The aim is to give teams visibility they can trust and reporting that supports daily work.",
        ],
      },
    ],
  },
  {
    slug: "ai-automation-saves-time",
    href: "/blog/ai-automation-saves-time",
    category: "AI Automation",
    title: "How AI automation saves time for growing teams",
    excerpt:
      "AI automation reduces repeated tasks and helps teams focus on decisions, customers, and growth.",
    coverImage: "/images/blog/ai-automation.svg",
    readTime: "4 min read",
    publishedAt: "2026-06-09",
    displayDate: "Jun 9, 2026",
    guideLabel: "Growblic Guide",
    intro:
      "AI automation is most useful when it removes repetitive work from a clear process: lead routing, support drafts, report summaries, status updates, reminders, and handoffs.",
    tags: ["Automation", "AI Flow", "Productivity"],
    visualType: "automation",
    accent: "from-blue-600 via-violet-600 to-cyan-400",
    summary: [
      "AI automation should start with repeated, well-defined tasks.",
      "Human review points keep workflows reliable.",
      "The goal is time saved plus better consistency.",
    ],
    keyTakeaways: [
      "Choose workflows that already happen often.",
      "Keep ownership and approval steps visible.",
      "Measure time saved and quality before expanding automation.",
    ],
    relatedServices: ["AI Automation", "CRM Automation", "Dashboards"],
    bestFor: [
      "Teams handling repeated updates.",
      "Businesses with lead, support, or report flows.",
      "Companies wanting faster internal operations.",
    ],
    sections: [
      {
        eyebrow: "Operations",
        heading: "Automation works best when the workflow is already clear",
        body: [
          "Growing teams often lose time to repeated updates, manual reporting, lead routing, customer replies, and internal follow-ups.",
          "AI automation can make these flows faster and more consistent, but it works best when the business process is understood before the automation is designed.",
        ],
        points: [
          "Turn repeated tasks into structured workflows.",
          "Reduce missed follow-ups and manual delays.",
          "Create cleaner handoffs between tools and teams.",
        ],
      },
      {
        eyebrow: "Use cases",
        heading: "Where AI automation creates practical value",
        body: [
          "Good automation supports people rather than replacing judgment. It can prepare summaries, route data, draft replies, trigger reminders, and keep records updated.",
          "The biggest gains often come from small workflows that happen many times every week.",
        ],
        points: [
          "Lead capture, routing, and notification flows.",
          "Report generation and data cleanup.",
          "Customer support drafts and internal summaries.",
        ],
        callout:
          "Useful AI automation should make work easier to review, not harder to understand.",
      },
      {
        eyebrow: "Planning",
        heading: "How to choose the first automation",
        body: [
          "Start with repeated, rules-based tasks where the inputs and expected outputs are clear. Then decide where a human should review, approve, or edit before anything is sent or saved.",
          "This creates confidence before expanding automation across more complex workflows.",
        ],
        points: [
          "Choose repeated, rules-based tasks for the first automation.",
          "Keep approval and review points visible for the team.",
          "Measure time saved and quality before expanding the system.",
        ],
      },
      {
        eyebrow: "Growblic approach",
        heading: "What Growblic can build",
        body: [
          "Growblic can build AI workflow systems, automation dashboards, notification flows, data pipelines, support assistants, CRM automations, and reporting tools.",
          "Each automation is planned around a real business process so the output is practical, measurable, and easier for teams to trust.",
        ],
      },
    ],
  },
  {
    slug: "scalable-business-website",
    href: "/blog/scalable-business-website",
    category: "Website Development",
    title: "Why every business needs a scalable website",
    excerpt:
      "A scalable website supports brand trust, SEO, lead generation, and future business expansion.",
    coverImage: "/images/blog/scalable-website.svg",
    readTime: "4 min read",
    publishedAt: "2026-06-05",
    displayDate: "Jun 5, 2026",
    guideLabel: "Growblic Guide",
    intro:
      "A scalable website is more than a polished homepage. It is a flexible business asset that can support service pages, SEO campaigns, landing pages, forms, dashboards, portals, and future product experiences.",
    tags: ["Websites", "SEO", "Growth"],
    visualType: "website",
    accent: "from-cyan-500 via-blue-600 to-indigo-500",
    summary: [
      "A scalable website builds trust and supports growth.",
      "Reusable sections make future pages easier to launch.",
      "SEO, speed, and mobile quality should be planned early.",
    ],
    keyTakeaways: [
      "Plan the site as a content and conversion system.",
      "Create reusable patterns for services, proof, and CTAs.",
      "Leave room for future integrations and landing pages.",
    ],
    relatedServices: ["Website Development", "SEO Pages", "Landing Pages"],
    bestFor: [
      "Businesses planning long-term growth.",
      "Brands that need stronger online trust.",
      "Teams preparing services, products, or campaigns.",
    ],
    sections: [
      {
        eyebrow: "Foundation",
        heading: "A scalable website gives your business room to grow",
        body: [
          "A website is often the first serious signal of trust for a business. A scalable website makes that trust easier to build while leaving room for content, campaigns, integrations, and future product features.",
          "Instead of rebuilding every time the business adds a service, the site should use reusable sections and page patterns that can expand cleanly.",
        ],
        points: [
          "Improve brand trust with clear design and messaging.",
          "Support SEO pages, service pages, and landing pages.",
          "Leave room for forms, dashboards, portals, and integrations.",
        ],
      },
      {
        eyebrow: "Growth",
        heading: "Scalable websites support marketing and operations together",
        body: [
          "A strong business website should support more than presentation. It should help visitors understand the offer, compare services, take action, and return when they need more information.",
          "When planned well, the same website can support SEO, campaigns, lead capture, customer portals, and product pages without losing consistency.",
        ],
        points: [
          "Reusable page sections and design patterns.",
          "Responsive layouts for mobile and desktop.",
          "Cleaner structure for content and future marketing.",
        ],
        callout:
          "Scalability is not only technical. It is also about content structure, design consistency, and conversion paths.",
      },
      {
        eyebrow: "Planning",
        heading: "What to define before designing the website",
        body: [
          "Clarify the core pages, service structure, SEO opportunities, lead capture paths, and future sections before visual design begins.",
          "This makes the website easier to expand without making each new page feel disconnected.",
        ],
        points: [
          "Define the pages that support trust, SEO, and lead generation.",
          "Create reusable sections for services, products, and proof points.",
          "Plan future content and integrations before the layout becomes rigid.",
        ],
      },
      {
        eyebrow: "Growblic approach",
        heading: "What Growblic can build",
        body: [
          "Growblic can build company websites, service websites, landing pages, SEO-ready pages, product pages, dashboards, portals, and web experiences that grow with the business.",
          "The result is a website that looks premium today and can keep supporting the business as it adds new offers.",
        ],
      },
    ],
  },
  {
    slug: "admin-panels-operations",
    href: "/blog/admin-panels-operations",
    category: "Admin Panels",
    title: "How admin panels make operations easier",
    excerpt:
      "Admin panels help businesses manage users, orders, reports, content, and operations from one place.",
    coverImage: "/images/blog/admin-panels.svg",
    readTime: "5 min read",
    publishedAt: "2026-06-01",
    displayDate: "Jun 1, 2026",
    guideLabel: "Growblic Guide",
    intro:
      "Admin panels turn software into something a business can actually operate after launch. They give teams controlled access to users, orders, reports, content, settings, and workflow actions.",
    tags: ["Admin Panel", "Roles", "Operations"],
    visualType: "admin",
    accent: "from-indigo-600 via-blue-600 to-cyan-400",
    summary: [
      "Admin panels give teams control after launch.",
      "Roles, permissions, and audit-friendly actions matter early.",
      "Tables, filters, forms, and reports should match daily operations.",
    ],
    keyTakeaways: [
      "Plan admin tools around real team tasks.",
      "Define sensitive actions and permissions before development.",
      "Make records easy to search, update, review, and export.",
    ],
    relatedServices: ["Admin Panels", "Internal Tools", "SaaS Dashboards"],
    bestFor: [
      "Businesses with internal teams.",
      "Apps that need content or user management.",
      "Operations that need reports and approvals.",
    ],
    sections: [
      {
        eyebrow: "Control",
        heading: "Admin panels make software easier to run after launch",
        body: [
          "Admin panels give businesses a practical control center. Instead of asking developers to change every small item, teams can manage content, users, orders, reports, and operations from a secure interface.",
          "A well-planned admin panel reduces support pressure and helps the business keep moving without touching code.",
        ],
        points: [
          "Manage users, orders, content, reports, and settings.",
          "Create role-based access for different teams.",
          "Keep operational data organized and easier to review.",
        ],
      },
      {
        eyebrow: "Operations",
        heading: "Good admin panels are built around real daily tasks",
        body: [
          "Admin panels are most useful when they are designed around the actions teams perform every day: searching records, changing status, approving items, updating content, reviewing reports, and exporting data.",
          "The interface should make common tasks obvious while protecting sensitive actions with the right permissions.",
        ],
        points: [
          "Tables, filters, forms, and detail views.",
          "Approval flows and status updates.",
          "Dashboards for daily tracking and reporting.",
        ],
        callout:
          "A strong admin panel feels calm and practical because it is built for repeated use by real teams.",
      },
      {
        eyebrow: "Planning",
        heading: "What to define before building admin controls",
        body: [
          "Define what teams need to manage, which actions require permission, what information needs filtering, and how reports or status changes should be reviewed.",
          "This planning prevents the admin panel from becoming a cluttered afterthought.",
        ],
        points: [
          "List the records, users, content, and reports the team manages.",
          "Define role-based permissions before building sensitive controls.",
          "Design tables, filters, and forms around daily operational speed.",
        ],
      },
      {
        eyebrow: "Growblic approach",
        heading: "What Growblic can build",
        body: [
          "Growblic can build admin panels, CRM panels, CMS tools, order management systems, user management systems, reporting dashboards, and role-based internal tools.",
          "The goal is to give the right people the right controls while keeping the product secure and easy to manage.",
        ],
      },
    ],
  },
] satisfies BlogPost[];

export const blogPostMap = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<(typeof blogPosts)[number]["slug"], BlogPost>;
