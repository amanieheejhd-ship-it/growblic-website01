import { createHash, createHmac, randomBytes } from "node:crypto";
import argon2 from "argon2";

// Argon2id parameters — identical to the internship applicant portal so the
// public-user system meets the same hashing bar.
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
} as const;

// A pre-computed argon2id hash of a throwaway password. Verifying against this
// on the non-existent-user path keeps login timing constant (no user-enumeration
// via response time).
export const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$/I+xpvFZgN77kopLCg6MQw$LJkPQii2n+mjd5nWIBTdohqnUvbvHjB8qg6X8oR5GX4";

export function normalizePublicUserEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPublicUserPassword(password: string) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPublicUserPassword(
  passwordHash: string | null | undefined,
  password: string,
) {
  if (!passwordHash) return false;
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}

export function generatePublicUserSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashPublicUserSessionToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

// Peppered, keyed hash for throttle identifiers so raw emails/IPs are never
// stored. Requires PUBLIC_AUTH_PEPPER in production.
export function hashPublicUserLoginIdentifier(value: string) {
  const pepper = process.env.PUBLIC_AUTH_PEPPER;
  if (!pepper && process.env.NODE_ENV === "production") {
    throw new Error("PUBLIC_AUTH_PEPPER is required.");
  }
  const localDevelopmentPepper = "growblic-local-public-auth-pepper";
  return createHmac("sha256", pepper ?? localDevelopmentPepper)
    .update(value, "utf8")
    .digest("hex");
}
