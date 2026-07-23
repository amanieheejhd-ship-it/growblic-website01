import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GENERIC_PASSWORD_RESET_MESSAGE,
  PASSWORD_MIN_LENGTH,
  readCredentials,
  readEmailOnly,
  readProfileUpdate,
  readRegistration,
  readResetCredentials,
} from "./public-auth.core";
import {
  DUMMY_PASSWORD_HASH,
  hashPublicUserLoginIdentifier,
  hashPublicUserPassword,
  hashPublicUserSessionToken,
  generatePublicUserSessionToken,
  normalizePublicUserEmail,
  verifyPublicUserPassword,
} from "./public-auth.crypto";

describe("public-auth crypto", () => {
  it("hashes passwords with argon2id and verifies them", async () => {
    const hash = await hashPublicUserPassword("correct horse battery");
    assert.match(hash, /^\$argon2id\$/);
    assert.equal(await verifyPublicUserPassword(hash, "correct horse battery"), true);
    assert.equal(await verifyPublicUserPassword(hash, "wrong password 12345"), false);
    assert.equal(await verifyPublicUserPassword(null, "anything"), false);
  });

  it("ships a real argon2id dummy hash for the constant-time login path", async () => {
    assert.match(DUMMY_PASSWORD_HASH, /^\$argon2id\$/);
    // Verifying a wrong password against the dummy must return false (not throw).
    assert.equal(await verifyPublicUserPassword(DUMMY_PASSWORD_HASH, "whatever"), false);
  });

  it("stores session tokens only as a deterministic sha256 hex", () => {
    const token = generatePublicUserSessionToken();
    const hash = hashPublicUserSessionToken(token);
    assert.match(hash, /^[0-9a-f]{64}$/);
    assert.equal(hash, hashPublicUserSessionToken(token));
    assert.notEqual(token, hash);
  });

  it("normalizes emails and peppers throttle identifiers deterministically", () => {
    assert.equal(normalizePublicUserEmail("  User@Example.COM "), "user@example.com");
    const a = hashPublicUserLoginIdentifier("public-user-email:user@example.com");
    const b = hashPublicUserLoginIdentifier("public-user-email:user@example.com");
    const c = hashPublicUserLoginIdentifier("public-user-email:other@example.com");
    assert.equal(a, b);
    assert.notEqual(a, c);
    assert.match(a, /^[0-9a-f]{64}$/);
  });
});

describe("public-auth validation", () => {
  it("requires a valid email and a 12+ char password", () => {
    assert.equal(PASSWORD_MIN_LENGTH, 12);
    assert.throws(() => readCredentials({ email: "nope", password: "longenoughpass" }), /valid email/i);
    assert.throws(() => readCredentials({ email: "a@b.co", password: "short" }), /at least 12/i);
    const ok = readCredentials({ email: " A@B.co ", password: "abcdefghijkl" });
    assert.equal(ok.emailNormalized, "a@b.co");
    assert.equal(ok.emailDisplay, "A@B.co");
  });

  it("reads optional display name on registration", () => {
    const reg = readRegistration({ email: "a@b.co", password: "abcdefghijkl", displayName: "  Jane  Doe " });
    assert.equal(reg.displayName, "Jane Doe");
    const noName = readRegistration({ email: "a@b.co", password: "abcdefghijkl" });
    assert.equal(noName.displayName, null);
  });

  it("reads email-only + reset credentials", () => {
    assert.equal(readEmailOnly({ email: "X@Y.io" }), "x@y.io");
    assert.throws(() => readResetCredentials({ token: "", password: "abcdefghijkl" }), /invalid or expired/i);
    assert.throws(() => readResetCredentials({ token: "t", password: "short" }), /at least 12/i);
    const ok = readResetCredentials({ token: "tok", password: "abcdefghijkl" });
    assert.deepEqual(ok, { token: "tok", password: "abcdefghijkl" });
  });

  it("validates profile updates and rejects empty payloads", () => {
    assert.throws(() => readProfileUpdate({}), /No profile fields/i);
    const update = readProfileUpdate({ displayName: "Jane", phone: "+91 90000 00000", company: "Growblic", fullName: "" });
    assert.equal(update.displayName, "Jane");
    assert.equal(update.company, "Growblic");
    assert.equal(update.fullName, null);
    assert.throws(() => readProfileUpdate({ phone: "abc" }), /valid phone/i);
  });

  it("exposes a single enumeration-safe reset message", () => {
    assert.match(GENERIC_PASSWORD_RESET_MESSAGE, /if an account exists/i);
  });
});
