/**
 * Gera public/sitemap.xml localmente (dev / preview).
 * Em produção na Vercel, /sitemap.xml é servido pela API dinâmica (api/sitemap.mjs).
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { buildSitemapUrls, urlsToXml } from "./sitemap-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "sitemap.xml");

async function main() {
  const { urls, postCount } = await buildSitemapUrls();
  const xml = urlsToXml(urls);

  writeFileSync(outPath, xml, "utf8");
  console.log("[sitemap]", outPath, `— ${urls.length} URLs (${postCount} posts)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
