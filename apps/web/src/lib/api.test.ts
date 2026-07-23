import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  fetchGrowblicApi,
  growblicApiUrl,
  LOCAL_BACKEND_CONNECTION_ERROR,
  persistWebsiteForm,
  submissionsApiUrl,
} from "./api";

const originalFetch = globalThis.fetch;
process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
process.env.NEXT_PUBLIC_SUBMISSIONS_API_URL = "http://localhost:4001";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const submissionsBaseUrl = process.env.NEXT_PUBLIC_SUBMISSIONS_API_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("API configuration fails clearly instead of using a placeholder fallback", () => {
  delete process.env.NEXT_PUBLIC_API_URL;
  assert.throws(() => growblicApiUrl("/health/live"), /NEXT_PUBLIC_API_URL/);
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
});

test("submissions fall back to the primary API origin for single-origin gateways", () => {
  delete process.env.NEXT_PUBLIC_SUBMISSIONS_API_URL;
  assert.equal(
    submissionsApiUrl("/public-submissions/contact"),
    `${apiBaseUrl}/public-submissions/contact`,
  );
  process.env.NEXT_PUBLIC_SUBMISSIONS_API_URL = "http://localhost:4001";
  assert.equal(
    submissionsApiUrl("/public-submissions/contact"),
    `${submissionsBaseUrl}/public-submissions/contact`,
  );
});

test("local backend network failures return an actionable safe message", async () => {
  globalThis.fetch = (async () => {
    throw new TypeError("Failed to fetch");
  }) as typeof fetch;
  await assert.rejects(fetchGrowblicApi("/health/live"), {
    message: LOCAL_BACKEND_CONNECTION_ERROR,
  });
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

  assert.equal(requestedUrl, `${submissionsBaseUrl}/public-submissions/contact`);
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
    `${submissionsBaseUrl}/public-submissions/project-requests`,
    `${submissionsBaseUrl}/public-submissions/price-calculator`,
  ]);
});
