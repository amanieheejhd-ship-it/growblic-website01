export type Internship = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  overview: string;
  mode: string;
  learn: string[];
  responsibilities: string[];
  eligibility: string;
  skills: string[];
};

export const internships: Internship[] = [
  {
    slug: "frontend-developer",
    title: "Frontend Developer Internship",
    shortTitle: "Frontend Developer",
    category: "Engineering",
    overview:
      "Work with Growblic's frontend flow to understand how clean interfaces, responsive layouts, and production-ready website sections are built for real clients and products.",
    mode:
      "Remote internship for India-based applicants with guided tasks, review cycles, and practical project exposure.",
    learn: [
      "React and Next.js component structure",
      "Tailwind CSS layouts and responsive UI patterns",
      "Premium card, form, dashboard, and landing-page sections",
      "Basic performance, accessibility, and polish checks",
    ],
    responsibilities: [
      "Build and refine frontend sections from clear requirements",
      "Convert design ideas into responsive components",
      "Test layouts across mobile, tablet, and desktop screens",
      "Collaborate on fixes, UI improvements, and content updates",
    ],
    eligibility:
      "Suitable for BCA, MCA, B.Tech, B.E., B.Sc Computer Science, Diploma in Computer Science, and related courses. Students from related fields and self-taught beginners may also apply.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React basics",
      "Responsive design",
      "Git and GitHub basics",
    ],
  },
  {
    slug: "backend-developer",
    title: "Backend Developer Internship",
    shortTitle: "Backend Developer",
    category: "Engineering",
    overview:
      "Learn how Growblic builds APIs, authentication systems, databases, dashboards, admin panels, and dependable backend workflows for modern applications.",
    mode:
      "Remote internship for India-based applicants with guided backend assignments, code reviews, and practical project exposure.",
    learn: [
      "API structure and request-response workflows",
      "Node.js and backend project fundamentals",
      "Database models, queries, and data validation",
      "Authentication, admin panels, and backend security basics",
    ],
    responsibilities: [
      "Create and improve beginner-friendly API endpoints",
      "Work with databases and structured application data",
      "Assist with authentication and admin-panel workflows",
      "Test backend features and document important changes",
    ],
    eligibility:
      "Suitable for BCA, MCA, B.Tech, B.E., B.Sc Computer Science, Diploma in Computer Science, and related technical courses. Related-field students and self-taught beginners may also apply.",
    skills: [
      "JavaScript or TypeScript basics",
      "Node.js basics",
      "APIs",
      "Databases",
      "Authentication fundamentals",
      "Git and GitHub basics",
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design Internship",
    shortTitle: "UI/UX Design",
    category: "Design",
    overview:
      "Learn how Growblic plans and designs clean digital experiences for websites, dashboards, SaaS products, and mobile applications.",
    mode:
      "Remote internship for India-based applicants with guided design tasks, feedback cycles, and practical portfolio-focused work.",
    learn: [
      "Figma tools and organised design files",
      "Wireframes and interactive prototypes",
      "Responsive mobile and web layouts",
      "Design systems and basic user-experience principles",
    ],
    responsibilities: [
      "Create wireframes for website and app screens",
      "Turn ideas into clean interface designs",
      "Maintain spacing, typography, and component consistency",
      "Improve designs using feedback and usability observations",
    ],
    eligibility:
      "Suitable for B.Des, BCA, B.Tech, BA, visual-design students, and learners with a UI/UX or graphic-design diploma or certification. Self-taught designers may also apply.",
    skills: [
      "Figma",
      "Wireframes",
      "Prototypes",
      "Mobile and web layouts",
      "Design systems",
      "Basic user-experience principles",
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing Internship",
    shortTitle: "Digital Marketing",
    category: "Marketing",
    overview:
      "Learn how Growblic plans content, improves online visibility, manages digital campaigns, and creates lead-generation workflows for businesses.",
    mode:
      "Remote internship for India-based applicants with guided marketing assignments, campaign learning, and practical reporting exposure.",
    learn: [
      "SEO fundamentals and keyword planning",
      "Content planning and social-media workflows",
      "Google Ads and Meta Ads basics",
      "Lead generation and analytics fundamentals",
    ],
    responsibilities: [
      "Assist with content calendars and campaign ideas",
      "Research keywords, audiences, and competitors",
      "Support SEO and social-media activities",
      "Track basic campaign and lead-generation performance",
    ],
    eligibility:
      "Suitable for BBA, B.Com, BA, MBA, marketing students, and learners completing digital-marketing courses or related programmes. Interested beginners from other fields may also apply.",
    skills: [
      "SEO basics",
      "Content planning",
      "Social media",
      "Google Ads",
      "Meta Ads",
      "Lead generation",
      "Analytics basics",
    ],
  },
];

export function getInternshipBySlug(slug: string) {
  return internships.find((internship) => internship.slug === slug);
}
