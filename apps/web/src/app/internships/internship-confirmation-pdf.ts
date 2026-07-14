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

export type InternshipProgram = (typeof internshipPrograms)[number];

export type ConfirmationLetterInput = {
  fullName: string;
  program: string;
  durationDays: number;
  joiningDate: string;
  referenceNumber?: string;
};

export type ConfirmationLetterAssets = {
  header: ArrayBuffer | Uint8Array;
  signature: ArrayBuffer | Uint8Array;
  footer: ArrayBuffer | Uint8Array;
};

const pageWidth = 595.5;
const pageHeight = 842.25;
const black = rgb(0.04, 0.04, 0.04);
const white = rgb(1, 1, 1);
const brandGreen = rgb(0.24, 0.62, 0.2);

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
  minimumSize = 7,
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
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (font.widthOfTextAtSize(candidate, size) <= width || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) {
    lines.push(line);
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

export function confirmationDynamicText(input: ConfirmationLetterInput) {
  const date = formatConfirmationDate(input.joiningDate);

  return {
    date,
    referenceNumber:
      input.referenceNumber ?? createConfirmationReference(),
    confirmationSentence: `This is to confirm that ${cleanText(input.fullName)} has been enrolled in a ${input.durationDays} day Internship program in ${cleanText(input.program)}.`,
    programLine: `2. Program: ${cleanText(input.program)}`,
    dateLine: `3. Date of Joining: ${date}`,
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
  const header = await document.embedPng(assets.header);
  const signature = await document.embedPng(assets.signature);
  const footer = await document.embedPng(assets.footer);
  const text = confirmationDynamicText(input);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: white,
  });

  page.drawImage(header, {
    x: 32,
    y: pageHeight - 68 - 72,
    width: 245,
    height: 72,
  });

  page.drawText("G", {
    x: 112,
    y: 176,
    size: 325,
    font: watermarkFont,
    color: brandGreen,
    opacity: 0.11,
  });

  page.drawText(`Ref No: ${text.referenceNumber}`, {
    x: 412,
    y: 690,
    size: fitFontSize(
      regularFont,
      `Ref No: ${text.referenceNumber}`,
      160,
      9.2,
    ),
    font: regularFont,
    color: black,
  });
  page.drawText(`Date: ${text.date}`, {
    x: 412,
    y: 666,
    size: 9.2,
    font: regularFont,
    color: black,
  });

  page.drawText("Internship Confirmation Letter", {
    x: 49,
    y: 582,
    size: 11,
    font: boldFont,
    color: black,
  });

  const confirmationSize = fitFontSize(
    regularFont,
    fontSafeText(regularFont, text.confirmationSentence),
    500,
    9.2,
    8.2,
  );
  const confirmationLines = wrapText(
    regularFont,
    text.confirmationSentence,
    confirmationSize,
    500,
  );

  confirmationLines.slice(0, 2).forEach((line, index) => {
    page.drawText(line, {
      x: 49,
      y: 568 - index * 13,
      size: confirmationSize,
      font: regularFont,
      color: black,
    });
  });

  page.drawText("1. Name of Company: Growblic Private Limited", {
    x: 50,
    y: 520,
    size: 9.2,
    font: regularFont,
    color: black,
  });
  page.drawText(fontSafeText(regularFont, text.programLine), {
    x: 50,
    y: 507,
    size: 9.2,
    font: regularFont,
    color: black,
  });
  page.drawText(text.dateLine, {
    x: 50,
    y: 494,
    size: 9.2,
    font: regularFont,
    color: black,
  });

  const description =
    "This internship program is designed to provide practical industry exposure, hands-on experience in modern software development technologies, and innovative learning opportunities. The program aims to enhance technical skills, problem-solving abilities, teamwork, and professional growth through real-world projects and sustainable digital solutions.";
  const descriptionLines = wrapText(regularFont, description, 9.2, 500);

  descriptionLines.forEach((line, index) => {
    page.drawText(line, {
      x: 50,
      y: 468 - index * 13,
      size: 9.2,
      font: regularFont,
      color: black,
    });
  });

  page.drawText("Authorized Signatory", {
    x: 38,
    y: 321,
    size: 9.2,
    font: regularFont,
    color: black,
  });
  page.drawImage(signature, {
    x: 48,
    y: 275,
    width: 85,
    height: 35,
  });
  page.drawImage(footer, {
    x: 1,
    y: 0,
    width: 594,
    height: 160,
  });

  return document.save({ useObjectStreams: false });
}
