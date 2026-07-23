import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  certificateCanGenerate,
  certificateDates,
  certificateNumber,
  certificatePublicReference,
} from "./internship-certificate.core";

describe("internship certificate lifecycle rules", () => {
  for (const duration of [30, 45, 60, 90, 180]) {
    it(`counts the joining date as day one for ${duration} days`, () => {
      const dates = certificateDates(
        new Date("2026-07-25T17:00:00.000Z"),
        duration,
        5,
      );
      assert.equal(
        dates.completionDate.getTime() - dates.joiningDate.getTime(),
        (duration - 1) * 86_400_000,
      );
      assert.equal(
        dates.completionDate.getTime() - dates.reminderDueAt.getTime(),
        5 * 86_400_000,
      );
    });
  }

  it("allocates a year-aware certificate reference", () => {
    assert.equal(certificateNumber(2026, 1), "GB-CERT-2026-000001");
    assert.equal(certificateNumber(2027, 2), "GB-CERT-2027-000002");
  });

  it("generates an exact 12-character public reference", () => {
    const reference = certificatePublicReference(
      2026,
      Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7]),
    );
    assert.equal(reference.length, 12);
    assert.match(reference, /^GB[0-9]{2}[A-Z0-9]{8}$/);
    assert.equal(reference, "GB26ABCDEFGH");
  });

  it("supports distinct references across concurrent creation", async () => {
    const references = await Promise.all(
      Array.from({ length: 256 }, async (_, index) => certificatePublicReference(
        2026,
        Uint8Array.from([
          index >> 5,
          index & 31,
          0,
          1,
          2,
          3,
          4,
          5,
        ]),
      )),
    );
    assert.equal(new Set(references).size, references.length);
  });

  it("requires trusted paid, matching, completed, ready and skilled state", () => {
    const valid = {
      paymentStatus: "PAID",
      applicationMatches: true,
      joiningDate: new Date("2026-07-01T00:00:00.000Z"),
      completionDate: new Date("2026-07-30T00:00:00.000Z"),
      status: "READY",
      skillCount: 1,
      emailedAt: null,
      now: new Date("2026-07-30T00:00:00.000Z"),
    };
    assert.equal(certificateCanGenerate(valid), true);
    assert.equal(certificateCanGenerate({ ...valid, paymentStatus: "PENDING" }), false);
    assert.equal(certificateCanGenerate({ ...valid, applicationMatches: false }), false);
    assert.equal(certificateCanGenerate({ ...valid, skillCount: 0 }), false);
    assert.equal(
      certificateCanGenerate({
        ...valid,
        now: new Date("2026-07-29T23:59:59.999Z"),
      }),
      false,
    );
  });
});
