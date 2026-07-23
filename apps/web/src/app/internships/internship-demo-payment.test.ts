import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const panelSource = readFileSync(
  new URL("./InternshipFeePanel.tsx", import.meta.url),
  "utf8",
);

describe("temporary internship demo checkout UI", () => {
  it("adds only the requested small ₹1 demo action", () => {
    assert.match(panelSource, /Demo ₹1 Payment/);
    assert.match(panelSource, /Processing demo payment\.\.\./);
    assert.match(panelSource, /Demo payment successful\. ₹1 payment completed\./);
    assert.doesNotMatch(panelSource, />TEST MODE</);
  });

  it("uses secured backend demo completion while keeping the QR and checkout", () => {
    assert.match(panelSource, /demo-complete/);
    assert.match(panelSource, /x-payment-access-token/);
    assert.doesNotMatch(panelSource, /setFlow\("paid"\)/);
    assert.match(panelSource, /demoPaymentEnabled \? \(/);
    assert.match(panelSource, /disabled={!demoReady \|\| demoBusy \|\| paid}/);
    assert.match(panelSource, /shouldRenderPaymentQr\(flow\)/);
    assert.match(panelSource, /<QRCodeSVG/);
    assert.match(panelSource, /Open secure checkout/);
  });
});
