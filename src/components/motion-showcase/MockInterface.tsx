import { motion } from "framer-motion";
import {
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Send,
  Zap,
  Target,
  FileText,
  Map,
  Search,
  Paperclip,
  Mic,
  Brain,
  ChevronDown,
  RefreshCw,
  Wifi,
  MessageSquare,
  Lightbulb,
  GraduationCap,
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

const sidebarApps = [
  { icon: Calendar, label: "Agenda" },
  { icon: Zap, label: "Ações" },
  { icon: Target, label: "Campanhas" },
  { icon: FileText, label: "Conteúdo" },
  { icon: BarChart3, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
  { icon: Map, label: "Mapa" },
  { icon: Search, label: "Pesquisa" },
];

const appOptions = [
  { id: "chat", name: "Adz Chat v1.0", icon: MessageSquare },
  { id: "traffic", name: "Orquestrador de Tráfego", icon: Target },
];

export const MockInterface = ({
  typedText,
  showResponse,
  responseText,
  activeApp,
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
  const currentAppName = selectedAppName || "Adz Chat v1.0";
  const CurrentAppIcon = selectedAppName === "Orquestrador de Tráfego" ? Target : MessageSquare;

  return (
    <div className="w-full min-h-[420px] sm:h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-border/30 relative">
      <motion.div
        className="h-12 border-b border-border/30 flex items-center px-3 sm:px-4 gap-2 sm:gap-4 bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 shrink-0">
          <img src={adzhubLogo} alt="AdzHub" className="h-6 w-auto" />
        </div>

        <div className="flex-1 min-w-0" />

        <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5" /> Chat
          </span>
          <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
            <Lightbulb className="w-3.5 h-3.5" /> Recomendações
          </span>
          <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
            <GraduationCap className="w-3.5 h-3.5" /> Aprenda
          </span>
        </div>

        <div className="relative shrink-0">
          <motion.div
            className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium flex items-center gap-1 transition-colors border cursor-pointer max-w-[140px] sm:max-w-none truncate ${
              highlightedElement === "app-selector"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-foreground border-border/50"
            }`}
            animate={{ scale: highlightedElement === "app-selector" ? 1.05 : 1 }}
          >
            <CurrentAppIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{currentAppName}</span>
            <ChevronDown className="w-3 h-3 shrink-0" />
          </motion.div>

          {showAppDropdown && (
            <motion.div
              className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-border/50 py-1 z-50 min-w-[180px]"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {appOptions.map((app) => (
                <motion.div
                  key={app.id}
                  className={`flex items-center gap-2 text-xs py-2 px-3 cursor-pointer transition-colors ${
                    highlightedElement === `app-${app.id}`
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                  animate={{ scale: highlightedElement === `app-${app.id}` ? 1.02 : 1 }}
                >
                  <app.icon className="w-3.5 h-3.5" />
                  {app.name}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          className={`hidden sm:flex w-7 h-7 rounded-full items-center justify-center transition-colors shrink-0 ${
            highlightedElement === "notifications"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          <Bell className="w-4 h-4" />
        </motion.div>
        <div className="hidden sm:block w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shrink-0" />
      </motion.div>

      <div className="flex flex-col sm:flex-row h-[calc(100%-3rem)] min-h-0">
        <motion.div
          className="hidden sm:flex w-14 py-3 flex-col items-center gap-1 bg-[hsl(40,30%,96%)] rounded-2xl m-2 shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {sidebarApps.map((app, index) => (
            <motion.div
              key={app.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                activeApp === index
                  ? "bg-primary text-primary-foreground"
                  : highlightedElement === `sidebar-${index}`
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
              }`}
              animate={{ scale: highlightedElement === `sidebar-${index}` ? 1.1 : 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <app.icon className="w-4 h-4" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="hidden sm:flex w-44 bg-[hsl(40,30%,96%)] flex-col rounded-2xl m-2 shrink-0 min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4 pt-6">
            <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mb-2">
              <span className="text-lg">!</span>
            </div>
            <span className="text-[10px] text-center leading-relaxed">Nenhum item em pendentes.</span>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex flex-col bg-[hsl(40,20%,97%)] min-h-0 min-w-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="h-10 flex items-center px-3 sm:px-4 gap-2 flex-wrap">
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

          <div className="flex-1 flex justify-center p-3 sm:p-4 overflow-y-auto min-h-0">
            <div className="w-full max-w-2xl">
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-foreground leading-relaxed">
                    Olá! Sou o assistente da AdzHub. Como posso ajudar você hoje?
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <span className="bg-white/60 px-1.5 py-0.5 rounded">🤖 adz-chat</span>
                    <span>10:00</span>
                  </div>
                </div>
              </motion.div>

              {typedText && !showUserMessage && (
                <motion.div
                  className="flex justify-end mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-col gap-1 max-w-sm">
                    <div className="bg-[#2D4A8C] text-white rounded-2xl px-3 py-2">
                      <p className="text-xs">
                        {typedText}
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-0.5 h-3 bg-white ml-0.5 align-middle"
                        />
                      </p>
                    </div>
                    <span className="text-[9px] text-muted-foreground text-right">10:30</span>
                  </div>
                </motion.div>
              )}

              {showUserMessage && userMessageText && (
                <motion.div
                  className="flex justify-end mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-col gap-1 max-w-sm">
                    <div className="bg-[#2D4A8C] text-white rounded-2xl px-3 py-2">
                      <p className="text-xs">{userMessageText}</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground text-right">10:30</span>
                  </div>
                </motion.div>
              )}

              {showProcessing && (
                <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="flex gap-1"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </motion.div>
                    <span className="text-xs text-muted-foreground italic">
                      {processingText || "Processando..."}
                    </span>
                  </div>
                </motion.div>
              )}

              {showFormDialogue && formDialogueData && (
                <motion.div className="mb-4">
                  <FormDialogue
                    data={formDialogueData}
                    highlightedButton={highlightedElement === "confirm-btn"}
                  />
                </motion.div>
              )}

              {showResponse && responseText && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-foreground leading-relaxed">
                      {responseText}
                      {responseText.length < 100 && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                          className="inline-block w-0.5 h-3 bg-foreground/50 ml-0.5 align-middle"
                        />
                      )}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <span className="bg-white/60 px-1.5 py-0.5 rounded">🤖 traffic-orchestrator</span>
                      <span>10:30</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <motion.div
            className="p-2 sm:p-3 flex justify-center shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="w-full max-w-2xl">
              <motion.div
                className={`flex flex-col gap-2 bg-white rounded-xl border-2 transition-all ${
                  highlightedElement === "input"
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-[#5B6BBF]/30"
                }`}
                animate={{ scale: highlightedElement === "input" ? 1.01 : 1 }}
              >
                <div className="flex items-center gap-2 px-3 pt-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Comece sua solicitação..."
                    className="flex-1 min-w-0 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                    readOnly
                  />
                </div>

                <div className="flex items-center gap-1 sm:gap-2 px-3 pb-2 flex-wrap">
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[10px] text-foreground bg-muted/50 px-2 py-0.5 rounded-md"
                  >
                    <Brain className="w-3 h-3" />
                    Super Cérebro
                  </button>
                  <button type="button" className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    Automático
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="flex-1 min-w-[4px]" />
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <motion.button
                    type="button"
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      highlightedElement === "send-button"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    animate={{ scale: highlightedElement === "send-button" ? 1.1 : 1 }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>

              <p className="text-[8px] text-muted-foreground text-center mt-2">
                O Adz pode cometer erros. Verifique informações importantes.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
