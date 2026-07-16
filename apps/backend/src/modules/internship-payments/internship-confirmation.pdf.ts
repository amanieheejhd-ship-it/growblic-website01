import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import fontkit from "@pdf-lib/fontkit";
import {
  degrees,
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

import type { ConfirmationLetterData } from "./internship-confirmation.binding";
import { growblicLogoPngBytes } from "./internship-invoice.pdf";

export const A4_PORTRAIT: [number, number] = [595.28, 841.89];
export const AUTHORIZED_SIGNATURE_TEXT = "Bintu Malik";
export const AUTHORIZED_SIGNATURE_FONT_ASSET =
  "assets/fonts/AuthorizedSignature.ttf";

const AUTHORIZED_SIGNATURE_FONT_MISSING =
  "Private authorized signature font asset is missing from the backend build.";

export function authorizedSignatureFontCandidates() {
  return Array.from(
    new Set([
      resolve(__dirname, AUTHORIZED_SIGNATURE_FONT_ASSET),
      resolve(__dirname, "../../assets/fonts/AuthorizedSignature.ttf"),
      resolve(process.cwd(), "dist", AUTHORIZED_SIGNATURE_FONT_ASSET),
      resolve(process.cwd(), "src", AUTHORIZED_SIGNATURE_FONT_ASSET),
      resolve(
        process.cwd(),
        "apps/backend/dist",
        AUTHORIZED_SIGNATURE_FONT_ASSET,
      ),
      resolve(
        process.cwd(),
        "apps/backend/src",
        AUTHORIZED_SIGNATURE_FONT_ASSET,
      ),
    ]),
  );
}

export async function loadAuthorizedSignatureFontBytes(
  candidates: readonly string[] = authorizedSignatureFontCandidates(),
) {
  for (const candidate of candidates) {
    try {
      const bytes = await readFile(candidate);
      if (bytes.length > 0) return bytes;
    } catch {
      // Try the next source/build location without leaking private paths.
    }
  }
  throw new Error(AUTHORIZED_SIGNATURE_FONT_MISSING);
}

// Mechanically derived from apps/web/public/templates/growblic-official-logo.png:
// the official white mark is preserved exactly, with its black background made
// transparent and its pixels tinted pale green for the document watermark.
const GROWBLIC_WATERMARK_LOGO_PNG_BASE64 = "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";

export function growblicWatermarkLogoPngBytes() {
  return Buffer.from(GROWBLIC_WATERMARK_LOGO_PNG_BASE64, "base64");
}

const company = {
  name: "Growblic Private Limited",
  address: "182/80, Goyal traders, Industrial Area Phase 1, Chandigarh 160002",
  phone: "+91 8377001500",
  email: "hello@growblic.com",
  website: "www.growblic.com",
  gstin: "06AAMCG3210D1Z4",
  cin: "U63120HR2025PTC135768",
} as const;

function dateInIndia(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function safeText(font: PDFFont, value: string) {
  const supported = new Set(font.getCharacterSet());
  return Array.from(value, (character) =>
    supported.has(character.codePointAt(0) ?? 0) ? character : "?",
  ).join("");
}

function wrapText(font: PDFFont, value: string, size: number, width: number) {
  const words = safeText(font, value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrappedText(
  page: PDFPage,
  font: PDFFont,
  value: string,
  options: {
    x: number;
    y: number;
    width: number;
    size: number;
    lineHeight: number;
    color: ReturnType<typeof rgb>;
  },
) {
  const lines = wrapText(font, value, options.size, options.width);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x: options.x,
      y: options.y - index * options.lineHeight,
      size: options.size,
      font,
      color: options.color,
    });
  });
  return options.y - lines.length * options.lineHeight;
}

export function confirmationEducationDetails(data: ConfirmationLetterData) {
  return [
    data.instituteEnrollment
      ? `Institute enrollment: ${data.instituteEnrollment}`
      : null,
    data.instituteName ? `Institute: ${data.instituteName}` : null,
    data.course ? `Course: ${data.course}` : null,
    data.enrollmentNumber
      ? `Enrollment No.: ${data.enrollmentNumber}`
      : null,
    data.highestQualification
      ? `Highest qualification: ${data.highestQualification}`
      : null,
    data.passingYear ? `Passing year: ${data.passingYear}` : null,
  ].filter((value): value is string => Boolean(value));
}

export async function generateInternshipConfirmationPdf(
  data: ConfirmationLetterData,
) {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const page = document.addPage(A4_PORTRAIT);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const signature = await document.embedFont(
    await loadAuthorizedSignatureFontBytes(),
    { subset: true },
  );
  const logo = await document.embedPng(growblicLogoPngBytes());
  const watermarkLogo = await document.embedPng(
    growblicWatermarkLogoPngBytes(),
  );
  const black = rgb(0.04, 0.055, 0.07);
  const slate = rgb(0.28, 0.32, 0.37);
  const green = rgb(0.12, 0.55, 0.16);
  const lightGreen = rgb(0.62, 0.84, 0.36);
  const signatureColor = rgb(41 / 255, 82 / 255, 121 / 255);
  const paleGreen = rgb(0.95, 0.985, 0.95);
  const line = rgb(0.84, 0.89, 0.84);
  const margin = 48;
  const contentWidth = A4_PORTRAIT[0] - margin * 2;

  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4_PORTRAIT[0],
    height: A4_PORTRAIT[1],
    color: rgb(1, 1, 1),
  });

  const watermarkSize = 250;
  page.drawImage(watermarkLogo, {
    x: (A4_PORTRAIT[0] - watermarkSize) / 2,
    y: (A4_PORTRAIT[1] - watermarkSize) / 2,
    width: watermarkSize,
    height: watermarkSize,
    opacity: 0.1,
  });

  page.drawImage(logo, { x: 46, y: 734, width: 44, height: 44 });
  page.drawText("Growblic", {
    x: 98,
    y: 751,
    size: 25,
    font: bold,
    color: black,
  });
  page.drawText("Software Development Company", {
    x: 99,
    y: 733,
    size: 9.5,
    font: regular,
    color: green,
  });

  page.drawText(`Ref No: ${safeText(regular, data.referenceNumber)}`, {
    x: 396,
    y: 744,
    size: 9,
    font: regular,
    color: black,
  });
  page.drawText(`Date: ${dateInIndia(data.issuedAt)}`, {
    x: 396,
    y: 724,
    size: 9,
    font: regular,
    color: black,
  });

  page.drawText("Internship Confirmation Letter", {
    x: margin,
    y: 650,
    size: 16,
    font: bold,
    color: black,
  });
  let y = drawWrappedText(
    page,
    regular,
    `This is to confirm that ${data.fullName} has been enrolled in a ${data.durationDays}-day internship program in ${data.program}.`,
    {
      x: margin,
      y: 630,
      width: contentWidth,
      size: 10,
      lineHeight: 14,
      color: black,
    },
  );

  y -= 9;
  const detailRows = [
    `1. Name of Company: ${company.name}`,
    `2. Program: ${data.program}`,
    `3. Date of Joining: ${dateInIndia(data.joiningDate)}`,
  ];
  detailRows.forEach((row) => {
    page.drawText(safeText(regular, row), {
      x: margin,
      y,
      size: 9.7,
      font: regular,
      color: black,
    });
    y -= 15;
  });

  y -= 2;
  page.drawRectangle({
    x: margin,
    y: y - 112,
    width: contentWidth,
    height: 112,
    color: paleGreen,
    borderColor: line,
    borderWidth: 0.75,
  });
  page.drawText("Candidate Details", {
    x: margin + 14,
    y: y - 20,
    size: 10,
    font: bold,
    color: green,
  });
  const candidateRows = [
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `State: ${data.state}`,
  ];
  candidateRows.forEach((row, index) => {
    const column = index % 2;
    const rowIndex = Math.floor(index / 2);
    page.drawText(safeText(regular, row), {
      x: margin + 14 + column * 244,
      y: y - 40 - rowIndex * 18,
      size: 8.6,
      font: regular,
      color: slate,
    });
  });
  const education = confirmationEducationDetails(data).join(" | ");
  if (education) {
    drawWrappedText(page, regular, `Education: ${education}`, {
      x: margin + 14,
      y: y - 80,
      width: contentWidth - 28,
      size: 8.2,
      lineHeight: 12,
      color: slate,
    });
  }

  y -= 134;
  y = drawWrappedText(
    page,
    regular,
    "This internship program is designed to provide practical industry exposure, hands-on experience in modern software development technologies, and innovative learning opportunities. The program aims to enhance technical skills, problem-solving abilities, teamwork, and professional growth through real-world projects and sustainable digital solutions.",
    {
      x: margin,
      y,
      width: contentWidth,
      size: 9.6,
      lineHeight: 13.5,
      color: black,
    },
  );

  const signatoryY = Math.min(y - 24, 275);
  page.drawText("Authorized Signatory", {
    x: margin,
    y: signatoryY,
    size: 9.5,
    font: bold,
    color: black,
  });
  page.drawText(AUTHORIZED_SIGNATURE_TEXT, {
    x: margin + 5,
    y: signatoryY + 12,
    size: 12.5,
    font: signature,
    color: signatureColor,
    rotate: degrees(6),
  });

  const footerY = 72;
  page.drawText(company.address, {
    x: margin,
    y: footerY + 48,
    size: 8.2,
    font: regular,
    color: black,
  });
  page.drawText(`${company.phone}  |  ${company.email}  |  ${company.website}`, {
    x: margin,
    y: footerY + 32,
    size: 8.2,
    font: regular,
    color: black,
  });
  page.drawText(`GSTIN: ${company.gstin}`, {
    x: 382,
    y: footerY + 48,
    size: 8.2,
    font: regular,
    color: black,
  });
  page.drawText(`CIN: ${company.cin}`, {
    x: 382,
    y: footerY + 32,
    size: 8.2,
    font: regular,
    color: black,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4_PORTRAIT[0],
    height: 28,
    color: green,
  });
  page.drawRectangle({
    x: 0,
    y: 28,
    width: A4_PORTRAIT[0],
    height: 8,
    color: lightGreen,
  });

  document.setTitle(`Growblic internship confirmation ${data.referenceNumber}`);
  document.setAuthor(company.name);
  document.setSubject("Verified internship confirmation letter");
  return document.save();
}
