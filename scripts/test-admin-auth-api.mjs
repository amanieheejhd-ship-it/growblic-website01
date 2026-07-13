const baseUrl = (process.env.ADMIN_AUTH_BASE_URL || "http://localhost:3001").replace(
  /\/$/,
  "",
);
const adminEmail = process.env.ADMIN_AUTH_TEST_EMAIL?.trim();
const adminPassword = process.env.ADMIN_AUTH_TEST_PASSWORD;
const sessionCookieName = "growblic_admin_session";
const testUserAgent = "Growblic-Admin-Auth-Integration-Test";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNoSensitiveFields(value, context) {
  if (!value || typeof value !== "object") {
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase().replace(/[_-]/g, "");
    assert(
      ![
        "password",
        "passwordhash",
        "token",
        "tokenhash",
        "sessiontoken",
        "cookie",
        "setcookie",
      ].includes(normalizedKey),
      `${context} contained a sensitive field.`,
    );
    assertNoSensitiveFields(nestedValue, context);
  }
}

function assertSafeUser(user, context) {
  assert(user && typeof user === "object" && !Array.isArray(user), `${context} did not include a user object.`);
  assert(
    JSON.stringify(Object.keys(user).sort()) ===
      JSON.stringify(["email", "id", "name", "roles"]),
    `${context} user fields were not limited to the safe allowlist.`,
  );
  assert(typeof user.id === "string" && user.id.length > 0, `${context} user ID was invalid.`);
  assert(typeof user.email === "string", `${context} user email was invalid.`);
  assert(typeof user.name === "string" && user.name.length > 0, `${context} user name was invalid.`);
  assert(Array.isArray(user.roles), `${context} user roles were invalid.`);
  assertNoSensitiveFields(user, context);
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("User-Agent", testUserAgent);

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    redirect: "manual",
  });
  const data = await response.json().catch(() => null);

  return { response, data };
}

function getSetCookieHeaders(response) {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }

  const header = response.headers.get("set-cookie");
  return header ? [header] : [];
}

function extractSessionCookie(response) {
  const setCookieHeaders = getSetCookieHeaders(response);
  const sessionHeader = setCookieHeaders.find((header) =>
    header.toLowerCase().startsWith(`${sessionCookieName.toLowerCase()}=`),
  );

  assert(sessionHeader, "Login response did not set the admin session cookie.");

  const [cookiePair] = sessionHeader.split(";", 1);
  const separator = cookiePair.indexOf("=");
  const name = cookiePair.slice(0, separator);
  const value = cookiePair.slice(separator + 1);

  assert(name === sessionCookieName, "Login response used an unexpected cookie name.");
  assert(value.length > 0, "Login response set an empty session cookie.");

  const normalizedHeader = sessionHeader.toLowerCase();
  assert(normalizedHeader.includes("httponly"), "Session cookie was missing HttpOnly.");
  assert(normalizedHeader.includes("samesite=lax"), "Session cookie was missing SameSite=Lax.");
  assert(normalizedHeader.includes("path=/"), "Session cookie was missing Path=/.");

  return {
    cookieHeader: `${name}=${value}`,
    setCookieHeaders,
  };
}

function assertCookieCleared(setCookieHeaders) {
  const clearHeader = setCookieHeaders.find((header) =>
    header.toLowerCase().startsWith(`${sessionCookieName.toLowerCase()}=`),
  );

  assert(clearHeader, "Logout response did not include a cookie-clear header.");

  const normalized = clearHeader.toLowerCase();
  assert(
    normalized.includes("max-age=0") || normalized.includes("expires=thu, 01 jan 1970"),
    "Logout response did not expire the session cookie.",
  );
}

async function main() {
  if (!adminEmail) {
    throw new Error("ADMIN_AUTH_TEST_EMAIL is required.");
  }

  if (!adminPassword) {
    throw new Error("ADMIN_AUTH_TEST_PASSWORD is required.");
  }

  const unauthenticated = await request("/api/auth/session/");
  assert(unauthenticated.response.status === 401, "Unauthenticated session check did not return 401.");
  console.log("PASS unauthenticated session: 401");

  const malformed = await request("/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert(malformed.response.status === 400, "Malformed login did not return 400.");
  console.log("PASS malformed login: 400");

  const wrongPassword = await request("/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: adminEmail,
      password: `${adminPassword[0] === "A" ? "B" : "A"}${adminPassword.slice(1)}`,
    }),
  });
  assert(wrongPassword.response.status === 401, "Incorrect-password login did not return 401.");
  assert(wrongPassword.data?.success === false, "Incorrect-password login did not fail safely.");
  assertNoSensitiveFields(wrongPassword.data, "Incorrect-password response");
  console.log("PASS incorrect-password login: 401");

  const login = await request("/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  assert(login.response.status === 200, "Correct login did not return 200.");
  assert(login.data?.success === true, "Correct login did not return success.");
  assertSafeUser(login.data.user, "Login response");
  assertNoSensitiveFields(login.data, "Login response");
  assert(
    login.data.user.email === adminEmail.normalize("NFKC").trim().toLowerCase(),
    "Login response email did not match the requested administrator.",
  );
  assert(login.data.user.roles.includes("SUPER_ADMIN"), "Login response did not include SUPER_ADMIN.");

  const { cookieHeader } = extractSessionCookie(login.response);
  console.log("PASS correct login: 200 with safe user and secure cookie attributes");

  const authenticated = await request("/api/auth/session/", {
    headers: { Cookie: cookieHeader },
  });
  assert(authenticated.response.status === 200, "Authenticated session check did not return 200.");
  assert(authenticated.data?.success === true, "Authenticated session check did not succeed.");
  assertSafeUser(authenticated.data.user, "Session response");
  assertNoSensitiveFields(authenticated.data, "Session response");
  assert(authenticated.data.user.email === login.data.user.email, "Session email did not match login identity.");
  assert(authenticated.data.user.name === login.data.user.name, "Session name did not match login identity.");
  assert(authenticated.data.user.roles.includes("SUPER_ADMIN"), "Session response did not include SUPER_ADMIN.");
  console.log("PASS authenticated session: 200 with matching SUPER_ADMIN identity");

  const logout = await request("/api/auth/logout/", {
    method: "POST",
    headers: { Cookie: cookieHeader },
  });
  assert(logout.response.status === 200, "Logout did not return 200.");
  assert(logout.data?.success === true, "Logout did not return success.");
  assertCookieCleared(getSetCookieHeaders(logout.response));
  console.log("PASS logout: 200 with cookie clear");

  const revoked = await request("/api/auth/session/", {
    headers: { Cookie: cookieHeader },
  });
  assert(revoked.response.status === 401, "Revoked cookie remained authenticated.");
  console.log("PASS revoked cookie session: 401");

  const idempotentLogout = await request("/api/auth/logout/", {
    method: "POST",
    headers: { Cookie: cookieHeader },
  });
  assert(idempotentLogout.response.status === 200, "Repeated logout did not return 200.");
  assert(idempotentLogout.data?.success === true, "Repeated logout was not idempotent.");
  assertCookieCleared(getSetCookieHeaders(idempotentLogout.response));
  console.log("PASS repeated logout: 200 idempotent success");

  console.log("Admin authentication API integration test passed.");
}

main().catch((error) => {
  console.error(
    "Admin authentication API integration test failed:",
    error instanceof Error ? error.message : "Unknown error.",
  );
  process.exitCode = 1;
});
