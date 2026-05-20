import { useState, useEffect, useRef, useCallback, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pointer, MessageSquare, CheckCircle, Pause, Play, ListChecks } from "lucide-react";
import { MockInterface, type MockPendingItem } from "@/components/motion-showcase/MockInterface";
import { MockCursorOverlay } from "@/components/motion-showcase/MockCursorOverlay";
import { FormDialogueData } from "@/components/motion-showcase/FormDialogue";
import { AdzChatWelcomeContent } from "./AdzChatWelcomeMock";

type MockView = "platform" | "adzchat-welcome";

const SCENE_MESSAGE = "aumente o orçamento total das campanhas em 15%";

const PENDING_ITEMS: MockPendingItem[] = [
  {
    id: "report",
    title: "Enviar relatório de campanha",
    subtitle: "Meta Ads · vence hoje",
    kind: "report",
  },
  {
    id: "budget",
    title: "Revisar orçamento semanal",
    subtitle: "Lembrete da IA",
    kind: "reminder",
  },
  {
    id: "creatives",
    title: "Aprovar criativos",
    subtitle: "3 anúncios aguardando",
    kind: "alert",
  },
];

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

interface TabPhase {
  duration: number;
  clicking: boolean;
  /** `data-cursor-target` no MockInterface; se omitido, usa explore-chat. */
  cursorTarget?: string | null;
  mockOverrides: Record<string, unknown>;
}

interface Tab {
  id: string;
  icon: typeof Eye;
  title: string;
  description: string;
  phases: TabPhase[];
}

const TABS: Tab[] = [
  {
    id: "explore",
    icon: Eye,
    title: "Explore a plataforma",
    description:
      "Tela inicial do Adz Chat: boas-vindas, atalhos rápidos e compositor para começar em linguagem natural.",
    phases: [
      {
        duration: 1500,
        clicking: false,
        cursorTarget: "welcome-card-images",
        mockOverrides: { mockView: "adzchat-welcome", highlightedElement: "welcome-card-images" },
      },
      {
        duration: 1500,
        clicking: false,
        cursorTarget: "welcome-card-text",
        mockOverrides: { mockView: "adzchat-welcome", highlightedElement: "welcome-card-text" },
      },
      {
        duration: 1500,
        clicking: false,
        cursorTarget: "welcome-card-code",
        mockOverrides: { mockView: "adzchat-welcome", highlightedElement: "welcome-card-code" },
      },
      {
        duration: 1800,
        clicking: false,
        cursorTarget: "welcome-input",
        mockOverrides: { mockView: "adzchat-welcome", highlightedElement: "welcome-input" },
      },
    ],
  },
  {
    id: "pending",
    icon: ListChecks,
    title: "Resolva pendências",
    description:
      "Alertas, lembretes e tarefas na barra central — aprove relatórios e notificações em um clique.",
    phases: [
      {
        duration: 1600,
        clicking: false,
        cursorTarget: "pending-panel",
        mockOverrides: { pendingItems: PENDING_ITEMS, activeApp: 0 },
      },
      {
        duration: 1100,
        clicking: false,
        cursorTarget: "pending-item-report",
        mockOverrides: {
          pendingItems: PENDING_ITEMS,
          highlightedElement: "pending-report",
          activeApp: 0,
        },
      },
      {
        duration: 900,
        clicking: false,
        cursorTarget: "pending-approve-report",
        mockOverrides: {
          pendingItems: PENDING_ITEMS,
          highlightedElement: "pending-approve-report",
          activeApp: 0,
        },
      },
      {
        duration: 500,
        clicking: true,
        cursorTarget: "pending-approve-report",
        mockOverrides: {
          pendingItems: PENDING_ITEMS,
          highlightedElement: "pending-approve-report",
          approvedPendingIds: ["report"],
          activeApp: 0,
        },
      },
      {
        duration: 1000,
        clicking: false,
        cursorTarget: "pending-item-budget",
        mockOverrides: {
          pendingItems: PENDING_ITEMS,
          approvedPendingIds: ["report"],
          highlightedElement: "pending-budget",
          activeApp: 0,
        },
      },
    ],
  },
  {
    id: "select",
    icon: Pointer,
    title: "Selecione o app",
    description:
      "Escolha o Orquestrador de Tráfego para direcionar a IA ao contexto de campanhas e orçamentos.",
    phases: [
      {
        duration: 1200,
        clicking: false,
        cursorTarget: "app-selector",
        mockOverrides: { highlightedElement: "app-selector" },
      },
      {
        duration: 800,
        clicking: true,
        cursorTarget: "app-selector",
        mockOverrides: { highlightedElement: "app-selector", showAppDropdown: true },
      },
      {
        duration: 1500,
        clicking: false,
        cursorTarget: "app-traffic",
        mockOverrides: { showAppDropdown: true, highlightedElement: "app-traffic" },
      },
      {
        duration: 800,
        clicking: true,
        cursorTarget: "app-traffic",
        mockOverrides: {
          showAppDropdown: true,
          highlightedElement: "app-traffic",
          selectedAppName: "Orquestrador de Tráfego",
        },
      },
      {
        duration: 700,
        clicking: false,
        cursorTarget: "app-selector",
        mockOverrides: { showAppDropdown: false, selectedAppName: "Orquestrador de Tráfego" },
      },
    ],
  },
  {
    id: "command",
    icon: MessageSquare,
    title: "Dê o comando",
    description: 'Digite em linguagem natural: "aumente o orçamento total das campanhas em 15%".',
    phases: [
      {
        duration: 700,
        clicking: false,
        cursorTarget: "input",
        mockOverrides: { highlightedElement: "input", selectedAppName: "Orquestrador de Tráfego" },
      },
      {
        duration: 650,
        clicking: false,
        cursorTarget: "input",
        mockOverrides: {
          highlightedElement: "input",
          selectedAppName: "Orquestrador de Tráfego",
          typedText: "aumente o orçamento ",
        },
      },
      {
        duration: 750,
        clicking: false,
        cursorTarget: "input",
        mockOverrides: {
          highlightedElement: "input",
          selectedAppName: "Orquestrador de Tráfego",
          typedText: "aumente o orçamento total das campanhas ",
        },
      },
      {
        duration: 900,
        clicking: false,
        cursorTarget: "input",
        mockOverrides: {
          highlightedElement: "input",
          selectedAppName: "Orquestrador de Tráfego",
          typedText: SCENE_MESSAGE,
        },
      },
      {
        duration: 700,
        clicking: false,
        cursorTarget: "send-button",
        mockOverrides: {
          highlightedElement: "send-button",
          selectedAppName: "Orquestrador de Tráfego",
          typedText: SCENE_MESSAGE,
        },
      },
      {
        duration: 450,
        clicking: true,
        cursorTarget: "send-button",
        mockOverrides: {
          highlightedElement: "send-button",
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
        },
      },
    ],
  },
  {
    id: "confirm",
    icon: CheckCircle,
    title: "Revise e confirme",
    description: "A IA interpreta, monta a proposta e espera sua aprovação antes de executar qualquer mudança.",
    phases: [
      {
        duration: 1400,
        clicking: false,
        cursorTarget: "explore-chat",
        mockOverrides: {
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
          showProcessing: true,
          processingText: "Processando com orquestrador de tráfego...",
          chatScrollY: 0,
        },
      },
      {
        duration: 1100,
        clicking: false,
        cursorTarget: "explore-chat",
        mockOverrides: {
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
          showFormDialogue: true,
          formDialogueData: FORM_DATA,
          chatScrollY: 0,
        },
      },
      {
        duration: 900,
        clicking: false,
        cursorTarget: "chat-scroll-handle",
        mockOverrides: {
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
          showFormDialogue: true,
          formDialogueData: FORM_DATA,
          chatScrollY: 0,
        },
      },
      {
        duration: 1000,
        clicking: true,
        cursorTarget: "chat-scroll-handle",
        mockOverrides: {
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
          showFormDialogue: true,
          formDialogueData: FORM_DATA,
          chatScrollY: 75,
        },
      },
      {
        duration: 900,
        clicking: true,
        cursorTarget: "chat-scroll-handle",
        mockOverrides: {
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
          showFormDialogue: true,
          formDialogueData: FORM_DATA,
          chatScrollY: 145,
        },
      },
      {
        duration: 600,
        clicking: false,
        cursorTarget: "confirm-btn",
        mockOverrides: {
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
          showFormDialogue: true,
          formDialogueData: FORM_DATA,
          chatScrollY: 145,
          highlightedElement: "confirm-btn",
        },
      },
      {
        duration: 800,
        clicking: true,
        cursorTarget: "confirm-btn",
        mockOverrides: {
          selectedAppName: "Orquestrador de Tráfego",
          showUserMessage: true,
          userMessageText: SCENE_MESSAGE,
          showFormDialogue: true,
          formDialogueData: FORM_DATA,
          chatScrollY: 145,
          highlightedElement: "confirm-btn",
        },
      },
    ],
  },
];

const PENDING_TAB_INDEX = TABS.findIndex((t) => t.id === "pending");
/** A partir do clique em "Aprovar" no relatório, mantém as demais notificações visíveis. */
const PENDING_APPROVE_PHASE_IDX = 3;

const DEFAULT_MOCK = {
  mockView: "platform" as MockView,
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
  pendingItems: undefined as MockPendingItem[] | undefined,
  approvedPendingIds: [] as string[],
  pendingPanelOpen: false,
  chatScrollY: 0,
};

interface HomeInteractiveMotionProps {
  embedded?: boolean;
  id?: string;
}

/** Cards clicáveis + auto-play (mesmo padrão da /seo) para a home. */
export function HomeInteractiveMotion({ embedded = false, id }: HomeInteractiveMotionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mockContainerRef = useRef<HTMLDivElement>(null);

  const tab = TABS[activeTab];
  const phase = tab.phases[phaseIdx] ?? tab.phases[0];

  const showPendingCarryover =
    activeTab > PENDING_TAB_INDEX ||
    (activeTab === PENDING_TAB_INDEX && phaseIdx >= PENDING_APPROVE_PHASE_IDX);

  const pendingPanelOpen = activeTab >= PENDING_TAB_INDEX;

  const mockState = {
    ...DEFAULT_MOCK,
    pendingPanelOpen,
    ...phase.mockOverrides,
    ...(showPendingCarryover
      ? {
          pendingItems: PENDING_ITEMS,
          pendingPanelOpen: true,
          approvedPendingIds:
            "approvedPendingIds" in phase.mockOverrides
              ? (phase.mockOverrides.approvedPendingIds as string[])
              : ["report"],
          activeApp:
            "activeApp" in phase.mockOverrides ? (phase.mockOverrides.activeApp as number) : 0,
        }
      : {}),
  };

  const advancePhase = useCallback(() => {
    setPhaseIdx((prev) => {
      if (prev + 1 < TABS[activeTab].phases.length) return prev + 1;
      const nextTab = (activeTab + 1) % TABS.length;
      setActiveTab(nextTab);
      return 0;
    });
  }, [activeTab]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsNarrowViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  const showCursor = !isNarrowViewport;
  const mockView = (mockState.mockView as MockView) ?? "platform";

  const cursorTarget =
    phase.cursorTarget ??
    (typeof mockState.highlightedElement === "string" ? mockState.highlightedElement : null) ??
    (mockView === "adzchat-welcome" ? "welcome-center" : "explore-chat");

  return (
    <section
      id={id}
      className={
        embedded
          ? "relative py-8 sm:py-12 scroll-mt-28"
          : "relative py-12 sm:py-16 bg-[#F8F8F8] rounded-3xl mx-4 sm:mx-5 scroll-mt-28"
      }
    >
      <motion.div className="max-w-7xl mx-auto px-4 sm:px-8">
        {!embedded && (
          <motion.div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-2">
              Como funciona
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#08080C]">Do comando à ação</h2>
            <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">
              Da frase em português à alteração confirmável — com o contexto da sua operação na AdzHub.
            </p>
          </motion.div>
        )}

        <motion.div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-6 lg:gap-10 items-start">
          <motion.div>
            {!embedded && (
              <p className="text-xs font-medium text-[#37489d] mb-6 lg:hidden">Toque para explorar</p>
            )}
            {embedded && (
              <motion.div className="mb-6 lg:mb-0">
                <p className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-2">
                  Como funciona
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#08080C]">Do comando à ação</h2>
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
                        layoutId="home-lp-tab-indicator"
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
            <motion.div ref={mockContainerRef} className="relative w-full">
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
                pendingItems={mockState.pendingItems as MockPendingItem[] | undefined}
                approvedPendingIds={mockState.approvedPendingIds as string[]}
                pendingPanelOpen={mockState.pendingPanelOpen as boolean}
                welcomeSlot={
                  mockView === "adzchat-welcome" ? (
                    <AdzChatWelcomeContent
                      highlightedElement={mockState.highlightedElement}
                      typedText={mockState.typedText as string}
                    />
                  ) : undefined
                }
                chatScrollY={mockState.chatScrollY as number}
              />
              <MockCursorOverlay
                containerRef={mockContainerRef as RefObject<HTMLElement | null>}
                target={cursorTarget}
                clicking={phase.clicking}
                hidden={!showCursor}
                layoutKey={`${mockView}-${activeTab}-${phaseIdx}-${String(mockState.pendingPanelOpen)}-${String(mockState.showAppDropdown)}-${String(mockState.showFormDialogue)}-${mockState.chatScrollY}-${(mockState.approvedPendingIds as string[]).join(",")}`}
              />
            </motion.div>
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
      </motion.div>
    </section>
  );
}
