import { motion } from "framer-motion";
import { ColorOrb } from "@/components/ui/ColorOrb";
import {
  Send,
  Paperclip,
  Settings,
  Brain,
  Mic,
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Code,
} from "lucide-react";

export type AdzChatWelcomeMockView = "adzchat-welcome";

interface AdzChatWelcomeMockProps {
  highlightedElement?: string | null;
  typedText?: string;
}

const FEATURE_CARDS = [
  {
    id: "images",
    icon: ImageIcon,
    title: "Gerador de Imagens",
    description: "Gere imagens incríveis instantaneamente a partir de texto.",
  },
  {
    id: "text",
    icon: FileText,
    title: "Escrever Texto",
    description: "Crie textos envolventes e persuasivos sem esforço.",
  },
  {
    id: "code",
    icon: Code,
    title: "Escrever Código",
    description: "Gere código limpo e eficiente rapidamente a partir de texto.",
  },
] as const;

/** Conteúdo da tela inicial do Adz Chat (para embutir no MockInterface). */
export function AdzChatWelcomeContent({
  highlightedElement = null,
  typedText = "",
}: AdzChatWelcomeMockProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 text-[#121212] bg-[#FAFAF8]">
      <div
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 min-h-0 overflow-y-auto"
        data-cursor-target="welcome-center"
      >
        <motion.div
          className="w-[60px] h-[55px] sm:w-[70px] sm:h-[65px] rounded-full bg-white shadow-sm p-1 flex items-center justify-center mb-5"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <ColorOrb
            dimension="45px"
            tones={{
              base: "oklch(95% 0.05 330)",
              accent1: "oklch(70% 0.18 50)",
              accent2: "oklch(62% 0.24 280)",
              accent3: "oklch(40% 0.15 265)",
            }}
            spinDuration={20}
          />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-1 mb-6 max-w-md text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#121212] tracking-tight">
            Bem-vindo, adm
          </h2>
          <p className="text-sm sm:text-[15px] text-[#121212]/80 leading-relaxed">
            Comece descrevendo uma tarefa e deixe o chat assumir.
            <br className="hidden sm:inline" />
            <span className="sm:hidden"> </span>
            Não sabe por onde começar?
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-1.5"
          data-cursor-target="welcome-cards"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.45 }}
        >
          {FEATURE_CARDS.map((card, i) => {
            const Icon = card.icon;
            const isHighlighted = highlightedElement === `welcome-card-${card.id}`;
            return (
              <motion.div
                key={card.id}
                data-cursor-target={`welcome-card-${card.id}`}
                className={`rounded-xl border bg-white px-3 py-3 sm:py-3.5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all ${
                  isHighlighted
                    ? "border-[#37489d]/40 ring-2 ring-[#37489d]/15"
                    : "border-[#E8E8E8]"
                }`}
                animate={{ scale: isHighlighted ? 1.02 : 1 }}
                transition={{ delay: 0.18 + i * 0.05 }}
              >
                <Icon className="w-5 h-5 text-[#121212] mb-2" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-[#121212] leading-tight">{card.title}</p>
                <p className="text-xs text-[#121212]/65 mt-1 leading-snug">{card.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        className="shrink-0 px-3 sm:px-4 pb-3 sm:pb-4 pt-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
      >
        <div className="max-w-3xl mx-auto w-full">
          <motion.div
            data-cursor-target="welcome-input"
            className={`rounded-[22px] sm:rounded-[28px] bg-white border flex flex-col gap-2 p-2 sm:p-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all ${
              highlightedElement === "welcome-input"
                ? "border-[#37489d] ring-2 ring-[#37489d]/20"
                : "border-gray-200/80"
            }`}
            animate={{ scale: highlightedElement === "welcome-input" ? 1.01 : 1 }}
          >
            <motion.div className="min-h-[44px] sm:min-h-[48px] flex items-start px-3 sm:px-4 py-2.5">
              <p className="text-sm text-[#121212]/85 leading-relaxed w-full">
                {typedText ? (
                  <>
                    {typedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.75 }}
                      className="inline-block w-0.5 h-3.5 bg-[#37489d] ml-0.5 align-middle rounded-sm"
                    />
                  </>
                ) : (
                  <span className="text-[#121212]/35">
                    Digite sua mensagem… (Shift+Enter para nova linha, @ para mencionar apps)
                  </span>
                )}
              </p>
            </motion.div>
            <motion.div className="flex items-center justify-between gap-2 px-1 pb-0.5 flex-wrap">
              <motion.div className="flex items-center gap-0.5 sm:gap-1 text-[#121212]/45">
                <button type="button" className="p-2 rounded-full hover:bg-gray-50" aria-hidden>
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-gray-50" aria-hidden>
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 h-9 rounded-full px-2.5 text-xs text-[#121212]/70 border border-transparent bg-[#E8F0FE]/80"
                  aria-hidden
                >
                  <Brain className="w-4 h-4 text-[#37489d]" />
                  Super Cérebro
                  <span className="w-1.5 h-1.5 rounded-full bg-[#37489d]" />
                </button>
                <button
                  type="button"
                  className="hidden sm:flex items-center gap-1 h-9 rounded-full px-2 text-[11px] text-[#121212]/55"
                  aria-hidden
                >
                  Automático
                  <ChevronDown className="w-3 h-3" />
                </button>
              </motion.div>
              <motion.div className="flex items-center gap-0.5">
                <button type="button" className="p-2 rounded-full text-[#121212]/45" aria-hidden>
                  <Mic className="w-4 h-4" />
                </button>
                <motion.button
                  type="button"
                  data-cursor-target="welcome-send-button"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#121212] text-white transition-transform ${
                    highlightedElement === "welcome-send-button" ? "scale-105 shadow-lg" : ""
                  }`}
                  animate={{ scale: highlightedElement === "welcome-send-button" ? 1.08 : 1 }}
                  aria-label="Enviar"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
          <p className="text-[10px] sm:text-[11px] text-center text-[#121212]/40 mt-2 font-medium">
            O Adz pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/** Tela inicial standalone (legado / preview). */
export function AdzChatWelcomeMock(props: AdzChatWelcomeMockProps) {
  return (
    <div className="w-full min-h-[420px] sm:h-[500px] bg-[#FAFAF8] rounded-2xl shadow-2xl overflow-hidden border border-[#1A2B4B]/8 relative flex flex-col text-[#121212]">
      <AdzChatWelcomeContent {...props} />
    </div>
  );
}
