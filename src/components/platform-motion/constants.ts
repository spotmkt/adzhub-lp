/** Rotas e rótulos alinhados ao app Blog (`content-generator`) e dashboard GSC do MVP. */
export const BLOG_APP_NAME = "Blog";

export const BLOG_VIEWS = [
  { id: "ideas", label: "Big Ideas" },
  { id: "posts", label: "Postagens" },
  { id: "calendar", label: "Calendário" },
  { id: "settings", label: "Configurações" },
] as const;

export type BlogViewId = (typeof BLOG_VIEWS)[number]["id"] | "gsc" | "editor";

export const SEO_POSTS = [
  {
    title: "Fibromialgia: evolução diagnóstica e novas abordagens",
    date: "12 mar 2025, 14:32",
    image: "/seo/cover-fibromialgia.jpg",
    status: "Publicado",
  },
  {
    title: "Dor crônica: quando procurar um neurologista",
    date: "08 mar 2025, 09:15",
    image: "/seo/cover-seo-clinicas.jpg",
    status: "Pendente",
  },
  {
    title: "Progressos em neuromodulação e manejo da fibromialgia",
    date: "03 mar 2025, 11:48",
    image: "/seo/cover-neuromodulacao.jpg",
    status: "Publicado",
  },
  {
    title: "TDAH em adultos: sinais que passam despercebidos",
    date: "28 fev 2025, 16:20",
    image: "/seo/cover-calendario.jpg",
    status: "Publicado",
  },
] as const;

export const GSC_PAGES = [
  {
    title: "Análise Detalhada dos Tipos de Ondas de Eletroencefalograma (EEG)…",
    image: "/seo/thumb-eeg.jpg",
    clicks: "50",
    impressions: "4.133",
    ctr: "1,2%",
    position: "6,0",
    hint: "Quase lá",
    hintClass: "bg-sky-50 text-sky-700",
  },
  {
    title: "Atentah (Cloridrato de Atomoxetina) no Tratamento do TDAH…",
    image: "/seo/thumb-atentah.jpg",
    clicks: "24",
    impressions: "7.056",
    ctr: "0,3%",
    position: "7,0",
    hint: "Enriquecer",
    hintClass: "bg-amber-50 text-amber-800",
  },
  {
    title: "Mapeamento Funcional do Cérebro: Áreas de Brodmann e o Sistema 10-20…",
    image: "/seo/thumb-cerebro.jpg",
    clicks: "22",
    impressions: "4.350",
    ctr: "0,5%",
    position: "8,6",
    hint: "Melhorar título",
    hintClass: "bg-orange-50 text-orange-800",
  },
  {
    title: "TDAH sem Remédios: Guia Completo de Tratamentos Naturais…",
    image: "/seo/thumb-tdah.jpg",
    clicks: "19",
    impressions: "2.124",
    ctr: "0,8%",
    position: "9,3",
    hint: "Quase lá",
    hintClass: "bg-sky-50 text-sky-700",
  },
] as const;

export const BIG_IDEAS = [
  {
    title: "Dor crônica: quando procurar um neurologista",
    keyword: "dor crônica neurologista",
    intent: "Informacional",
  },
  {
    title: "TDAH em adultos: sinais que passam despercebidos",
    keyword: "tdah adultos sintomas",
    intent: "Informacional",
  },
] as const;

export const CALENDAR_DAYS = [
  { weekday: "S", day: "24", items: [{ label: "Dor", tone: "bg-emerald-100 text-emerald-800" }] },
  { weekday: "T", day: "25", items: [] },
  { weekday: "Q", day: "26", items: [{ label: "Fibro", tone: "bg-sky-100 text-sky-800" }] },
  { weekday: "Q", day: "27", items: [{ label: "TDAH", tone: "bg-violet-100 text-violet-800" }] },
  { weekday: "S", day: "28", items: [] },
  { weekday: "S", day: "29", items: [{ label: "Neuro", tone: "bg-amber-100 text-amber-800" }] },
  { weekday: "D", day: "30", items: [] },
] as const;

/** Pontos do gráfico dual (cliques × impressões) — perfil semelhante ao GSC real. */
export const GSC_CHART = {
  clicks: [8, 6, 11, 9, 7, 10, 8, 12, 9, 14, 11, 10, 13, 16, 12, 9, 11, 8, 10, 15, 18, 12, 9, 11, 14, 10, 12, 16, 13, 11, 9, 14, 17, 12, 15, 11],
  impressions: [620, 580, 710, 650, 590, 740, 680, 800, 720, 880, 760, 700, 820, 940, 780, 690, 750, 640, 710, 900, 1100, 820, 700, 760, 860, 730, 790, 980, 840, 760, 700, 880, 1050, 820, 920, 780],
} as const;
