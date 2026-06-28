export type BlogVisualType =
  | "software"
  | "mobile"
  | "dashboard"
  | "automation"
  | "website"
  | "admin";

export type BlogPost = {
  slug: string;
  href: string;
  category: string;
  title: string;
  excerpt: string;
  coverImage: string;
  readingTime: string;
  guideLabel: string;
  tags: string[];
  visualType: BlogVisualType;
  accent: string;
  summary: string[];
  bestFor: string[];
  sections: {
    heading: string;
    body: string;
    points?: string[];
  }[];
};

export const blogPosts = [
  {
    slug: "custom-software",
    href: "/blog/custom-software",
    category: "Software Development",
    title: "Why custom software is better than one-size-fits-all tools",
    excerpt:
      "Custom software helps businesses build workflows that match their real operations instead of adjusting to generic tools.",
    coverImage: "/images/blog/custom-software.svg",
    readingTime: "5 min read",
    guideLabel: "Growblic Guide",
    tags: ["Workflows", "Operations", "Business Tools"],
    visualType: "software",
    accent: "from-blue-600 via-cyan-500 to-violet-500",
    summary: [
      "Built around your real process.",
      "Cleaner data, roles, and reporting.",
      "Easier to expand as the business grows.",
    ],
    bestFor: [
      "Teams outgrowing spreadsheets.",
      "Businesses with repeated manual work.",
      "Companies needing internal tools or portals.",
    ],
    sections: [
      {
        heading: "Introduction",
        body: "Generic software can be useful at the beginning, but growing teams often need systems that match the way their business actually works. Custom software gives your workflows, users, reports, and approvals a dedicated place to run.",
      },
      {
        heading: "Why it matters",
        body: "When a business adjusts itself around a fixed tool, workarounds become normal. Purpose-built software removes those limits and turns repeated tasks into clear digital flows.",
        points: [
          "Reduce duplicate entry and scattered information.",
          "Support permissions, reports, and approvals your team needs.",
          "Connect departments with one cleaner operating system.",
        ],
      },
      {
        heading: "Key benefits",
        body: "The best custom software is practical, focused, and built around measurable business value.",
        points: [
          "Workflow screens that match real operations.",
          "Dashboards that show useful business data.",
          "Scalable modules that can grow after launch.",
        ],
      },
      {
        heading: "What Growblic can build",
        body: "Growblic can build internal tools, CRMs, dashboards, admin panels, portals, reporting systems, approval flows, and automation modules for daily business operations.",
      },
      {
        heading: "Final thoughts",
        body: "Custom software is not about adding complexity. It is about giving your business a cleaner system that fits the work you already do and supports the way you want to grow.",
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
    readingTime: "4 min read",
    guideLabel: "Growblic Guide",
    tags: ["iOS + Android", "Customer Journey", "Retention"],
    visualType: "mobile",
    accent: "from-cyan-500 via-blue-600 to-violet-500",
    summary: [
      "Faster customer actions.",
      "Better engagement and reminders.",
      "A smoother branded experience.",
    ],
    bestFor: [
      "Service businesses with repeat customers.",
      "Brands that need ordering, booking, or tracking.",
      "Teams improving support and customer loyalty.",
    ],
    sections: [
      {
        heading: "Introduction",
        body: "Customers expect fast mobile access to the businesses they use often. A well-designed app can make booking, ordering, tracking, payments, updates, and support feel much easier.",
      },
      {
        heading: "Why it matters",
        body: "A mobile app keeps your business close to the customer and reduces the friction between interest and action.",
        points: [
          "Give customers a dedicated place to interact with your brand.",
          "Make repeat actions faster than web-only journeys.",
          "Use notifications and account flows to keep users informed.",
        ],
      },
      {
        heading: "Key benefits",
        body: "Mobile apps are most valuable when they solve real customer needs and make repeated actions simpler.",
        points: [
          "Quick access to services, orders, bookings, or support.",
          "Cleaner onboarding and user account experiences.",
          "More consistent communication through app updates.",
        ],
      },
      {
        heading: "What Growblic can build",
        body: "Growblic can build customer apps, business apps, booking apps, service apps, delivery flows, reward systems, dashboards, and mobile-first product experiences.",
      },
      {
        heading: "Final thoughts",
        body: "A mobile app should not just exist because competitors have one. It should improve the customer journey in a way that is faster, clearer, and easier to return to.",
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
    readingTime: "5 min read",
    guideLabel: "Growblic Guide",
    tags: ["Reports", "Analytics", "Operations"],
    visualType: "dashboard",
    accent: "from-violet-600 via-blue-600 to-cyan-400",
    summary: [
      "Clear metrics and status.",
      "Useful filters and reports.",
      "Fast access to operational actions.",
    ],
    bestFor: [
      "Sales and operations teams.",
      "Managers tracking daily performance.",
      "Businesses needing reports in one place.",
    ],
    sections: [
      {
        heading: "Introduction",
        body: "A dashboard should help a team understand what is happening without digging through scattered files, messages, and tools. The right dashboard turns business activity into clear decisions.",
      },
      {
        heading: "Why it matters",
        body: "Teams move faster when they can see leads, revenue, orders, support, tasks, and alerts in one organized interface.",
        points: [
          "Show the numbers that matter most for daily decisions.",
          "Make reports easy to filter, export, and review.",
          "Connect data with actions instead of only displaying charts.",
        ],
      },
      {
        heading: "Key benefits",
        body: "A strong dashboard balances clarity, depth, and speed.",
        points: [
          "High-level cards for quick scanning.",
          "Charts for trends and comparisons.",
          "Tables and filters for operational detail.",
        ],
      },
      {
        heading: "What Growblic can build",
        body: "Growblic can build sales dashboards, admin dashboards, analytics panels, reporting systems, CRM views, finance dashboards, and custom role-based business views.",
      },
      {
        heading: "Final thoughts",
        body: "A dashboard should reduce confusion. If it helps your team see what matters and act quickly, it becomes a real business tool instead of a decorative screen.",
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
    readingTime: "4 min read",
    guideLabel: "Growblic Guide",
    tags: ["Automation", "AI Flow", "Productivity"],
    visualType: "automation",
    accent: "from-blue-600 via-violet-600 to-cyan-400",
    summary: [
      "Reduce repetitive work.",
      "Route data and tasks faster.",
      "Support teams with smarter workflows.",
    ],
    bestFor: [
      "Teams handling repeated updates.",
      "Businesses with lead, support, or report flows.",
      "Companies wanting faster internal operations.",
    ],
    sections: [
      {
        heading: "Introduction",
        body: "Growing teams often lose time to repeated updates, manual reporting, lead routing, customer replies, and internal follow-ups. AI automation can make these flows faster and more consistent.",
      },
      {
        heading: "Why it matters",
        body: "Automation helps teams spend less time moving information and more time making decisions.",
        points: [
          "Turn repeated tasks into structured workflows.",
          "Reduce missed follow-ups and manual delays.",
          "Create cleaner handoffs between tools and teams.",
        ],
      },
      {
        heading: "Key benefits",
        body: "Good automation supports people rather than replacing judgment.",
        points: [
          "Lead capture, routing, and notification flows.",
          "Report generation and data cleanup.",
          "Customer support drafts and internal summaries.",
        ],
      },
      {
        heading: "What Growblic can build",
        body: "Growblic can build AI workflow systems, automation dashboards, notification flows, data pipelines, support assistants, CRM automations, and reporting tools.",
      },
      {
        heading: "Final thoughts",
        body: "AI automation works best when it is tied to clear business processes. Start with the tasks that repeat often, then improve the workflow step by step.",
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
    readingTime: "4 min read",
    guideLabel: "Growblic Guide",
    tags: ["Websites", "SEO", "Growth"],
    visualType: "website",
    accent: "from-cyan-500 via-blue-600 to-indigo-500",
    summary: [
      "Better brand trust.",
      "Room for SEO and campaigns.",
      "A foundation for future features.",
    ],
    bestFor: [
      "Businesses planning long-term growth.",
      "Brands that need stronger online trust.",
      "Teams preparing services, products, or campaigns.",
    ],
    sections: [
      {
        heading: "Introduction",
        body: "A website is often the first serious signal of trust for a business. A scalable website makes that trust easier to build while leaving room for content, campaigns, integrations, and future product features.",
      },
      {
        heading: "Why it matters",
        body: "A website should support more than a homepage. It should help people understand your work, contact your team, discover services, and return when they need more information.",
        points: [
          "Improve brand trust with clear design and messaging.",
          "Support SEO pages, service pages, and landing pages.",
          "Leave room for forms, dashboards, portals, and integrations.",
        ],
      },
      {
        heading: "Key benefits",
        body: "Scalable websites are easier to expand without starting from scratch.",
        points: [
          "Reusable page sections and design patterns.",
          "Responsive layouts for mobile and desktop.",
          "Cleaner structure for content and future marketing.",
        ],
      },
      {
        heading: "What Growblic can build",
        body: "Growblic can build company websites, service websites, landing pages, SEO-ready pages, product pages, dashboards, portals, and web experiences that grow with the business.",
      },
      {
        heading: "Final thoughts",
        body: "A scalable website is a long-term business asset. It should be easy to understand today and flexible enough for what your company adds tomorrow.",
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
    readingTime: "5 min read",
    guideLabel: "Growblic Guide",
    tags: ["Admin Panel", "Roles", "Operations"],
    visualType: "admin",
    accent: "from-indigo-600 via-blue-600 to-cyan-400",
    summary: [
      "Control business data in one place.",
      "Manage users, roles, and actions.",
      "Reduce scattered operational work.",
    ],
    bestFor: [
      "Businesses with internal teams.",
      "Apps that need content or user management.",
      "Operations that need reports and approvals.",
    ],
    sections: [
      {
        heading: "Introduction",
        body: "Admin panels give businesses a practical control center. Instead of asking developers to change every small item, teams can manage content, users, orders, reports, and operations from a secure interface.",
      },
      {
        heading: "Why it matters",
        body: "A good admin panel makes daily operations faster and gives the right people access to the right controls.",
        points: [
          "Manage users, orders, content, reports, and settings.",
          "Create role-based access for different teams.",
          "Keep operational data organized and easier to review.",
        ],
      },
      {
        heading: "Key benefits",
        body: "Admin panels are most useful when they are designed around real operational tasks.",
        points: [
          "Tables, filters, forms, and detail views.",
          "Approval flows and status updates.",
          "Dashboards for daily tracking and reporting.",
        ],
      },
      {
        heading: "What Growblic can build",
        body: "Growblic can build admin panels, CRM panels, CMS tools, order management systems, user management systems, reporting dashboards, and role-based internal tools.",
      },
      {
        heading: "Final thoughts",
        body: "Admin panels make software easier to run after launch. They give teams the control they need while keeping operations structured and secure.",
      },
    ],
  },
] satisfies BlogPost[];

export const blogPostMap = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<(typeof blogPosts)[number]["slug"], BlogPost>;
