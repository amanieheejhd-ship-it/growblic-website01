import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import {
  confirmationDynamicText,
  confirmationFilename,
  createConfirmationReference,
  generateConfirmationLetter,
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
  program: "React Native Developer",
  durationDays: 180,
  joiningDate: "2026-07-14",
  referenceNumber: "2026/07/000123",
};

async function fixedAssets(): Promise<ConfirmationLetterAssets> {
  const [header, signature, footer] = await Promise.all([
    readFile(resolve(assetRoot, "internship-letter-header.png")),
    readFile(resolve(assetRoot, "internship-letter-signature.png")),
    readFile(resolve(assetRoot, "internship-letter-footer.png")),
  ]);

  return { header, signature, footer };
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
  assert.match(
    confirmationDynamicText(validInput).confirmationSentence,
    /180 day/,
  );
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
    "Growblic-Internship-Confirmation-Aarav-Sharma.pdf",
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

test("dynamic student name appears in the generated text", () => {
  assert.match(
    confirmationDynamicText(validInput).confirmationSentence,
    /Gautam/,
  );
});

test("selected program appears in both generated program fields", () => {
  const text = confirmationDynamicText(validInput);

  assert.match(text.confirmationSentence, /React Native Developer/);
  assert.equal(text.programLine, "2. Program: React Native Developer");
});

test("selected date appears in all generated date fields", () => {
  const text = confirmationDynamicText(validInput);

  assert.equal(text.date, "14 July 2026");
  assert.match(text.dateLine, /14 July 2026/);
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

test("sample-specific reference values are never reused", () => {
  const generatedText = JSON.stringify(confirmationDynamicText(validInput));

  assert.doesNotMatch(generatedText, /Jaspreet Singh Thind/);
  assert.doesNotMatch(generatedText, /Backend Developer/);
  assert.doesNotMatch(generatedText, /7 June 2026|29 May 2026|2026\/05\/1011/);
});
