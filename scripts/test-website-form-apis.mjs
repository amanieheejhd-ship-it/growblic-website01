const baseUrl = (process.env.WEBSITE_FORMS_BASE_URL || "http://localhost:4000").replace(
  /\/$/,
  "",
);
const timestamp = Date.now();

const cases = [
  {
    name: "careers",
    path: "/public-submissions/career-applications",
    valid: {
      submissionKey: `career-${timestamp}`,
      fullName: "API Test Candidate",
      email: `career-${timestamp}@example.com`,
      phone: "+91 90000 00001",
      role: "Frontend Developer",
      experience: "1-3 years",
      workLinks: ["https://example.com/portfolio"],
      message: `Automated careers API verification ${timestamp}`,
      website: "",
    },
  },
  {
    name: "internships",
    path: "/public-submissions/internship-applications",
    valid: {
      submissionKey: `internship-${timestamp}`,
      internshipSlug: "frontend-developer",
      fullName: "API Test Intern",
      email: `internship-${timestamp}@example.com`,
      phone: "+91 90000 00002",
      state: "Delhi",
      instituteEnrollment: "Yes",
      instituteName: "Test Institute",
      course: "BCA",
      enrollmentNumber: `TEST-${timestamp}`,
      highestQualification: "",
      passingYear: "",
      message: `Automated internship API verification ${timestamp}`,
      website: "",
    },
  },
  {
    name: "meeting requests",
    path: "/public-submissions/meetups",
    valid: {
      submissionKey: `meeting-${timestamp}`,
      name: "API Test Visitor",
      email: `meeting-${timestamp}@example.com`,
      phone: "+91 90000 00003",
      message: `Automated meetup API verification ${timestamp}`,
      source: "automated-test",
      website: "",
    },
  },
  {
    name: "quote requests",
    path: "/public-submissions/price-calculator",
    valid: {
      submissionKey: `quote-${timestamp}`,
      name: "API Test Customer",
      email: `quote-${timestamp}@example.com`,
      phone: "+91 90000 00004",
      company: "Test Company",
      location: "Delhi, India",
      service: "Website Development",
      budget: "Test estimate",
      requirements: `Automated quote API verification ${timestamp}`,
      calculatorData: { testRun: true, timestamp },
      source: "automated-test",
      website: "",
    },
  },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function post(path, body, raw = false) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: raw ? body : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  const cacheControl = response.headers.get("cache-control") || "";

  assert(cacheControl.toLowerCase().includes("no-store"), `${path} omitted no-store.`);
  return { response, data };
}

async function main() {
  for (const testCase of cases) {
    const valid = await post(testCase.path, testCase.valid);
    assert(valid.response.status === 201 && valid.data?.success === true, `${testCase.name} valid submission failed.`);
    console.log(`PASS ${testCase.name}: valid submission 201`);

    const duplicate = await post(testCase.path, testCase.valid);
    assert(duplicate.response.status === 201 && duplicate.data?.success === true, `${testCase.name} idempotent retry failed.`);
    console.log(`PASS ${testCase.name}: idempotent retry 201`);

    const invalidEmail = await post(testCase.path, {
      ...testCase.valid,
      submissionKey: `${testCase.valid.submissionKey}-invalid-email`,
      email: "invalid-email",
    });
    assert(invalidEmail.response.status === 400 && invalidEmail.data?.success === false, `${testCase.name} invalid email was accepted.`);
    console.log(`PASS ${testCase.name}: invalid email 400`);

    const malformed = await post(testCase.path, "{", true);
    assert(malformed.response.status === 400 && malformed.data?.success === false, `${testCase.name} malformed JSON was accepted.`);
    console.log(`PASS ${testCase.name}: malformed JSON 400`);

    const honeypot = await post(testCase.path, { website: "filled-by-bot" });
    assert(honeypot.response.status === 201 && honeypot.data?.success === true, `${testCase.name} honeypot did not fail closed safely.`);
    console.log(`PASS ${testCase.name}: honeypot generic success 201`);
  }

  console.log("Website form API tests passed.");
}

main().catch((error) => {
  console.error(
    "Website form API tests failed:",
    error instanceof Error ? error.message : "Unknown error.",
  );
  process.exitCode = 1;
});
