import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Zap,
  Target,
  FileText,
  Map,
  Search,
  ChevronDown,
  RefreshCw,
  Wifi,
  MessageSquare,
  Lightbulb,
  GraduationCap,
  LayoutDashboard,
  Youtube,
  Pencil,
  ExternalLink,
  Archive,
  ArrowLeft,
  Eye,
  Sparkles,
} from "lucide-react";
import adzhubLogo from "@/assets/adzhub-logo-new.svg";
import { AnimatedCursor } from "./AnimatedCursor";

type View = "dashboard" | "posts" | "editor";

interface MotionStep {
  duration: number;
  view: View;
  cursorX: number;
  cursorY: number;
  clicking: boolean;
  highlight: "postagens" | "editar" | null;
  listTranslateY: number;
}

/** Cursor coords relativos ao mock (mesmo box do MockInterface da Home). */
const STEPS: MotionStep[] = [
  {
    duration: 1400,
    view: "dashboard",
    cursorX: 420,
    cursorY: 280,
    clicking: false,
    highlight: null,
    listTranslateY: 0,
  },
  {
    duration: 1000,
    view: "dashboard",
    cursorX: 138,
    cursorY: 178,
    clicking: false,
    highlight: "postagens",
    listTranslateY: 0,
  },
  {
    duration: 220,
    view: "dashboard",
    cursorX: 138,
    cursorY: 178,
    clicking: true,
    highlight: "postagens",
    listTranslateY: 0,
  },
  {
    duration: 500,
    view: "posts",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlight: null,
    listTranslateY: 0,
  },
  {
    duration: 2600,
    view: "posts",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlight: null,
    listTranslateY: -150,
  },
  {
    duration: 800,
    view: "posts",
    cursorX: 698,
    cursorY: 312,
    clicking: false,
    highlight: "editar",
    listTranslateY: -150,
  },
  {
    duration: 220,
    view: "posts",
    cursorX: 698,
    cursorY: 312,
    clicking: true,
    highlight: "editar",
    listTranslateY: -150,
  },
  {
    duration: 500,
    view: "editor",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlight: null,
    listTranslateY: 0,
  },
  {
    duration: 4200,
    view: "editor",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlight: null,
    listTranslateY: 0,
  },
];

const CAPTIONS: string[] = [
  "No dashboard você acompanha cliques, impressões e performance do conteúdo na mesma base da plataforma.",
  "O cursor vai até Postagens na coluna ao lado — o mesmo padrão de navegação da AdzHub.",
  "Clique em Postagens para abrir a lista de artigos do blog.",
  "Lista de postagens: busque, filtre e gerencie publicações sem sair do ambiente.",
  "Role a lista para ver mais artigos; tudo fica organizado por status e data.",
  "Escolha um post e abra a edição para ajustar título, capa e detalhes de publicação.",
  "Clique em Editar para entrar no fluxo de edição do artigo.",
  "Tela de edição: capa, título, slug, autor e status — integrada ao restante da operação.",
  "Demonstração completa: do dashboard à publicação, no layout que você já conhece na AdzHub.",
];

const sidebarApps = [
  { icon: Calendar, label: "Agenda" },
  { icon: Zap, label: "Ações" },
  { icon: Target, label: "Campanhas" },
  { icon: FileText, label: "Conteúdo" },
  { icon: BarChart3, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
  { icon: Map, label: "Mapa" },
  { icon: Search, label: "Pesquisa" },
] as const;

const CONTENT_ACTIVE_INDEX = 3;

const POSTS = [
  {
    title: "Fibromialgia: evolução diagnóstica e novas abordagens",
    date: "12 mar 2025, 14:32",
    thumb: "from-violet-200 to-indigo-300",
  },
  {
    title: "SEO local para clínicas: checklist prático em 10 passos",
    date: "08 mar 2025, 09:15",
    thumb: "from-emerald-200 to-teal-300",
  },
  {
    title: "Progressos em neuromodulação e manejo da fibromialgia",
    date: "03 mar 2025, 11:48",
    thumb: "from-amber-200 to-orange-300",
  },
  {
    title: "Como estruturar um calendário editorial para PMEs",
    date: "28 fev 2025, 16:20",
    thumb: "from-sky-200 to-blue-300",
  },
  {
    title: "Métricas que importam além do tráfego: engajamento e conversão",
    date: "22 fev 2025, 10:05",
    thumb: "from-rose-200 to-pink-300",
  },
];

export function ConteudoMotionShowcase() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const step = STEPS[stepIndex] ?? STEPS[0];
  const caption = CAPTIONS[stepIndex] ?? CAPTIONS[0];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsNarrowViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setStepIndex((i) => (i + 1 >= STEPS.length ? 0 : i + 1));
    }, step.duration);
    return () => clearTimeout(t);
  }, [stepIndex, step.duration]);

  const showCursor =
    !isNarrowViewport && step.cursorX >= 0 && step.cursorY >= 0;
  const view = step.view;

  const listScrollPx = isNarrowViewport
    ? Math.round(step.listTranslateY * 0.45)
    : step.listTranslateY;

  return (
    <motion.div
      className="relative pb-2 w-full max-w-5xl mx-auto"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute -inset-3 bg-gradient-to-r from-[#37489d]/12 via-[#F9C7B2]/12 to-[#F9B2D4]/12 rounded-[28px] blur-xl pointer-events-none" aria-hidden />

      <div className="relative w-full">
        {/* Shell alinhado ao MockInterface da Home (motion hero) */}
        <div className="w-full h-[min(440px,82dvh)] min-h-[380px] sm:h-[500px] sm:min-h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-border/30 relative">
          <motion.div
            className="h-12 border-b border-border/30 flex items-center px-3 sm:px-4 gap-2 sm:gap-4 bg-white"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex items-center gap-2 shrink-0">
              <img src={adzhubLogo} alt="AdzHub" className="h-6 w-auto" />
            </div>

            <div className="flex-1 min-w-0" />

            <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </span>
              <span className="flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> Recomendações
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Aprenda
              </span>
            </div>

            <div className="shrink-0 px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium flex items-center gap-1 border bg-muted/50 text-foreground border-border/50 max-w-[160px] sm:max-w-none truncate">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Central de conteúdo</span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </div>

            <div className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-muted-foreground shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="hidden sm:block w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0" />
          </motion.div>

          <div className="flex flex-col sm:flex-row h-[calc(100%-3rem)] min-h-0">
            {/* Barra de ícones — igual à Home */}
            <motion.div
              className="hidden sm:flex w-14 py-3 flex-col items-center gap-1 bg-[hsl(40,30%,96%)] rounded-2xl m-2 shrink-0"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
            >
              {sidebarApps.map((app, index) => (
                <div
                  key={app.label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    index === CONTENT_ACTIVE_INDEX
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                  title={app.label}
                >
                  <app.icon className="w-4 h-4" />
                </div>
              ))}
            </motion.div>

            {/* Painel contextual — navegação do módulo Conteúdo / Blog */}
            <motion.div
              className="hidden sm:flex w-44 bg-[hsl(40,30%,96%)] flex-col rounded-2xl m-2 shrink-0 min-h-0 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-3 mb-2">
                Conteúdo
              </p>
              <SecondaryNavRow
                icon={<LayoutDashboard className="w-3.5 h-3.5" />}
                label="Visão geral"
                active={view === "dashboard"}
              />
              <SecondaryNavRow
                icon={<FileText className="w-3.5 h-3.5" />}
                label="Postagens"
                active={view === "posts" || view === "editor"}
                pulse={step.highlight === "postagens"}
              />
              <SecondaryNavRow icon={<Calendar className="w-3.5 h-3.5" />} label="Calendário" />
              <SecondaryNavRow icon={<BarChart3 className="w-3.5 h-3.5" />} label="Métricas" />
            </motion.div>

            {/* Área principal — subheader fixo + conteúdo em transição */}
            <motion.div
              className="flex-1 flex flex-col bg-[hsl(40,20%,97%)] min-h-0 min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div
                className="flex sm:hidden items-center gap-1 px-2 py-1.5 border-b border-border/20 bg-[hsl(40,30%,96%)] overflow-x-auto shrink-0"
                aria-label="Navegação do módulo Conteúdo"
              >
                <MobileNavPill
                  icon={<LayoutDashboard className="w-3 h-3 shrink-0" />}
                  label="Visão geral"
                  active={view === "dashboard"}
                />
                <MobileNavPill
                  icon={<FileText className="w-3 h-3 shrink-0" />}
                  label="Postagens"
                  active={view === "posts" || view === "editor"}
                  pulse={step.highlight === "postagens"}
                />
                <MobileNavPill icon={<Calendar className="w-3 h-3 shrink-0" />} label="Calendário" />
                <MobileNavPill icon={<BarChart3 className="w-3 h-3 shrink-0" />} label="Métricas" />
              </div>

              <div className="h-10 flex items-center px-3 sm:px-4 gap-2 flex-wrap shrink-0 border-b border-border/20">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-foreground font-medium">Cliente Demo</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </div>
                <button type="button" className="flex items-center gap-1 text-[10px] text-primary ml-0 sm:ml-2">
                  <RefreshCw className="w-3 h-3" />
                  Recarregar
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-md ml-auto sm:ml-2"
                >
                  <Wifi className="w-3 h-3" />
                  Upgrade
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden relative p-2 sm:p-3">
                <AnimatePresence mode="wait">
                  {view === "dashboard" && (
                    <motion.div
                      key="dash"
                      className="absolute inset-2 sm:inset-3 overflow-y-auto rounded-xl bg-white/80 border border-border/20 shadow-sm"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="text-xs sm:text-sm font-semibold text-foreground">Visão geral</span>
                          <span className="text-[10px] text-muted-foreground rounded-md border border-border/40 px-2 py-0.5">
                            Últimos 90 dias
                          </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                          <DashStat label="Total de cliques" value="196" tone="blue" />
                          <DashStat label="Impressões" value="12,2 mil" tone="violet" />
                          <DashStat label="CTR média" value="1,6%" tone="slate" />
                          <DashStat label="Posição média" value="7,3" tone="slate" />
                        </div>
                        <div className="rounded-xl border border-border/30 bg-muted/20 p-3 mb-3">
                          <p className="text-[10px] font-medium text-muted-foreground mb-2">Cliques e impressões</p>
                          <div className="h-24 flex items-end gap-0.5">
                            {[40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 88].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-primary to-primary/60"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border/30 overflow-hidden">
                          <div className="px-2 py-1.5 bg-muted/30 border-b border-border/20 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-foreground">Páginas × Search Console</span>
                            <span className="text-[9px] text-emerald-600 font-medium">Só blog</span>
                          </div>
                          <div className="divide-y divide-border/20">
                            {[
                              ["Guia de SEO para clínicas", "Melhorar título"],
                              ["Fibromialgia: novas diretrizes", "Performando"],
                              ["Blog institucional", "Quase lá"],
                            ].map(([title, tag], i) => (
                              <div key={i} className="px-2 py-2 flex items-center gap-2 text-[10px]">
                                <div className="w-8 h-8 rounded bg-muted/50 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground truncate">{title}</p>
                                  <p className="text-muted-foreground">142 cliques</p>
                                </div>
                                <span
                                  className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                                    tag === "Performando"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : tag === "Quase lá"
                                        ? "bg-sky-50 text-sky-700"
                                        : "bg-amber-50 text-amber-800"
                                  }`}
                                >
                                  {tag}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {view === "posts" && (
                    <motion.div
                      key="posts"
                      className="absolute inset-2 sm:inset-3 flex flex-col min-h-0 rounded-xl bg-white/80 border border-border/20 shadow-sm overflow-hidden"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="shrink-0 p-3 border-b border-border/20">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-primary" />
                          <h2 className="text-sm font-semibold text-foreground">Postagens</h2>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-snug">
                          Posts do seu blog no WordPress ou Webflow. Edite, publique ou arquive sem sair da AdzHub.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2 py-1.5 text-[10px] text-muted-foreground min-w-[100px]">
                            <Search className="w-3 h-3 shrink-0" />
                            Buscar por título…
                          </div>
                          <div className="flex items-center gap-1 rounded-lg border border-border/40 px-2 py-1.5 text-[10px] text-foreground">
                            Todos os status
                            <ChevronDown className="w-3 h-3" />
                          </div>
                          <div className="flex items-center gap-1 rounded-lg border border-border/40 px-2 py-1.5 text-[10px] text-foreground">
                            Mais recentes
                            <ChevronDown className="w-3 h-3" />
                          </div>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg border border-border/40 text-muted-foreground"
                            aria-label="Atualizar"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <span className="flex-1 min-w-[8px]" />
                          <button
                            type="button"
                            className="rounded-lg bg-primary text-primary-foreground text-[10px] px-2.5 py-1.5 font-medium flex items-center gap-1"
                          >
                            <Youtube className="w-3 h-3" />
                            Gerar pelo YouTube
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 min-h-0 overflow-hidden relative p-2">
                        <motion.div
                          className="space-y-2"
                          animate={{ y: listScrollPx }}
                          transition={{
                            duration: stepIndex === 4 ? 2.2 : 0.35,
                            ease: "easeInOut",
                          }}
                        >
                          {POSTS.map((post, i) => (
                            <div
                              key={post.title}
                              className={`flex items-stretch gap-2 rounded-xl border border-border/30 bg-white p-2 shadow-sm ${
                                i === 2 && step.highlight === "editar"
                                  ? "ring-2 ring-primary/40 ring-offset-1"
                                  : ""
                              }`}
                            >
                              <div className={`w-12 sm:w-14 shrink-0 rounded-lg bg-gradient-to-br ${post.thumb}`} />
                              <div className="flex-1 min-w-0 py-0.5">
                                <p className="text-[10px] sm:text-xs font-semibold text-primary leading-tight line-clamp-2">
                                  {post.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                                    Publicado
                                  </span>
                                  <span className="text-[9px] text-muted-foreground">Criado em {post.date}</span>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-1 justify-center shrink-0">
                                <button
                                  type="button"
                                  className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground px-1 py-1 rounded-md hover:bg-muted/50"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span className="hidden sm:inline">Acessar</span>
                                </button>
                                <button
                                  type="button"
                                  className={`flex items-center justify-center gap-1 text-[9px] px-1.5 py-1 rounded-md font-medium ${
                                    i === 2 && step.highlight === "editar"
                                      ? "bg-primary text-primary-foreground"
                                      : "text-primary hover:bg-primary/10"
                                  }`}
                                >
                                  <Pencil className="w-3 h-3" />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground px-1 py-1 rounded-md hover:bg-muted/50"
                                >
                                  <Archive className="w-3 h-3" />
                                  <span className="hidden sm:inline">Arquivar</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {view === "editor" && (
                    <motion.div
                      key="editor"
                      className="absolute inset-2 sm:inset-3 overflow-y-auto rounded-xl bg-white/80 border border-border/20 shadow-sm"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                            Editar artigo
                          </div>
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground border border-border/40 rounded-lg px-2.5 py-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </button>
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground mb-2">Imagem de capa</p>
                        <div className="rounded-xl border border-border/30 overflow-hidden mb-4 max-w-md">
                          <div className="aspect-[16/9] bg-gradient-to-br from-muted via-muted/80 to-primary/10" />
                          <div className="flex flex-wrap gap-2 p-2 bg-muted/20 border-t border-border/20">
                            <button
                              type="button"
                              className="text-[10px] px-2 py-1.5 rounded-lg border border-border/40 bg-white text-foreground"
                            >
                              Trocar imagem
                            </button>
                            <button
                              type="button"
                              className="text-[10px] px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              Gerar capa com IA
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3 max-w-xl">
                          <div>
                            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Título</label>
                            <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-[11px] text-foreground leading-snug">
                              Progressos em neuromodulação e manejo da fibromialgia — novas diretrizes e inovações
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-medium text-muted-foreground block mb-1">Status</label>
                              <div className="rounded-lg border border-border/40 px-3 py-2 text-[11px] text-foreground flex items-center justify-between bg-white">
                                Publicado
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-medium text-muted-foreground block mb-1">Autor</label>
                              <div className="rounded-lg border border-border/40 px-3 py-2 text-[11px] text-foreground flex items-center justify-between bg-white">
                                Alessandro
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Slug (URL)</label>
                            <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-[10px] text-muted-foreground font-mono truncate">
                              progressos-em-neuromodulacao-e-manejo-da-fibromialgia
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                              Tempo de leitura (min)
                            </label>
                            <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
                              Ex: 4
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-[8px] text-muted-foreground text-center px-3 pb-2 shrink-0">
                O Adz pode cometer erros. Verifique informações importantes.
              </p>
            </motion.div>
          </div>
        </div>

        {showCursor && (
          <AnimatedCursor x={step.cursorX} y={step.cursorY} clicking={step.clicking} />
        )}
      </div>

      <div className="mt-4 px-1 sm:px-2 min-h-[4.5rem] flex items-start justify-center">
        <motion.p
          key={stepIndex}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl"
        >
          {caption}
        </motion.p>
      </div>
    </motion.div>
  );
}

function MobileNavPill({
  icon,
  label,
  active,
  pulse,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  pulse?: boolean;
}) {
  return (
    <motion.div
      className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium whitespace-nowrap ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-white/80 text-muted-foreground border border-border/40"
      } ${pulse ? "ring-2 ring-primary/45 ring-offset-1" : ""}`}
      animate={pulse ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.55, repeat: pulse ? Infinity : 0, repeatDelay: 0.35 }}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  );
}

function SecondaryNavRow({
  icon,
  label,
  active,
  pulse,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  pulse?: boolean;
}) {
  return (
    <motion.div
      className={`mx-2 mb-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs cursor-default ${
        active ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-muted/50"
      } ${pulse ? "ring-2 ring-primary/45 ring-offset-1" : ""}`}
      animate={pulse ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.55, repeat: pulse ? Infinity : 0, repeatDelay: 0.35 }}
    >
      {icon}
      <span className="truncate">{label}</span>
    </motion.div>
  );
}

function DashStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "violet" | "slate";
}) {
  const bar =
    tone === "blue"
      ? "from-blue-600 to-indigo-500"
      : tone === "violet"
        ? "from-violet-600 to-purple-500"
        : "from-slate-600 to-slate-400";
  return (
    <div className="rounded-lg border border-border/30 bg-white p-2 shadow-sm">
      <div className={`h-1 rounded-full bg-gradient-to-r ${bar} mb-1.5 opacity-90`} />
      <p className="text-[9px] text-muted-foreground leading-tight mb-0.5">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
