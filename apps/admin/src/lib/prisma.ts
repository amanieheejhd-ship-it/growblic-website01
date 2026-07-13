import "server-only";

// Temporary Phase 2C bridge. Phase 2D moves the singleton and generated client
// into packages/database so both server applications import a real workspace package.
export { prisma } from "../../../web/src/lib/prisma";
