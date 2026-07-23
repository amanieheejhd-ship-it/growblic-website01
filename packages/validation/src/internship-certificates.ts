import { FormValidationError } from "./common";

export const INTERNSHIP_CERTIFICATE_SKILL_CATALOG = {
  "Frontend Development": [
    "HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js",
    "Tailwind CSS", "Responsive Design", "REST API Integration",
    "Git and GitHub", "State Management", "Web Performance",
    "Accessibility", "Testing Basics",
  ],
  "Backend Development": [
    "Node.js", "NestJS", "Express.js", "TypeScript", "REST API Development",
    "PostgreSQL", "MySQL", "MongoDB", "Prisma ORM",
    "Authentication and Authorization", "Redis", "API Security", "Docker",
    "Git and GitHub", "Unit Testing",
  ],
  "Full Stack Development": [
    "HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js",
    "Node.js", "NestJS", "REST APIs", "PostgreSQL", "Prisma ORM",
    "Authentication", "Git and GitHub", "Deployment", "Testing",
  ],
  "Mobile App Development": [
    "Flutter", "Dart", "React Native", "Android Development",
    "iOS Development", "API Integration", "State Management", "Firebase",
    "Push Notifications", "Local Storage", "App Testing",
    "Play Store Deployment", "App Store Deployment", "Git and GitHub",
  ],
  "UI/UX Design": [
    "Figma", "Wireframing", "Prototyping", "User Research", "User Flows",
    "Information Architecture", "Design Systems", "Responsive Design",
    "Mobile UI Design", "Web UI Design", "Typography", "Color Theory",
    "Accessibility", "Usability Testing",
  ],
  "QA / Software Testing": [
    "Manual Testing", "Test Case Writing", "Bug Reporting",
    "Regression Testing", "Functional Testing", "API Testing", "Postman",
    "Browser Testing", "Mobile App Testing", "Automation Testing Basics",
    "Performance Testing Basics", "Jira", "Quality Documentation",
  ],
  "DevOps / Cloud": [
    "Linux", "Git and GitHub", "Docker", "CI/CD", "GitHub Actions",
    "Nginx", "AWS", "EC2", "S3", "Cloud Deployment",
    "Environment Configuration", "Monitoring", "SSL Configuration",
    "Backup and Recovery",
  ],
  "Data Analytics": [
    "Microsoft Excel", "SQL", "Data Cleaning", "Data Visualization",
    "Power BI", "Tableau", "Python Basics", "Pandas", "Reporting",
    "Dashboard Creation", "Business Analysis", "Data Interpretation",
  ],
  "AI / Machine Learning": [
    "Python", "NumPy", "Pandas", "Scikit-learn", "Data Preprocessing",
    "Model Training", "Model Evaluation", "Machine Learning Basics",
    "Prompt Engineering", "AI API Integration",
    "Natural Language Processing Basics", "Computer Vision Basics",
  ],
  "Digital Marketing": [
    "Social Media Marketing", "Content Planning", "Campaign Management",
    "Meta Ads", "Google Ads", "Lead Generation", "Email Marketing",
    "Analytics", "Market Research", "Copywriting", "Performance Reporting",
  ],
  SEO: [
    "Keyword Research", "On-Page SEO", "Technical SEO", "Local SEO",
    "Google Search Console", "Google Analytics", "Content Optimization",
    "Backlink Analysis", "Competitor Analysis", "SEO Auditing",
    "Metadata Optimization", "Page Speed Basics",
  ],
  "Graphic Design": [
    "Adobe Photoshop", "Adobe Illustrator", "Canva", "Branding",
    "Logo Design", "Social Media Creatives", "Typography", "Color Theory",
    "Layout Design", "Marketing Creatives", "Image Editing",
    "Print Design Basics",
  ],
} as const;

export type InternshipCertificateDomainRole =
  keyof typeof INTERNSHIP_CERTIFICATE_SKILL_CATALOG;

export type InternshipCertificateDraft = {
  domainRole: InternshipCertificateDomainRole;
  skills: string[];
  designation: string | null;
  projectWork: string | null;
  performanceSummary: string | null;
  conductNote: string | null;
  remarks: string | null;
};

export function isInternshipCertificateDomainRole(
  value: unknown,
): value is InternshipCertificateDomainRole {
  return typeof value === "string" &&
    Object.hasOwn(INTERNSHIP_CERTIFICATE_SKILL_CATALOG, value);
}

export const INTERNSHIP_CERTIFICATE_STATUSES = [
  "PENDING_START_DATE", "PENDING_SKILLS", "READY", "GENERATED",
  "EMAILED", "EMAIL_FAILED", "CANCELLED",
] as const;

function text(value: unknown, maximum: number, required = false) {
  if (value === null || value === undefined || value === "") {
    if (required) throw new FormValidationError("Complete all required certificate fields.");
    return null;
  }
  if (typeof value !== "string") throw new FormValidationError("Invalid certificate details.");
  const normalized = value.normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  if ((required && !normalized) || normalized.length > maximum) {
    throw new FormValidationError("Invalid certificate details.");
  }
  return normalized || null;
}

export function readInternshipCertificateId(value: string) {
  if (!/^(?:c[a-z0-9]{20,}|cert_[a-f0-9]{32})$/.test(value)) {
    throw new FormValidationError("Invalid certificate identifier.");
  }
  return value;
}

export function readInternshipCertificateDraft(input: unknown): InternshipCertificateDraft {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new FormValidationError("Invalid certificate details.");
  }
  const values = input as Record<string, unknown>;
  if (!isInternshipCertificateDomainRole(values.domainRole)) {
    throw new FormValidationError("Select an internship domain or role.");
  }
  if (!Array.isArray(values.skills) || values.skills.length > 25) {
    throw new FormValidationError("Add no more than 25 skills.");
  }
  const skills = values.skills.map((skill) => text(skill, 80, true) as string);
  if (new Set(skills.map((skill) => skill.toLocaleLowerCase("en"))).size !== skills.length) {
    throw new FormValidationError("Duplicate skills are not allowed.");
  }
  const catalog = new Set<string>(INTERNSHIP_CERTIFICATE_SKILL_CATALOG[values.domainRole]);
  if (skills.filter((skill) => !catalog.has(skill)).length > 10) {
    throw new FormValidationError("Add no more than 10 custom skills.");
  }
  return {
    domainRole: values.domainRole,
    skills,
    designation: text(values.designation, 120),
    projectWork: text(values.projectWork, 800),
    performanceSummary: text(values.performanceSummary, 800),
    conductNote: text(values.conductNote, 500),
    remarks: text(values.remarks, 500),
  };
}

export function assertCertificateReady(draft: InternshipCertificateDraft) {
  if (!draft.domainRole) {
    throw new FormValidationError("Select an internship domain or role.");
  }
  if (draft.skills.length === 0) {
    throw new FormValidationError("Add at least one verified skill before marking ready.");
  }
}
