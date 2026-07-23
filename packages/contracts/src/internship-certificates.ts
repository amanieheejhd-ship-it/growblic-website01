export type InternshipCertificateStatus =
  | "PENDING_START_DATE"
  | "PENDING_SKILLS"
  | "READY"
  | "GENERATED"
  | "EMAILED"
  | "EMAIL_FAILED"
  | "CANCELLED";

export type InternshipCertificateListItem = {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  applicationReference: string;
  program: string;
  durationDays: number;
  joiningDate: string | null;
  completionDate: string | null;
  paymentStatus: string;
  status: InternshipCertificateStatus;
  daysRemaining: number | null;
  reminderStatus: string;
  skillsCompleted: boolean;
  emailStatus: string;
  emailedAt: string | null;
};

export type InternshipCertificateDraft = {
  domainRole: InternshipCertificateDomainRole;
  skills: string[];
  designation: string | null;
  projectWork: string | null;
  performanceSummary: string | null;
  conductNote: string | null;
  remarks: string | null;
};
import type { InternshipCertificateDomainRole } from "./internship-certificate-skills";
