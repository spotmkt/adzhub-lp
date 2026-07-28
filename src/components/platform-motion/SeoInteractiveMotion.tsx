import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ListChecks,
  List,
  CalendarDays,
  Pause,
  Play,
} from "lucide-react";
import { SeoBlogPlatformMock } from "./SeoBlogPlatformMock";
import type { BlogViewId } from "./constants";

interface TabPhase {
  duration: number;
  view?: BlogViewId;
  listScrollY: number;
  highlightNav: "posts" | null;
  highlightEditIndex: number | null;
}

interface Tab {
  id: string;
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
  view: BlogViewId;
  phases: TabPhase[];
}

const TABS: Tab[] = [
  {
    id: "gsc",
    icon: LayoutDashboard,
    title: "Acompanhe no Search Console",
    description:
      "Cliques, impressões e oportunidades por página — a mesma leitura que guia a operação.",
    view: "gsc",
    phases: [
      { duration: 3200, listScrollY: 0, highlightNav: null, highlightEditIndex: null },
      { duration: 2200, listScrollY: 0, highlightNav: null, highlightEditIndex: null },
    ],
  },
  {
    id: "ideas",
    icon: ListChecks,
    title: "Pauta em Big Ideas",
    description:
      "Temas com keyword e intenção entram no pipeline; você aprova o que seguimos.",
    view: "ideas",
    phases: [
      { duration: 2500, listScrollY: 0, highlightNav: null, highlightEditIndex: null },
      { duration: 1800, listScrollY: 0, highlightNav: "posts", highlightEditIndex: null },
    ],
  },
  {
    id: "posts",
    icon: List,
    title: "Postagens na operação",
    description:
      "Artigos em produção e revisão; status, aprovação e edição no mesmo fluxo.",
    view: "posts",
    phases: [
      { duration: 2000, listScrollY: 0, highlightNav: null, highlightEditIndex: null },
      { duration: 1800, listScrollY: -80, highlightNav: null, highlightEditIndex: 2 },
      {
        duration: 3400,
        view: "editor",
        listScrollY: 0,
        highlightNav: null,
        highlightEditIndex: null,
      },
    ],
  },
  {
    id: "calendar",
    icon: CalendarDays,
    title: "Calendário e publicação",
    description:
      "Ritmo editorial e publicações no seu site — você vê o calendário da operação.",
    view: "calendar",
    phases: [
      { duration: 2800, listScrollY: 0, highlightNav: null, highlightEditIndex: null },
      { duration: 2200, listScrollY: 0, highlightNav: null, highlightEditIndex: null },
    ],
  },
];

interface SeoInteractiveMotionProps {
  /** Esconde títulos centrais quando embutido no hero (títulos ficam na coluna dos cards). */
  embedded?: boolean;
  id?: string;
}

/** Tabs + auto-play (estilo Notion) para seção interativa da /seo. */
export function SeoInteractiveMotion({ embedded = false, id }: SeoInteractiveMotionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tab = TABS[activeTab];
  const phase = tab.phases[phaseIdx] ?? tab.phases[0];
  const activeView = phase.view ?? tab.view;

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
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeTab, phaseIdx, paused, phase.duration, advancePhase]);

  const handleTabClick = (i: number) => {
    setActiveTab(i);
    setPhaseIdx(0);
  };

  return (
    <section
      id={id}
      className={
        embedded
          ? "relative py-8 sm:py-12 scroll-mt-28"
          : "relative py-12 sm:py-16 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5 scroll-mt-28"
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {!embedded && (
          <motion.div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-2">
              Na operação
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#08080C]">
              Ferramenta + execução no mesmo lugar
            </h2>
            <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">
              Search Console, pauta, postagens e calendário — nós operamos, você acompanha.
            </p>
          </motion.div>
        )}

        <motion.div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-6 lg:gap-10 items-start">
          <motion.div>
            {!embedded && (
              <p className="text-xs font-medium text-[#37489d] mb-6 lg:hidden">Toque para explorar</p>
            )}
            {embedded && (
              <motion.div className="mb-6">
                <p className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-2">
                  Na operação
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#08080C]">
                  Ferramenta + execução no mesmo lugar
                </h2>
              </motion.div>
            )}
            <motion.div className="flex flex-col gap-1">
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
                        : "hover:bg-white/60 border border-transparent"
                    }`}
                  >
                    <motion.div className="flex items-center gap-3">
                      <motion.div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isActive ? "bg-[#37489d] text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                      <span
                        className={`text-sm font-semibold ${isActive ? "text-[#08080C]" : "text-gray-500"}`}
                      >
                        {t.title}
                      </span>
                    </motion.div>
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
                        layoutId="seo-lp-tab-indicator"
                        className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[#37489d]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="mt-4 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors pl-1"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {paused ? "Retomar animação" : "Pausar animação"}
            </button>
          </motion.div>

          <motion.div className="relative w-full max-w-[750px] lg:max-w-none mx-auto">
            <motion.div
              className="absolute -inset-4 bg-gradient-to-br from-[#37489d]/8 via-transparent to-[#F9C7B2]/10 rounded-3xl blur-2xl pointer-events-none"
              aria-hidden
            />
            <SeoBlogPlatformMock
              view={activeView}
              listScrollY={phase.listScrollY}
              highlightNav={phase.highlightNav}
              highlightEditIndex={phase.highlightEditIndex}
            />
            <motion.div className="flex items-center justify-center gap-1.5 mt-4">
              {tab.phases.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === phaseIdx
                      ? "w-6 bg-[#37489d]"
                      : i < phaseIdx
                        ? "w-1.5 bg-[#37489d]/50"
                        : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
