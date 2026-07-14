import { generateInternshipCertificatePdf } from "./internship-certificate-renderer";

export const internshipPrograms = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Flutter Developer",
  "React Native Developer",
  "Android Developer",
  "iOS Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "QA Engineer",
  "AI/ML Engineer",
  "Data Analyst",
  "Digital Marketing",
  "Human Resources",
  "Business Development",
] as const;

export const confirmationLetterTypography = {
  companyName: 25,
  subtitle: 11,
  reference: 10,
  title: 22,
  body: 11.5,
  studentName: 28,
  program: 17,
  sectionHeading: 11,
  bullet: 9.5,
  signatory: 16,
  footer: 9,
} as const;

export type InternshipProgram = (typeof internshipPrograms)[number];

export type ProgramCertificateContent = {
  learning: readonly string[];
  responsibilities: readonly string[];
  skills: readonly string[];
};

export const internshipProgramContent: Record<
  InternshipProgram,
  ProgramCertificateContent
> = {
  "Frontend Developer": {
    learning: [
      "HTML, CSS, and JavaScript fundamentals",
      "Responsive web layouts",
      "React and Next.js component structure",
      "API integration basics",
      "Git and GitHub workflow",
      "Accessibility and performance checks",
    ],
    responsibilities: [
      "Build responsive frontend sections",
      "Convert designs into reusable components",
      "Test mobile, tablet, and desktop layouts",
      "Fix UI issues and improve existing pages",
      "Collaborate on frontend tasks and reviews",
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Responsive Design",
      "Git and GitHub",
    ],
  },
  "Backend Developer": {
    learning: [
      "REST API design",
      "Node.js and NestJS fundamentals",
      "Database and ORM basics",
      "Authentication and authorization",
      "Error handling and validation",
      "API testing and documentation",
    ],
    responsibilities: [
      "Build and test backend APIs",
      "Validate incoming requests",
      "Work with PostgreSQL and Prisma",
      "Implement safe error handling",
      "Document API behavior",
      "Assist in backend debugging",
    ],
    skills: [
      "Node.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "REST APIs",
      "Authentication",
      "API Testing",
    ],
  },
  "Full Stack Developer": {
    learning: [
      "Frontend and backend integration",
      "React and Next.js fundamentals",
      "REST APIs and database workflows",
      "Authentication basics",
      "Deployment fundamentals",
      "Git-based collaboration",
    ],
    responsibilities: [
      "Build full-stack features",
      "Connect frontend forms to APIs",
      "Work with databases",
      "Test complete user flows",
      "Fix integration issues",
      "Maintain reusable code",
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "Git",
    ],
  },
  "Flutter Developer": {
    learning: [
      "Dart language fundamentals",
      "Flutter widgets and layouts",
      "State management basics",
      "REST API integration",
      "Navigation and local storage",
      "Mobile testing and release basics",
    ],
    responsibilities: [
      "Build reusable Flutter screens",
      "Implement responsive mobile layouts",
      "Connect applications to APIs",
      "Debug device-specific UI issues",
      "Test Android and iOS builds",
    ],
    skills: [
      "Dart",
      "Flutter",
      "Widgets",
      "State Management",
      "REST APIs",
      "Firebase",
      "Git",
      "Mobile Testing",
    ],
  },
  "React Native Developer": {
    learning: [
      "React Native fundamentals",
      "Reusable mobile components",
      "Navigation and state management",
      "Native device API basics",
      "REST API integration",
      "Cross-platform testing",
    ],
    responsibilities: [
      "Build cross-platform mobile screens",
      "Implement navigation flows",
      "Integrate backend APIs",
      "Resolve Android and iOS UI issues",
      "Test and document mobile features",
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React Native",
      "React Navigation",
      "REST APIs",
      "State Management",
      "Git",
      "Mobile Testing",
    ],
  },
  "Android Developer": {
    learning: [
      "Kotlin language fundamentals",
      "Android activity and lifecycle concepts",
      "Modern layouts with Jetpack Compose",
      "REST API and local data integration",
      "Permissions and device services",
      "Android testing and release basics",
    ],
    responsibilities: [
      "Build Android application screens",
      "Implement navigation and state flows",
      "Connect applications to APIs",
      "Debug device and lifecycle issues",
      "Test features across Android devices",
    ],
    skills: [
      "Kotlin",
      "Android SDK",
      "Jetpack Compose",
      "Room",
      "REST APIs",
      "Firebase",
      "Git",
      "Android Testing",
    ],
  },
  "iOS Developer": {
    learning: [
      "Swift language fundamentals",
      "SwiftUI views and navigation",
      "iOS application lifecycle",
      "Networking and data persistence",
      "Apple platform design guidelines",
      "iOS testing and release basics",
    ],
    responsibilities: [
      "Build reusable SwiftUI screens",
      "Implement navigation and state flows",
      "Integrate APIs and local storage",
      "Debug simulator and device issues",
      "Test features across iOS devices",
    ],
    skills: [
      "Swift",
      "SwiftUI",
      "Xcode",
      "URLSession",
      "Core Data",
      "REST APIs",
      "Git",
      "XCTest",
    ],
  },
  "UI/UX Designer": {
    learning: [
      "User research fundamentals",
      "Information architecture",
      "Wireframing and prototyping",
      "Visual hierarchy and typography",
      "Design systems and components",
      "Usability testing basics",
    ],
    responsibilities: [
      "Create user flows and wireframes",
      "Design responsive interface screens",
      "Maintain reusable design components",
      "Prepare developer-ready handoffs",
      "Review feedback and improve usability",
    ],
    skills: [
      "Figma",
      "Wireframing",
      "Prototyping",
      "User Research",
      "Design Systems",
      "Typography",
      "Responsive Design",
      "Usability Testing",
    ],
  },
  "DevOps Engineer": {
    learning: [
      "Linux and shell fundamentals",
      "CI/CD pipeline concepts",
      "Containerization with Docker",
      "Cloud deployment basics",
      "Monitoring and logging",
      "Infrastructure security practices",
    ],
    responsibilities: [
      "Maintain development pipelines",
      "Build and review container images",
      "Assist with cloud deployments",
      "Monitor application health",
      "Document operational procedures",
    ],
    skills: [
      "Linux",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Cloud Platforms",
      "Nginx",
      "Monitoring",
      "Git",
    ],
  },
  "QA Engineer": {
    learning: [
      "Software testing fundamentals",
      "Test case and scenario design",
      "Web and mobile testing",
      "API testing basics",
      "Defect reporting and tracking",
      "Automation testing concepts",
    ],
    responsibilities: [
      "Prepare and execute test cases",
      "Verify web and mobile user flows",
      "Report reproducible defects",
      "Retest fixes and run regression checks",
      "Maintain testing documentation",
    ],
    skills: [
      "Manual Testing",
      "Test Cases",
      "API Testing",
      "Postman",
      "Bug Tracking",
      "Regression Testing",
      "Playwright",
      "Git",
    ],
  },
  "AI/ML Engineer": {
    learning: [
      "Python for data workflows",
      "Data preparation and exploration",
      "Machine learning fundamentals",
      "Model training and evaluation",
      "Feature engineering basics",
      "Responsible AI practices",
    ],
    responsibilities: [
      "Prepare and validate datasets",
      "Build baseline machine learning models",
      "Evaluate model performance",
      "Document experiments and results",
      "Assist with model integration tasks",
    ],
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "Jupyter",
      "Data Visualization",
      "Model Evaluation",
      "Git",
    ],
  },
  "Data Analyst": {
    learning: [
      "Data cleaning and validation",
      "Spreadsheet analysis techniques",
      "SQL querying fundamentals",
      "Statistical analysis basics",
      "Dashboard and report design",
      "Business insight communication",
    ],
    responsibilities: [
      "Clean and organize datasets",
      "Write queries for business questions",
      "Build reports and dashboards",
      "Check data quality and consistency",
      "Present concise analytical findings",
    ],
    skills: [
      "Excel",
      "SQL",
      "Python",
      "Pandas",
      "Power BI",
      "Data Cleaning",
      "Visualization",
      "Reporting",
    ],
  },
  "Digital Marketing": {
    learning: [
      "Digital campaign fundamentals",
      "Search and social media marketing",
      "Content planning and copywriting",
      "SEO and keyword research",
      "Marketing analytics basics",
      "Conversion optimization concepts",
    ],
    responsibilities: [
      "Research audiences and competitors",
      "Assist with campaign content",
      "Schedule and monitor social posts",
      "Track campaign performance",
      "Prepare concise marketing reports",
    ],
    skills: [
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Content Marketing",
      "Social Media",
      "Analytics",
      "Copywriting",
      "Reporting",
    ],
  },
  "Human Resources": {
    learning: [
      "Recruitment workflow fundamentals",
      "Candidate screening and coordination",
      "Onboarding process basics",
      "HR documentation practices",
      "Employee engagement concepts",
      "Workplace confidentiality standards",
    ],
    responsibilities: [
      "Assist with candidate coordination",
      "Maintain organized HR records",
      "Support onboarding activities",
      "Prepare routine HR communication",
      "Track interviews and follow-ups",
    ],
    skills: [
      "Recruitment",
      "Screening",
      "Onboarding",
      "Documentation",
      "Communication",
      "Coordination",
      "HR Operations",
      "Confidentiality",
    ],
  },
  "Business Development": {
    learning: [
      "Market and customer research",
      "Lead generation fundamentals",
      "Sales pipeline management",
      "Business communication",
      "Proposal preparation basics",
      "Client relationship practices",
    ],
    responsibilities: [
      "Research prospective clients",
      "Maintain lead and follow-up records",
      "Assist with outreach communication",
      "Support proposals and presentations",
      "Summarize pipeline activity",
    ],
    skills: [
      "Market Research",
      "Lead Generation",
      "CRM",
      "Sales Communication",
      "Proposals",
      "Presentations",
      "Negotiation",
      "Reporting",
    ],
  },
};

export type ConfirmationLetterInput = {
  fullName: string;
  program: string;
  durationDays: number;
  joiningDate: string;
  referenceNumber?: string;
};

export type ConfirmationLetterAssets = {
  logo: ArrayBuffer | Uint8Array;
};

function cleanText(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

export function validateConfirmationInput(input: ConfirmationLetterInput) {
  const errors: {
    fullName?: string;
    program?: string;
    joiningDate?: string;
  } = {};

  if (!cleanText(input.fullName)) {
    errors.fullName = "Full name is required.";
  }

  if (!internshipPrograms.includes(input.program as InternshipProgram)) {
    errors.program = "Select a valid program.";
  }

  try {
    formatConfirmationDate(input.joiningDate);
  } catch {
    errors.joiningDate = "Date of joining is required.";
  }

  return errors;
}

export function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatConfirmationDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("A valid joining date is required.");
  }

  const [, year, month, day] = match;
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const localDate = new Date(numericYear, numericMonth - 1, numericDay);

  if (
    localDate.getFullYear() !== numericYear ||
    localDate.getMonth() !== numericMonth - 1 ||
    localDate.getDate() !== numericDay
  ) {
    throw new Error("A valid joining date is required.");
  }

  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][numericMonth - 1];

  return `${numericDay} ${monthName} ${numericYear}`;
}

export function createConfirmationReference(
  date = new Date(),
  randomValue = Math.random(),
) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const suffix = Math.floor(randomValue * 1_000_000)
    .toString()
    .padStart(6, "0");

  return `${year}/${month}/${suffix}`;
}

export function confirmationFilename(fullName: string) {
  const safeName = cleanText(fullName)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return `Growblic-Internship-Certificate-${safeName || "Student"}.pdf`;
}

export function replaceObjectUrl(
  previousUrl: string | null,
  nextUrl: string,
  revoke: (url: string) => void,
) {
  if (previousUrl && previousUrl !== nextUrl) {
    revoke(previousUrl);
  }

  return nextUrl;
}

export function highDpiPreviewScale(devicePixelRatio: number) {
  return Math.max(2.5, Math.min(devicePixelRatio || 1, 3));
}

export function confirmationDynamicText(
  input: ConfirmationLetterInput,
  issuedAt = new Date(),
) {
  const joiningDate = formatConfirmationDate(input.joiningDate);

  return {
    issueDate: formatConfirmationDate(localDateValue(issuedAt)),
    joiningDate,
    referenceNumber:
      input.referenceNumber ?? createConfirmationReference(),
    statement: `This is to certify that ${cleanText(input.fullName)} has been enrolled in the ${cleanText(input.program)} internship program for ${input.durationDays} days, commencing on ${joiningDate}.`,
  };
}

export async function generateConfirmationLetter(
  assets: ConfirmationLetterAssets,
  input: ConfirmationLetterInput,
) {
  const errors = validateConfirmationInput(input);

  if (errors.fullName || errors.program || errors.joiningDate) {
    throw new Error(errors.fullName ?? errors.program ?? errors.joiningDate);
  }

  if (![30, 45, 60, 90, 180].includes(input.durationDays)) {
    throw new Error("A valid internship duration is required.");
  }

  const content =
    internshipProgramContent[input.program as InternshipProgram];

  return generateInternshipCertificatePdf(
    assets,
    input,
    content,
    confirmationDynamicText(input),
  );
}
