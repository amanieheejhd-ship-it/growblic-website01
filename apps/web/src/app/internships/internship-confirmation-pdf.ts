import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export const internshipPrograms = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Flutter Developer",
  "React Native Developer",
  "Android Developer",
  "iOS Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "QA Engineer",
  "AI/ML Engineer",
  "Data Analyst",
  "Digital Marketing",
  "Human Resources",
  "Business Development",
] as const;

export const confirmationLetterTypography = {
  companyName: 30,
  subtitle: 11.5,
  reference: 10,
  title: 22,
  body: 12,
  studentName: 14.5,
  detailLabel: 10,
  detailValue: 12.5,
  footer: 9.5,
} as const;

export type InternshipProgram = (typeof internshipPrograms)[number];

export type ConfirmationLetterInput = {
  fullName: string;
  program: string;
  durationDays: number;
  joiningDate: string;
  referenceNumber?: string;
};

export type ConfirmationLetterAssets = {
  signature: ArrayBuffer | Uint8Array;
};

const pageWidth = 595.28;
const pageHeight = 841.89;
const navy = rgb(0.055, 0.11, 0.2);
const slate = rgb(0.28, 0.34, 0.43);
const blue = rgb(0.15, 0.39, 0.92);
const green = rgb(0.16, 0.62, 0.34);
const paleBlue = rgb(0.95, 0.975, 1);
const paleGreen = rgb(0.94, 0.985, 0.955);
const line = rgb(0.84, 0.89, 0.96);
const white = rgb(1, 1, 1);

function cleanText(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

function fontSafeText(font: PDFFont, value: string) {
  const supported = new Set(font.getCharacterSet());

  return Array.from(cleanText(value), (character) =>
    supported.has(character.codePointAt(0) ?? 0) ? character : "?",
  ).join("");
}

function fitFontSize(
  font: PDFFont,
  text: string,
  maximumWidth: number,
  preferredSize: number,
  minimumSize = 9.5,
) {
  let size = preferredSize;

  while (size > minimumSize && font.widthOfTextAtSize(text, size) > maximumWidth) {
    size -= 0.2;
  }

  return size;
}

function wrapText(font: PDFFont, value: string, size: number, width: number) {
  const words = fontSafeText(font, value).split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (font.widthOfTextAtSize(candidate, size) <= width || !currentLine) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function validateConfirmationInput(input: ConfirmationLetterInput) {
  const errors: {
    fullName?: string;
    program?: string;
    joiningDate?: string;
  } = {};

  if (!cleanText(input.fullName)) {
    errors.fullName = "Full name is required.";
  }

  if (!internshipPrograms.includes(input.program as InternshipProgram)) {
    errors.program = "Select a valid program.";
  }

  try {
    formatConfirmationDate(input.joiningDate);
  } catch {
    errors.joiningDate = "Date of joining is required.";
  }

  return errors;
}

export function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatConfirmationDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("A valid joining date is required.");
  }

  const [, year, month, day] = match;
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const localDate = new Date(numericYear, numericMonth - 1, numericDay);

  if (
    localDate.getFullYear() !== numericYear ||
    localDate.getMonth() !== numericMonth - 1 ||
    localDate.getDate() !== numericDay
  ) {
    throw new Error("A valid joining date is required.");
  }

  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][numericMonth - 1];

  return `${numericDay} ${monthName} ${numericYear}`;
}

export function createConfirmationReference(
  date = new Date(),
  randomValue = Math.random(),
) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const suffix = Math.floor(randomValue * 1_000_000)
    .toString()
    .padStart(6, "0");

  return `${year}/${month}/${suffix}`;
}

export function confirmationFilename(fullName: string) {
  const safeName = cleanText(fullName)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return `Growblic-Internship-Confirmation-${safeName || "Student"}.pdf`;
}

export function replaceObjectUrl(
  previousUrl: string | null,
  nextUrl: string,
  revoke: (url: string) => void,
) {
  if (previousUrl && previousUrl !== nextUrl) {
    revoke(previousUrl);
  }

  return nextUrl;
}

export function highDpiPreviewScale(devicePixelRatio: number) {
  return Math.max(2, Math.min(devicePixelRatio || 1, 3));
}

export function confirmationDynamicText(
  input: ConfirmationLetterInput,
  issuedAt = new Date(),
) {
  const joiningDate = formatConfirmationDate(input.joiningDate);

  return {
    issueDate: formatConfirmationDate(localDateValue(issuedAt)),
    joiningDate,
    referenceNumber:
      input.referenceNumber ?? createConfirmationReference(),
    statement: `This is to confirm that ${cleanText(input.fullName)} has been enrolled in a ${input.durationDays}-day internship program as a ${cleanText(input.program)}.`,
  };
}

export async function generateConfirmationLetter(
  assets: ConfirmationLetterAssets,
  input: ConfirmationLetterInput,
) {
  const errors = validateConfirmationInput(input);

  if (errors.fullName || errors.program || errors.joiningDate) {
    throw new Error(
      errors.fullName ?? errors.program ?? errors.joiningDate,
    );
  }

  if (![30, 45, 60, 90, 180].includes(input.durationDays)) {
    throw new Error("A valid internship duration is required.");
  }

  const document = await PDFDocument.create();
  const page = document.addPage([pageWidth, pageHeight]);
  const regularFont = await document.embedFont(StandardFonts.Helvetica);
  const boldFont = await document.embedFont(StandardFonts.HelveticaBold);
  const watermarkFont = await document.embedFont(
    StandardFonts.HelveticaBoldOblique,
  );
  const signature = await document.embedPng(assets.signature);
  const text = confirmationDynamicText(input);
  const safeName = fontSafeText(boldFont, input.fullName);
  const safeProgram = fontSafeText(boldFont, input.program);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: white,
  });

  page.drawRectangle({ x: 46, y: 748, width: 48, height: 48, color: navy });
  page.drawText("G", {
    x: 57,
    y: 759,
    size: 27,
    font: boldFont,
    color: white,
  });
  page.drawText("Growblic", {
    x: 108,
    y: 766,
    size: confirmationLetterTypography.companyName,
    font: boldFont,
    color: navy,
  });
  page.drawText("Software Development Company", {
    x: 110,
    y: 748,
    size: confirmationLetterTypography.subtitle,
    font: regularFont,
    color: green,
  });

  page.drawText(`Ref No: ${text.referenceNumber}`, {
    x: 405,
    y: 777,
    size: fitFontSize(
      regularFont,
      `Ref No: ${text.referenceNumber}`,
      145,
      confirmationLetterTypography.reference,
    ),
    font: regularFont,
    color: slate,
  });
  page.drawText(`Date: ${text.issueDate}`, {
    x: 405,
    y: 757,
    size: confirmationLetterTypography.reference,
    font: regularFont,
    color: slate,
  });
  page.drawLine({
    start: { x: 46, y: 724 },
    end: { x: 549, y: 724 },
    thickness: 1.2,
    color: line,
  });
  page.drawLine({
    start: { x: 46, y: 724 },
    end: { x: 164, y: 724 },
    thickness: 3,
    color: green,
  });

  page.drawText("Internship Confirmation Letter", {
    x: 46,
    y: 672,
    size: confirmationLetterTypography.title,
    font: boldFont,
    color: navy,
  });
  page.drawText("This is to confirm that", {
    x: 46,
    y: 632,
    size: confirmationLetterTypography.body,
    font: regularFont,
    color: slate,
  });
  page.drawText(safeName, {
    x: 46,
    y: 606,
    size: fitFontSize(
      boldFont,
      safeName,
      503,
      confirmationLetterTypography.studentName,
      11.5,
    ),
    font: boldFont,
    color: blue,
  });
  page.drawText(
    `has been enrolled in a ${input.durationDays}-day internship program as a`,
    {
      x: 46,
      y: 581,
      size: confirmationLetterTypography.body,
      font: regularFont,
      color: slate,
    },
  );
  page.drawText(safeProgram, {
    x: 46,
    y: 556,
    size: fitFontSize(
      boldFont,
      safeProgram,
      503,
      13.5,
      11.5,
    ),
    font: boldFont,
    color: navy,
  });

  page.drawRectangle({
    x: 46,
    y: 392,
    width: 503,
    height: 132,
    color: paleBlue,
    borderColor: line,
    borderWidth: 1,
  });
  page.drawRectangle({ x: 46, y: 518, width: 503, height: 6, color: green });
  page.drawLine({
    start: { x: 297.5, y: 406 },
    end: { x: 297.5, y: 510 },
    thickness: 1,
    color: line,
  });
  page.drawLine({
    start: { x: 60, y: 458 },
    end: { x: 535, y: 458 },
    thickness: 1,
    color: line,
  });

  const drawDetail = (
    label: string,
    value: string,
    x: number,
    labelY: number,
    maximumWidth = 220,
  ) => {
    page.drawText(label.toUpperCase(), {
      x,
      y: labelY,
      size: confirmationLetterTypography.detailLabel,
      font: boldFont,
      color: green,
    });
    const safeValue = fontSafeText(boldFont, value);
    page.drawText(safeValue, {
      x,
      y: labelY - 20,
      size: fitFontSize(
        boldFont,
        safeValue,
        maximumWidth,
        confirmationLetterTypography.detailValue,
      ),
      font: boldFont,
      color: navy,
    });
  };

  drawDetail("Company", "Growblic Private Limited", 62, 488);
  drawDetail("Program", input.program, 314, 488);
  drawDetail("Duration", `${input.durationDays} days`, 62, 438);
  drawDetail("Date of Joining", text.joiningDate, 314, 438);

  const description =
    "This internship program is designed to provide practical industry exposure, hands-on experience in modern software development technologies, and innovative learning opportunities. The program aims to enhance technical skills, problem-solving abilities, teamwork, and professional growth through real-world projects and sustainable digital solutions.";
  const descriptionLines = wrapText(
    regularFont,
    description,
    confirmationLetterTypography.body,
    503,
  );

  descriptionLines.forEach((descriptionLine, index) => {
    page.drawText(descriptionLine, {
      x: 46,
      y: 354 - index * 17,
      size: confirmationLetterTypography.body,
      font: regularFont,
      color: slate,
    });
  });

  page.drawText("G", {
    x: 224,
    y: 148,
    size: 170,
    font: watermarkFont,
    color: green,
    opacity: 0.045,
  });

  page.drawText("Authorized Signatory", {
    x: 46,
    y: 210,
    size: 10.5,
    font: boldFont,
    color: navy,
  });
  page.drawImage(signature, {
    x: 48,
    y: 165,
    width: 80,
    height: 35,
  });
  page.drawLine({
    start: { x: 46, y: 126 },
    end: { x: 549, y: 126 },
    thickness: 1,
    color: line,
  });

  page.drawText("182/80, Goyal traders, Industrial Area Phase 1, Chandigarh 160002", {
    x: 46,
    y: 98,
    size: confirmationLetterTypography.footer,
    font: regularFont,
    color: slate,
  });
  page.drawText("+91 8377001500  |  hello@growblic.com  |  www.growblic.com", {
    x: 46,
    y: 79,
    size: confirmationLetterTypography.footer,
    font: regularFont,
    color: slate,
  });
  page.drawText("GSTIN: 06AAMCG3210D1Z4", {
    x: 392,
    y: 98,
    size: confirmationLetterTypography.footer,
    font: boldFont,
    color: navy,
  });
  page.drawText("CIN: U63120HR2025PTC135768", {
    x: 392,
    y: 79,
    size: confirmationLetterTypography.footer,
    font: boldFont,
    color: navy,
  });

  page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 9, color: blue });
  page.drawRectangle({ x: 0, y: 9, width: pageWidth, height: 5, color: paleGreen });
  page.drawRectangle({ x: 390, y: 0, width: 205.28, height: 9, color: green });

  return document.save({ useObjectStreams: false });
}
