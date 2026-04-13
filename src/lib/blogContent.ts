import DOMPurify from "dompurify";
import { marked } from "marked";

/**
 * Detecta HTML típico de CMS (WordPress, Webflow, etc.) vs. texto/markdown puro.
 */
function isLikelyHtml(s: string): boolean {
  const t = s.trim();
  if (!t.startsWith("<")) return false;
  const sample = t.slice(0, 4000);
  return /<\/?[a-z][\s\S]*?>/i.test(sample);
}

/**
 * Converte conteúdo do post em HTML seguro para dangerouslySetInnerHTML.
 * - HTML (ex.: blocos do WordPress): sanitiza com DOMPurify.
 * - Markdown: converte com marked (GFM) e depois sanitiza.
 */
export function prepareBlogBodyHtml(raw: string | null | undefined): string {
  if (!raw?.trim()) return "";
  const trimmed = raw.trim();

  let html: string;
  if (isLikelyHtml(trimmed)) {
    html = trimmed;
  } else {
    html = marked(trimmed, { async: false }) as string;
  }

  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel", "id", "class"],
    ALLOW_DATA_ATTR: false,
  });
}
