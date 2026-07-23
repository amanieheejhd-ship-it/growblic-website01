const baseUrl = (process.env.CONTACT_API_BASE_URL || "http://localhost:4000").replace(
  /\/$/,
  "",
);
const timestamp = Date.now();
const testEmail = `growblic-api-test+${timestamp}@example.com`;
const successMessage = "Thank you. Your enquiry has been received.";

async function postContact(payload) {
  const response = await fetch(`${baseUrl}/public-submissions/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);

  return { response, data };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const validPayload = {
    name: "Growblic Contact API Test",
    email: testEmail,
    phone: "+91 00000 00000",
    company: "Growblic automated test",
    service: "Website Development",
    budget: "Automated test",
    message: `Automated contact API verification created at ${timestamp}.`,
    website: "",
  };

  const valid = await postContact(validPayload);
  assert(valid.response.status === 201, `Expected valid request status 201; received ${valid.response.status}.`);
  assert(valid.data?.success === true, "Valid request did not return success: true.");
  console.log("Valid enquiry:", {
    status: valid.response.status,
    success: valid.data.success,
    testEmail,
  });

  const invalid = await postContact({
    ...validPayload,
    email: "invalid-email",
    message: `Invalid-email API verification created at ${timestamp}.`,
  });
  assert(invalid.response.status === 400, `Expected invalid email status 400; received ${invalid.response.status}.`);
  assert(invalid.data?.success === false, "Invalid email did not return success: false.");
  console.log("Invalid email:", {
    status: invalid.response.status,
    success: invalid.data.success,
    message: invalid.data.message,
  });

  const honeypot = await postContact({
    website: "https://spam.example",
  });
  assert(honeypot.response.status === 201, `Expected honeypot status 201; received ${honeypot.response.status}.`);
  assert(honeypot.data?.success === true, "Honeypot request did not return generic success.");
  assert(honeypot.data?.message === successMessage, "Honeypot response did not use the generic success message.");
  assert(
    Object.keys(honeypot.data).every((key) => key === "success" || key === "message"),
    "Honeypot response revealed unexpected information.",
  );
  console.log("Honeypot:", {
    status: honeypot.response.status,
    success: honeypot.data.success,
    message: honeypot.data.message,
  });
}

main().catch((error) => {
  console.error("Contact API test failed:", error instanceof Error ? error.message : "Unknown error.");
  process.exitCode = 1;
});
