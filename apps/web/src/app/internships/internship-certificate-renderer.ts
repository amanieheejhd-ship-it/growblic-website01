import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type {
  ConfirmationLetterAssets,
  ConfirmationLetterInput,
  ProgramCertificateContent,
} from "./internship-confirmation-pdf";

type CertificateText = {
  issueDate: string;
  joiningDate: string;
  referenceNumber: string;
};

const pageWidth = 595.28;
const pageHeight = 841.89;
const navy = rgb(0.055, 0.11, 0.2);
const slate = rgb(0.28, 0.34, 0.43);
const green = rgb(0.16, 0.62, 0.34);
const line = rgb(0.83, 0.87, 0.85);
const ivory = rgb(0.997, 0.994, 0.985);

function safeText(font: PDFFont, value: string) {
  const supported = new Set(font.getCharacterSet());

  return Array.from(value, (character) =>
    supported.has(character.codePointAt(0) ?? 0) ? character : "?",
  ).join("");
}

function fitFontSize(
  font: PDFFont,
  value: string,
  maximumWidth: number,
  preferredSize: number,
  minimumSize: number,
) {
  let size = preferredSize;

  while (size > minimumSize && font.widthOfTextAtSize(value, size) > maximumWidth) {
    size -= 0.2;
  }

  return size;
}

export async function generateInternshipCertificatePdf(
  assets: ConfirmationLetterAssets,
  input: ConfirmationLetterInput,
  content: ProgramCertificateContent,
  text: CertificateText,
) {
  const document = await PDFDocument.create();
  const page = document.addPage([pageWidth, pageHeight]);
  const regularFont = await document.embedFont(StandardFonts.Helvetica);
  const boldFont = await document.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await document.embedFont(StandardFonts.HelveticaOblique);
  const logo = await document.embedPng(assets.logo);

  const drawCentered = (
    value: string,
    y: number,
    size: number,
    font: PDFFont,
    color = navy,
  ) => {
    const valueSafe = safeText(font, value);
    page.drawText(valueSafe, {
      x: (pageWidth - font.widthOfTextAtSize(valueSafe, size)) / 2,
      y,
      size,
      font,
      color,
    });
  };

  const drawBulletGrid = (
    items: readonly string[],
    startY: number,
    columns: 2 | 3,
  ) => {
    const left = 48;
    const availableWidth = 499;
    const gap = columns === 2 ? 24 : 18;
    const columnWidth = (availableWidth - gap * (columns - 1)) / columns;
    const rows = Math.ceil(items.length / columns);

    items.forEach((item, index) => {
      const column = Math.floor(index / rows);
      const row = index % rows;
      const x = left + column * (columnWidth + gap);
      const y = startY - row * 15;
      const itemSafe = safeText(regularFont, item);
      const itemSize = fitFontSize(
        regularFont,
        itemSafe,
        columnWidth - 13,
        9.5,
        8.7,
      );

      page.drawCircle({ x: x + 3, y: y + 3.5, size: 2, color: green });
      page.drawText(itemSafe, {
        x: x + 11,
        y,
        size: itemSize,
        font: regularFont,
        color: slate,
      });
    });
  };

  const drawSection = (
    title: string,
    items: readonly string[],
    headingY: number,
    columns: 2 | 3,
  ) => {
    page.drawText(title, {
      x: 48,
      y: headingY,
      size: 11,
      font: boldFont,
      color: green,
    });
    page.drawLine({
      start: { x: 48, y: headingY - 9 },
      end: { x: 547, y: headingY - 9 },
      thickness: 0.7,
      color: line,
    });
    drawBulletGrid(items, headingY - 27, columns);
  };

  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: ivory,
  });
  page.drawRectangle({
    x: 20,
    y: 20,
    width: pageWidth - 40,
    height: pageHeight - 40,
    borderColor: navy,
    borderWidth: 1,
  });
  page.drawRectangle({
    x: 26,
    y: 26,
    width: pageWidth - 52,
    height: pageHeight - 52,
    borderColor: line,
    borderWidth: 0.6,
  });
  page.drawLine({
    start: { x: 26, y: 815 },
    end: { x: 118, y: 815 },
    thickness: 2.3,
    color: green,
  });
  page.drawLine({
    start: { x: 477, y: 26 },
    end: { x: 569, y: 26 },
    thickness: 2.3,
    color: green,
  });

  page.drawImage(logo, { x: 46, y: 756, width: 44, height: 44 });
  page.drawText("Growblic", {
    x: 103,
    y: 773,
    size: 25,
    font: boldFont,
    color: navy,
  });
  page.drawText("Software Development Company", {
    x: 104,
    y: 756,
    size: 10.5,
    font: regularFont,
    color: green,
  });
  page.drawText("REFERENCE NUMBER", {
    x: 408,
    y: 790,
    size: 8.8,
    font: boldFont,
    color: green,
  });
  page.drawText(text.referenceNumber, {
    x: 408,
    y: 774,
    size: 9.5,
    font: regularFont,
    color: navy,
  });
  page.drawText("ISSUE DATE", {
    x: 408,
    y: 753,
    size: 8.8,
    font: boldFont,
    color: green,
  });
  page.drawText(text.issueDate, {
    x: 408,
    y: 737,
    size: 9.5,
    font: regularFont,
    color: navy,
  });
  page.drawLine({
    start: { x: 46, y: 720 },
    end: { x: 549, y: 720 },
    thickness: 0.8,
    color: line,
  });

  drawCentered("INTERNSHIP CONFIRMATION CERTIFICATE", 684, 22, boldFont);
  page.drawLine({
    start: { x: 252, y: 672 },
    end: { x: 343, y: 672 },
    thickness: 1.5,
    color: green,
  });
  drawCentered("This is to certify that", 649, 11.5, regularFont, slate);

  const nameSafe = safeText(boldFont, input.fullName);
  drawCentered(
    nameSafe,
    613,
    fitFontSize(boldFont, nameSafe, 470, 28, 24),
    boldFont,
  );
  drawCentered("has been enrolled in the", 587, 11.5, regularFont, slate);
  const programSafe = safeText(boldFont, input.program);
  drawCentered(
    programSafe,
    559,
    fitFontSize(boldFont, programSafe, 440, 17, 15),
    boldFont,
    green,
  );
  drawCentered(
    `internship program at Growblic Private Limited for a duration of ${input.durationDays} days,`,
    536,
    11,
    regularFont,
    slate,
  );
  drawCentered(
    `commencing on ${text.joiningDate}.`,
    518,
    11,
    regularFont,
    slate,
  );

  drawSection("WHAT THE INTERN WILL LEARN", content.learning, 480, 2);
  drawSection("BASIC RESPONSIBILITIES", content.responsibilities, 395, 2);
  drawSection("SKILLS COVERED", content.skills, 310, 3);

  drawCentered(
    "We wish the participant a valuable and rewarding learning experience.",
    215,
    10.5,
    italicFont,
    slate,
  );

  page.drawText("Bintu Malik", {
    x: 392,
    y: 190,
    size: 16,
    font: italicFont,
    color: navy,
  });
  page.drawLine({
    start: { x: 371, y: 181 },
    end: { x: 521, y: 181 },
    thickness: 0.7,
    color: line,
  });
  page.drawText("Authorized Signatory", {
    x: 392,
    y: 164,
    size: 9.5,
    font: boldFont,
    color: navy,
  });
  page.drawText("Growblic Private Limited", {
    x: 383,
    y: 148,
    size: 9,
    font: regularFont,
    color: slate,
  });

  page.drawLine({
    start: { x: 46, y: 125 },
    end: { x: 549, y: 125 },
    thickness: 1.1,
    color: green,
  });
  page.drawText(
    "182/80, Goyal traders, Industrial Area Phase 1, Chandigarh 160002",
    {
      x: 46,
      y: 101,
      size: 8.8,
      font: regularFont,
      color: slate,
    },
  );
  page.drawText("+91 8377001500  |  hello@growblic.com  |  www.growblic.com", {
    x: 46,
    y: 83,
    size: 8.8,
    font: regularFont,
    color: slate,
  });
  page.drawText("GSTIN: 06AAMCG3210D1Z4", {
    x: 390,
    y: 101,
    size: 8.8,
    font: boldFont,
    color: navy,
  });
  page.drawText("CIN: U63120HR2025PTC135768", {
    x: 390,
    y: 83,
    size: 8.8,
    font: boldFont,
    color: navy,
  });

  return document.save({ useObjectStreams: false });
}
