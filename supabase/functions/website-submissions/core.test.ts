import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  createWebsiteSubmissionsHandler,
  type SubmissionWrite,
  type SubmissionWriter,
} from "./core";

const ORIGIN = "https://amanieheejhd-ship-it.github.io";

const validSubmissions = {
  contact: {
    submissionKey: "contact-test-001",
    name: "Synthetic Contact",
    email: "contact@example.com",
    message: "Synthetic contact request",
  },
  "project-request": {
    submissionKey: "project-test-001",
    name: "Synthetic Project",
    requirements: "Synthetic project request",
    source: "start-project-page",
  },
  "price-calculator": {
    submissionKey: "calculator-test-001",
    name: "Synthetic Calculator",
    requirements: "Synthetic calculator request",
    source: "price-calculator",
    calculatorData: { category: "Synthetic", selectedOptions: ["Synthetic option"] },
  },
  "meetup-request": {
    submissionKey: "meetup-test-001",
    name: "Synthetic Meetup",
    message: "Synthetic meetup request",
    source: "meetup-page",
  },
  "career-application": {
    submissionKey: "career-test-001",
    fullName: "Synthetic Candidate",
    email: "career@example.com",
    phone: "9000000000",
    role: "Frontend Developer",
    experience: "1-3 years",
    workLinks: ["https://example.com/portfolio"],
    message: "Synthetic career application",
  },
  "internship-application": {
    submissionKey: "internship-test-001",
    internshipSlug: "frontend-developer",
    fullName: "Synthetic Intern",
    email: "intern@example.com",
    phone: "9000000000",
    state: "Delhi",
    instituteEnrollment: "Yes",
    instituteName: "Synthetic Institute",
    course: "BCA",
    enrollmentNumber: "SYNTHETIC-001",
    message: "Synthetic internship application",
  },
} as const;

function request(
  body: unknown,
  options: { origin?: string; method?: string; contentType?: string; raw?: boolean } = {},
) {
  const headers = new Headers({
    Origin: options.origin ?? ORIGIN,
    "Content-Type": options.contentType ?? "application/json",
  });

  return new Request("https://example.supabase.co/functions/v1/website-submissions", {
    method: options.method ?? "POST",
    headers,
    body:
      (options.method ?? "POST") === "POST"
        ? options.raw
          ? String(body)
          : JSON.stringify(body)
        : undefined,
  });
}

function recordingWriter() {
  const writes: SubmissionWrite[] = [];
  const write: SubmissionWriter = async (submission) => {
    writes.push(submission);
  };

  return { write, writes };
}

describe("website submissions Edge Function", () => {
  test("accepts and maps all six explicit submission types", async (context) => {
    const expectedTables = {
      contact: "contact_enquiries",
      "project-request": "quote_requests",
      "price-calculator": "quote_requests",
      "meetup-request": "meeting_requests",
      "career-application": "career_applications",
      "internship-application": "internship_applications",
    } as const;

    for (const [type, payload] of Object.entries(validSubmissions)) {
      await context.test(type, async () => {
        const { write, writes } = recordingWriter();
        const handler = createWebsiteSubmissionsHandler({ write });
        const response = await handler(request({ type, payload }));
        const data = await response.json();

        assert.equal(response.status, 201);
        assert.equal(data.success, true);
        assert.equal(writes.length, 1);
        assert.equal(writes[0].table, expectedTables[type as keyof typeof expectedTables]);
      });
    }
  });

  test("rejects validation failures without writing", async () => {
    const { write, writes } = recordingWriter();
    const handler = createWebsiteSubmissionsHandler({ write });
    const response = await handler(
      request({
        type: "project-request",
        payload: { ...validSubmissions["project-request"], submissionKey: "bad key" },
      }),
    );

    assert.equal(response.status, 400);
    assert.equal(writes.length, 0);
  });

  test("rejects malformed JSON", async () => {
    const { write, writes } = recordingWriter();
    const handler = createWebsiteSubmissionsHandler({ write });
    const response = await handler(request("{", { raw: true }));

    assert.equal(response.status, 400);
    assert.equal(writes.length, 0);
  });

  test("returns generic success for the honeypot without writing", async () => {
    const { write, writes } = recordingWriter();
    const handler = createWebsiteSubmissionsHandler({ write });
    const response = await handler(
      request({
        type: "contact",
        payload: { website: "filled-by-bot" },
      }),
    );

    assert.equal(response.status, 201);
    assert.equal((await response.json()).success, true);
    assert.equal(writes.length, 0);
  });

  test("preserves idempotency for duplicate submission keys", async () => {
    const storedKeys = new Set<string>();
    const write: SubmissionWriter = async ({ row, conflictColumn }) => {
      storedKeys.add(String(row[conflictColumn]));
    };
    const handler = createWebsiteSubmissionsHandler({ write });
    const envelope = {
      type: "project-request",
      payload: validSubmissions["project-request"],
    };

    const first = await handler(request(envelope));
    const duplicate = await handler(request(envelope));

    assert.equal(first.status, 201);
    assert.equal(duplicate.status, 201);
    assert.equal(storedKeys.size, 1);
  });

  test("rejects an unauthorized origin without CORS access", async () => {
    const { write, writes } = recordingWriter();
    const handler = createWebsiteSubmissionsHandler({ write });
    const response = await handler(
      request(
        { type: "contact", payload: validSubmissions.contact },
        { origin: "https://attacker.example" },
      ),
    );

    assert.equal(response.status, 403);
    assert.equal(response.headers.get("access-control-allow-origin"), null);
    assert.equal(writes.length, 0);
  });

  test("handles an allowed CORS preflight without credentials or a wildcard", async () => {
    const { write } = recordingWriter();
    const handler = createWebsiteSubmissionsHandler({ write });
    const response = await handler(request(null, { method: "OPTIONS" }));

    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), ORIGIN);
    assert.equal(response.headers.get("access-control-allow-credentials"), null);
  });

  test("accepts local development origins", async () => {
    const { write } = recordingWriter();
    const handler = createWebsiteSubmissionsHandler({ write });
    const response = await handler(
      request(
        { type: "contact", payload: validSubmissions.contact },
        { origin: "http://localhost:3101" },
      ),
    );

    assert.equal(response.status, 201);
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:3101");
  });

  test("returns a generic response for database errors", async () => {
    const handler = createWebsiteSubmissionsHandler({
      write: async () => {
        throw new Error("sensitive database detail");
      },
    });
    const response = await handler(
      request({ type: "contact", payload: validSubmissions.contact }),
    );
    const data = await response.json();

    assert.equal(response.status, 500);
    assert.equal(data.message, "Unable to submit your request right now.");
    assert.doesNotMatch(JSON.stringify(data), /sensitive database detail/);
  });

  test("requires POST with JSON", async () => {
    const { write, writes } = recordingWriter();
    const handler = createWebsiteSubmissionsHandler({ write });
    const getResponse = await handler(request(null, { method: "GET" }));
    const textResponse = await handler(
      request("plain text", { raw: true, contentType: "text/plain" }),
    );

    assert.equal(getResponse.status, 405);
    assert.equal(textResponse.status, 415);
    assert.equal(writes.length, 0);
  });
});
