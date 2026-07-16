import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";

const schema = readFileSync(
  resolve(
    __dirname,
    "../../../../../packages/database/prisma/schema.prisma",
  ),
  "utf8",
);
const migration = readFileSync(
  resolve(
    __dirname,
    "../../../../../packages/database/prisma/migrations/20260715193000_add_internship_confirmation_sequence/migration.sql",
  ),
  "utf8",
);

describe("internship confirmation persistence schema", () => {
  it("defines unique complete references and year-specific counters", () => {
    assert.match(schema, /confirmationReference\s+String\?\s+@unique/);
    assert.match(schema, /@@unique\(\[confirmationYear, confirmationSequence\]\)/);
    assert.match(schema, /model InternshipConfirmationSequence/);
    assert.match(schema, /year\s+Int\s+@id/);
    assert.match(migration, /confirmation_reference_key/);
    assert.match(migration, /confirmation_year_confirmation_sequence_key/);
    assert.match(migration, /confirmation_fields_complete_check/);
  });
});
