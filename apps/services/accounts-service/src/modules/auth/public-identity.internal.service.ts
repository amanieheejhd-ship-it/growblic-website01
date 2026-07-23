import {
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { createHash, timingSafeEqual } from "node:crypto";

import { hashPublicUserSessionToken } from "./public-auth.crypto";
import {
  PUBLIC_USER_DATABASE,
  type PublicUserDatabase,
} from "./public-auth.database";

// Both sides are SHA-256-digested first so the comparison length is fixed
// regardless of the raw token lengths — mirrors the established internal-token
// pattern in internship-service (constantTimeEqual + sha256).
function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function constantTimeEqual(expected: string, received: string) {
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(received, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

export type PublicUserIdentity =
  | { authenticated: false }
  | { authenticated: true; id: string; emailNormalized: string };

// Resolves the canonical identity that OWNS a public session, for trusted
// server-to-server callers only. The email is derived HERE from the validated
// session — never from any caller-supplied value — which is the property that
// makes the SSO bridge safe: a caller can only ever learn the identity behind a
// session token it already holds, and can never assert an arbitrary email.
@Injectable()
export class PublicIdentityInternalService {
  constructor(
    @Inject(PUBLIC_USER_DATABASE) private readonly db: PublicUserDatabase,
  ) {}

  // Validate the shared internal token (constant-time). Fails CLOSED: 503 when
  // the token is unset (bridge not configured), 401 on mismatch.
  private authorize(suppliedToken: string) {
    const expected = process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN?.trim();
    if (!expected) throw new ServiceUnavailableException();
    if (
      !suppliedToken ||
      !constantTimeEqual(sha256Hex(expected), sha256Hex(suppliedToken))
    ) {
      throw new UnauthorizedException();
    }
  }

  async resolve(
    internalToken: string,
    sessionToken: string,
  ): Promise<PublicUserIdentity> {
    this.authorize(internalToken);
    if (!sessionToken || sessionToken.length > 256) {
      return { authenticated: false };
    }
    const now = new Date();
    const database = await this.db.client();
    const sessionRow = await database.publicUserSession.findFirst({
      where: {
        tokenHash: hashPublicUserSessionToken(sessionToken),
        revokedAt: null,
        expiresAt: { gt: now },
      },
    });
    if (!sessionRow) return { authenticated: false };
    const account = await database.publicUserAccount.findUnique({
      where: { id: sessionRow.accountId },
    });
    if (!account || account.status !== "ACTIVE") {
      return { authenticated: false };
    }
    return {
      authenticated: true,
      id: account.id,
      emailNormalized: account.emailNormalized,
    };
  }
}
