import "dotenv/config";

import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import {
  generateSessionToken,
  hashLoginIdentifier,
  hashPassword,
  hashSessionToken,
  normalizeAdminEmail,
  safeEqual,
  verifyPassword,
} from "../apps/web/src/server/auth/admin-auth.crypto";

async function main() {
  const password = "temporary-verification-password";
  const passwordHash = await hashPassword(password);

  assert.equal(await verifyPassword(passwordHash, password), true);
  assert.equal(await verifyPassword(passwordHash, `${password}-wrong`), false);

  const firstToken = generateSessionToken();
  const secondToken = generateSessionToken();
  const firstTokenHash = hashSessionToken(firstToken);

  assert.notEqual(firstToken, secondToken);
  assert.equal(firstTokenHash, hashSessionToken(firstToken));
  assert.notEqual(firstToken, firstTokenHash);
  assert.equal(safeEqual(firstTokenHash, hashSessionToken(firstToken)), true);
  assert.equal(
    normalizeAdminEmail("  ADMIN@Example.COM  "),
    "admin@example.com",
  );

  const previousPepper = process.env.ADMIN_AUTH_PEPPER;

  try {
    delete process.env.ADMIN_AUTH_PEPPER;
    assert.throws(() => hashLoginIdentifier("email:admin@example.com"));

    process.env.ADMIN_AUTH_PEPPER =
      previousPepper ?? randomBytes(32).toString("hex");
    const identifierHash = hashLoginIdentifier("email:admin@example.com");
    assert.equal(
      identifierHash,
      hashLoginIdentifier("email:admin@example.com"),
    );
  } finally {
    if (previousPepper === undefined) {
      delete process.env.ADMIN_AUTH_PEPPER;
    } else {
      process.env.ADMIN_AUTH_PEPPER = previousPepper;
    }
  }

  console.log("Admin authentication crypto verification passed.");
}

main().catch(() => {
  console.error("Admin authentication crypto verification failed.");
  process.exitCode = 1;
});
