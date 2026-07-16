import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const panelSource = readFileSync(
  new URL("./InternshipFeePanel.tsx", import.meta.url),
  "utf8",
);

describe("temporary internship demo checkout UI", () => {
  it("clearly labels test mode and the ₹1 demo action", () => {
    assert.match(panelSource, />TEST MODE</);
    assert.match(panelSource, /Demo payment only/);
    assert.match(panelSource, /Demo amount: ₹1/);
    assert.match(panelSource, /Pay ₹1 \(Demo\)/);
    assert.match(
      panelSource,
      /TEST MODE — No real payment will be charged\./,
    );
  });

  it("uses backend demo endpoints and keeps the real QR on the non-demo branch", () => {
    assert.match(panelSource, /internship-payments\/demo-sessions/);
    assert.match(panelSource, /demo-complete/);
    assert.match(panelSource, /x-payment-access-token/);
    assert.match(panelSource, /demoGatewayEnabled \? \(/);
    assert.match(
      panelSource,
      /shouldRenderRealPaymentQr\(flow, demoGatewayEnabled\)/,
    );
    assert.match(panelSource, /<QRCodeSVG/);
  });
});
