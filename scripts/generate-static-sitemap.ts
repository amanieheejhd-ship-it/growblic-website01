import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sitemap from "../apps/web/src/app/sitemap";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

async function main() {
  const entries = sitemap();
  const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((entry) => {
    const lastModified =
      entry.lastModified instanceof Date
        ? entry.lastModified.toISOString()
        : entry.lastModified;

    return [
      "  <url>",
      `    <loc>${escapeXml(entry.url.toString())}</loc>`,
      lastModified
        ? `    <lastmod>${escapeXml(String(lastModified))}</lastmod>`
        : "",
      entry.changeFrequency
        ? `    <changefreq>${entry.changeFrequency}</changefreq>`
        : "",
      entry.priority !== undefined
        ? `    <priority>${entry.priority}</priority>`
        : "",
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  }),
  "</urlset>",
  "",
  ].join("\n");

  const outputDirectory = join(process.cwd(), "apps/web/out");
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(join(outputDirectory, "sitemap.xml"), xml, "utf8");
}

void main();
