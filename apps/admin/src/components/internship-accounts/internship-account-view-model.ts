// The applicant-account view model is shared with the backend admin module,
// which now builds these views server-side. The canonical implementation
// lives in @growblic/contracts; this module re-exports it for the admin UI.
export {
  authMethodLabel,
  certificateUnavailableReason,
  compactPaymentReference,
  compactReference,
  formatMoneyPaise,
  friendlyStatus,
  hasInstituteEnrollment,
  summarizeApplicantDownloads,
  visibleListText,
} from "@growblic/contracts";
export type {
  ApplicantAccountView,
  DocumentActionState,
  DocumentDownloadSummary,
} from "@growblic/contracts";
