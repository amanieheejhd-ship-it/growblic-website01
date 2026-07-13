import type { AdminLoginRequest } from "@growblic/contracts";

export function normalizeAdminEmail(email: string) {
  return email.normalize("NFKC").trim().toLowerCase();
}

export type AdminLoginValidationResult =
  | { success: true; data: AdminLoginRequest }
  | { success: false };

export function validateAdminLogin(
  input: AdminLoginRequest,
  minimumPasswordLength: number,
): AdminLoginValidationResult {
  const email = normalizeAdminEmail(input.email);
  if (
    email.length === 0 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    input.password.length < minimumPasswordLength ||
    input.password.length > 1_024
  ) {
    return { success: false };
  }
  return { success: true, data: { email, password: input.password } };
}
