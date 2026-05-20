import { motion, AnimatePresence } from "framer-motion";
import { useMem0Scroll } from "./useMem0Scroll";
import { MockInterface } from "../motion-showcase/MockInterface";
import { AnimatedCursor } from "../motion-showcase/AnimatedCursor";
import { FormDialogueData } from "../motion-showcase/FormDialogue";

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

interface Phase {
  id: string;
  title: string;
  description: string;
  mockProps: Partial<MockInterfaceState>;
  cursorX: number;
  cursorY: number;
  clicking: boolean;
}

interface MockInterfaceState {
  typedText: string;
  showResponse: boolean;
  responseText: string;
  activeApp: number;
  highlightedElement: string | null;
  showAppDropdown: boolean;
  selectedAppName: string;
  showProcessing: boolean;
  processingText: string;
  showFormDialogue: boolean;
  formDialogueData: FormDialogueData | undefined;
  showUserMessage: boolean;
  userMessageText: string;
}

const PHASES: Phase[] = [
  {
    id: "explore",
    title: "Explore a plataforma",
    description: "Visão geral: chat, atalhos e aplicativos especializados integrados no mesmo ambiente.",
    mockProps: { highlightedElement: null, typedText: "", showUserMessage: false },
    cursorX: 400,
    cursorY: 250,
    clicking: false,
  },
  {
    id: "select",
    title: "Selecione o app",
    description: "Escolha o Orquestrador de Tráfego para direcionar a IA ao contexto de campanhas e orçamentos.",
    mockProps: {
      highlightedElement: "app-selector",
      showAppDropdown: true,
      selectedAppName: "Orquestrador de Tráfego",
    },
    cursorX: 520,
    cursorY: 55,
    clicking: true,
  },
  {
    id: "command",
    title: "Dê o comando",
    description: "Digite em linguagem natural: \"aumente o orçamento total das campanhas em 15%\".",
    mockProps: {
      highlightedElement: "input",
      showAppDropdown: false,
      selectedAppName: "Orquestrador de Tráfego",
      typedText: SCENE_MESSAGE,
      showUserMessage: false,
    },
    cursorX: 350,
    cursorY: 445,
    clicking: false,
  },
  {
    id: "confirm",
    title: "Revise e confirme",
    description: "A IA interpreta, monta a proposta e espera sua aprovação antes de executar qualquer mudança.",
    mockProps: {
      highlightedElement: "confirm-btn",
      showAppDropdown: false,
      selectedAppName: "Orquestrador de Tráfego",
      typedText: "",
      showUserMessage: true,
      userMessageText: SCENE_MESSAGE,
      showProcessing: false,
      showFormDialogue: true,
      formDialogueData: FORM_DATA,
    },
    cursorX: 200,
    cursorY: 370,
    clicking: false,
  },
];

const DEFAULT_STATE: MockInterfaceState = {
  typedText: "",
  showResponse: false,
  responseText: "",
  activeApp: 0,
  highlightedElement: null,
  showAppDropdown: false,
  selectedAppName: "Adz Chat v1.0",
  showProcessing: false,
  processingText: "",
  showFormDialogue: false,
  formDialogueData: undefined,
  showUserMessage: false,
  userMessageText: "",
};

export function Mem0StyleHome() {
  const { activePhase, sectionRef, phaseRefs, goToPhase, sectionMinHeight, phaseHeight } =
    useMem0Scroll(PHASES.length);

  const phase = PHASES[activePhase];
  const mockState: MockInterfaceState = { ...DEFAULT_STATE, ...phase.mockProps };

  return (
    <section ref={sectionRef} className="relative" style={{ minHeight: sectionMinHeight }}>
      {/* Sentinelas distribuídas na altura da seção */}
      <motion.div className="absolute inset-x-0 top-0 pointer-events-none" aria-hidden>
        {PHASES.map((p, i) => (
          <motion.div
            key={p.id}
            ref={(el) => { phaseRefs.current[i] = el; }}
            className="absolute inset-x-0"
            style={{ top: `calc(${i} * ${phaseHeight})`, height: phaseHeight }}
          />
        ))}
      </motion.div>

      {/* Stepper + demo ficam fixos enquanto a seção rola */}
      <motion.div className="sticky top-20 z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div className="grid lg:grid-cols-[320px_1fr] gap-0 lg:gap-12">
          {/* Stepper */}
          <motion.div className="py-8 lg:py-16">
            <h3 className="text-sm font-semibold text-[#37489d] uppercase tracking-wider mb-2">
              Como funciona
            </h3>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#08080C] mb-10">
              Do comando à ação
            </h2>

            <motion.div className="relative flex flex-col">
              <motion.div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200" />
              <motion.div
                className="absolute left-[11px] top-3 w-0.5 bg-[#37489d] origin-top"
                animate={{ height: `${(activePhase / (PHASES.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              {PHASES.map((p, i) => {
                const isActive = i === activePhase;
                const isPast = i < activePhase;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => goToPhase(i)}
                    className="relative flex items-start gap-4 text-left py-4 group cursor-pointer"
                  >
                    <motion.div
                      className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isActive
                          ? "border-[#37489d] bg-[#37489d] scale-110"
                          : isPast
                            ? "border-[#37489d] bg-[#37489d]"
                            : "border-gray-300 bg-white group-hover:border-gray-400"
                      }`}
                    >
                      {(isActive || isPast) && (
                        <motion.div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </motion.div>
                    <motion.div className="min-w-0">
                      <motion.div
                        className={`text-sm font-semibold transition-colors duration-200 ${
                          isActive ? "text-[#08080C]" : "text-gray-400"
                        }`}
                      >
                        {p.title}
                      </motion.div>
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-gray-500 mt-1 leading-relaxed"
                          >
                            {p.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </button>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Demo */}
          <motion.div className="py-8 lg:py-16">
            <motion.div className="relative w-full max-w-[750px] mx-auto">
              <motion.div
                className="absolute -inset-6 bg-gradient-to-br from-[#37489d]/8 via-transparent to-[#F9C7B2]/10 rounded-3xl blur-2xl pointer-events-none"
                aria-hidden
              />
              <motion.div className="relative">
                <MockInterface
                  typedText={mockState.typedText}
                  showResponse={mockState.showResponse}
                  responseText={mockState.responseText}
                  activeApp={mockState.activeApp}
                  highlightedElement={mockState.highlightedElement}
                  showAppDropdown={mockState.showAppDropdown}
                  selectedAppName={mockState.selectedAppName}
                  showProcessing={mockState.showProcessing}
                  processingText={mockState.processingText}
                  showFormDialogue={mockState.showFormDialogue}
                  formDialogueData={mockState.formDialogueData}
                  showUserMessage={mockState.showUserMessage}
                  userMessageText={mockState.userMessageText}
                />
                <AnimatedCursor
                  x={phase.cursorX}
                  y={phase.cursorY}
                  clicking={phase.clicking}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
