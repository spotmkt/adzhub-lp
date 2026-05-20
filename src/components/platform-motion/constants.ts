/** Rotas e rótulos alinhados ao app Blog (`content-generator`) e dashboard GSC do MVP. */
export const BLOG_APP_NAME = "Blog";

export const BLOG_VIEWS = [
  { id: "ideas", label: "Big Ideas" },
  { id: "posts", label: "Postagens" },
  { id: "calendar", label: "Calendário" },
  { id: "settings", label: "Configurações" },
] as const;

export type BlogViewId = (typeof BLOG_VIEWS)[number]["id"] | "gsc";

export const SEO_POSTS = [
  {
    title: "Fibromialgia: evolução diagnóstica e novas abordagens",
    date: "12 mar 2025, 14:32",
    thumb: "from-violet-200 to-indigo-300",
    status: "Publicado",
  },
  {
    title: "SEO local para clínicas: checklist prático em 10 passos",
    date: "08 mar 2025, 09:15",
    thumb: "from-emerald-200 to-teal-300",
    status: "Pendente",
  },
  {
    title: "Progressos em neuromodulação e manejo da fibromialgia",
    date: "03 mar 2025, 11:48",
    thumb: "from-amber-200 to-orange-300",
    status: "Publicado",
  },
  {
    title: "Como estruturar um calendário editorial para PMEs",
    date: "28 fev 2025, 16:20",
    thumb: "from-sky-200 to-blue-300",
    status: "Publicado",
  },
] as const;

export const GSC_PAGES = [
  { title: "Guia de SEO para clínicas", hint: "Melhorar título", hintClass: "bg-amber-50 text-amber-800" },
  { title: "Fibromialgia: novas diretrizes", hint: "Performando", hintClass: "bg-emerald-50 text-emerald-700" },
  { title: "Blog institucional — página inicial", hint: "Quase lá", hintClass: "bg-sky-50 text-sky-700" },
] as const;

export const BIG_IDEAS = [
  {
    title: "SEO local para clínicas em 2025",
    keyword: "seo local clínicas",
    type: "volume",
  },
  {
    title: "Como aparecer nas recomendações do ChatGPT",
    keyword: "geo marca",
    type: "notícia",
  },
] as const;
