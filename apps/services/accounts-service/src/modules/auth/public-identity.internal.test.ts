import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";

import { hashPublicUserSessionToken } from "./public-auth.crypto";
import type { PublicUserDatabase } from "./public-auth.database";
import { PublicIdentityInternalService } from "./public-identity.internal.service";

type Session = {
  tokenHash: string;
  accountId: string;
  revokedAt: Date | null;
  expiresAt: Date;
};
type Account = { id: string; emailNormalized: string; status: string };

function fakeDatabase(seed: {
  sessions?: Session[];
  accounts?: Account[];
}): PublicUserDatabase {
  const sessions = seed.sessions ?? [];
  const accounts = seed.accounts ?? [];
  const client = {
    publicUserSession: {
      findFirst: async ({ where }: { where: Record<string, any> }) =>
        sessions.find(
          (s) =>
            s.tokenHash === where.tokenHash &&
            s.revokedAt === null &&
            s.expiresAt > where.expiresAt.gt,
        ) ?? null,
    },
    publicUserAccount: {
      findUnique: async ({ where }: { where: { id: string } }) =>
        accounts.find((a) => a.id === where.id) ?? null,
    },
  };
  return { client: async () => client };
}

const TOKEN = "trusted-internal-token";
const future = new Date(Date.now() + 60_000);
const past = new Date(Date.now() - 60_000);

async function withToken<T>(
  value: string | undefined,
  run: () => Promise<T>,
): Promise<T> {
  const previous = process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
  if (value === undefined) delete process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
  else process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN = value;
  try {
    return await run();
  } finally {
    if (previous === undefined) delete process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
    else process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN = previous;
  }
}

describe("PublicIdentityInternalService", () => {
  it("fails closed (503) when the internal token is not configured", async () => {
    const service = new PublicIdentityInternalService(fakeDatabase({}));
    await withToken(undefined, () =>
      assert.rejects(service.resolve("anything", "session"), ServiceUnavailableException),
    );
  });

  it("rejects a wrong internal token (401), regardless of session validity", async () => {
    const service = new PublicIdentityInternalService(fakeDatabase({}));
    await withToken(TOKEN, () =>
      assert.rejects(service.resolve("wrong-token", "session"), UnauthorizedException),
    );
  });

  it("resolves the identity (id + normalized email) for a valid session", async () => {
    const sessionToken = "valid-session-token";
    const service = new PublicIdentityInternalService(
      fakeDatabase({
        sessions: [
          {
            tokenHash: hashPublicUserSessionToken(sessionToken),
            accountId: "acc_1",
            revokedAt: null,
            expiresAt: future,
          },
        ],
        accounts: [{ id: "acc_1", emailNormalized: "owner@example.test", status: "ACTIVE" }],
      }),
    );
    await withToken(TOKEN, async () => {
      const identity = await service.resolve(TOKEN, sessionToken);
      assert.deepEqual(identity, {
        authenticated: true,
        id: "acc_1",
        emailNormalized: "owner@example.test",
      });
    });
  });

  it("returns { authenticated: false } for unknown, revoked, or expired sessions", async () => {
    const revokedToken = "revoked-token";
    const expiredToken = "expired-token";
    const service = new PublicIdentityInternalService(
      fakeDatabase({
        sessions: [
          {
            tokenHash: hashPublicUserSessionToken(revokedToken),
            accountId: "acc_1",
            revokedAt: new Date(),
            expiresAt: future,
          },
          {
            tokenHash: hashPublicUserSessionToken(expiredToken),
            accountId: "acc_1",
            revokedAt: null,
            expiresAt: past,
          },
        ],
        accounts: [{ id: "acc_1", emailNormalized: "owner@example.test", status: "ACTIVE" }],
      }),
    );
    await withToken(TOKEN, async () => {
      assert.deepEqual(await service.resolve(TOKEN, "no-such-token"), { authenticated: false });
      assert.deepEqual(await service.resolve(TOKEN, revokedToken), { authenticated: false });
      assert.deepEqual(await service.resolve(TOKEN, expiredToken), { authenticated: false });
      assert.deepEqual(await service.resolve(TOKEN, ""), { authenticated: false });
    });
  });

  it("returns { authenticated: false } when the owning account is not ACTIVE", async () => {
    const sessionToken = "disabled-owner-token";
    const service = new PublicIdentityInternalService(
      fakeDatabase({
        sessions: [
          {
            tokenHash: hashPublicUserSessionToken(sessionToken),
            accountId: "acc_disabled",
            revokedAt: null,
            expiresAt: future,
          },
        ],
        accounts: [{ id: "acc_disabled", emailNormalized: "disabled@example.test", status: "DISABLED" }],
      }),
    );
    await withToken(TOKEN, async () => {
      assert.deepEqual(await service.resolve(TOKEN, sessionToken), { authenticated: false });
    });
  });
});
