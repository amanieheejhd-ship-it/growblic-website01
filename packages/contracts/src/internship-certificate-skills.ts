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

export const INTERNSHIP_CERTIFICATE_DOMAIN_ROLES =
  Object.keys(INTERNSHIP_CERTIFICATE_SKILL_CATALOG) as InternshipCertificateDomainRole[];

export function isInternshipCertificateDomainRole(
  value: unknown,
): value is InternshipCertificateDomainRole {
  return typeof value === "string" &&
    Object.hasOwn(INTERNSHIP_CERTIFICATE_SKILL_CATALOG, value);
}
