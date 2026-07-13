const baseUrl = (process.env.ADMIN_AUTH_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path) {
  return fetch(`${baseUrl}${path}`, {
    redirect: "manual",
    headers: { Accept: "text/html" },
  });
}

async function main() {
  const loginResponse = await request("/admin/login/");
  assert(loginResponse.status === 200, "Admin login page did not return 200.");
  const loginHtml = await loginResponse.text();
  console.log("PASS admin login page: 200");

  const normalizedHtml = loginHtml.toLowerCase();
  const forbiddenValues = [
    "passwordhash",
    "tokenhash",
    "admin_auth_pepper",
    "database_url",
    "growblic_admin_session",
  ];
  assert(
    forbiddenValues.every((value) => !normalizedHtml.includes(value)),
    "Admin login page exposed a sensitive field.",
  );
  console.log("PASS admin login page: no sensitive fields exposed");

  const robotsTag = loginHtml
    .match(/<meta\b[^>]*>/gi)
    ?.find((tag) => /name=["']robots["']/i.test(tag));
  assert(
    robotsTag &&
      /content=["'][^"']*noindex/i.test(robotsTag) &&
      /content=["'][^"']*nofollow/i.test(robotsTag),
    "Admin login page was missing noindex or nofollow.",
  );
  console.log("PASS admin login page: noindex and nofollow");

  const adminResponse = await request("/admin/");
  assert(
    adminResponse.status >= 300 && adminResponse.status < 400,
    "Unauthenticated admin page did not redirect.",
  );

  const location = adminResponse.headers.get("location");
  assert(location, "Unauthenticated admin redirect had no destination.");
  const destination = new URL(location, baseUrl);
  assert(
    destination.pathname === "/admin/login/",
    "Unauthenticated admin page redirected unexpectedly.",
  );
  console.log("PASS unauthenticated admin page: protected redirect");
  console.log("Admin page tests passed.");
}

main().catch((error) => {
  console.error(
    "Admin page tests failed:",
    error instanceof Error ? error.message : "Unknown error.",
  );
  process.exitCode = 1;
});
