import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import {
  growblicLogoPngBytes,
} from "./internship-invoice.pdf";
import {
  loadAuthorizedSignatureFontBytes,
} from "./internship-confirmation.pdf";

export const CERTIFICATE_A4_LANDSCAPE: [number, number] = [841.89, 595.28];

export type InternshipCertificatePdfData = {
  certificateNumber: string;
  issueDate: Date;
  candidateName: string;
  program: string;
  designation: string;
  durationDays: number;
  joiningDate: Date;
  completionDate: Date;
  skills: string[];
  projectWork: string | null;
  performanceSummary: string | null;
  verificationReference: string;
};

function dateInIndia(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function fit(font: PDFFont, text: string, size: number, width: number) {
  while (size > 9 && font.widthOfTextAtSize(text, size) > width) size -= 0.5;
  return size;
}

function centeredX(font: PDFFont, text: string, size: number) {
  return (CERTIFICATE_A4_LANDSCAPE[0] - font.widthOfTextAtSize(text, size)) / 2;
}

function wrappedLines(font: PDFFont, text: string, size: number, width: number, maximum: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  let truncated = false;
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === maximum) {
        truncated = true;
        break;
      }
    }
  }
  if (line && lines.length < maximum) lines.push(line);
  if (truncated && lines.length === maximum) {
    let last = lines[maximum - 1];
    while (last.length > 1 && font.widthOfTextAtSize(`${last}...`, size) > width) {
      last = last.slice(0, -1);
    }
    lines[maximum - 1] = `${last}...`;
  }
  return lines;
}

export async function generateInternshipCertificatePdf(
  data: InternshipCertificatePdfData,
) {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const page = document.addPage(CERTIFICATE_A4_LANDSCAPE);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const signature = await document.embedFont(
    await loadAuthorizedSignatureFontBytes(),
    { subset: true },
  );
  const logo = await document.embedPng(growblicLogoPngBytes());
  const navy = rgb(0.04, 0.11, 0.2);
  const blue = rgb(41 / 255, 82 / 255, 121 / 255);
  const green = rgb(0.08, 0.53, 0.22);
  const gold = rgb(0.76, 0.58, 0.17);
  const slate = rgb(0.3, 0.35, 0.42);

  page.drawRectangle({ x: 0, y: 0, width: 841.89, height: 595.28, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 16, y: 16, width: 809.89, height: 563.28, borderColor: navy, borderWidth: 2 });
  page.drawRectangle({ x: 23, y: 23, width: 795.89, height: 549.28, borderColor: gold, borderWidth: 0.8 });
  page.drawImage(logo, { x: 50, y: 500, width: 48, height: 48 });
  page.drawText("Growblic Private Limited", { x: 112, y: 526, size: 19, font: bold, color: navy });
  page.drawText("Software Development Company", { x: 113, y: 507, size: 9, font: regular, color: green });
  page.drawText(data.certificateNumber, { x: 650, y: 526, size: 9, font: bold, color: navy });
  page.drawText(`Issued: ${dateInIndia(data.issueDate)}`, { x: 650, y: 508, size: 8.5, font: regular, color: slate });

  const title = "CERTIFICATE OF INTERNSHIP";
  page.drawText(title, { x: centeredX(bold, title, 28), y: 454, size: 28, font: bold, color: navy });
  page.drawText("This certificate is proudly presented to", {
    x: centeredX(regular, "This certificate is proudly presented to", 11),
    y: 424, size: 11, font: regular, color: slate,
  });
  const nameSize = fit(bold, data.candidateName, 26, 650);
  page.drawText(data.candidateName, {
    x: centeredX(bold, data.candidateName, nameSize),
    y: 382, size: nameSize, font: bold, color: blue,
  });
  page.drawLine({ start: { x: 190, y: 372 }, end: { x: 652, y: 372 }, thickness: 0.7, color: gold });

  const completion = `for successfully completing a ${data.durationDays}-day ${data.designation || data.program} internship`;
  const completionSize = fit(regular, completion, 12, 710);
  page.drawText(completion, {
    x: centeredX(regular, completion, completionSize),
    y: 342, size: completionSize, font: regular, color: navy,
  });
  const dates = `from ${dateInIndia(data.joiningDate)} to ${dateInIndia(data.completionDate)}.`;
  page.drawText(dates, { x: centeredX(regular, dates, 11), y: 320, size: 11, font: regular, color: navy });

  const skills = data.skills.slice(0, 10).join("  •  ");
  page.drawText("Verified skills", { x: 66, y: 278, size: 9, font: bold, color: green });
  wrappedLines(regular, skills, 9.5, 710, 2).forEach((line, index) => {
    page.drawText(line, { x: 66, y: 259 - index * 14, size: 9.5, font: regular, color: navy });
  });

  const summary = [data.projectWork, data.performanceSummary].filter(Boolean).join(" — ");
  if (summary) {
    wrappedLines(regular, summary, 8.5, 710, 2).forEach((line, index) => {
      page.drawText(line, { x: 66, y: 214 - index * 13, size: 8.5, font: regular, color: slate });
    });
  }

  page.drawText("Authorized Signatory", { x: 66, y: 133, size: 9.5, font: bold, color: navy });
  page.drawText("Bintu Malik", { x: 66, y: 103, size: 16, font: signature, color: blue });
  page.drawText("Growblic Private Limited", { x: 66, y: 82, size: 8.5, font: regular, color: slate });
  page.drawText(`Verification reference: ${data.verificationReference}`, {
    x: 470, y: 98, size: 8.5, font: bold, color: navy,
  });
  page.drawText("hello@growblic.com  |  www.growblic.com  |  +91 8377001500", {
    x: 470, y: 80, size: 8, font: regular, color: slate,
  });

  document.setTitle(`Growblic internship certificate ${data.certificateNumber}`);
  document.setAuthor("Growblic Private Limited");
  document.setSubject("Verified internship completion certificate");
  return document.save();
}
