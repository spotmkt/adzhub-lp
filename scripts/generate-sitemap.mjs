/**
 * Gera public/sitemap.xml antes do build.
 * Rotas estáticas + posts publicados em blog_posts (Supabase REST).
 * Credenciais: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (ou .env local),
 * ou fallback alinhado a src/integrations/supabase/client.ts
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "public", "sitemap.xml");

const DEFAULT_SUPABASE_URL = "https://xciubsogktecqcgafwaa.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVic29na3RlY3FjZ2Fmd2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjMyMzAsImV4cCI6MjA3MDMzOTIzMH0.0TTqMujpYz86Y911ykpgqO1VhyNcQ1UhbtTd3gwWyn0";

function loadDotEnv() {
  for (const name of [".env", ".env.local", ".env.production"]) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    try {
      const raw = readFileSync(p, "utf8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = val;
      }
    } catch {
      /* ignore */
    }
  }
}

loadDotEnv();

const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://adzhub.com.br").replace(/\/$/, "");

const staticPaths = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/conteudo", changefreq: "weekly", priority: "0.9" },
  { path: "/chat", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/termos", changefreq: "yearly", priority: "0.3" },
  { path: "/privacidade", changefreq: "yearly", priority: "0.3" },
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function blogLoc(slug) {
  const path = `/blog/${encodeURIComponent(slug)}`;
  return new URL(path, `${SITE_URL}/`).href;
}

async function fetchBlogPosts() {
  const url =
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    DEFAULT_ANON_KEY;

  const now = new Date().toISOString();
  const base = url.replace(/\/$/, "");
  const restUrl = `${base}/rest/v1/blog_posts?select=slug,updated_at,published_at&status=eq.published&published_at=lte.${encodeURIComponent(now)}&order=published_at.desc`;

  try {
    const res = await fetch(restUrl, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    if (!res.ok) {
      console.warn("[sitemap] blog_posts:", res.status, await res.text());
      return [];
    }
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch (e) {
    console.warn("[sitemap] fetch blog_posts:", e.message);
    return [];
  }
}

function toLastmod(iso) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return String(iso).slice(0, 10);
}

async function main() {
  const posts = await fetchBlogPosts();
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];

  for (const s of staticPaths) {
    urls.push({
      loc: new URL(s.path, `${SITE_URL}/`).href,
      changefreq: s.changefreq,
      priority: s.priority,
      lastmod: today,
    });
  }

  for (const p of posts) {
    if (!p?.slug || typeof p.slug !== "string") continue;
    urls.push({
      loc: blogLoc(p.slug),
      changefreq: "monthly",
      priority: "0.7",
      lastmod: toLastmod(p.updated_at || p.published_at),
    });
  }

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  writeFileSync(outPath, xml, "utf8");
  console.log("[sitemap]", outPath, `— ${urls.length} URLs (${posts.length} posts)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
