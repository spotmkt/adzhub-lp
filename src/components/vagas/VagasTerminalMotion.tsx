import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CodeLine =
  | { kind: "comment"; text: string }
  | { kind: "code"; parts: { text: string; tone: "key" | "punct" | "string" | "kw" | "ident" | "muted" }[] }
  | { kind: "blank" }
  | { kind: "tags"; tags: string[] };

type Scene = {
  file: string;
  caption: string;
  lines: CodeLine[];
};

/** Cada cena = um fluxo real da vaga. Caption e código andam juntos. */
const SCENES: Scene[] = [
  {
    file: "adzhub · content-script.ts",
    caption: "Extensão Manifest V3: lê a UI do Ads e devolve dados estruturados.",
    lines: [
      { kind: "comment", text: "// content-script.ts — captura no DOM" },
      {
        kind: "code",
        parts: [
          { text: "const", tone: "kw" },
          { text: " rows", tone: "ident" },
          { text: " = ", tone: "muted" },
          { text: "document", tone: "key" },
          { text: ".", tone: "punct" },
          { text: "queryAll", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: '".campaign-row"', tone: "string" },
          { text: ")", tone: "punct" },
        ],
      },
      {
        kind: "code",
        parts: [
          { text: "return", tone: "kw" },
          { text: " rows", tone: "ident" },
          { text: ".", tone: "punct" },
          { text: "map", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: "parseCampaign", tone: "ident" },
          { text: ")", tone: "punct" },
        ],
      },
      { kind: "blank" },
      { kind: "tags", tags: ["Manifest V3", "DOM", "Extensão"] },
    ],
  },
  {
    file: "adzhub · sync-campaigns.ts",
    caption: "API Meta → Supabase: campanhas e leads no mesmo fluxo, sem planilha.",
    lines: [
      { kind: "comment", text: "// sync-campaigns.ts" },
      {
        kind: "code",
        parts: [
          { text: "const", tone: "kw" },
          { text: " campaigns", tone: "ident" },
          { text: " = await ", tone: "muted" },
          { text: "meta", tone: "key" },
          { text: ".", tone: "punct" },
          { text: "getCampaigns", tone: "ident" },
          { text: "()", tone: "punct" },
        ],
      },
      {
        kind: "code",
        parts: [
          { text: "await ", tone: "muted" },
          { text: "supabase", tone: "key" },
          { text: ".", tone: "punct" },
          { text: "from", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: '"campaigns"', tone: "string" },
          { text: ").", tone: "punct" },
          { text: "upsert", tone: "ident" },
          { text: "(campaigns)", tone: "punct" },
        ],
      },
      { kind: "blank" },
      { kind: "tags", tags: ["Meta API", "Supabase", "Sync"] },
    ],
  },
  {
    file: "adzhub · agent-run.ts",
    caption: "Agente no AdzChat: tarefa da reunião vira ação na plataforma.",
    lines: [
      { kind: "comment", text: "// agent-run.ts — vibecoding + operação" },
      {
        kind: "code",
        parts: [
          { text: "const", tone: "kw" },
          { text: " task", tone: "ident" },
          { text: " = await ", tone: "muted" },
          { text: "agent", tone: "key" },
          { text: ".", tone: "punct" },
          { text: "fromMeeting", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: '"Ômega 3"', tone: "string" },
          { text: ")", tone: "punct" },
        ],
      },
      {
        kind: "code",
        parts: [
          { text: "await ", tone: "muted" },
          { text: "adzchat", tone: "key" },
          { text: ".", tone: "punct" },
          { text: "execute", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: "task", tone: "ident" },
          { text: ")", tone: "punct" },
        ],
      },
      { kind: "blank" },
      { kind: "tags", tags: ["AdzChat", "IA", "Vibecoding"] },
    ],
  },
];

const TONE_CLASS: Record<string, string> = {
  key: "text-[#b45309]",
  punct: "text-[#9CA3AF]",
  string: "text-[#059669]",
  kw: "text-[#37489d]",
  ident: "text-[#08080C]",
  muted: "text-[#6B7280]",
};

const LINE_MS = 380;
const HOLD_MS = 2600;
const FADE_MS = 320;

/** Terminal em loop: 3 cenas alinhadas à vaga (extensão → API → agente). */
export function VagasTerminalMotion() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "fadeout">("typing");

  const scene = SCENES[sceneIndex];
  const script = scene.lines;

  useEffect(() => {
    if (phase === "typing") {
      if (visibleCount >= script.length) {
        setPhase("hold");
        return;
      }
      const t = setTimeout(() => setVisibleCount((c) => c + 1), LINE_MS);
      return () => clearTimeout(t);
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("fadeout"), HOLD_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleCount(0);
      setSceneIndex((i) => (i + 1) % SCENES.length);
      setPhase("typing");
    }, FADE_MS);
    return () => clearTimeout(t);
  }, [phase, visibleCount, script.length]);

  return (
    <motion.div
      className="relative w-full max-w-full min-w-0 overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
    >
      <div
        className="absolute -inset-3 bg-gradient-to-br from-[#37489d]/15 via-[#F9C7B2]/12 to-[#D4EFF4]/30 rounded-[28px] blur-2xl pointer-events-none"
        aria-hidden
      />

      <div className="relative rounded-2xl bg-white/80 backdrop-blur-md border border-[#08080C]/10 shadow-[0_20px_50px_-24px_rgba(8,8,12,0.35)] overflow-hidden text-[11px] sm:text-xs font-mono leading-relaxed">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#F7F7F5]/90 border-b border-[#08080C]/8">
          <AnimatePresence mode="wait">
            <motion.span
              key={scene.file}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[#9CA3AF] text-[10px] tracking-wide truncate"
            >
              {scene.file}
            </motion.span>
          </AnimatePresence>
          <span className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="text-emerald-600 text-[10px] font-medium">live</span>
          </span>
        </div>

        <div className="px-4 sm:px-5 py-4 min-h-[200px] sm:min-h-[220px] bg-gradient-to-b from-white/40 to-[#F7F7F5]/50">
          <motion.div
            className="space-y-1"
            animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
            transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
          >
            {script.slice(0, visibleCount).map((line, i) => (
              <motion.div
                key={`${sceneIndex}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {line.kind === "blank" && <div className="h-3" />}
                {line.kind === "comment" && <p className="text-[#9CA3AF]">{line.text}</p>}
                {line.kind === "code" && (
                  <p className="break-all sm:break-normal">
                    {line.parts.map((p, pi) => (
                      <span key={pi} className={TONE_CLASS[p.tone]}>
                        {p.text}
                      </span>
                    ))}
                    {i === visibleCount - 1 && phase === "typing" && (
                      <motion.span
                        className="inline-block w-[6px] h-[1em] align-middle ml-0.5 bg-[#37489d]"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                      />
                    )}
                  </p>
                )}
                {line.kind === "tags" && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {line.tags.map((t) => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-2 py-0.5 rounded-md bg-[#37489d]/10 text-[#37489d] text-[10px] font-semibold border border-[#37489d]/15"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-[#08080C]/5 bg-[#F7F7F5]/60">
          <AnimatePresence mode="wait">
            <motion.p
              key={scene.caption}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] sm:text-[11px] text-[#6B7280] leading-relaxed"
            >
              {scene.caption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
