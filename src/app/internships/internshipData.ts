export type Internship = {
  title: string;
  slug: string;
  category: "Engineering" | "Design" | "Marketing";
  type: "Internship";
  location: "Remote / India";
  experience: "Beginner friendly";
  description: string;
  overview: string;
  learn: string[];
  responsibilities: string[];
  eligibility: string;
  skills: string[];
  mode: string;
};

export const internships: Internship[] = [
  {
    title: "Frontend Developer Internship",
    slug: "frontend-developer",
    category: "Engineering",
    type: "Internship",
    location: "Remote / India",
    experience: "Beginner friendly",
    description:
      "Learn React, Next.js, Tailwind CSS, responsive design, and premium website development on real projects.",
    overview:
      "Work with Growblic's frontend flow to understand how clean interfaces, responsive layouts, and production-ready website sections are built for real clients and products.",
    learn: [
      "React and Next.js component structure",
      "Tailwind CSS layouts and responsive UI patterns",
      "Premium card, form, and landing page sections",
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
    skills: ["HTML", "CSS", "JavaScript", "React basics", "Responsive design"],
    mode: "Remote internship for India-based applicants with guided tasks, review cycles, and practical project exposure.",
  },
  {
    title: "Backend Developer Internship",
    slug: "backend-developer",
    category: "Engineering",
    type: "Internship",
    location: "Remote / India",
    experience: "Beginner friendly",
    description:
      "Learn APIs, databases, authentication, admin panels, dashboards, and backend systems.",
    overview:
      "Learn how Growblic plans and builds backend workflows that support apps, dashboards, admin panels, and business operations.",
    learn: [
      "API planning and backend route structure",
      "Database concepts and data validation",
      "Authentication and access-control basics",
      "Admin panel and dashboard backend workflows",
    ],
    responsibilities: [
      "Assist with API and data-flow planning",
      "Write small backend utilities or endpoint logic with guidance",
      "Document backend behavior and test common cases",
      "Support dashboard, auth, and database task reviews",
    ],
    eligibility:
      "Suitable for BCA, MCA, B.Tech, B.E., B.Sc Computer Science, Diploma in Computer Science, and related courses. Students from related fields and self-taught beginners may also apply.",
    skills: ["JavaScript or TypeScript basics", "APIs", "Database basics", "Problem solving"],
    mode: "Remote internship for India-based applicants with structured learning tasks and real backend workflow exposure.",
  },
  {
    title: "UI/UX Design Internship",
    slug: "ui-ux-design",
    category: "Design",
    type: "Internship",
    location: "Remote / India",
    experience: "Beginner friendly",
    description:
      "Learn Figma, wireframes, landing pages, mobile app screens, prototypes, and clean design systems.",
    overview:
      "Practice product thinking, screen structure, and clean visual design while working around real website, app, and dashboard use cases.",
    learn: [
      "Wireframes and user-flow thinking",
      "Figma layout, spacing, typography, and component basics",
      "Landing page, dashboard, and mobile app screen design",
      "Prototype presentation and design handoff habits",
    ],
    responsibilities: [
      "Create wireframes and clean UI screen drafts",
      "Improve spacing, hierarchy, and visual consistency",
      "Prepare design notes for developers",
      "Review competitor and user-flow references",
    ],
    eligibility:
      "Suitable for B.Des, BCA, B.Tech, BA, diploma or certification in UI/UX, graphic design, or related courses. Students from related fields and self-taught beginners may also apply.",
    skills: ["Figma basics", "Visual hierarchy", "Wireframing", "Attention to detail"],
    mode: "Remote internship for India-based applicants with design reviews, practical tasks, and portfolio-building project exposure.",
  },
  {
    title: "Digital Marketing Internship",
    slug: "digital-marketing",
    category: "Marketing",
    type: "Internship",
    location: "Remote / India",
    experience: "Beginner friendly",
    description:
      "Learn SEO basics, content planning, Google Ads, Meta Ads, social media strategy, and lead-generation workflows.",
    overview:
      "Explore how Growblic thinks about digital growth, content, campaign planning, search intent, and practical lead-generation workflows.",
    learn: [
      "SEO basics and keyword intent",
      "Content planning for service and product pages",
      "Google Ads, Meta Ads, and campaign structure basics",
      "Lead-generation workflow thinking and reporting habits",
    ],
    responsibilities: [
      "Research keywords, competitors, and content ideas",
      "Assist with campaign and social media planning",
      "Draft content outlines and basic marketing copy",
      "Track simple campaign notes and growth observations",
    ],
    eligibility:
      "Suitable for BBA, B.Com, BA, MBA, digital-marketing courses, or related fields. Students from related fields and self-taught beginners may also apply.",
    skills: ["Research", "Writing basics", "SEO interest", "Social media awareness"],
    mode: "Remote internship for India-based applicants with guided marketing tasks, content practice, and campaign exposure.",
  },
];

export function getInternshipBySlug(slug: string) {
  return internships.find((internship) => internship.slug === slug);
}
