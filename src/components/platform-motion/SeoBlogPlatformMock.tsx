import type { ReactNode } from "react";
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
  ListChecks,
  Pencil,
  Eye,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Youtube,
  Archive,
} from "lucide-react";
import adzhubLogo from "@/assets/adzhub-logo-new.svg";
import {
  BLOG_APP_NAME,
  BLOG_VIEWS,
  BIG_IDEAS,
  GSC_PAGES,
  SEO_POSTS,
  type BlogViewId,
} from "./constants";

const sidebarApps = [
  { icon: Calendar, label: "Agenda" },
  { icon: Zap, label: "Ações" },
  { icon: Target, label: "Campanhas" },
  { icon: FileText, label: "Blog" },
  { icon: BarChart3, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
  { icon: Map, label: "Mapa" },
  { icon: Search, label: "Pesquisa" },
] as const;

const BLOG_SIDEBAR_INDEX = 3;

export interface SeoBlogPlatformMockProps {
  view: BlogViewId;
  listScrollY?: number;
  highlightNav?: "posts" | null;
  highlightEditIndex?: number | null;
  className?: string;
  heightClass?: string;
}

export function SeoBlogPlatformMock({
  view,
  listScrollY = 0,
  highlightNav = null,
  highlightEditIndex = null,
  className = "",
  heightClass = "h-[min(440px,82dvh)] min-h-[380px] sm:h-[500px] sm:min-h-[500px]",
}: SeoBlogPlatformMockProps) {
  const activeNavId =
    view === "gsc"
      ? null
      : view === "ideas"
        ? "ideas"
        : view === "posts" || view === "editor"
          ? "posts"
          : view;

  return (
    <motion.div
      className={`w-full ${heightClass} bg-white rounded-2xl shadow-2xl overflow-hidden border border-border/30 relative ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="h-12 border-b border-border/30 flex items-center px-3 sm:px-4 gap-2 sm:gap-4 bg-white">
        <img src={adzhubLogo} alt="AdzHub" className="h-6 w-auto shrink-0" />
        <motion.div className="flex-1 min-w-0" />
        <motion.div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> Chat
          </span>
          <span className="flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> Recomendações
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Aprenda
          </span>
        </motion.div>
        <motion.div className="shrink-0 px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium flex items-center gap-1 border bg-muted/50 text-foreground border-border/50 max-w-[160px] sm:max-w-none truncate">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{BLOG_APP_NAME}</span>
          <ChevronDown className="w-3 h-3 shrink-0" />
        </motion.div>
        <motion.div className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-muted-foreground shrink-0">
          <Bell className="w-4 h-4" />
        </motion.div>
        <motion.div className="hidden sm:block w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0" />
      </div>

      <div className="flex flex-col sm:flex-row h-[calc(100%-3rem)] min-h-0">
        <motion.div className="hidden sm:flex w-14 py-3 flex-col items-center gap-1 bg-[hsl(40,30%,96%)] rounded-2xl m-2 shrink-0">
          {sidebarApps.map((app, index) => (
            <motion.div
              key={app.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                index === BLOG_SIDEBAR_INDEX
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              title={app.label}
            >
              <app.icon className="w-4 h-4" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="hidden sm:flex w-44 bg-[hsl(40,30%,96%)] flex-col rounded-2xl m-2 shrink-0 min-h-0 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-3 mb-2">
            {BLOG_APP_NAME}
          </p>
          {BLOG_VIEWS.map((item) => (
            <NavRow
              key={item.id}
              icon={
                item.id === "ideas" ? (
                  <ListChecks className="w-3.5 h-3.5" />
                ) : item.id === "posts" ? (
                  <FileText className="w-3.5 h-3.5" />
                ) : item.id === "calendar" ? (
                  <Calendar className="w-3.5 h-3.5" />
                ) : (
                  <Settings className="w-3.5 h-3.5" />
                )
              }
              label={item.label}
              active={activeNavId === item.id}
              pulse={highlightNav === "posts" && item.id === "posts"}
            />
          ))}
        </motion.div>

        <motion.div className="flex-1 flex flex-col bg-[hsl(40,20%,97%)] min-h-0 min-w-0">
          <motion.div className="h-10 flex items-center px-3 sm:px-4 gap-2 flex-wrap shrink-0 border-b border-border/20">
            <motion.div className="flex items-center gap-2 text-xs">
              <span className="text-foreground font-medium">Cliente Demo</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </motion.div>
            <button type="button" className="flex items-center gap-1 text-[10px] text-primary">
              <RefreshCw className="w-3 h-3" />
              Recarregar
            </button>
            <button
              type="button"
              className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-md ml-auto"
            >
              <Wifi className="w-3 h-3" />
              Upgrade
            </button>
          </motion.div>

          <motion.div className="flex-1 min-h-0 overflow-hidden relative p-2 sm:p-3">
            <AnimatePresence mode="wait">
              {view === "gsc" && (
                <Panel key="gsc">
                  <GscDashboardPanel />
                </Panel>
              )}
              {view === "ideas" && (
                <Panel key="ideas">
                  <BigIdeasPanel />
                </Panel>
              )}
              {(view === "posts" || view === "editor") && view === "posts" && (
                <Panel key="posts">
                  <PostsPanel listScrollY={listScrollY} highlightEditIndex={highlightEditIndex} />
                </Panel>
              )}
              {view === "editor" && (
                <Panel key="editor">
                  <EditorPanel />
                </Panel>
              )}
              {view === "calendar" && (
                <Panel key="calendar">
                  <PlaceholderPanel
                    title="Calendário editorial"
                    description="Planeje publicações e acompanhe o ritmo do blog no mesmo fluxo da operação."
                  />
                </Panel>
              )}
              {view === "settings" && (
                <Panel key="settings">
                  <PlaceholderPanel
                    title="Configurações do blog"
                    description="WordPress, Webflow, Search Console e automações de publicação."
                  />
                </Panel>
              )}
            </AnimatePresence>
          </motion.div>

          <p className="text-[8px] text-muted-foreground text-center px-3 pb-2 shrink-0">
            O Adz pode cometer erros. Verifique informações importantes.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-2 sm:inset-3 overflow-y-auto rounded-xl bg-white/80 border border-border/20 shadow-sm"
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.22 }}
    >
      {children}
    </motion.div>
  );
}

function NavRow({
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
      className={`mx-2 mb-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] sm:text-xs ${
        active ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"
      } ${pulse ? "ring-2 ring-primary/45 ring-offset-1" : ""}`}
      animate={pulse ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.55, repeat: pulse ? Infinity : 0, repeatDelay: 0.35 }}
    >
      {icon}
      <span className="truncate">{label}</span>
    </motion.div>
  );
}

function GscDashboardPanel() {
  return (
    <div className="p-3 sm:p-4">
      <motion.div className="mb-3">
        <h2 className="text-sm font-bold text-foreground">Dashboard Search Console</h2>
        <p className="text-[10px] text-muted-foreground">Google Search Console — Cliente Demo</p>
      </motion.div>
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <MetricCard label="Total de cliques" value="196" bar="from-blue-600 to-indigo-500" />
        <MetricCard label="Total de impressões" value="12,2 mil" bar="from-violet-600 to-purple-500" />
        <MetricCard label="CTR média" value="1,6%" bar="from-emerald-600 to-green-500" />
        <MetricCard label="Posição média" value="7,3" bar="from-orange-500 to-amber-500" />
      </motion.div>
      <motion.div className="rounded-xl border border-border/30 bg-muted/20 p-3 mb-3">
        <p className="text-[10px] font-medium text-muted-foreground mb-2">Cliques e impressões</p>
        <motion.div className="h-24 flex items-end gap-0.5">
          {[40, 55, 48, 62, 58, 70, 65, 78, 72, 85, 80, 88].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-primary to-primary/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </motion.div>
      </motion.div>
      <motion.div className="rounded-xl border border-border/30 overflow-hidden">
        <motion.div className="px-2 py-1.5 bg-muted/30 border-b border-border/20 flex items-center justify-between">
          <span className="text-[10px] font-medium text-foreground">Páginas × Search Console</span>
          <span className="text-[9px] text-emerald-600 font-medium">Só blog</span>
        </motion.div>
        <motion.div className="divide-y divide-border/20">
          {GSC_PAGES.map((row) => (
            <motion.div key={row.title} className="px-2 py-2 flex items-center gap-2 text-[10px]">
              <motion.div className="w-8 h-8 rounded bg-muted/50 shrink-0" />
              <motion.div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{row.title}</p>
                <p className="text-muted-foreground">142 cliques</p>
              </motion.div>
              <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${row.hintClass}`}>
                {row.hint}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function MetricCard({ label, value, bar }: { label: string; value: string; bar: string }) {
  return (
    <motion.div className="rounded-lg border border-border/30 bg-white p-2 shadow-sm">
      <motion.div className={`h-1 rounded-full bg-gradient-to-r ${bar} mb-1.5 opacity-90`} />
      <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </motion.div>
  );
}

function BigIdeasPanel() {
  return (
    <div className="p-3 sm:p-4">
      <motion.div className="flex items-center gap-2 mb-1">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Big Ideas</h2>
      </motion.div>
      <p className="text-[10px] text-muted-foreground mb-3">
        Ideias com palavra-chave, intenção de busca e pipeline até o rascunho no blog.
      </p>
      <motion.div className="space-y-2">
        {BIG_IDEAS.map((idea) => (
          <motion.div
            key={idea.title}
            className="rounded-xl border border-border/30 bg-white p-3 shadow-sm"
          >
            <p className="text-xs font-semibold text-foreground leading-snug">{idea.title}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Keyword: {idea.keyword}</p>
            <motion.div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {idea.type === "volume" ? "Volume" : "Notícia"}
              </span>
              <button
                type="button"
                className="text-[9px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md"
              >
                Pipeline → Postagens
              </button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function PostsPanel({
  listScrollY,
  highlightEditIndex,
}: {
  listScrollY: number;
  highlightEditIndex: number | null;
}) {
  return (
    <div className="flex flex-col min-h-0 h-full">
      <motion.div className="shrink-0 p-3 border-b border-border/20">
        <motion.div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Postagens Pendentes</h2>
        </motion.div>
        <p className="text-[10px] text-muted-foreground">Revise e aprove postagens geradas</p>
        <motion.div className="flex flex-wrap items-center gap-2 mt-2">
          <motion.div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2 py-1.5 text-[10px] text-muted-foreground min-w-[100px]">
            <Search className="w-3 h-3 shrink-0" />
            Buscar por título…
          </motion.div>
          <motion.div className="flex items-center gap-1 rounded-lg border border-border/40 px-2 py-1.5 text-[10px]">
            Todos os status
            <ChevronDown className="w-3 h-3" />
          </motion.div>
          <button
            type="button"
            className="rounded-lg bg-primary text-primary-foreground text-[10px] px-2.5 py-1.5 font-medium flex items-center gap-1 ml-auto"
          >
            <Youtube className="w-3 h-3" />
            Gerar pelo YouTube
          </button>
        </motion.div>
      </motion.div>
      <motion.div className="flex-1 min-h-0 overflow-hidden p-2">
        <motion.div
          className="space-y-2"
          animate={{ y: listScrollY }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        >
          {SEO_POSTS.map((post, i) => (
            <motion.div
              key={post.title}
              className={`flex items-stretch gap-2 rounded-xl border border-border/30 bg-white p-2 shadow-sm ${
                i === highlightEditIndex ? "ring-2 ring-primary/40 ring-offset-1" : ""
              }`}
            >
              <motion.div className={`w-12 shrink-0 rounded-lg bg-gradient-to-br ${post.thumb}`} />
              <motion.div className="flex-1 min-w-0 py-0.5">
                <p className="text-[10px] sm:text-xs font-semibold text-primary leading-tight line-clamp-2">
                  {post.title}
                </p>
                <motion.div className="flex flex-wrap items-center gap-2 mt-1">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      post.status === "Publicado"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {post.status}
                  </span>
                  <span className="text-[9px] text-muted-foreground">Criado em {post.date}</span>
                </motion.div>
              </motion.div>
              <motion.div className="flex flex-col gap-1 justify-center shrink-0">
                <button type="button" className="text-[9px] text-muted-foreground px-1 py-1">
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-1 text-[9px] px-1.5 py-1 rounded-md font-medium ${
                    i === highlightEditIndex
                      ? "bg-primary text-primary-foreground"
                      : "text-primary"
                  }`}
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </button>
                <button type="button" className="text-[9px] text-muted-foreground px-1 py-1">
                  <Archive className="w-3 h-3" />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function EditorPanel() {
  return (
    <div className="p-3 sm:p-4">
      <motion.div className="flex items-center justify-between gap-2 mb-4">
        <motion.div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          Editar artigo
        </motion.div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground border border-border/40 rounded-lg px-2.5 py-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
      </motion.div>
      <p className="text-[10px] font-medium text-muted-foreground mb-2">Imagem de capa</p>
      <motion.div className="rounded-xl border border-border/30 overflow-hidden mb-4 max-w-md">
        <motion.div className="aspect-[16/9] bg-gradient-to-br from-amber-200 to-orange-300" />
        <motion.div className="flex flex-wrap gap-2 p-2 bg-muted/20 border-t border-border/20">
          <button type="button" className="text-[10px] px-2 py-1.5 rounded-lg border border-border/40 bg-white">
            Trocar imagem
          </button>
          <button
            type="button"
            className="text-[10px] px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Gerar capa com IA
          </button>
        </motion.div>
      </motion.div>
      <motion.div className="space-y-3 max-w-xl">
        <motion.div>
          <label className="text-[10px] font-medium text-muted-foreground block mb-1">Título</label>
          <motion.div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-[11px] text-foreground leading-snug">
            Progressos em neuromodulação e manejo da fibromialgia — novas diretrizes
          </motion.div>
        </motion.div>
        <motion.div className="grid sm:grid-cols-2 gap-3">
          <motion.div>
            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Status</label>
            <motion.div className="rounded-lg border border-border/40 px-3 py-2 text-[11px] flex justify-between bg-white">
              Publicado
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.div>
          </motion.div>
          <motion.div>
            <label className="text-[10px] font-medium text-muted-foreground block mb-1">Autor</label>
            <motion.div className="rounded-lg border border-border/40 px-3 py-2 text-[11px] flex justify-between bg-white">
              Alessandro
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div className="p-3 bg-white rounded-lg border border-border/20 text-xs">
          <span className="flex items-center gap-1 text-foreground font-medium mb-1">
            <Sparkles className="w-3 h-3 text-[#37489d]" /> SEO automático
          </span>
          Meta title e description gerados. Score: 92/100
        </motion.div>
      </motion.div>
    </div>
  );
}

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
      <p className="text-sm font-semibold text-foreground mb-2">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
