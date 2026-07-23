import { Injectable } from "@nestjs/common";

// Prisma is loaded lazily (and externalised in webpack) so unit/HTTP tests can
// override this provider with an in-memory fake and never touch a database.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublicUserDatabaseClient = any;

export const PUBLIC_USER_DATABASE = Symbol("PUBLIC_USER_DATABASE");

export interface PublicUserDatabase {
  client(): Promise<PublicUserDatabaseClient>;
}

@Injectable()
export class PrismaPublicUserDatabase implements PublicUserDatabase {
  private databaseModule: { prisma: PublicUserDatabaseClient } | null = null;

  async client() {
    this.databaseModule ??= require("@growblic/database/client") as {
      prisma: PublicUserDatabaseClient;
    };
    return this.databaseModule.prisma;
  }
}
