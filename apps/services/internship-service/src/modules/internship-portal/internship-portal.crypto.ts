import { createHash, createHmac, randomBytes } from "node:crypto";
import argon2 from "argon2";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
} as const;

export function normalizeApplicantEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashApplicantPassword(password: string) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyApplicantPassword(passwordHash: string | null | undefined, password: string) {
  if (!passwordHash) return false;
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}

export function generateApplicantSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashApplicantSessionToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function hashApplicantLoginIdentifier(value: string) {
  const pepper = process.env.APPLICANT_AUTH_PEPPER ?? process.env.ADMIN_AUTH_PEPPER;
  if (!pepper && process.env.NODE_ENV === "production") {
    throw new Error("APPLICANT_AUTH_PEPPER or ADMIN_AUTH_PEPPER is required.");
  }
  const localDevelopmentPepper = "growblic-local-applicant-auth-pepper";
  return createHmac("sha256", pepper ?? localDevelopmentPepper).update(value, "utf8").digest("hex");
}

export function safePublicId(value: string) {
  return value.replace(/[^a-z0-9_-]/gi, "").slice(0, 128);
}
