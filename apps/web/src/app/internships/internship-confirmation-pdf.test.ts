import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import {
  confirmationLetterTypography,
  confirmationDynamicText,
  confirmationFilename,
  createConfirmationReference,
  generateConfirmationLetter,
  highDpiPreviewScale,
  internshipProgramContent,
  localDateValue,
  replaceObjectUrl,
  validateConfirmationInput,
  type ConfirmationLetterAssets,
  type ConfirmationLetterInput,
} from "./internship-confirmation-pdf";

const templatePath = resolve(
  process.cwd(),
  "apps/web/public/templates/internship-confirmation-template.pdf",
);
const assetRoot = resolve(process.cwd(), "apps/web/public/templates");

const validInput: ConfirmationLetterInput = {
  fullName: "Gautam",
  program: "Frontend Developer",
  durationDays: 180,
  joiningDate: "2026-07-14",
  referenceNumber: "2026/07/000123",
};

async function fixedAssets(): Promise<ConfirmationLetterAssets> {
  const logo = await readFile(resolve(assetRoot, "growblic-official-logo.png"));

  return { logo };
}

test("full name is required", () => {
  assert.equal(
    validateConfirmationInput({ ...validInput, fullName: " " }).fullName,
    "Full name is required.",
  );
});

test("program is required", () => {
  assert.equal(
    validateConfirmationInput({ ...validInput, program: "" }).program,
    "Select a valid program.",
  );
});

test("date of joining is required", () => {
  assert.equal(
    validateConfirmationInput({ ...validInput, joiningDate: "" }).joiningDate,
    "Date of joining is required.",
  );
});

test("selected duration is transferred into the confirmation text", () => {
  assert.match(confirmationDynamicText(validInput).statement, /180 days/);
});

test("current local date defaults from local date parts", () => {
  assert.equal(localDateValue(new Date(2026, 6, 14, 23, 30)), "2026-07-14");
});

test("reference number is generated without database identifiers", () => {
  assert.match(
    createConfirmationReference(new Date(2026, 6, 14, 12), 0.123),
    /^2026\/07\/\d{6}$/,
  );
});

test("download filename is sanitized", () => {
  assert.equal(
    confirmationFilename("  Aarav / Sharma  "),
    "Growblic-Internship-Certificate-Aarav-Sharma.pdf",
  );
});

test("uploaded template remains one page", async () => {
  const template = await PDFDocument.load(await readFile(templatePath));
  assert.equal(template.getPageCount(), 1);
});

test("generated PDF is non-empty and remains one page", async () => {
  const bytes = await generateConfirmationLetter(await fixedAssets(), validInput);
  const document = await PDFDocument.load(bytes);

  assert.ok(bytes.byteLength > 1000);
  assert.equal(document.getPageCount(), 1);
});

test("primary developer program certificates all remain one page", async () => {
  const assets = await fixedAssets();

  for (const program of [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
  ]) {
    const bytes = await generateConfirmationLetter(assets, {
      ...validInput,
      program,
    });
    const document = await PDFDocument.load(bytes);

    assert.equal(document.getPageCount(), 1, program);
  }
});

test("dynamic student name appears in the generated text", () => {
  assert.match(confirmationDynamicText(validInput).statement, /Gautam/);
});

test("selected program appears in the generated statement", () => {
  const text = confirmationDynamicText(validInput);

  assert.match(text.statement, /Frontend Developer/);
});

test("dynamic statement does not duplicate student values", () => {
  const { statement } = confirmationDynamicText(validInput);

  assert.equal(statement.match(/Gautam/g)?.length, 1);
  assert.equal(statement.match(/Frontend Developer/g)?.length, 1);
  assert.equal(statement.match(/180 days/g)?.length, 1);
});

test("selected date is formatted for the letter", () => {
  const text = confirmationDynamicText(
    validInput,
    new Date(2026, 6, 14, 23, 30),
  );

  assert.equal(text.joiningDate, "14 July 2026");
  assert.equal(text.issueDate, "14 July 2026");
});

test("reference number appears in the generated overlay text", () => {
  assert.equal(
    confirmationDynamicText(validInput).referenceNumber,
    "2026/07/000123",
  );
});

test("replacing an object URL revokes the old URL", () => {
  const revoked: string[] = [];

  assert.equal(
    replaceObjectUrl("blob:old", "blob:new", (url) => revoked.push(url)),
    "blob:new",
  );
  assert.deepEqual(revoked, ["blob:old"]);
});

test("all configured letter typography remains readable", () => {
  assert.ok(
    Object.values(confirmationLetterTypography).every((size) => size >= 9),
  );
  assert.ok(confirmationLetterTypography.companyName >= 24);
  assert.ok(confirmationLetterTypography.companyName <= 30);
  assert.ok(confirmationLetterTypography.title >= 20);
  assert.ok(confirmationLetterTypography.title <= 28);
  assert.ok(confirmationLetterTypography.body >= 11.5);
  assert.ok(confirmationLetterTypography.studentName >= 26);
  assert.ok(confirmationLetterTypography.program >= 16);
});

test("preview renderer uses a bounded high-DPI scale", () => {
  assert.equal(highDpiPreviewScale(1), 2.5);
  assert.equal(highDpiPreviewScale(2), 2.5);
  assert.equal(highDpiPreviewScale(2.75), 2.75);
  assert.equal(highDpiPreviewScale(4), 3);
});

test("every internship program has distinct certificate content", () => {
  const contentSignatures = Object.values(internshipProgramContent).map(
    (content) => JSON.stringify(content),
  );

  assert.equal(Object.keys(internshipProgramContent).length, 15);
  assert.equal(new Set(contentSignatures).size, 15);
  Object.values(internshipProgramContent).forEach((content) => {
    assert.ok(content.learning.length >= 5);
    assert.ok(content.responsibilities.length >= 5);
    assert.ok(content.skills.length >= 8);
  });
});

test("sample-specific reference values are never reused", () => {
  const generatedText = JSON.stringify(confirmationDynamicText(validInput));

  assert.doesNotMatch(generatedText, /Jaspreet Singh Thind/);
  assert.doesNotMatch(generatedText, /Backend Developer/);
  assert.doesNotMatch(generatedText, /7 June 2026|29 May 2026|2026\/05\/1011/);
});
