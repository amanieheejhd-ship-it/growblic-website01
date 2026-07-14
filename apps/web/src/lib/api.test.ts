import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { persistWebsiteForm, submitLead } from "./api";

const originalFetch = globalThis.fetch;

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
