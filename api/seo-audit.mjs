/**
 * POST /api/seo-audit
 * Proxy da LP → Edge Function `blog-seo-audit` (AdzSEO Analytics / MUVERA).
 *
 * Body:
 *   { url?: string, text?: string, title?: string, primary_keyword?: string }
 *
 * Env:
 *   SUPABASE_URL
 *   SUPABASE_ANON_KEY
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://xciubsogktecqcgafwaa.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVic29na3RlY3FjZ2Fmd2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjMyMzAsImV4cCI6MjA3MDMzOTIzMH0.0TTqMujpYz86Y911ykpgqO1VhyNcQ1UhbtTd3gwWyn0";

const MAX_TEXT_CHARS = 40_000;
const MAX_HTML_CHARS = 80_000;
const FETCH_TIMEOUT_MS = 12_000;

const FRIENDLY_ERROR =
  "Não conseguimos analisar o artigo agora. Tente novamente em instantes.";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 512 * 1024) {
        reject(new Error("body_too_large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function stripTags(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(str) {
  return String(str || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function extractMeta(html, name) {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`,
    "i",
  );
  const m = html.match(re) || html.match(re2);
  return m ? decodeEntities(m[1]).trim() : "";
}

function extractTitle(html) {
  const og = extractMeta(html, "og:title");
  if (og) return og;
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return decodeEntities(stripTags(h1[1])).slice(0, 200);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) return decodeEntities(stripTags(title[1])).slice(0, 200);
  return "Artigo";
}

/** Remove cromo de navegação para o score refletir o corpo do artigo. */
function stripChrome(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<form[\s\S]*?<\/form>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<aside[\s\S]*?<\/aside>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

function matchAllBlocks(rawHtml, tag) {
  const re = new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, "gi");
  return rawHtml.match(re) || [];
}

/**
 * Escolhe o bloco com mais texto real: páginas de blog costumam ter vários
 * `<article>` (cards de posts relacionados) antes do corpo do artigo.
 */
function extractArticleHtml(rawHtml) {
  const candidates = [
    ...matchAllBlocks(rawHtml, "article"),
    ...matchAllBlocks(rawHtml, "main"),
    ...matchAllBlocks(rawHtml, "body"),
  ];

  let best = "";
  let bestLength = 0;
  for (const candidate of candidates) {
    const cleaned = stripChrome(candidate);
    const length = stripTags(cleaned).length;
    if (length > bestLength) {
      best = cleaned;
      bestLength = length;
    }
  }

  if (!best) best = stripChrome(rawHtml);
  return best.slice(0, MAX_HTML_CHARS);
}

function textToHtml(text, title) {
  const paras = String(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("\n");
  return `<article><h1>${String(title || "Artigo").replace(/</g, "&lt;")}</h1>${paras}</article>`;
}

function normalizeUrl(value) {
  let u = String(value || "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

async function fetchArticleFromUrl(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AdzHubSeoAuditBot/1.0 (+https://www.adzhub.com.br)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!resp.ok) {
      throw new Error(`fetch_http_${resp.status}`);
    }
    const raw = await resp.text();
    const title = extractTitle(raw);
    const metaDescription =
      extractMeta(raw, "description") || extractMeta(raw, "og:description");
    const html = extractArticleHtml(raw);
    const plain = stripTags(html);
    if (plain.length < 120) {
      throw new Error("content_too_short");
    }
    return {
      title,
      meta_title: title.slice(0, 70),
      meta_description: metaDescription.slice(0, 180),
      html,
      source_url: url,
    };
  } finally {
    clearTimeout(t);
  }
}

async function callBlogSeoAudit(payload) {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/blog-seo-audit`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`blog-seo-audit invalid_json ${resp.status}`);
  }
  if (!resp.ok || data?.success === false) {
    throw new Error(data?.error || `blog-seo-audit HTTP ${resp.status}`);
  }
  return data;
}

function computeOverall(dimensions) {
  if (!dimensions || typeof dimensions !== "object") return null;
  const scores = Object.values(dimensions)
    .map((d) => (d && typeof d.score === "number" ? d.score : null))
    .filter((n) => n != null);
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return json(res, 204, {});
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, message: "Método não permitido." });
  }

  let payload;
  try {
    const raw = await readBody(req);
    payload = JSON.parse(raw.toString("utf8") || "{}");
  } catch {
    return json(res, 400, { ok: false, message: "Não entendemos os dados enviados." });
  }

  const url = normalizeUrl(payload.url);
  const text = String(payload.text || "").trim().slice(0, MAX_TEXT_CHARS);
  const titleInput = String(payload.title || "").trim().slice(0, 200);
  const keyword = String(payload.primary_keyword || "").trim().slice(0, 120);

  if (!url && text.length < 120) {
    return json(res, 400, {
      ok: false,
      message: "Cole a URL do artigo ou um texto com pelo menos ~120 caracteres.",
    });
  }

  let article;
  try {
    if (url) {
      article = await fetchArticleFromUrl(url);
    } else {
      const title = titleInput || text.split(/\n/).find((l) => l.trim())?.slice(0, 80) || "Artigo";
      article = {
        title,
        meta_title: title.slice(0, 70),
        meta_description: text.slice(0, 160),
        html: textToHtml(text, title),
        source_url: null,
      };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[seo-audit] fetch:", msg);
    if (msg === "content_too_short") {
      return json(res, 400, {
        ok: false,
        message: "Não encontramos texto suficiente nessa URL. Cole o conteúdo do artigo.",
      });
    }
    return json(res, 400, {
      ok: false,
      message: "Não conseguimos abrir essa URL. Confira o link ou cole o texto do artigo.",
    });
  }

  try {
    const audit = await callBlogSeoAudit({
      title: article.title,
      primary_keyword: keyword || article.title,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      html: article.html,
      deterministic_summary: "",
      link_contexts: [],
      site_pages: [],
      teia_text: "",
    });

    const overall =
      typeof audit.overall_score === "number"
        ? audit.overall_score
        : computeOverall(audit.dimensions);

    return json(res, 200, {
      ok: true,
      title: article.title,
      source_url: article.source_url,
      overall_score: overall,
      dimensions: audit.dimensions || {},
      issues: Array.isArray(audit.issues) ? audit.issues.slice(0, 8) : [],
      summary: typeof audit.summary === "string" ? audit.summary : "",
      intent_facets: Array.isArray(audit.intent_facets) ? audit.intent_facets.slice(0, 6) : [],
    });
  } catch (e) {
    console.error("[seo-audit] edge:", e instanceof Error ? e.message : e);
    return json(res, 502, { ok: false, message: FRIENDLY_ERROR });
  }
}
