import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

const A5_PORTRAIT: [number, number] = [419.5276, 595.2756];
const COMPANY_ADDRESS = "182/80, Goyal traders, Industrial Area Phase 1,";
const COMPANY_CITY = "Chandigarh 160002";
const LOGO_PNG_BASE64 = "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";

export function growblicLogoPngBytes() {
  return Buffer.from(LOGO_PNG_BASE64, "base64");
}

export type InvoicePdfData = {
  invoiceNumber: string;
  issuedAt: Date;
  paidAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  program: string;
  durationDays: number;
  amountPaise: number;
  currency: string;
  status: "PAID";
  gatewayOrderId: string;
  gatewayPaymentId: string;
  paymentMethod?: string | null;
};

function formatAmount(paise: number, currency: string) {
  return `${currency} ${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function dateInIndia(value: Date) {
  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function timeInIndia(value: Date) {
  return `${value.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })} IST`;
}

function fitText(font: PDFFont, text: string, preferredSize: number, width: number) {
  let size = preferredSize;
  while (size > 7.5 && font.widthOfTextAtSize(text, size) > width) size -= 0.25;
  return size;
}

function drawRow(
  page: PDFPage,
  fonts: { regular: PDFFont; bold: PDFFont },
  colors: { navy: ReturnType<typeof rgb>; slate: ReturnType<typeof rgb> },
  label: string,
  value: string,
  y: number,
) {
  page.drawText(label, { x: 28, y, size: 8.5, font: fonts.regular, color: colors.slate });
  page.drawText(value, {
    x: 137,
    y,
    size: fitText(fonts.bold, value, 9.5, 254),
    font: fonts.bold,
    color: colors.navy,
  });
}

export async function generateInternshipInvoicePdf(data: InvoicePdfData) {
  const document = await PDFDocument.create();
  const page = document.addPage(A5_PORTRAIT);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const logo = await document.embedPng(Buffer.from(LOGO_PNG_BASE64, "base64"));
  const navy = rgb(0.055, 0.09, 0.16);
  const slate = rgb(0.31, 0.36, 0.44);
  const green = rgb(0.035, 0.57, 0.35);
  const paleGreen = rgb(0.94, 0.985, 0.965);
  const line = rgb(0.84, 0.87, 0.89);
  const fonts = { regular, bold };
  const colors = { navy, slate };

  page.drawRectangle({ x: 0, y: 0, width: A5_PORTRAIT[0], height: A5_PORTRAIT[1], color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 0, y: 587.2756, width: A5_PORTRAIT[0], height: 8, color: green });
  page.drawImage(logo, { x: 28, y: 540, width: 28, height: 28 });
  page.drawText("Growblic Private Limited", { x: 76, y: 551, size: 18, font: bold, color: navy });
  page.drawText("Software Development Company", { x: 76, y: 535, size: 8.5, font: regular, color: slate });
  const receiptTitle = "PAYMENT RECEIPT";
  page.drawText(receiptTitle, {
    x: 391.5 - bold.widthOfTextAtSize(receiptTitle, 16),
    y: 508,
    size: 16,
    font: bold,
    color: green,
  });
  page.drawText(`Invoice: ${data.invoiceNumber}`, {
    x: 28,
    y: 509,
    size: fitText(regular, `Invoice: ${data.invoiceNumber}`, 8.5, 225),
    font: regular,
    color: slate,
  });
  page.drawText(`Issued: ${dateInIndia(data.issuedAt)}`, { x: 28, y: 494, size: 8.5, font: regular, color: slate });
  page.drawLine({ start: { x: 28, y: 480 }, end: { x: 391.5, y: 480 }, thickness: 1, color: line });

  page.drawText("CUSTOMER", { x: 28, y: 462, size: 9, font: bold, color: green });
  drawRow(page, fonts, colors, "Customer Name", data.customerName, 445);
  drawRow(page, fonts, colors, "Customer Email", data.customerEmail, 429);
  drawRow(page, fonts, colors, "Customer Phone", data.customerPhone, 413);

  page.drawLine({ start: { x: 28, y: 398 }, end: { x: 391.5, y: 398 }, thickness: 0.75, color: line });
  page.drawText("PAYMENT DETAILS", { x: 28, y: 380, size: 9, font: bold, color: green });
  drawRow(page, fonts, colors, "Internship Program", data.program, 363);
  drawRow(page, fonts, colors, "Duration", `${data.durationDays} days`, 349);
  drawRow(page, fonts, colors, "Amount Paid", (data.amountPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 }), 335);
  drawRow(page, fonts, colors, "Currency", data.currency, 321);
  drawRow(page, fonts, colors, "Payment Status", data.status, 307);
  drawRow(page, fonts, colors, "Payment Date", dateInIndia(data.paidAt), 293);
  drawRow(page, fonts, colors, "Payment Time", timeInIndia(data.paidAt), 279);
  drawRow(page, fonts, colors, "Razorpay Order ID", data.gatewayOrderId, 265);
  drawRow(page, fonts, colors, "Razorpay Payment ID", data.gatewayPaymentId, 251);
  if (data.paymentMethod) drawRow(page, fonts, colors, "Payment Method", data.paymentMethod.toUpperCase(), 237);

  page.drawRectangle({ x: 28, y: 190, width: 363.5, height: 36, color: paleGreen });
  page.drawText("Total Paid", { x: 42, y: 203, size: 11, font: bold, color: navy });
  const total = formatAmount(data.amountPaise, data.currency);
  const totalSize = fitText(bold, total, 16, 178);
  page.drawText(total, {
    x: 377 - bold.widthOfTextAtSize(total, totalSize),
    y: 199.5,
    size: totalSize,
    font: bold,
    color: green,
  });
  page.drawText("Tax breakdown is not shown. This document records the verified amount received.", {
    x: 28,
    y: 173,
    size: 7.6,
    font: regular,
    color: slate,
  });

  page.drawLine({ start: { x: 28, y: 158 }, end: { x: 391.5, y: 158 }, thickness: 0.75, color: line });
  page.drawText("PAID TO", { x: 28, y: 142, size: 9, font: bold, color: green });
  drawRow(page, fonts, colors, "Company", "Growblic Private Limited", 125);
  drawRow(page, fonts, colors, "Address", COMPANY_ADDRESS, 109);
  drawRow(page, fonts, colors, "", COMPANY_CITY, 94);
  drawRow(page, fonts, colors, "Email", "hello@growblic.com", 78);
  drawRow(page, fonts, colors, "Phone", "+91 8377001500", 62);
  drawRow(page, fonts, colors, "Website", "www.growblic.com", 46);
  page.drawText("GSTIN: 06AAMCG3210D1Z4", { x: 28, y: 26, size: 7.8, font: bold, color: navy });
  page.drawText("CIN: U63120HR2025PTC135768", { x: 210, y: 26, size: 7.8, font: bold, color: navy });
  page.drawRectangle({ x: 0, y: 0, width: A5_PORTRAIT[0], height: 8, color: green });

  document.setTitle(`Growblic payment receipt ${data.invoiceNumber}`);
  document.setAuthor("Growblic Private Limited");
  document.setSubject("Verified internship payment receipt");
  return document.save();
}
