import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, BarChart3, Settings, Bell, Zap, Target,
  FileText, Map, Search, ChevronDown, RefreshCw,
  Wifi, MessageSquare, Lightbulb, GraduationCap,
  Pencil, Eye, ExternalLink, ArrowLeft, Sparkles,
  LayoutDashboard, List, Edit, Pause, Play,
} from "lucide-react";
import adzhubLogo from "@/assets/adzhub-logo-new.svg";

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
  { title: "Fibromialgia: evolução diagnóstica e novas abordagens", date: "12 mar 2025", thumb: "from-violet-200 to-indigo-300" },
  { title: "SEO local para clínicas: checklist prático em 10 passos", date: "08 mar 2025", thumb: "from-emerald-200 to-teal-300" },
  { title: "Progressos em neuromodulação e manejo da fibromialgia", date: "03 mar 2025", thumb: "from-amber-200 to-orange-300" },
  { title: "Como estruturar um calendário editorial para PMEs", date: "28 fev 2025", thumb: "from-sky-200 to-blue-300" },
  { title: "Métricas que importam além do tráfego", date: "22 fev 2025", thumb: "from-rose-200 to-pink-300" },
];

type View = "dashboard" | "posts" | "editor";

interface Tab {
  id: string;
  icon: typeof Eye;
  title: string;
  description: string;
  view: View;
  phases: { duration: number; listScrollY: number; highlight: "postagens" | "editar" | null }[];
}

const TABS: Tab[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Monitore performance",
    description: "Cliques, impressões, CTR e posição média do Google no dashboard integrado.",
    view: "dashboard",
    phases: [
      { duration: 2500, listScrollY: 0, highlight: null },
      { duration: 2000, listScrollY: 0, highlight: null },
    ],
  },
  {
    id: "posts",
    icon: List,
    title: "Gerencie conteúdo",
    description: "Lista de postagens com filtros e busca rápida.",
    view: "posts",
    phases: [
      { duration: 2000, listScrollY: 0, highlight: null },
      { duration: 2500, listScrollY: -80, highlight: null },
      { duration: 1500, listScrollY: -80, highlight: "postagens" },
    ],
  },
  {
    id: "browse",
    icon: Search,
    title: "Navegue pelo acervo",
    description: "Role a lista para ver artigos organizados por status e data.",
    view: "posts",
    phases: [
      { duration: 1500, listScrollY: 0, highlight: null },
      { duration: 2500, listScrollY: -140, highlight: null },
      { duration: 1500, listScrollY: -140, highlight: "editar" },
    ],
  },
  {
    id: "editor",
    icon: Edit,
    title: "Edite e publique",
    description: "Ajuste título, slug, capa e meta tags. Publique com SEO já otimizado.",
    view: "editor",
    phases: [
      { duration: 2500, listScrollY: 0, highlight: null },
      { duration: 2500, listScrollY: 0, highlight: "editar" },
    ],
  },
];

function MiniDashboard() {
  return (
    <div className="p-3 sm:p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-foreground">Visão geral</span>
          <span className="ml-2 text-[10px] text-muted-foreground">Últimos 90 dias</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Total de cliques", value: "196" },
          { label: "Impressões", value: "12,2 mil" },
          { label: "CTR média", value: "1,6%" },
          { label: "Posição média", value: "7,3" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-lg p-2 border border-border/20">
            <div className="text-[10px] text-muted-foreground">{m.label}</div>
            <div className="text-lg font-bold text-foreground">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="h-24 bg-gradient-to-r from-[#37489d]/5 to-[#37489d]/10 rounded-lg flex items-center justify-center text-muted-foreground">
        <BarChart3 className="w-5 h-5 mr-2 opacity-40" />
        Cliques e impressões
      </div>
      <div className="space-y-1.5">
        {["Guia de SEO para clínicas", "Fibromialgia: novas diretrizes", "Blog institucional"].map((t, i) => (
          <div key={t} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-border/20">
            <span className="text-xs text-foreground truncate">{t}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              i === 0 ? "bg-blue-100 text-blue-700" : i === 1 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}>
              {i === 0 ? "Melhorar título" : i === 1 ? "Performando" : "Quase lá"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostsList({ scrollY, showEditHighlight }: { scrollY: number; showEditHighlight: boolean }) {
  return (
    <div className="p-3 sm:p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">Postagens</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Search className="w-3.5 h-3.5" />
          <Settings className="w-3.5 h-3.5" />
        </div>
      </div>
      <motion.div animate={{ y: scrollY }} transition={{ duration: 1.5, ease: "easeInOut" }}>
        <div className="space-y-2">
          {POSTS.map((post, i) => (
            <motion.div
              key={post.title}
              className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                i === 2 && showEditHighlight ? "border-[#37489d] bg-[#37489d]/5 ring-1 ring-[#37489d]/20" : "border-border/20 bg-white"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${post.thumb} shrink-0`} />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-foreground truncate">{post.title}</div>
                <div className="text-[10px] text-muted-foreground">{post.date}</div>
              </div>
              {i === 2 && showEditHighlight && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 text-[10px] font-medium text-[#37489d] bg-[#37489d]/10 px-2 py-1 rounded-md shrink-0"
                >
                  <Pencil className="w-3 h-3" /> Editar
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function EditorView() {
  return (
    <div className="p-3 sm:p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para postagens
      </div>
      <div className="h-28 bg-gradient-to-br from-amber-200 to-orange-300 rounded-xl flex items-center justify-center text-sm text-foreground/60">
        Imagem de capa
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground mb-1">Título</div>
        <div className="text-sm font-semibold text-foreground">Progressos em neuromodulação e manejo da fibromialgia</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div><span className="text-muted-foreground">Slug:</span> <span className="text-foreground">neuromodulacao-fibromialgia</span></div>
        <div><span className="text-muted-foreground">Autor:</span> <span className="text-foreground">Dr. Silva</span></div>
      </div>
      <div className="flex gap-2">
        <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md">
          <Eye className="w-3 h-3" /> Publicado
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
          <ExternalLink className="w-3 h-3" /> Ver no blog
        </span>
      </div>
      <div className="mt-2 p-3 bg-white rounded-lg border border-border/20 text-xs text-muted-foreground leading-relaxed">
        <span className="flex items-center gap-1 text-foreground font-medium mb-1">
          <Sparkles className="w-3 h-3 text-[#37489d]" /> SEO Automático
        </span>
        Meta title e description gerados. Score: 92/100
      </div>
    </div>
  );
}

function SeoMock({ view, scrollY, highlight }: { view: View; scrollY: number; highlight: "postagens" | "editar" | null }) {
  return (
    <div className="w-full h-[420px] sm:h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-border/30 relative">
      <div className="h-12 border-b border-border/30 flex items-center px-3 sm:px-4 gap-2 sm:gap-4 bg-white">
        <img src={adzhubLogo} alt="AdzHub" className="h-6 w-auto" />
        <div className="flex-1" />
        <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> Chat</span>
          <span className="flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Recomendações</span>
          <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Aprenda</span>
        </div>
        <div className="px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium flex items-center gap-1 border bg-muted/50 text-foreground border-border/50">
          <FileText className="w-3.5 h-3.5" /> Central de conteúdo <ChevronDown className="w-3 h-3" />
        </div>
        <div className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-muted-foreground"><Bell className="w-4 h-4" /></div>
        <div className="hidden sm:block w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
      </div>

      <div className="flex h-[calc(100%-3rem)]">
        <div className="hidden sm:flex w-14 py-3 flex-col items-center gap-1 bg-[hsl(40,30%,96%)] rounded-2xl m-2 shrink-0">
          {sidebarApps.map((app, i) => (
            <div
              key={app.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                i === CONTENT_ACTIVE_INDEX ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <app.icon className="w-4 h-4" />
            </div>
          ))}
        </div>

        <div className="hidden sm:flex w-36 bg-[hsl(40,30%,96%)] flex-col rounded-2xl m-2 shrink-0 py-3 px-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase px-2 mb-2">Conteúdo</span>
          {["Visão geral", "Postagens", "Calendário", "Métricas"].map((item) => (
            <div
              key={item}
              className={`text-xs px-2 py-1.5 rounded-md transition-colors ${
                (view === "posts" || view === "editor") && item === "Postagens"
                  ? "bg-primary/10 text-primary font-medium"
                  : view === "dashboard" && item === "Visão geral"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground"
              }`}
            >
              {item}
            </div>
          ))}
          <div className="mt-auto pt-3 border-t border-border/20 px-2 space-y-1">
            <div className="text-[10px] text-muted-foreground">Cliente Demo</div>
            <div className="flex items-center gap-1 text-[10px] text-primary">
              <RefreshCw className="w-3 h-3" /> Recarregar
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-md w-fit">
              <Wifi className="w-3 h-3" /> Upgrade
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-[hsl(40,20%,97%)]">
          <AnimatePresence mode="wait">
            {view === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3 }}>
                <MiniDashboard />
              </motion.div>
            )}
            {view === "posts" && (
              <motion.div key="posts" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3 }}>
                <PostsList scrollY={scrollY} showEditHighlight={highlight === "editar"} />
              </motion.div>
            )}
            {view === "editor" && (
              <motion.div key="editor" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3 }}>
                <EditorView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function NotionStyleSeo() {
  const [activeTab, setActiveTab] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tab = TABS[activeTab];
  const phase = tab.phases[phaseIdx] ?? tab.phases[0];

  const advancePhase = useCallback(() => {
    setPhaseIdx((prev) => {
      if (prev + 1 < TABS[activeTab].phases.length) return prev + 1;
      const nextTab = (activeTab + 1) % TABS.length;
      setActiveTab(nextTab);
      return 0;
    });
  }, [activeTab]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(advancePhase, phase.duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeTab, phaseIdx, paused, phase.duration, advancePhase]);

  const handleTabClick = (i: number) => {
    setActiveTab(i);
    setPhaseIdx(0);
  };

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-10 items-start">
          {/* Tabs */}
          <div className="py-8 lg:py-16">
            <h3 className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-2">
              Central de conteúdo
            </h3>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#08080C] mb-8">
              Conteúdo que trabalha por você
            </h2>

            <div className="flex flex-col gap-1">
              {TABS.map((t, i) => {
                const isActive = i === activeTab;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTabClick(i)}
                    className={`relative text-left rounded-xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-white shadow-lg border border-gray-200/80"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive ? "bg-[#37489d] text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-semibold ${isActive ? "text-[#08080C]" : "text-gray-500"}`}>
                        {t.title}
                      </span>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-sm text-gray-500 leading-relaxed pl-11 overflow-hidden"
                        >
                          {t.description}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {isActive && (
                      <motion.div
                        layoutId="notion-seo-tab-indicator"
                        className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[#37489d]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pl-4">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                {paused ? "Retomar animação" : "Pausar animação"}
              </button>
            </div>
          </div>

          {/* Demo */}
          <div className="py-8 lg:py-16">
            <div className="relative w-full max-w-[750px] mx-auto">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#37489d]/6 via-transparent to-[#F9C7B2]/10 rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative">
                <SeoMock
                  view={tab.view}
                  scrollY={phase.listScrollY}
                  highlight={phase.highlight}
                />
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4">
                {tab.phases.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === phaseIdx ? "w-6 bg-[#37489d]" : i < phaseIdx ? "w-1.5 bg-[#37489d]/50" : "w-1.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
