// Prisma is loaded lazily so unit tests do not require a database connection.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminDatabase = any;

type DatabaseModule = {
  prisma: AdminDatabase;
  Prisma: { DbNull: unknown; JsonNull: unknown };
};

let databaseModule: DatabaseModule | null = null;

function loadDatabaseModule(): DatabaseModule {
  databaseModule ??= require("@growblic/database/client") as DatabaseModule;
  return databaseModule;
}

export function adminDatabase(): AdminDatabase {
  return loadDatabaseModule().prisma;
}

export function prismaJsonNulls() {
  const { Prisma } = loadDatabaseModule();
  return { DbNull: Prisma.DbNull, JsonNull: Prisma.JsonNull };
}
