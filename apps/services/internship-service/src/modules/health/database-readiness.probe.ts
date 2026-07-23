import { Injectable, OnApplicationShutdown } from "@nestjs/common";

export const DATABASE_READINESS_PROBE = Symbol("DATABASE_READINESS_PROBE");

export interface ReadinessProbe {
  check(): Promise<void>;
}

type DatabaseModule = {
  Prisma: {
    sql(strings: TemplateStringsArray): unknown;
  };
  prisma: {
    $queryRaw(query: unknown): Promise<unknown>;
    $disconnect(): Promise<void>;
  };
};

function loadDatabasePackage() {
  return Promise.resolve().then(
    () => require("@growblic/database/client") as DatabaseModule,
  );
}

@Injectable()
export class DatabaseReadinessProbe implements ReadinessProbe, OnApplicationShutdown {
  private databaseModule: DatabaseModule | null = null;

  async check() {
    const database = await this.loadDatabase();
    await database.prisma.$queryRaw(database.Prisma.sql`SELECT 1`);
  }

  async onApplicationShutdown() {
    await this.databaseModule?.prisma.$disconnect();
  }

  private async loadDatabase() {
    this.databaseModule ??= await loadDatabasePackage();
    return this.databaseModule;
  }
}
