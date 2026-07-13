import "server-only";

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
import { Prisma, prisma } from "@growblic/database";

export type SubmissionListQuery = {
  page: number;
  pageSize: number;
  status: string | null;
  search: string;
};

const priceCalculatorWhere: Prisma.QuoteRequestWhereInput = {
  OR: [
    { source: "price-calculator" },
    {
      AND: [
        { source: null },
        { calculatorData: { not: Prisma.DbNull } },
        { calculatorData: { not: Prisma.JsonNull } },
      ],
    },
  ],
};
const projectRequestWhere: Prisma.QuoteRequestWhereInput = { NOT: priceCalculatorWhere };

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

function calculatorFields(value: Prisma.JsonValue | null, fallbackCategory: string | null) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      projectCategory: fallbackCategory,
      selectedOptionsSummary: "No structured options available.",
      calculatorDetailsSummary: fallbackCategory ?? "Calculator submission",
    };
  }
  const object = value as Record<string, Prisma.JsonValue>;
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
  const [
    contactTotal, contactPending, projectTotal, projectPending, calculatorTotal, calculatorPending,
    meetupTotal, meetupPending, careerTotal, careerPending, internshipTotal, internshipPending,
  ] = await Promise.all([
    prisma.contactEnquiry.count(),
    prisma.contactEnquiry.count({ where: { status: "NEW" } }),
    prisma.quoteRequest.count({ where: projectRequestWhere }),
    prisma.quoteRequest.count({ where: { AND: [projectRequestWhere, { status: "NEW" }] } }),
    prisma.quoteRequest.count({ where: priceCalculatorWhere }),
    prisma.quoteRequest.count({ where: { AND: [priceCalculatorWhere, { status: "NEW" }] } }),
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

export async function listContactMessages(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminContactMessage>> {
  const where: Prisma.ContactEnquiryWhereInput = {
    ...(query.status ? { status: query.status as EnquiryStatus } : {}),
    ...(query.search ? { OR: ["name", "email", "phone", "company", "service", "message"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.contactEnquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, company: true, service: true, message: true, status: true, createdAt: true } }),
    prisma.contactEnquiry.count({ where }),
  ]);
  return pageResult(items.map(({ message, ...item }) => ({ ...item, messageSummary: textSummary(message), createdAt: item.createdAt.toISOString() })), total, query);
}

function quoteSearch(query: SubmissionListQuery): Prisma.QuoteRequestWhereInput {
  return {
    ...(query.status ? { status: query.status as EnquiryStatus } : {}),
    ...(query.search ? { OR: ["name", "email", "phone", "company", "service", "requirements"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
}

export async function listProjectRequests(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminProjectRequest>> {
  const where: Prisma.QuoteRequestWhereInput = { AND: [projectRequestWhere, quoteSearch(query)] };
  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, company: true, service: true, budget: true, requirements: true, status: true, createdAt: true } }),
    prisma.quoteRequest.count({ where }),
  ]);
  return pageResult(items.map(({ requirements, ...item }) => ({ ...item, timeline: null, requirementsSummary: textSummary(requirements), createdAt: item.createdAt.toISOString() })), total, query);
}

export async function listPriceCalculatorLeads(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminPriceCalculatorLead>> {
  const where: Prisma.QuoteRequestWhereInput = { AND: [priceCalculatorWhere, quoteSearch(query)] };
  const [items, total] = await Promise.all([
    prisma.quoteRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, service: true, budget: true, calculatorData: true, status: true, createdAt: true } }),
    prisma.quoteRequest.count({ where }),
  ]);
  return pageResult(items.map(({ service, budget, calculatorData, ...item }) => ({ ...item, ...calculatorFields(calculatorData, service), calculatedEstimate: budget, createdAt: item.createdAt.toISOString() })), total, query);
}

export async function listMeetupRequests(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminMeetupRequest>> {
  const where: Prisma.MeetingRequestWhereInput = {
    ...(query.status ? { status: query.status as EnquiryStatus } : {}),
    ...(query.search ? { OR: ["name", "email", "phone", "message"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.meetingRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, name: true, email: true, phone: true, message: true, status: true, createdAt: true } }),
    prisma.meetingRequest.count({ where }),
  ]);
  return pageResult(items.map(({ message, ...item }) => ({ ...item, company: null, topicSummary: textSummary(message), createdAt: item.createdAt.toISOString() })), total, query);
}

export async function listCareerApplications(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminCareerApplication>> {
  const where: Prisma.CareerApplicationWhereInput = {
    ...(query.status ? { status: query.status as ApplicationStatus } : {}),
    ...(query.search ? { OR: ["candidateName", "email", "phone", "role", "experience", "message"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.careerApplication.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, candidateName: true, email: true, phone: true, role: true, experience: true, workLinks: true, message: true, status: true, createdAt: true } }),
    prisma.careerApplication.count({ where }),
  ]);
  return pageResult(items.map(({ message, ...item }) => ({ ...item, messageSummary: textSummary(message), createdAt: item.createdAt.toISOString() })), total, query);
}

export async function listInternshipApplications(query: SubmissionListQuery): Promise<AdminSubmissionPage<AdminInternshipApplication>> {
  const where: Prisma.InternshipApplicationWhereInput = {
    ...(query.status ? { status: query.status as ApplicationStatus } : {}),
    ...(query.search ? { OR: ["candidateName", "email", "phone", "internshipSlug", "instituteName", "course", "state"].map((field) => ({ [field]: { contains: query.search, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.internshipApplication.findMany({ where, orderBy: { createdAt: "desc" }, skip: offset(query), take: query.pageSize, select: { id: true, candidateName: true, email: true, phone: true, internshipSlug: true, instituteName: true, course: true, state: true, status: true, createdAt: true } }),
    prisma.internshipApplication.count({ where }),
  ]);
  return pageResult(items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })), total, query);
}

export async function updateAdminSubmissionStatus(kind: AdminSubmissionKind, id: string, status: EnquiryStatus | ApplicationStatus, adminUserId: string) {
  return prisma.$transaction(async (transaction) => {
    let previousStatus: string;
    if (kind === "contact-messages") {
      const existing = await transaction.contactEnquiry.findUnique({ where: { id }, select: { status: true } }); if (!existing) return null; previousStatus = existing.status;
      await transaction.contactEnquiry.update({ where: { id }, data: { status: status as EnquiryStatus } });
    } else if (kind === "project-requests" || kind === "price-calculator-leads") {
      const classification = kind === "project-requests" ? projectRequestWhere : priceCalculatorWhere;
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
