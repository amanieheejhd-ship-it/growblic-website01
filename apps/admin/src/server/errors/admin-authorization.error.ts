export type AdminAuthorizationErrorCode = "UNAUTHENTICATED" | "FORBIDDEN";

export class AdminAuthorizationError extends Error {
  readonly code: AdminAuthorizationErrorCode;

  constructor(code: AdminAuthorizationErrorCode) {
    super(code === "UNAUTHENTICATED" ? "Admin authentication required." : "Admin role required.");
    this.name = "AdminAuthorizationError";
    this.code = code;
  }
}
