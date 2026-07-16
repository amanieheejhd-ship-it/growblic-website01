import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canContinueToInternshipPayment,
  shouldRevealInternshipPlans,
} from "./internship-application-flow";

describe("internship application frontend gate", () => {
  it("does not reveal plans when persistence fails or is not created", () => {
    assert.equal(shouldRevealInternshipPlans(400), false);
    assert.equal(shouldRevealInternshipPlans(500), false);
    assert.equal(shouldRevealInternshipPlans(200), false);
  });

  it("reveals plans only after successful 201 persistence", () => {
    assert.equal(shouldRevealInternshipPlans(201), true);
  });

  it("opens payment only after a plan and persisted application are present", () => {
    assert.equal(canContinueToInternshipPayment(null, "application-201"), false);
    assert.equal(canContinueToInternshipPayment(30, ""), false);
    assert.equal(canContinueToInternshipPayment(30, "   "), false);
    assert.equal(canContinueToInternshipPayment(30, "application-201"), true);
  });
});
