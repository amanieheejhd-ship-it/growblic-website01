import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { persistWebsiteForm, submitLead } from "./api";

const originalFetch = globalThis.fetch;
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "https://growblic-api.onrender.com"
).replace(/\/$/, "");

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function installStalledFetch() {
  let calls = 0;

  globalThis.fetch = ((_input: string | URL | Request, init?: RequestInit) => {
    calls += 1;

    return new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal;
      const rejectWithAbort = () =>
        reject(new DOMException("The operation was aborted.", "AbortError"));

      if (signal?.aborted) {
        rejectWithAbort();
        return;
      }

      signal?.addEventListener("abort", rejectWithAbort, { once: true });
    });
  }) as typeof fetch;

  return () => calls;
}

test("legacy lead delivery aborts once after its strict timeout", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const calls = installStalledFetch();
  const request = submitLead("/leads/start-project", {
    name: "Synthetic Test",
    message: "Synthetic timeout verification",
  });

  context.mock.timers.tick(10_000);

  await assert.rejects(request, { name: "AbortError" });
  assert.equal(calls(), 1);
});

test("website persistence aborts once instead of remaining locked", async (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const calls = installStalledFetch();
  const request = persistWebsiteForm("/api/quote-requests/", {
    submissionKey: "synthetic-timeout-test",
    name: "Synthetic Test",
    requirements: "Synthetic timeout verification",
  });

  context.mock.timers.tick(15_000);

  await assert.rejects(request, { name: "AbortError" });
  assert.equal(calls(), 1);
});

test("public forms send direct payloads to the configured NestJS endpoints", async () => {
  let requestedUrl = "";
  let requestInit: RequestInit | undefined;
  globalThis.fetch = (async (input, init) => {
    requestedUrl = String(input);
    requestInit = init;
    return Response.json(
      { success: true, message: "Thank you. Your request has been received." },
      { status: 201 },
    );
  }) as typeof fetch;

  const result = await persistWebsiteForm("/api/contact/", {
    submissionKey: "contact-static-test",
    name: "Synthetic Contact",
    email: "contact@example.com",
    message: "Synthetic static adapter request",
  });

  const headers = new Headers(requestInit?.headers);
  const payload = JSON.parse(String(requestInit?.body));

  assert.equal(requestedUrl, `${apiBaseUrl}/public-submissions/contact`);
  assert.equal(payload.submissionKey, "contact-static-test");
  assert.equal(payload.type, undefined);
  assert.equal(headers.get("authorization"), null);
  assert.equal(headers.get("apikey"), null);
  assert.equal(result.status, 201);
});

test("project and calculator requests use distinct backend endpoints", async () => {
  const urls: string[] = [];
  globalThis.fetch = (async (input) => {
    urls.push(String(input));
    return Response.json({ success: true }, { status: 201 });
  }) as typeof fetch;

  await persistWebsiteForm("/api/quote-requests/", {
    submissionKey: "project-static-test",
    name: "Synthetic Project",
    requirements: "Synthetic project request",
  });
  await persistWebsiteForm("/api/quote-requests/", {
    submissionKey: "calculator-static-test",
    name: "Synthetic Calculator",
    requirements: "Synthetic calculator request",
    calculatorData: { category: "Synthetic" },
  });

  assert.deepEqual(urls, [
    `${apiBaseUrl}/public-submissions/project-requests`,
    `${apiBaseUrl}/public-submissions/price-calculator`,
  ]);
});
