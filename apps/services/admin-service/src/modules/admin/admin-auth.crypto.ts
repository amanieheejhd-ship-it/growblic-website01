import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import argon2 from "argon2";

export { normalizeAdminEmail } from "@growblic/validation";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
} as const;

function getAdminAuthPepper() {
  const pepper = process.env.ADMIN_AUTH_PEPPER;

  if (!pepper) {
    throw new Error("ADMIN_AUTH_PEPPER environment variable is missing.");
  }

  return pepper;
}

export async function hashPassword(password: string) {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string) {
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}

export function generateSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function hashLoginIdentifier(value: string) {
  return createHmac("sha256", getAdminAuthPepper())
    .update(value, "utf8")
    .digest("hex");
}

export function safeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left, "utf8").digest();
  const rightDigest = createHash("sha256").update(right, "utf8").digest();

  return timingSafeEqual(leftDigest, rightDigest);
}
