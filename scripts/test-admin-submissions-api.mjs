import { randomUUID } from "node:crypto";

const adminBaseUrl = (process.env.ADMIN_AUTH_BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const webBaseUrl = (process.env.WEBSITE_FORMS_BASE_URL || "http://127.0.0.1:3002").replace(/\/$/, "");
const email = process.env.ADMIN_AUTH_TEST_EMAIL?.trim();
const password = process.env.ADMIN_AUTH_TEST_PASSWORD;
const endpoints = ["contact-messages", "project-requests", "price-calculator-leads", "meetup-requests", "career-applications", "internship-applications"];
const safeFields = {
  "contact-messages": ["company", "createdAt", "email", "id", "messageSummary", "name", "phone", "service", "status"],
  "project-requests": ["budget", "company", "createdAt", "email", "id", "name", "phone", "requirementsSummary", "service", "status", "timeline"],
  "price-calculator-leads": ["calculatedEstimate", "calculatorDetailsSummary", "createdAt", "email", "id", "name", "phone", "projectCategory", "selectedOptionsSummary", "status"],
  "meetup-requests": ["company", "createdAt", "email", "id", "name", "phone", "status", "topicSummary"],
  "career-applications": ["candidateName", "createdAt", "email", "experience", "id", "messageSummary", "phone", "role", "status", "workLinks"],
  "internship-applications": ["candidateName", "course", "createdAt", "email", "id", "instituteName", "internshipSlug", "phone", "state", "status"],
};
function assert(condition, message) { if (!condition) throw new Error(message); }
async function request(base, path, options = {}) { const response = await fetch(`${base}${path}`, { ...options, redirect: "manual" }); const data = await response.json().catch(() => null); return { response, data }; }
function cookie(response) { const values = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [response.headers.get("set-cookie")].filter(Boolean); const header = values.find((value) => value.toLowerCase().startsWith("growblic_admin_session=")); assert(header, "Login did not establish a session."); return header.split(";", 1)[0]; }
function assertSafe(kind, item) { assert(item && typeof item === "object", `${kind} item was invalid.`); assert(JSON.stringify(Object.keys(item).sort()) === JSON.stringify([...safeFields[kind]].sort()), `${kind} exposed unexpected fields.`); }

async function main() {
  for (const endpoint of endpoints) { const result = await request(adminBaseUrl, `/api/${endpoint}/`); assert(result.response.status === 401, `${endpoint} unauthenticated access did not return 401.`); }
  console.log("PASS unauthenticated access: all six endpoints returned 401");
  if (!email || !password) throw new Error("Admin integration test credentials are required.");
  const login = await request(adminBaseUrl, "/api/auth/login/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  assert(login.response.status === 200, "Admin login failed.");
  const headers = { Cookie: cookie(login.response) };
  const malformed = await request(adminBaseUrl, "/api/project-requests/?page=zero", { headers });
  assert(malformed.response.status === 400, "Malformed pagination did not return 400.");
  console.log("PASS malformed pagination: 400");
  for (const endpoint of endpoints) { const result = await request(adminBaseUrl, `/api/${endpoint}/?pageSize=5`, { headers }); assert(result.response.status === 200 && result.data?.success === true && Array.isArray(result.data.items), `${endpoint} list failed.`); if (result.data.items[0]) assertSafe(endpoint, result.data.items[0]); }
  console.log("PASS authenticated lists: all six endpoints returned safe fields");
  const dashboard = await request(adminBaseUrl, "/api/dashboard/summary/", { headers });
  assert(dashboard.response.status === 200 && dashboard.data?.success === true, "Dashboard summary failed.");
  for (const endpoint of endpoints) { const count = dashboard.data.counts?.[endpoint]; assert(Number.isInteger(count?.total) && Number.isInteger(count?.pending), "Dashboard summary count was invalid."); }
  console.log("PASS dashboard summary: numeric total and pending counts");

  const marker = `admin-submissions-test-${randomUUID()}`;
  const projectCreate = await request(webBaseUrl, "/api/quote-requests/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionKey: `${marker}-project`, name: "Synthetic Project Request Test", requirements: marker, source: "start-project-page" }) });
  const calculatorCreate = await request(webBaseUrl, "/api/quote-requests/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionKey: `${marker}-calculator`, name: "Synthetic Calculator Lead Test", requirements: marker, source: "price-calculator", calculatorData: { category: "Synthetic", selectedOptions: ["Synthetic option"] } }) });
  assert(projectCreate.response.status === 201 && calculatorCreate.response.status === 201, "Synthetic classification records could not be created.");
  const projectList = await request(adminBaseUrl, `/api/project-requests/?search=${encodeURIComponent(marker)}`, { headers });
  const calculatorList = await request(adminBaseUrl, `/api/price-calculator-leads/?search=${encodeURIComponent(marker)}`, { headers });
  assert(projectList.data?.items?.length === 1 && calculatorList.data?.items?.length === 1, "QuoteRequest classification counts were invalid.");
  assert(projectList.data.items[0].id !== calculatorList.data.items[0].id, "Project and calculator classifications overlapped.");
  assertSafe("project-requests", projectList.data.items[0]); assertSafe("price-calculator-leads", calculatorList.data.items[0]);
  console.log("PASS QuoteRequest classification: project and calculator records are isolated");
  const syntheticId = projectList.data.items[0].id;
  const invalid = await request(adminBaseUrl, `/api/project-requests/${syntheticId}/`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ status: "INVALID" }) });
  assert(invalid.response.status === 400, "Invalid status was not rejected.");
  const valid = await request(adminBaseUrl, `/api/project-requests/${syntheticId}/`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ status: "CONTACTED" }) });
  assert(valid.response.status === 200 && valid.data?.status === "CONTACTED", "Valid synthetic status update failed.");
  console.log("PASS status validation and audited synthetic update");
  await request(adminBaseUrl, "/api/auth/logout/", { method: "POST", headers });
  console.log("Admin submissions API integration test passed.");
}
main().catch((error) => { console.error("Admin submissions API integration test failed:", error instanceof Error ? error.message : "Unknown error."); process.exitCode = 1; });
