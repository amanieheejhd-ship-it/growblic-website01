import { Module } from "@nestjs/common";

import { PublicAuthController } from "./public-auth.controller";
import { PublicAuthEmailProvider } from "./public-auth.email";
import { PublicAuthService } from "./public-auth.service";
import {
  PrismaPublicUserDatabase,
  PUBLIC_USER_DATABASE,
} from "./public-auth.database";
import { PublicIdentityInternalController } from "./public-identity.internal.controller";
import { PublicIdentityInternalService } from "./public-identity.internal.service";

@Module({
  controllers: [PublicAuthController, PublicIdentityInternalController],
  providers: [
    PublicAuthService,
    PublicAuthEmailProvider,
    PublicIdentityInternalService,
    PrismaPublicUserDatabase,
    { provide: PUBLIC_USER_DATABASE, useExisting: PrismaPublicUserDatabase },
  ],
})
export class PublicAuthModule {}
