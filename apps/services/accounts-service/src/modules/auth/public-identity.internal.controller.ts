import { Controller, Get, Header, Headers } from "@nestjs/common";

import { PublicIdentityInternalService } from "./public-identity.internal.service";

// INTERNAL, server-to-server ONLY. Never exposed through the public gateway —
// nginx blocks /internal/* with 403. The trusted caller (internship-service's
// SSO bridge) presents the shared token AND the public session token as
// headers; the identity is derived from the validated session, so a caller can
// never assert an arbitrary email.
@Controller("internal/public-user-identity")
export class PublicIdentityInternalController {
  constructor(private readonly identity: PublicIdentityInternalService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  resolve(
    @Headers("x-public-identity-internal-token") token = "",
    @Headers("x-public-session-token") sessionToken = "",
  ) {
    return this.identity.resolve(token, sessionToken);
  }
}
