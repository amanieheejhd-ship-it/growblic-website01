import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inflateSync } from "node:zlib";
import fontkit from "@pdf-lib/fontkit";
import {
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
} from "pdf-lib";

import {
  confirmationLetterFilename,
  trustedConfirmationLetterData,
} from "./internship-confirmation.binding";
import {
  A4_PORTRAIT,
  AUTHORIZED_SIGNATURE_FONT_ASSET,
  AUTHORIZED_SIGNATURE_TEXT,
  authorizedSignatureFontCandidates,
  confirmationEducationDetails,
  generateInternshipConfirmationPdf,
  growblicWatermarkLogoPngBytes,
  loadAuthorizedSignatureFontBytes,
} from "./internship-confirmation.pdf";
import { InvoiceStateError } from "./internship-invoice.binding";

const application = {
  id: "application_confirmation_fixture",
  internshipSlug: "frontend-developer",
  candidateName: "Aarav Fixture Applicant",
  email: "aarav.fixture@growblic.test",
  phone: "+91 90000 00003",
  state: "Chandigarh",
  instituteEnrollment: "Yes",
  instituteName: "Fixture Institute of Technology",
  course: "Bachelor of Computer Applications",
  enrollmentNumber: "FIXTURE-ENROLL-03",
  highestQualification: "Higher Secondary",
  passingYear: "2026",
  createdAt: new Date("2026-07-13T09:00:00.000Z"),
};

const payment = {
  internshipApplicationId: application.id,
  gateway: "RAZORPAY",
  status: "PAID",
  selectedDuration: 30,
  internshipProgram: "Frontend Developer",
  amountPaise: 300_000,
  currency: "INR",
  customerName: application.candidateName,
  customerEmail: application.email,
  customerPhone: application.phone,
  paidAt: new Date("2026-07-14T08:00:00.000Z"),
  confirmationReference: "GB-INT-2026-000003",
  confirmationSequence: 3,
  confirmationYear: 2026,
  joiningDate: new Date("2026-07-25T00:00:00.000Z"),
  confirmationIssuedAt: new Date("2026-07-15T08:00:00.000Z"),
  gatewayOrderId: "order_confirmation_fixture_03",
  gatewayPaymentId: "pay_confirmation_fixture_03",
  paymentMethod: "upi",
};

const invoice = {
  invoiceNumber: "GB-INT-2026-CONFIRM03",
  issuedAt: new Date("2026-07-14T08:00:01.000Z"),
  customerName: application.candidateName,
  customerEmail: application.email,
  customerPhone: application.phone,
  description: "Frontend Developer internship - 30 days",
  amountPaise: 300_000,
  totalPaise: 300_000,
  currency: "INR",
};

function decodedPdfText(bytes: Uint8Array) {
  const source = Buffer.from(bytes).toString("binary");
  const text: string[] = [];
  for (const match of source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
    try {
      const decoded = inflateSync(Buffer.from(match[1], "binary")).toString("binary");
      for (const token of decoded.matchAll(/<([0-9A-Fa-f]+)>\s*Tj/g)) {
        text.push(Buffer.from(token[1], "hex").toString("latin1"));
      }
    } catch {
      // Non-text PDF streams are intentionally ignored.
    }
  }
  return text.join(" ");
}

function decodedPdfStreams(bytes: Uint8Array) {
  const source = Buffer.from(bytes).toString("binary");
  const streams: string[] = [];
  for (const match of source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
    try {
      streams.push(inflateSync(Buffer.from(match[1], "binary")).toString("binary"));
    } catch {
      // Non-Flate streams are intentionally ignored.
    }
  }
  return streams;
}

describe("trusted internship confirmation letter", () => {
  it("binds applicant, program, duration, joining date, and reference from persisted records", async () => {
    const data = trustedConfirmationLetterData(payment, application, invoice);
    const bytes = await generateInternshipConfirmationPdf(data);
    const text = decodedPdfText(bytes);

    assert.match(text, /Aarav Fixture Applicant/);
    assert.match(text, /aarav\.fixture@growblic\.test/);
    assert.match(text, /Chandigarh/);
    assert.match(text, /Fixture Institute of Technology/);
    assert.match(text, /Frontend Developer/);
    assert.match(text, /30-day internship/);
    assert.match(text, /15 July 2026/);
    assert.match(text, /25 July 2026/);
    assert.match(text, /GB-INT-2026-000003/);
    assert.equal(
      confirmationLetterFilename(data),
      "growblic-internship-confirmation-aarav-fixture-applicant-gb-int-2026-000003.pdf",
    );
  });

  it("omits empty optional education fields", async () => {
    const data = trustedConfirmationLetterData(
      payment,
      {
        ...application,
        instituteName: null,
        course: null,
        enrollmentNumber: null,
        highestQualification: null,
        passingYear: null,
      },
      invoice,
    );
    const education = confirmationEducationDetails(data);
    const text = decodedPdfText(await generateInternshipConfirmationPdf(data));

    assert.deepEqual(education, ["Institute enrollment: Yes"]);
    assert.doesNotMatch(text, /Institute:|Course:|Enrollment No\.:|Highest qualification:|Passing year:/);
  });

  it("rejects forged duration, program, reference, and unpaid payment records", () => {
    assert.throws(
      () => trustedConfirmationLetterData(
        { ...payment, selectedDuration: 180 },
        application,
        invoice,
      ),
      InvoiceStateError,
    );
    assert.throws(
      () => trustedConfirmationLetterData(
        { ...payment, internshipProgram: "Backend Developer" },
        application,
        invoice,
      ),
      InvoiceStateError,
    );
    assert.throws(
      () => trustedConfirmationLetterData(
        { ...payment, status: "PENDING" },
        application,
        invoice,
      ),
      InvoiceStateError,
    );
    assert.throws(
      () => trustedConfirmationLetterData(
        { ...payment, confirmationReference: "FORGED-REFERENCE" },
        application,
        invoice,
      ),
      InvoiceStateError,
    );
    assert.throws(
      () => trustedConfirmationLetterData(
        { ...payment, joiningDate: null },
        application,
        invoice,
      ),
      InvoiceStateError,
    );
  });

  it("generates exactly one A4 page", async () => {
    const bytes = await generateInternshipConfirmationPdf(
      trustedConfirmationLetterData(payment, application, invoice),
    );
    const document = await PDFDocument.load(bytes);
    const page = document.getPage(0);

    assert.equal(document.getPageCount(), 1);
    assert.ok(Math.abs(page.getWidth() - A4_PORTRAIT[0]) < 0.01);
    assert.ok(Math.abs(page.getHeight() - A4_PORTRAIT[1]) < 0.01);
  });

  it("renders the authorized signature with the private script font and no signature image", async () => {
    const bytes = await generateInternshipConfirmationPdf(
      trustedConfirmationLetterData(payment, application, invoice),
    );
    const text = decodedPdfText(bytes);
    const document = await PDFDocument.load(bytes);
    const resources = document.getPage(0).node.Resources();
    assert.ok(resources);
    const pageFonts = resources.lookup(PDFName.of("Font"), PDFDict);
    const embeddedFontNames = pageFonts.entries().flatMap(([, reference]) => {
      const font = document.context.lookup(reference, PDFDict);
      const baseFont = font.get(PDFName.of("BaseFont"));
      return baseFont ? [baseFont.toString()] : [];
    });
    const verifier = await PDFDocument.create();
    verifier.registerFontkit(fontkit);
    const signatureFont = await verifier.embedFont(
      await loadAuthorizedSignatureFontBytes(),
      { subset: true },
    );
    const encodedSignature = signatureFont
      .encodeText(AUTHORIZED_SIGNATURE_TEXT)
      .toString();
    const imageCount = document.context
      .enumerateIndirectObjects()
      .filter(([, object]) => {
        if (!(object instanceof PDFRawStream)) return false;
        return object.dict
          .lookupMaybe(PDFName.of("Subtype"), PDFName)
          ?.toString() === "/Image";
      }).length;

    assert.match(text, /Authorized Signatory/);
    assert.equal(AUTHORIZED_SIGNATURE_TEXT, "Bintu Malik");
    assert.ok(
      decodedPdfStreams(bytes).some((stream) =>
        stream.includes(`${encodedSignature} Tj`),
      ),
    );
    assert.equal(text.match(/Growblic Private Limited/g)?.length, 1);
    assert.equal(
      AUTHORIZED_SIGNATURE_FONT_ASSET,
      "assets/fonts/AuthorizedSignature.ttf",
    );
    assert.ok(embeddedFontNames.some((name) => name.startsWith("/Zapfino-")));
    assert.ok(
      authorizedSignatureFontCandidates().some((candidate) =>
        candidate.endsWith("src/assets/fonts/AuthorizedSignature.ttf"),
      ),
    );
    assert.equal(imageCount, 3);
    assert.equal(document.getPageCount(), 1);
    assert.ok(Math.abs(document.getPage(0).getWidth() - A4_PORTRAIT[0]) < 0.01);
    assert.ok(Math.abs(document.getPage(0).getHeight() - A4_PORTRAIT[1]) < 0.01);
  });

  it("fails safely when the private signature font is missing", async () => {
    await assert.rejects(
      loadAuthorizedSignatureFontBytes([
        "/private/backend/font/path/that-does-not-exist.ttf",
      ]),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal(
          error.message,
          "Private authorized signature font asset is missing from the backend build.",
        );
        assert.doesNotMatch(error.message, /private\/backend|does-not-exist/);
        return true;
      },
    );
  });

  it("uses the official Growblic logo mark as the watermark instead of a standalone G glyph", async () => {
    const watermark = growblicWatermarkLogoPngBytes();
    const bytes = await generateInternshipConfirmationPdf(
      trustedConfirmationLetterData(payment, application, invoice),
    );
    const text = decodedPdfText(bytes);
    const document = await PDFDocument.load(bytes);
    const imageWidths = document.context
      .enumerateIndirectObjects()
      .flatMap(([, object]) => {
        if (!(object instanceof PDFRawStream)) return [];
        const subtype = object.dict.lookupMaybe(
          PDFName.of("Subtype"),
          PDFName,
        );
        if (subtype?.toString() !== "/Image") return [];
        const width = object.dict.lookupMaybe(PDFName.of("Width"), PDFNumber);
        return width ? [width.asNumber()] : [];
      });

    assert.deepEqual(
      Array.from(watermark.subarray(0, 8)),
      [137, 80, 78, 71, 13, 10, 26, 10],
    );
    assert.equal(watermark.readUInt32BE(16), 240);
    assert.equal(watermark.readUInt32BE(20), 240);
    assert.ok(imageWidths.includes(240));
    assert.doesNotMatch(text, /(?:^|\s)G(?:\s|$)/);
  });
});
