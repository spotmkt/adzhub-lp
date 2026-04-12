import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedCursor } from "./AnimatedCursor";
import { MockInterface } from "./MockInterface";
import { AdzChatProductMockInterface } from "./AdzChatProductMockInterface";
import { FormDialogueData } from "./FormDialogue";

const SCENE_1_MESSAGE = "aumente o orçamento total das campanhas em 15%";

export type AdzChatShowcaseVariant = "platform" | "product";

interface AnimationStep {
  duration: number;
  cursorX: number;
  cursorY: number;
  clicking: boolean;
  highlightedElement: string | null;
  typedChars: number;
  showResponse: boolean;
  responseChars: number;
  activeApp: number;
  showAppDropdown?: boolean;
  selectedAppName?: string;
  showProcessing?: boolean;
  processingText?: string;
  showFormDialogue?: boolean;
  formDialogueData?: FormDialogueData;
  showUserMessage?: boolean;
  userMessageText?: string;
}

const FORM_DIALOGUE_DATA: FormDialogueData = {
  icon: "lightning",
  title: "Aumentar orçamento das campanhas",
  action: "confirmar alteração",
  fields: [
    { label: "campanhas", value: "3 campanhas selecionadas" },
    { label: "aumento", value: "15%" },
    { label: "valor estimado", value: "R$ 450,00 → R$ 517,50" },
  ],
};

/** Legendas — UI plataforma (hero home). */
const PLATFORM_STEP_CAPTIONS: string[] = [
  "Visão geral da plataforma: chat, atalhos e aplicativos especializados no mesmo ambiente.",
  "O cursor vai até o seletor de aplicativo no topo — é ali que você escolhe qual “especialista” responde.",
  "Clique para abrir o menu de apps: chat geral ou ferramentas focadas, como tráfego pago.",
  "Lista aberta: cada opção direciona o contexto da IA para o tipo de tarefa.",
  "Navegação até o Orquestrador de Tráfego, pensado para campanhas e orçamentos.",
  "Seleção confirmada: a conversa passa a usar o contexto de mídia e campanhas.",
  "O menu fecha e o cabeçalho mostra qual app está ativo — igual ao uso no dia a dia.",
  "O cursor se move até o campo de mensagem, onde você descreve o que precisa em linguagem natural.",
  "Clique no campo para focar e preparar o pedido à plataforma.",
  "Campo ativo: em seguida o texto do comando é digitado automaticamente nesta demonstração.",
  "Digitação do pedido: aumentar o orçamento total das campanhas em 15%.",
  "Indo até o botão de enviar a mensagem ao orquestrador.",
  "Envio: sua instrução deixa de ser rascunho e entra no fluxo do agente.",
  "A mensagem aparece no histórico do chat, como no uso real.",
  "Processamento: o Orquestrador de Tráfego interpreta o pedido e monta a resposta.",
  "Abre o painel de confirmação — com resumo da ação antes de qualquer alteração efetiva.",
  "Momento para revisar campanhas, percentual e impacto estimado nos valores.",
  "Cursor sobre “Confirmar alteração”: nada é aplicado sem o seu ok explícito.",
  "Clique para confirmar — a alteração proposta entra no fluxo da plataforma.",
  "Demonstração completa: da frase em português ao passo confirmável dentro da AdzHub.",
];

/** Legendas — UI AdzChat (página /chat). */
const PRODUCT_STEP_CAPTIONS: string[] = [
  "Interface do AdzChat: modelos, histórico e conversa no mesmo lugar, com a cara da AdzHub.",
  "O cursor vai até o seletor de agente no topo — é ali que você troca o contexto da IA.",
  "Clique para abrir o menu: chat geral ou agente especializado em Meta Ads.",
  "Lista aberta: cada opção direciona a conversa para o tipo de tarefa.",
  "Navegação até o Agente API Meta Ads, focado em campanhas e orçamentos.",
  "Seleção confirmada: a conversa passa a usar o contexto de mídia e campanhas.",
  "O menu fecha e o cabeçalho mostra qual agente está ativo.",
  "O cursor vai ao campo de mensagem para descrever o pedido em linguagem natural.",
  "Clique para focar o compositor e preparar o envio.",
  "Campo ativo: o texto do comando é digitado automaticamente nesta demonstração.",
  "Digitação do pedido: aumentar o orçamento total das campanhas em 15%.",
  "Indo até o botão de enviar a mensagem.",
  "Envio: sua instrução entra no fluxo do agente.",
  "A mensagem aparece no histórico do chat.",
  "Processamento: o agente Meta Ads interpreta o pedido e monta a resposta.",
  "Abre o painel de confirmação — revisão antes de qualquer alteração efetiva.",
  "Momento para revisar campanhas, percentual e impacto estimado nos valores.",
  "Cursor sobre “Confirmar alteração”: nada é aplicado sem o seu ok explícito.",
  "Clique para confirmar — a alteração proposta entra no fluxo da plataforma.",
  "Demonstração completa: do pedido em português ao passo confirmável no AdzChat.",
];

const PLATFORM_STEPS: AnimationStep[] = [
  {
    duration: 1000,
    cursorX: 400,
    cursorY: 250,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
  },
  {
    duration: 600,
    cursorX: 520,
    cursorY: 30,
    clicking: false,
    highlightedElement: "app-selector",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
  },
  {
    duration: 200,
    cursorX: 520,
    cursorY: 30,
    clicking: true,
    highlightedElement: "app-selector",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
  },
  {
    duration: 400,
    cursorX: 520,
    cursorY: 30,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
  },
  {
    duration: 500,
    cursorX: 520,
    cursorY: 75,
    clicking: false,
    highlightedElement: "app-traffic",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
  },
  {
    duration: 200,
    cursorX: 520,
    cursorY: 75,
    clicking: true,
    highlightedElement: "app-traffic",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 400,
    cursorX: 520,
    cursorY: 75,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: false,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 600,
    cursorX: 350,
    cursorY: 445,
    clicking: false,
    highlightedElement: "input",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 200,
    cursorX: 350,
    cursorY: 445,
    clicking: true,
    highlightedElement: "input",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 100,
    cursorX: 350,
    cursorY: 445,
    clicking: false,
    highlightedElement: "input",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 2500,
    cursorX: 350,
    cursorY: 445,
    clicking: false,
    highlightedElement: "input",
    typedChars: SCENE_1_MESSAGE.length,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 400,
    cursorX: 605,
    cursorY: 460,
    clicking: false,
    highlightedElement: "send-button",
    typedChars: SCENE_1_MESSAGE.length,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 200,
    cursorX: 605,
    cursorY: 460,
    clicking: true,
    highlightedElement: "send-button",
    typedChars: SCENE_1_MESSAGE.length,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
  },
  {
    duration: 100,
    cursorX: 605,
    cursorY: 460,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
  },
  {
    duration: 1500,
    cursorX: 400,
    cursorY: 300,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showProcessing: true,
    processingText: "Processando com orquestrador de tráfego...",
  },
  {
    duration: 500,
    cursorX: 400,
    cursorY: 300,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showProcessing: false,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 1500,
    cursorX: 400,
    cursorY: 300,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 600,
    cursorX: 200,
    cursorY: 370,
    clicking: false,
    highlightedElement: "confirm-btn",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 200,
    cursorX: 200,
    cursorY: 370,
    clicking: true,
    highlightedElement: "confirm-btn",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 2000,
    cursorX: 200,
    cursorY: 370,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Orquestrador de Tráfego",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
];

const PRODUCT_STEPS: AnimationStep[] = [
  {
    duration: 1000,
    cursorX: 560,
    cursorY: 260,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
  },
  {
    duration: 600,
    cursorX: 308,
    cursorY: 22,
    clicking: false,
    highlightedElement: "app-selector",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
  },
  {
    duration: 200,
    cursorX: 308,
    cursorY: 22,
    clicking: true,
    highlightedElement: "app-selector",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
  },
  {
    duration: 400,
    cursorX: 308,
    cursorY: 22,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
  },
  {
    duration: 500,
    cursorX: 308,
    cursorY: 100,
    clicking: false,
    highlightedElement: "app-traffic",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
  },
  {
    duration: 200,
    cursorX: 308,
    cursorY: 100,
    clicking: true,
    highlightedElement: "app-traffic",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: true,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 400,
    cursorX: 308,
    cursorY: 100,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    showAppDropdown: false,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 600,
    cursorX: 520,
    cursorY: 468,
    clicking: false,
    highlightedElement: "input",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 200,
    cursorX: 520,
    cursorY: 468,
    clicking: true,
    highlightedElement: "input",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 100,
    cursorX: 520,
    cursorY: 468,
    clicking: false,
    highlightedElement: "input",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 2500,
    cursorX: 520,
    cursorY: 468,
    clicking: false,
    highlightedElement: "input",
    typedChars: SCENE_1_MESSAGE.length,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 400,
    cursorX: 858,
    cursorY: 478,
    clicking: false,
    highlightedElement: "send-button",
    typedChars: SCENE_1_MESSAGE.length,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 200,
    cursorX: 858,
    cursorY: 478,
    clicking: true,
    highlightedElement: "send-button",
    typedChars: SCENE_1_MESSAGE.length,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
  },
  {
    duration: 100,
    cursorX: 858,
    cursorY: 478,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
  },
  {
    duration: 1500,
    cursorX: 520,
    cursorY: 280,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showProcessing: true,
    processingText: "Processando com Agente API Meta Ads...",
  },
  {
    duration: 500,
    cursorX: 520,
    cursorY: 280,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showProcessing: false,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 1500,
    cursorX: 520,
    cursorY: 280,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 600,
    cursorX: 328,
    cursorY: 318,
    clicking: false,
    highlightedElement: "confirm-btn",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 200,
    cursorX: 328,
    cursorY: 318,
    clicking: true,
    highlightedElement: "confirm-btn",
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
  {
    duration: 2000,
    cursorX: 328,
    cursorY: 318,
    clicking: false,
    highlightedElement: null,
    typedChars: 0,
    showResponse: false,
    responseChars: 0,
    activeApp: 0,
    selectedAppName: "Agente API Meta Ads",
    showUserMessage: true,
    userMessageText: SCENE_1_MESSAGE,
    showFormDialogue: true,
    formDialogueData: FORM_DIALOGUE_DATA,
  },
];

interface AdzChatShowcaseProps {
  variant?: AdzChatShowcaseVariant;
}

export const AdzChatShowcase = ({ variant = "platform" }: AdzChatShowcaseProps) => {
  const steps = variant === "product" ? PRODUCT_STEPS : PLATFORM_STEPS;
  const stepCaptions = variant === "product" ? PRODUCT_STEP_CAPTIONS : PLATFORM_STEP_CAPTIONS;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    setCurrentStepIndex(0);
    setTypedChars(0);
    setIsTyping(false);
  }, [variant]);

  useEffect(() => {
    if (currentStep.typedChars > typedChars && !isTyping) {
      setIsTyping(true);
      const targetChars = currentStep.typedChars;
      const charsToType = targetChars - typedChars;
      const intervalTime = Math.max(8, currentStep.duration / charsToType);

      let currentChar = typedChars;
      const interval = setInterval(() => {
        currentChar++;
        setTypedChars(currentChar);
        if (currentChar >= targetChars) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [currentStepIndex, currentStep.typedChars, typedChars, isTyping, currentStep.duration]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setCurrentStepIndex(0);
        setTypedChars(0);
      }
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [currentStepIndex, currentStep.duration, steps.length]);

  const stepCaption =
    stepCaptions[currentStepIndex] ?? stepCaptions[stepCaptions.length - 1] ?? "";

  const mockProps = {
    typedText: SCENE_1_MESSAGE.slice(0, typedChars),
    showResponse: currentStep.showResponse,
    responseText: "",
    activeApp: currentStep.activeApp,
    highlightedElement: currentStep.highlightedElement,
    showAppDropdown: currentStep.showAppDropdown,
    selectedAppName: currentStep.selectedAppName,
    showProcessing: currentStep.showProcessing,
    processingText: currentStep.processingText,
    showFormDialogue: currentStep.showFormDialogue,
    formDialogueData: currentStep.formDialogueData,
    showUserMessage: currentStep.showUserMessage,
    userMessageText: currentStep.userMessageText,
  };

  return (
    <motion.div
      className="relative pb-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {variant === "product" ? (
          <AdzChatProductMockInterface {...mockProps} />
        ) : (
          <MockInterface {...mockProps} />
        )}

        <AnimatedCursor x={currentStep.cursorX} y={currentStep.cursorY} clicking={currentStep.clicking} />
      </div>

      <div className="mt-5 px-1 sm:px-2 min-h-[4.5rem] flex items-start justify-center">
        <motion.p
          key={`${variant}-${currentStepIndex}`}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-center text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl"
        >
          {stepCaption}
        </motion.p>
      </div>
    </motion.div>
  );
};
