/**
 * Sitemap dinâmico — consulta blog_posts no Supabase a cada requisição.
 * Rota pública: /sitemap.xml (rewrite em vercel.json).
 */
import { buildSitemapXml } from "../scripts/sitemap-lib.mjs";

/** Cache na CDN: 15 min fresh, até 1 h stale enquanto revalida. */
const CACHE_CONTROL = "public, s-maxage=900, stale-while-revalidate=3600";

export default async function handler(_req, res) {
  try {
    const xml = await buildSitemapXml();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", CACHE_CONTROL);
    res.status(200).send(xml);
  } catch (e) {
    console.error("[sitemap api]", e);
    res.status(500).setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("Erro ao gerar sitemap.");
  }
}
