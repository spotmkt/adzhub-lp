import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MockInterface } from "../motion-showcase/MockInterface";
import { AnimatedCursor } from "../motion-showcase/AnimatedCursor";
import { FormDialogueData } from "../motion-showcase/FormDialogue";
import {
  Eye, Pointer, MessageSquare, CheckCircle, Pause, Play,
} from "lucide-react";

const SCENE_MESSAGE = "aumente o orçamento total das campanhas em 15%";

const FORM_DATA: FormDialogueData = {
  icon: "lightning",
  title: "Aumentar orçamento das campanhas",
  action: "confirmar alteração",
  fields: [
    { label: "campanhas", value: "3 campanhas selecionadas" },
    { label: "aumento", value: "15%" },
    { label: "valor estimado", value: "R$ 450,00 → R$ 517,50" },
  ],
};

interface Tab {
  id: string;
  icon: typeof Eye;
  title: string;
  description: string;
  phases: TabPhase[];
}

interface TabPhase {
  duration: number;
  cursorX: number;
  cursorY: number;
  clicking: boolean;
  mockOverrides: Record<string, unknown>;
}

const TABS: Tab[] = [
  {
    id: "explore",
    icon: Eye,
    title: "Explore a plataforma",
    description: "Visão geral do ambiente: chat, atalhos e aplicativos especializados.",
    phases: [
      { duration: 2000, cursorX: 300, cursorY: 200, clicking: false, mockOverrides: {} },
      { duration: 1500, cursorX: 500, cursorY: 300, clicking: false, mockOverrides: {} },
      { duration: 1500, cursorX: 200, cursorY: 150, clicking: false, mockOverrides: {} },
    ],
  },
  {
    id: "select",
    icon: Pointer,
    title: "Selecione o app",
    description: "Escolha o Orquestrador de Tráfego para direcionar a IA.",
    phases: [
      { duration: 1200, cursorX: 520, cursorY: 30, clicking: false, mockOverrides: { highlightedElement: "app-selector" } },
      { duration: 800, cursorX: 520, cursorY: 30, clicking: true, mockOverrides: { highlightedElement: "app-selector", showAppDropdown: true } },
      { duration: 1500, cursorX: 520, cursorY: 75, clicking: false, mockOverrides: { showAppDropdown: true, highlightedElement: "app-traffic" } },
      { duration: 800, cursorX: 520, cursorY: 75, clicking: true, mockOverrides: { showAppDropdown: true, highlightedElement: "app-traffic", selectedAppName: "Orquestrador de Tráfego" } },
      { duration: 700, cursorX: 520, cursorY: 75, clicking: false, mockOverrides: { showAppDropdown: false, selectedAppName: "Orquestrador de Tráfego" } },
    ],
  },
  {
    id: "command",
    icon: MessageSquare,
    title: "Dê o comando",
    description: "Digite em linguagem natural o que você precisa que a IA faça.",
    phases: [
      { duration: 1000, cursorX: 350, cursorY: 445, clicking: false, mockOverrides: { highlightedElement: "input", selectedAppName: "Orquestrador de Tráfego" } },
      { duration: 3000, cursorX: 350, cursorY: 445, clicking: false, mockOverrides: { highlightedElement: "input", selectedAppName: "Orquestrador de Tráfego", typedText: SCENE_MESSAGE } },
      { duration: 800, cursorX: 605, cursorY: 460, clicking: false, mockOverrides: { highlightedElement: "send-button", selectedAppName: "Orquestrador de Tráfego", typedText: SCENE_MESSAGE } },
      { duration: 400, cursorX: 605, cursorY: 460, clicking: true, mockOverrides: { highlightedElement: "send-button", selectedAppName: "Orquestrador de Tráfego" } },
    ],
  },
  {
    id: "confirm",
    icon: CheckCircle,
    title: "Revise e confirme",
    description: "A IA monta a proposta e aguarda sua aprovação explícita.",
    phases: [
      { duration: 1500, cursorX: 400, cursorY: 300, clicking: false, mockOverrides: { selectedAppName: "Orquestrador de Tráfego", showUserMessage: true, userMessageText: SCENE_MESSAGE, showProcessing: true, processingText: "Processando com orquestrador de tráfego..." } },
      { duration: 2000, cursorX: 400, cursorY: 300, clicking: false, mockOverrides: { selectedAppName: "Orquestrador de Tráfego", showUserMessage: true, userMessageText: SCENE_MESSAGE, showFormDialogue: true, formDialogueData: FORM_DATA } },
      { duration: 1200, cursorX: 200, cursorY: 370, clicking: false, mockOverrides: { selectedAppName: "Orquestrador de Tráfego", showUserMessage: true, userMessageText: SCENE_MESSAGE, showFormDialogue: true, formDialogueData: FORM_DATA, highlightedElement: "confirm-btn" } },
      { duration: 800, cursorX: 200, cursorY: 370, clicking: true, mockOverrides: { selectedAppName: "Orquestrador de Tráfego", showUserMessage: true, userMessageText: SCENE_MESSAGE, showFormDialogue: true, formDialogueData: FORM_DATA, highlightedElement: "confirm-btn" } },
    ],
  },
];

const DEFAULT_MOCK = {
  typedText: "",
  showResponse: false,
  responseText: "",
  activeApp: 0,
  highlightedElement: null as string | null,
  showAppDropdown: false,
  selectedAppName: "Adz Chat v1.0",
  showProcessing: false,
  processingText: "",
  showFormDialogue: false,
  formDialogueData: undefined as FormDialogueData | undefined,
  showUserMessage: false,
  userMessageText: "",
};

export function NotionStyleHome() {
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

  const mockState = { ...DEFAULT_MOCK, ...phase.mockOverrides };

  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-10 items-start">
          {/* Tabs esquerda */}
          <div className="py-8 lg:py-16">
            <h3 className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-2">
              Plataforma AdzHub
            </h3>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#08080C] mb-8">
              Automatize trabalho repetitivo
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
                        layoutId="notion-tab-indicator"
                        className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-[#37489d]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pause / Play */}
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

          {/* Demo direita */}
          <div className="py-8 lg:py-16">
            <div className="relative w-full max-w-[750px] mx-auto">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#37489d]/6 via-transparent to-orange-200/15 rounded-3xl blur-2xl pointer-events-none" />
              <div className="relative">
                <MockInterface
                  typedText={mockState.typedText as string}
                  showResponse={mockState.showResponse as boolean}
                  responseText={mockState.responseText as string}
                  activeApp={mockState.activeApp as number}
                  highlightedElement={mockState.highlightedElement}
                  showAppDropdown={mockState.showAppDropdown as boolean}
                  selectedAppName={mockState.selectedAppName as string}
                  showProcessing={mockState.showProcessing as boolean}
                  processingText={mockState.processingText as string}
                  showFormDialogue={mockState.showFormDialogue as boolean}
                  formDialogueData={mockState.formDialogueData}
                  showUserMessage={mockState.showUserMessage as boolean}
                  userMessageText={mockState.userMessageText as string}
                />
                <AnimatedCursor x={phase.cursorX} y={phase.cursorY} clicking={phase.clicking} />
              </div>

              {/* Progress dots */}
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
