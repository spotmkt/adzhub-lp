import { motion } from "framer-motion";
import {
  Send,
  Target,
  MessageSquare,
  Search,
  FileText,
  LayoutGrid,
  ChevronDown,
  Plus,
  Loader2,
  SlidersHorizontal,
  Radio,
  Mic,
  Globe,
  Sparkles,
  Grid3X3,
  CircleDot,
  Megaphone,
  Lightbulb,
  Stethoscope,
  PenLine,
} from "lucide-react";
import adzhubLogo from "@/assets/adzhub-logo-new.svg";
import { FormDialogue, FormDialogueData } from "./FormDialogue";

interface MockInterfaceProps {
  typedText: string;
  showResponse: boolean;
  responseText: string;
  activeApp: number;
  highlightedElement: string | null;
  showAppDropdown?: boolean;
  selectedAppName?: string;
  showProcessing?: boolean;
  processingText?: string;
  showFormDialogue?: boolean;
  formDialogueData?: FormDialogueData;
  showUserMessage?: boolean;
  userMessageText?: string;
}

const modeloItems: { id?: string; name: string; icon: typeof Megaphone }[] = [
  { id: "traffic", name: "Agente API Meta Ads", icon: Megaphone },
  { name: "Gerador de Briefings", icon: FileText },
  { name: "Diagnostico de Marketing", icon: Stethoscope },
  { name: "Redator de Blog", icon: PenLine },
  { name: "AdzChat Mini", icon: MessageSquare },
  { name: "AdzChat Pro", icon: Sparkles },
  { name: "Agente API Google Ads", icon: Search },
];

const chatHistory = [
  { title: "Otimização de campanhas Q1", when: "1m atrás", section: "Hoje" as const },
  { title: "Briefing marca X", when: "3h atrás", section: "Hoje" as const },
  { title: "Relatório mensal Meta", when: "2d atrás", section: "7d" as const },
];

const sugeridos = [
  { title: "Analise de Criativos", desc: "Analise os criativos e diga quais pausar/escalar" },
  { title: "Campanhas ativas", desc: "Quais campanhas estão ativas?" },
  { title: "Metricas do mes", desc: "Quanto gastei em anuncios este mes?" },
];

const appOptions = [
  { id: "chat", name: "AdzChat Geral", icon: MessageSquare },
  { id: "traffic", name: "Agente API Meta Ads", icon: Megaphone },
];

export const AdzChatProductMockInterface = ({
  typedText,
  showResponse,
  responseText,
  activeApp: _activeApp,
  highlightedElement,
  showAppDropdown,
  selectedAppName,
  showProcessing,
  processingText,
  showFormDialogue,
  formDialogueData,
  showUserMessage,
  userMessageText,
}: MockInterfaceProps) => {
  void _activeApp;
  const currentAppName = selectedAppName ?? "AdzChat Geral";
  const CurrentAppIcon = currentAppName === "AdzChat Geral" ? MessageSquare : Megaphone;

  const inConversation =
    Boolean(typedText) ||
    Boolean(showUserMessage) ||
    Boolean(showProcessing) ||
    Boolean(showFormDialogue) ||
    Boolean(showResponse && responseText);

  return (
    <div className="w-full min-h-[440px] sm:h-[520px] bg-[#F9F9F9] rounded-2xl shadow-2xl overflow-hidden border border-[#1A2B4B]/10 relative text-[#1A2B4B]">
      <div className="flex h-full min-h-[440px] sm:min-h-0">
        {/* Sidebar estilo AdzChat */}
        <motion.aside
          className="hidden sm:flex w-[216px] shrink-0 flex-col border-r border-[#1A2B4B]/8 bg-white py-3 px-2.5"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 px-1.5 mb-4">
            <img src={adzhubLogo} alt="AdzHub" className="h-7 w-auto" />
            <span className="text-sm font-semibold tracking-tight">Adzhub</span>
          </div>

          <div className="flex gap-1 px-0.5 mb-5 text-[#1A2B4B]/55">
            {[MessageSquare, Search, FileText, LayoutGrid].map((Icon, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F9F9F9] cursor-default border border-transparent"
                whileHover={{ scale: 1.04 }}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
            ))}
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2B4B]/40 px-1.5 mb-2">
            Modelos
          </div>
          <div className="flex flex-col gap-0.5 mb-5 min-h-0 overflow-y-auto pr-0.5">
            {modeloItems.map((m) => {
              const Icon = m.icon;
              const isTraffic = m.id === "traffic";
              const selected = isTraffic && currentAppName === "Agente API Meta Ads";
              return (
                <motion.div
                  key={m.name}
                  layout
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] leading-tight cursor-default ${
                    selected ? "bg-[#F59E0B]/12 text-[#1A2B4B] font-medium" : "text-[#1A2B4B]/75 hover:bg-[#F9F9F9]"
                  }`}
                  animate={{ x: selected ? 0 : 0 }}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${selected ? "text-[#F59E0B]" : "text-[#F59E0B]/80"}`} />
                  <span className="truncate">{m.name}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2B4B]/40 px-1.5 mb-1.5">
            Chats
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 text-[11px]">
            <div>
              <div className="text-[10px] text-[#1A2B4B]/35 mb-1 px-1.5">Hoje</div>
              {chatHistory
                .filter((c) => c.section === "Hoje")
                .map((c) => (
                  <div key={c.title} className="px-1.5 py-1 rounded-md hover:bg-[#F9F9F9] cursor-default">
                    <div className="truncate text-[#1A2B4B]/90">{c.title}</div>
                    <div className="text-[10px] text-[#1A2B4B]/40">{c.when}</div>
                  </div>
                ))}
            </div>
            <div>
              <div className="text-[10px] text-[#1A2B4B]/35 mb-1 px-1.5">Últimos 7 dias</div>
              {chatHistory
                .filter((c) => c.section === "7d")
                .map((c) => (
                  <div key={c.title} className="px-1.5 py-1 rounded-md hover:bg-[#F9F9F9] cursor-default">
                    <div className="truncate text-[#1A2B4B]/90">{c.title}</div>
                    <div className="text-[10px] text-[#1A2B4B]/40">{c.when}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#1A2B4B]/8 flex items-center gap-2 px-1.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#37489d] to-[#1A2B4B]" />
            <span className="text-xs font-medium text-[#1A2B4B]/85">Adz</span>
          </div>
        </motion.aside>

        {/* Área principal */}
        <motion.div
          className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#F9F9F9]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          {/* Header */}
          <header className="h-11 shrink-0 flex items-center justify-between px-3 sm:px-4 border-b border-[#1A2B4B]/8 bg-[#F9F9F9]/95 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="relative">
                <motion.button
                  type="button"
                  className={`flex items-center gap-1.5 max-w-[200px] sm:max-w-[260px] truncate rounded-lg border px-2 py-1 text-[11px] sm:text-xs font-medium transition-colors ${
                    highlightedElement === "app-selector"
                      ? "border-[#37489d] bg-[#37489d]/10 text-[#1A2B4B] ring-2 ring-[#37489d]/25"
                      : "border-[#1A2B4B]/12 bg-white text-[#1A2B4B]"
                  }`}
                  animate={{ scale: highlightedElement === "app-selector" ? 1.02 : 1 }}
                >
                  <CurrentAppIcon className="w-3.5 h-3.5 shrink-0 text-[#F59E0B]" />
                  <span className="truncate">{currentAppName}</span>
                  <ChevronDown className="w-3 h-3 shrink-0 text-[#1A2B4B]/45" />
                </motion.button>

                {showAppDropdown && (
                  <motion.div
                    className="absolute left-0 top-[calc(100%+4px)] z-40 w-[220px] rounded-xl border border-[#1A2B4B]/10 bg-white py-1 shadow-xl"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {appOptions.map((app) => (
                      <div
                        key={app.id}
                        className={`flex items-center gap-2 px-3 py-2 text-xs cursor-default ${
                          highlightedElement === `app-${app.id}`
                            ? "bg-[#37489d] text-white"
                            : "text-[#1A2B4B] hover:bg-[#F9F9F9]"
                        }`}
                      >
                        <app.icon className="w-3.5 h-3.5 shrink-0" />
                        {app.name}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
              <button
                type="button"
                className="w-7 h-7 rounded-lg border border-[#1A2B4B]/10 bg-white flex items-center justify-center text-[#1A2B4B]/60"
                aria-label="Novo chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-[#1A2B4B]/45">
              <Loader2 className="w-4 h-4 animate-spin opacity-70" />
              <SlidersHorizontal className="w-4 h-4 hidden sm:block" />
              <Radio className="w-4 h-4 hidden sm:block" />
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F59E0B] to-orange-600 border border-white shadow-sm" />
            </div>
          </header>

          {/* Conteúdo + compositor */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 flex flex-col">
              {!inConversation && (
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center text-center px-2 max-w-lg mx-auto w-full"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                >
                  <img src={adzhubLogo} alt="" className="h-14 w-auto mb-4 opacity-95" />
                  <h2 className="text-lg sm:text-xl font-semibold text-[#1A2B4B] mb-2">Agente API Meta Ads</h2>
                  <p className="text-xs sm:text-sm text-[#1A2B4B]/65 leading-relaxed mb-8">
                    Agente que consulta e gerencia campanhas Meta Ads via API. Inclui Analise de Criativos. Leitura
                    livre, escrita com confirmacao.
                  </p>

                  <div className="w-full text-left space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#1A2B4B]/35 mb-1">
                      Sugerido
                    </div>
                    {sugeridos.map((s, i) => (
                      <motion.div
                        key={s.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.06, type: "spring", stiffness: 380, damping: 28 }}
                        className="rounded-xl border border-[#1A2B4B]/8 bg-white px-3 py-2.5 shadow-sm"
                      >
                        <div className="text-xs font-semibold text-[#1A2B4B]">{s.title}</div>
                        <div className="text-[11px] text-[#37489d]/90 mt-0.5">{s.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {inConversation && (
                <div className="w-full max-w-2xl mx-auto space-y-4 pb-2">
                  {showUserMessage && userMessageText && (
                    <motion.div
                      className="flex justify-end"
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    >
                      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#37489d] px-3.5 py-2.5 text-white shadow-md">
                        <p className="text-xs leading-relaxed">{userMessageText}</p>
                      </div>
                    </motion.div>
                  )}

                  {showProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-xs text-[#1A2B4B]/55"
                    >
                      <motion.div
                        className="flex gap-1"
                        animate={{ opacity: [0.35, 1, 0.35] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#37489d]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#37489d]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#37489d]" />
                      </motion.div>
                      <span className="italic">{processingText || "Processando..."}</span>
                    </motion.div>
                  )}

                  {showFormDialogue && formDialogueData && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    >
                      <FormDialogue
                        data={formDialogueData}
                        highlightedButton={highlightedElement === "confirm-btn"}
                      />
                    </motion.div>
                  )}

                  {showResponse && responseText && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#37489d] flex items-center justify-center shrink-0">
                        <Target className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 rounded-2xl rounded-tl-md border border-[#1A2B4B]/10 bg-white px-3 py-2 text-xs text-[#1A2B4B]/85 shadow-sm">
                        {responseText}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Compositor fixo */}
            <motion.div
              className="shrink-0 p-3 sm:p-4 pt-0 bg-gradient-to-t from-[#F9F9F9] via-[#F9F9F9] to-transparent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
            >
              <div className="max-w-2xl mx-auto w-full">
                <motion.div
                  className={`rounded-2xl border-2 bg-white shadow-[0_12px_40px_-12px_rgba(26,43,75,0.18)] transition-all ${
                    highlightedElement === "input"
                      ? "border-[#37489d] ring-2 ring-[#37489d]/20"
                      : "border-[#1A2B4B]/10"
                  }`}
                  animate={{ scale: highlightedElement === "input" ? 1.01 : 1 }}
                >
                  <div className="px-3 sm:px-4 pt-3 pb-2">
                    <div className="min-h-[40px] flex items-start">
                      <p className="text-xs sm:text-sm w-full text-[#1A2B4B]/85 leading-relaxed">
                        {typedText && !showUserMessage ? (
                          <>
                            {typedText}
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 0.75 }}
                              className="inline-block w-0.5 h-3.5 bg-[#37489d] ml-0.5 align-middle rounded-sm"
                            />
                          </>
                        ) : (
                          <span className="text-[#1A2B4B]/35">Como posso ajudar você hoje?</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 sm:px-4 pb-2.5 flex-wrap">
                    <button type="button" className="text-[#1A2B4B]/40 hover:text-[#1A2B4B]/65 p-1" aria-hidden>
                      <Plus className="w-4 h-4" />
                    </button>
                    <button type="button" className="text-[#1A2B4B]/40 p-1" aria-hidden>
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button type="button" className="text-[#1A2B4B]/40 p-1" aria-hidden>
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[10px] text-[#1A2B4B]/55 border border-[#1A2B4B]/12 rounded-full px-2 py-0.5"
                      aria-hidden
                    >
                      <CircleDot className="w-3 h-3" />1
                    </button>
                    <button type="button" className="text-[#1A2B4B]/40 p-1" aria-hidden>
                      <Globe className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-[8px]" />
                    <button type="button" className="text-[#1A2B4B]/40 p-1" aria-hidden>
                      <Mic className="w-4 h-4" />
                    </button>
                    <motion.button
                      type="button"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        highlightedElement === "send-button"
                          ? "bg-[#1A2B4B] text-white scale-105 shadow-lg"
                          : "bg-[#1A2B4B] text-white opacity-90 hover:opacity-100"
                      }`}
                      animate={{ scale: highlightedElement === "send-button" ? 1.08 : 1 }}
                      aria-label="Enviar"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
                <p className="text-[9px] text-center text-[#1A2B4B]/35 mt-2">
                  O Adz pode cometer erros. Verifique informações importantes.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
