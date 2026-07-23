import type {
  AdminCareerApplication,
  AdminContactMessage,
  AdminDashboardSummary,
  AdminInternshipApplication,
  AdminMeetupRequest,
  AdminPriceCalculatorLead,
  AdminProjectRequest,
  AdminSubmissionKind,
  AdminSubmissionPage,
  ApplicationStatus,
  EnquiryStatus,
} from "@growblic/contracts";
import { adminDatabase, prismaJsonNulls } from "./admin-database";

export type SubmissionListQuery = {
  page: number;
  pageSize: number;
  status: string | null;
  search: string;
  enrolledInInstitute?: "all" | "yes" | "no";
};

type WhereInput = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonValue = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminTransaction = any;

function priceCalculatorWhere(): WhereInput {
  const { DbNull, JsonNull } = prismaJsonNulls();
  return {
    OR: [
      { source: "price-calculator" },
      {
        AND: [
          { source: null },
          { calculatorData: { not: DbNull } },
          { calculatorData: { not: JsonNull } },
        ],
      },
    ],
  };
}

function projectRequestWhere(): WhereInput {
  return { NOT: priceCalculatorWhere() };
}

function pageResult<T>(items: T[], total: number, query: SubmissionListQuery): AdminSubmissionPage<T> {
  return {
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    },
  };
}

function textSummary(value: string, maximum = 180) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maximum ? `${normalized.slice(0, maximum - 1)}…` : normalized;
}

function offset(query: SubmissionListQuery) {
  return (query.page - 1) * query.pageSize;
}

function calculatorFields(value: JsonValue | null, fallbackCategory: string | null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      projectCategory: fallbackCategory,
      selectedOptionsSummary: "No structured options available.",
      calculatorDetailsSummary: fallbackCategory ?? "Calculator submission",
    };
  }
  const object = value as Record<string, JsonValue>;
  const category = typeof object.category === "string" ? object.category : fallbackCategory;
  const selectedOptions = Array.isArray(object.selectedOptions)
    ? object.selectedOptions.filter((item): item is string => typeof item === "string").slice(0, 12)
    : [];
  const selectedOptionsSummary = selectedOptions.length
    ? textSummary(selectedOptions.join("; "), 220)
    : "No structured options available.";
  return {
    projectCategory: category,
    selectedOptionsSummary,
    calculatorDetailsSummary: textSummary(
      [category, selectedOptionsSummary].filter(Boolean).join(" — "),
      260,
    ),
  };
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const prisma = adminDatabase();
  const projectWhere = projectRequestWhere();
  const calculatorWhere = priceCalculatorWhere();
  const [
    contactTotal, contactPending, projectTotal, projectPending, calculatorTotal, calculatorPending,
    meetupTotal, meetupPending, careerTotal, careerPending, internshipTotal, internshipPending,
  ] = await Promise.all([
    prisma.contactEnquiry.count(),
    prisma.contactEnquiry.count({ where: { status: "NEW" } }),
    prisma.quoteRequest.count({ where: projectWhere }),
    prisma.quoteRequest.count({ where: { AND: [projectWhere, { status: "NEW" }] } }),
    prisma.quoteRequest.count({ where: calculatorWhere }),
    prisma.quoteRequest.count({ where: { AND: [calculatorWhere, { status: "NEW" }] } }),
    prisma.meetingRequest.count(),
    prisma.meetingRequest.count({ where: { status: "NEW" } }),
    prisma.careerApplication.count(),
    prisma.careerApplication.count({ where: { status: "NEW" } }),
    prisma.internshipApplication.count(),
    prisma.internshipApplication.count({ where: { status: "NEW" } }),
  ]);
  return {
    "contact-messages": { total: contactTotal, pending: contactPending },
    "project-requests": { total: projectTotal, pending: projectPending },
    "price-calculator-leads": { total: calculatorTotal, pending: calculatorPending },
    "meetup-requests": { total: meetupTotal, pending: meetupPending },
    "career-applications": { total: careerTotal, pending: careerPending },
    "internship-applications": { total: internshipTotal, pending: internshipPending },
  };
}

type DateRow = { createdAt: Date };

export async function listContactMessages(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminContactMessage>> {
  const prisma = adminDatabase();
  const where: WhereInput = {
    ...(query.status ? { status: query.status as EnquiryStatus } : {}),
    ...(query.search ? { OR: ["name", "email", "phone", "company", "service", "message"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.contactEnquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, company: true, service: true, message: true, status: true, createdAt: true } }),
    prisma.contactEnquiry.count({ where }),
  ]);
  return pageResult(items.map(({ message, ...item }: DateRow & { message: string } & Record<string, unknown>) => ({ ...item, messageSummary: textSummary(message), createdAt: item.createdAt.toISOString() })) as AdminContactMessage[], total, query);
}

function quoteSearch(query: SubmissionListQuery): WhereInput {
  return {
    ...(query.status ? { status: query.status as EnquiryStatus } : {}),
    ...(query.search ? { OR: ["name", "email", "phone", "company", "service", "requirements"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
}

export async function listProjectRequests(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminProjectRequest>> {
  const prisma = adminDatabase();
  const where: WhereInput = { AND: [projectRequestWhere(), quoteSearch(query)] };
  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, company: true, service: true, budget: true, requirements: true, status: true, createdAt: true } }),
    prisma.quoteRequest.count({ where }),
  ]);
  return pageResult(items.map(({ requirements, ...item }: DateRow & { requirements: string } & Record<string, unknown>) => ({ ...item, timeline: null, requirementsSummary: textSummary(requirements), createdAt: item.createdAt.toISOString() })) as AdminProjectRequest[], total, query);
}

export async function listPriceCalculatorLeads(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminPriceCalculatorLead>> {
  const prisma = adminDatabase();
  const where: WhereInput = { AND: [priceCalculatorWhere(), quoteSearch(query)] };
  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, service: true, budget: true, calculatorData: true, status: true, createdAt: true } }),
    prisma.quoteRequest.count({ where }),
  ]);
  return pageResult(items.map(({ service, budget, calculatorData, ...item }: DateRow & { service: string | null; budget: string | null; calculatorData: JsonValue } & Record<string, unknown>) => ({ ...item, ...calculatorFields(calculatorData, service), calculatedEstimate: budget, createdAt: item.createdAt.toISOString() })) as AdminPriceCalculatorLead[], total, query);
}

export async function listMeetupRequests(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminMeetupRequest>> {
  const prisma = adminDatabase();
  const where: WhereInput = {
    ...(query.status ? { status: query.status as EnquiryStatus } : {}),
    ...(query.search ? { OR: ["name", "email", "phone", "message"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.meetingRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, message: true, status: true, createdAt: true } }),
    prisma.meetingRequest.count({ where }),
  ]);
  return pageResult(items.map(({ message, ...item }: DateRow & { message: string } & Record<string, unknown>) => ({ ...item, company: null, topicSummary: textSummary(message), createdAt: item.createdAt.toISOString() })) as AdminMeetupRequest[], total, query);
}

export async function listCareerApplications(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminCareerApplication>> {
  const prisma = adminDatabase();
  const where: WhereInput = {
    ...(query.status ? { status: query.status as ApplicationStatus } : {}),
    ...(query.search ? { OR: ["candidateName", "email", "phone", "role", "experience", "message"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.careerApplication.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, candidateName: true, email: true, phone: true, role: true, experience: true, workLinks: true, message: true, status: true, createdAt: true } }),
    prisma.careerApplication.count({ where }),
  ]);
  return pageResult(items.map(({ message, ...item }: DateRow & { message: string } & Record<string, unknown>) => ({ ...item, messageSummary: textSummary(message), createdAt: item.createdAt.toISOString() })) as AdminCareerApplication[], total, query);
}

export async function listInternshipApplications(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminInternshipApplication>> {
  const prisma = adminDatabase();
  const where: WhereInput = {
    ...(query.status ? { status: query.status as ApplicationStatus } : {}),
    ...(query.enrolledInInstitute === "yes" ? { instituteEnrollment: "Yes" } : {}),
    ...(query.enrolledInInstitute === "no" ? { instituteEnrollment: "No" } : {}),
    ...(query.search ? { OR: ["candidateName", "email", "phone", "internshipSlug", "instituteName", "course", "state"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.internshipApplication.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, candidateName: true, email: true, phone: true, internshipSlug: true, instituteName: true, course: true, state: true, status: true, createdAt: true } }),
    prisma.internshipApplication.count({ where }),
  ]);
  return pageResult(items.map((item: DateRow & Record<string, unknown>) => ({ ...item, createdAt: item.createdAt.toISOString() })) as AdminInternshipApplication[], total, query);
}

export async function updateAdminSubmissionStatus(kind: AdminSubmissionKind, id: string, status: EnquiryStatus | ApplicationStatus, adminUserId: string) {
  return adminDatabase().$transaction(async (transaction: AdminTransaction) => {
    let previousStatus: string;
    if (kind === "contact-messages") {
      const existing = await transaction.contactEnquiry.findUnique({ where: { id }, select: { status: true } }); if (!existing) return null; previousStatus = existing.status;
      await transaction.contactEnquiry.update({ where: { id }, data: { status: status as EnquiryStatus } });
    } else if (kind === "project-requests" || kind === "price-calculator-leads") {
      const classification = kind === "project-requests" ? projectRequestWhere() : priceCalculatorWhere();
      const existing = await transaction.quoteRequest.findFirst({ where: { AND: [{ id }, classification] }, select: { status: true } }); if (!existing) return null; previousStatus = existing.status;
      await transaction.quoteRequest.update({ where: { id }, data: { status: status as EnquiryStatus } });
    } else if (kind === "meetup-requests") {
      const existing = await transaction.meetingRequest.findUnique({ where: { id }, select: { status: true } }); if (!existing) return null; previousStatus = existing.status;
      await transaction.meetingRequest.update({ where: { id }, data: { status: status as EnquiryStatus } });
    } else if (kind === "career-applications") {
      const existing = await transaction.careerApplication.findUnique({ where: { id }, select: { status: true } }); if (!existing) return null; previousStatus = existing.status;
      await transaction.careerApplication.update({ where: { id }, data: { status: status as ApplicationStatus } });
    } else {
      const existing = await transaction.internshipApplication.findUnique({ where: { id }, select: { status: true } }); if (!existing) return null; previousStatus = existing.status;
      await transaction.internshipApplication.update({ where: { id }, data: { status: status as ApplicationStatus } });
    }
    await transaction.auditLog.create({ data: { adminUserId, action: "ADMIN_SUBMISSION_STATUS_CHANGED", entityType: kind, entityId: id, metadata: { previousStatus, status } } });
    return { id, status };
  });
}
