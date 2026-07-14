import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { persistWebsiteForm, submitLead } from "./api";

const originalFetch = globalThis.fetch;
const originalWebsiteSubmissionsUrl =
  process.env.NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalWebsiteSubmissionsUrl === undefined) {
    delete process.env.NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL;
  } else {
    process.env.NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL = originalWebsiteSubmissionsUrl;
  }
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

test("configured static builds send an explicit type envelope without privileged headers", async () => {
  const endpoint =
    "https://example.supabase.co/functions/v1/website-submissions";
  process.env.NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL = endpoint;

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

  await persistWebsiteForm("/api/contact/", {
    submissionKey: "contact-static-test",
    name: "Synthetic Contact",
    email: "contact@example.com",
    message: "Synthetic static adapter request",
  });

  const headers = new Headers(requestInit?.headers);
  const envelope = JSON.parse(String(requestInit?.body));

  assert.equal(requestedUrl, endpoint);
  assert.equal(envelope.type, "contact");
  assert.equal(envelope.payload.submissionKey, "contact-static-test");
  assert.equal(headers.get("authorization"), null);
  assert.equal(headers.get("apikey"), null);
});
