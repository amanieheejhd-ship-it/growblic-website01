import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  initialConfirmationModalState,
  nextConfirmationModal,
  validJoiningDateInput,
} from "./internship-confirmation-download";

const componentSource = readFileSync(
  new URL("./InternshipConfirmationFlow.tsx", import.meta.url),
  "utf8",
);
const panelSource = readFileSync(
  new URL("./InternshipFeePanel.tsx", import.meta.url),
  "utf8",
);

describe("internship confirmation download UI", () => {
  it("contains the joining-date modal and no browser PDF preview", () => {
    assert.match(
      componentSource,
      /Download Internship Confirmation Letter \(PDF\)/,
    );
    assert.match(componentSource, /Select Date of Joining/);
    assert.match(componentSource, /Date of Joining \*/);
    assert.match(componentSource, /Download PDF/);
    assert.doesNotMatch(componentSource, /<section\b|<footer\b|<Image\b|<canvas\b/);
    assert.doesNotMatch(
      componentSource,
      /Candidate Details|Authorized Signatory|Ref No:|watermark|data\./,
    );
  });

  it("opens on action and blocks empty, malformed, or impossible dates", () => {
    const opened = nextConfirmationModal(initialConfirmationModalState, {
      type: "open",
    });
    assert.equal(opened.open, true);
    assert.equal(validJoiningDateInput(""), false);
    assert.equal(validJoiningDateInput("2026-7-25"), false);
    assert.equal(validJoiningDateInput("2026-02-29"), false);
    assert.strictEqual(
      nextConfirmationModal(opened, { type: "submit-started" }),
      opened,
    );
  });

  it("closes only after success, keeps errors open, and blocks duplicate submits", () => {
    const opened = nextConfirmationModal(initialConfirmationModalState, {
      type: "open",
    });
    const dated = nextConfirmationModal(opened, {
      type: "date-changed",
      value: "2026-07-25",
    });
    const submitting = nextConfirmationModal(dated, {
      type: "submit-started",
    });
    assert.equal(submitting.busy, true);
    assert.strictEqual(
      nextConfirmationModal(submitting, { type: "submit-started" }),
      submitting,
    );

    const failed = nextConfirmationModal(submitting, {
      type: "download-failed",
      error: "Request failed",
    });
    assert.equal(failed.open, true);
    assert.equal(failed.error, "Request failed");

    const retried = nextConfirmationModal(failed, { type: "submit-started" });
    const succeeded = nextConfirmationModal(retried, {
      type: "download-succeeded",
    });
    assert.equal(succeeded.open, false);
    assert.equal(succeeded.busy, false);
  });

  it("posts only the joining date and downloads the successful PDF response", () => {
    assert.match(panelSource, /method: "POST"/);
    assert.match(panelSource, /body: JSON\.stringify\(\{ joiningDate \}\)/);
    assert.match(panelSource, /anchor\.click\(\)/);
  });
});
