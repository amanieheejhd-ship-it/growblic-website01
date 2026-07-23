import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  confirmationReference,
  JoiningDateError,
  parseJoiningDate,
} from "./internship-confirmation.core";

const trustedDates = {
  applicationCreatedAt: new Date("2026-07-13T08:00:00.000Z"),
  paidAt: new Date("2026-07-14T08:00:00.000Z"),
  now: new Date("2026-07-15T08:00:00.000Z"),
};

describe("internship confirmation issuance rules", () => {
  it("formats year-wise six-digit references", () => {
    assert.equal(confirmationReference(2026, 1), "GB-INT-2026-000001");
    assert.equal(confirmationReference(2026, 2), "GB-INT-2026-000002");
    assert.equal(confirmationReference(2027, 1), "GB-INT-2027-000001");
  });

  it("rejects missing, malformed, and impossible joining dates", () => {
    for (const value of [undefined, "", "25-07-2026", "2026-7-25"]) {
      assert.throws(
        () => parseJoiningDate(value, trustedDates),
        JoiningDateError,
      );
    }
    for (const value of ["2026-02-29", "2026-04-31", "2026-13-01"]) {
      assert.throws(
        () => parseJoiningDate(value, trustedDates),
        (error: unknown) =>
          error instanceof JoiningDateError && error.code === "IMPOSSIBLE",
      );
    }
  });

  it("rejects dates before payment and more than 365 days in the future", () => {
    assert.throws(
      () => parseJoiningDate("2026-07-13", trustedDates),
      (error: unknown) =>
        error instanceof JoiningDateError && error.code === "TOO_EARLY",
    );
    assert.throws(
      () => parseJoiningDate("2027-07-16", trustedDates),
      (error: unknown) =>
        error instanceof JoiningDateError &&
        error.code === "TOO_FAR_IN_FUTURE",
    );
  });

  it("accepts and normalizes a valid strict date", () => {
    assert.equal(
      parseJoiningDate("2026-07-25", trustedDates).toISOString(),
      "2026-07-25T00:00:00.000Z",
    );
  });
});
