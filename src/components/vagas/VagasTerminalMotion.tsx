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

/** Cada cena = um fluxo real do MVP (pseudo-código legível, sem API inventada). */
const SCENES: Scene[] = [
  {
    file: "adzhub · google-ads-agent.ts",
    caption: "Edge Function: GAQL via googleAds:search na Google Ads API.",
    lines: [
      { kind: "comment", text: "// google-ads-agent — Edge Function" },
      {
        kind: "code",
        parts: [
          { text: "const", tone: "kw" },
          { text: " { data }", tone: "ident" },
          { text: " = await ", tone: "muted" },
          { text: "googleAdsFetch", tone: "key" },
          { text: "(", tone: "punct" },
        ],
      },
      {
        kind: "code",
        parts: [
          { text: "  `/customers/${id}/googleAds:search`", tone: "string" },
          { text: ",", tone: "punct" },
        ],
      },
      {
        kind: "code",
        parts: [
          { text: "  { query: ", tone: "muted" },
          { text: "GAQL", tone: "ident" },
          { text: " }", tone: "muted" },
          { text: ")", tone: "punct" },
        ],
      },
      { kind: "blank" },
      { kind: "tags", tags: ["Google Ads API", "GAQL", "Edge Function"] },
    ],
  },
  {
    file: "adzhub · meta-reports-admin.ts",
    caption: "Meta Graph API → Postgres: insights de campanha syncados no Supabase.",
    lines: [
      { kind: "comment", text: "// meta-reports-admin — Graph → Postgres" },
      {
        kind: "code",
        parts: [
          { text: "const", tone: "kw" },
          { text: " insights", tone: "ident" },
          { text: " = await ", tone: "muted" },
          { text: "graph", tone: "key" },
          { text: ".", tone: "punct" },
          { text: "get", tone: "ident" },
          { text: "(", tone: "punct" },
          { text: "`/act_${id}/insights`", tone: "string" },
          { text: ")", tone: "punct" },
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
          { text: '"campaign_metrics"', tone: "string" },
          { text: ").", tone: "punct" },
          { text: "upsert", tone: "ident" },
          { text: "(insights)", tone: "punct" },
        ],
      },
      { kind: "blank" },
      { kind: "tags", tags: ["Meta Graph", "Supabase", "Sync"] },
    ],
  },
  {
    file: "adzhub · ask-adz-tools.ts",
    caption: "AdzChat: tools no Supercérebro — contexto da reunião e métricas na mesma conversa.",
    lines: [
      { kind: "comment", text: "// ask-adz — tool calls (AI SDK)" },
      {
        kind: "code",
        parts: [
          { text: "await ", tone: "muted" },
          { text: "search_client_context", tone: "key" },
          { text: "(", tone: "punct" },
          { text: '"tarefas da reunião Spot"', tone: "string" },
          { text: ")", tone: "punct" },
        ],
      },
      {
        kind: "code",
        parts: [
          { text: "await ", tone: "muted" },
          { text: "get_campaign_metrics", tone: "key" },
          { text: "({ ", tone: "punct" },
          { text: "campaign_name", tone: "ident" },
          { text: ": ", tone: "punct" },
          { text: '"Ômega 3"', tone: "string" },
          { text: " })", tone: "punct" },
        ],
      },
      { kind: "blank" },
      { kind: "tags", tags: ["AdzChat", "AI SDK", "Tools"] },
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

/** Terminal em loop: 3 cenas do MVP (Google Ads GAQL → Meta Graph sync → tools do AdzChat). */
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
      <div className="relative overflow-hidden rounded-2xl border border-[#08080C]/10 bg-white shadow-[0_20px_50px_-28px_rgba(8,8,12,0.28)] text-[11px] sm:text-xs font-mono leading-relaxed">
        <div className="flex items-center justify-between gap-3 border-b border-[#08080C]/8 bg-white px-4 py-2.5">
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

        <div className="min-h-[220px] bg-white px-4 py-4 sm:min-h-[240px] sm:px-5">
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

        <div className="border-t border-[#08080C]/5 bg-white px-4 pb-4 pt-1 sm:px-5">
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
