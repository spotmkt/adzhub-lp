import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Brain,
  TrendingUp,
  Users,
  Target,
  FileText,
  Sparkles,
  Pause,
  Play,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  X,
  CornerDownLeft,
  ChevronRight,
  Video,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import adzhubLogo from "@/assets/adzhub-logo-new.svg";
import { ColorOrb } from "@/components/ui/ColorOrb";
import {
  AdzChatAgentView,
  DragMeetingOverlay,
  MeetingContextCard,
  MEETING_TASKS,
} from "./VagasAdzChatBridge";
import { VagasGraphView } from "./VagasGraphView";

type SceneId =
  | "resumo"
  | "ask_campaign"
  | "dash"
  | "ask_context"
  | "grapho"
  | "node_detail"
  | "timeline"
  | "drag_meeting"
  | "adzchat_run"
  | "adzchat_ask";

type Spotlight =
  | "insight"
  | "radar"
  | "fab"
  | "chat"
  | "dash"
  | "graph"
  | "detail"
  | "timeline"
  | "drag"
  | "adzchat";

interface Scene {
  id: SceneId;
  tab: "resumo" | "dash" | "supercerebro" | "adzchat";
  label: string;
  duration: number;
  chat: "closed" | "open" | "hidden";
  spotlight: Spotlight;
}

const SCENES: Scene[] = [
  {
    id: "resumo",
    tab: "resumo",
    label: "Resumo",
    duration: 5600,
    chat: "closed",
    spotlight: "insight",
  },
  {
    id: "ask_campaign",
    tab: "resumo",
    label: "Pergunte ao Adz",
    duration: 7200,
    chat: "open",
    spotlight: "chat",
  },
  {
    id: "dash",
    tab: "dash",
    label: "Dash",
    duration: 4200,
    chat: "closed",
    spotlight: "dash",
  },
  {
    id: "ask_context",
    tab: "dash",
    label: "Contexto",
    duration: 5500,
    chat: "open",
    spotlight: "chat",
  },
  {
    id: "grapho",
    tab: "supercerebro",
    label: "Grafo",
    duration: 4800,
    chat: "hidden",
    spotlight: "graph",
  },
  {
    id: "node_detail",
    tab: "supercerebro",
    label: "Nó",
    duration: 4500,
    chat: "hidden",
    spotlight: "detail",
  },
  {
    id: "timeline",
    tab: "supercerebro",
    label: "Timeline",
    duration: 5200,
    chat: "hidden",
    spotlight: "timeline",
  },
  {
    id: "drag_meeting",
    tab: "adzchat",
    label: "Arrastar",
    duration: 4200,
    chat: "hidden",
    spotlight: "drag",
  },
  {
    id: "adzchat_run",
    tab: "adzchat",
    label: "AdzChat",
    duration: 7800,
    chat: "hidden",
    spotlight: "adzchat",
  },
  {
    id: "adzchat_ask",
    tab: "adzchat",
    label: "Atualizar",
    duration: 6200,
    chat: "hidden",
    spotlight: "adzchat",
  },
];

const NAV_TABS = [
  { id: "resumo" as const, label: "Resumo", icon: FileText },
  { id: "dash" as const, label: "Dash", icon: LayoutDashboard },
  { id: "supercerebro" as const, label: "Supercérebro", icon: Brain },
  { id: "adzchat" as const, label: "AdzChat", icon: MessageSquare },
];

const ORB_TONES = {
  base: "oklch(95% 0.05 330)",
  accent1: "oklch(70% 0.18 50)",
  accent2: "oklch(62% 0.24 280)",
  accent3: "oklch(40% 0.15 265)",
};

const CHAT_Q1 = "Qual o resultados dos últimos 7d nas campanhas?";
const CHAT_A1_FULL =
  "Nos últimos 7 dias: ROAS 3,4x (+0,4), CPA médio R$ 28 (−12%) e 186 leads (+23%). Vou abrir o Dashboard com a performance operacional.";
const CHAT_Q2 = "me mostra o contexto por trás dessas ações";
const CHAT_A2_FULL =
  "Vou abrir o grafo de contexto do Supercérebro: pessoas, WhatsApp, reunião Spot e tarefas ligadas a essas ações.";

const RADAR_AXES = [
  "Kickoff",
  "Negócio",
  "Branding",
  "Gestão Mkt",
  "Nutrição",
  "Comercial",
  "Canais",
  "Vendas",
  "Site",
  "Analytics",
];
const RADAR_VALUES = [0.35, 0.55, 0.7, 0.45, 0.6, 0.5, 0.75, 0.4, 0.3, 0.55];

const STAGE_H = "h-[520px] sm:h-[540px]";

function spotClass(active: boolean, dimOthers: boolean) {
  if (active) {
    return "relative z-10 ring-2 ring-[#37489d]/35 shadow-lg transition-shadow duration-500";
  }
  if (dimOthers) {
    return "opacity-40 transition-opacity duration-500 pointer-events-none";
  }
  return "transition-opacity duration-500";
}

function useTypewriter(full: string, active: boolean, cps = 28, paused = false) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  // Só reseta ao (re)ativar — ao desativar, congela o texto (evita bolha vazia no "done")
  useEffect(() => {
    if (!active) return;
    iRef.current = 0;
    setText("");
    setDone(false);
  }, [full, active]);

  useEffect(() => {
    if (!active || paused || done) return;
    const id = setInterval(() => {
      iRef.current += 1;
      const i = iRef.current;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setDone(true);
      }
    }, Math.max(12, 1000 / cps));
    return () => clearInterval(id);
  }, [full, active, cps, paused, done]);

  return { text, done };
}

/**
 * Motion narrativo do painel do cliente:
 * Resumo → Pergunte ao Adz (streaming) → Dash → Pergunte ao Adz → Grafo → Nó → Timeline.
 */
export function VagasPlatformMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [resumoPhase, setResumoPhase] = useState<"insight" | "radar" | "fab">("insight");
  const scene = SCENES[index];
  const remainingRef = useRef(scene.duration);
  const startedAtRef = useRef<number | null>(null);
  const frozen = paused || offscreen;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { root: null, threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    remainingRef.current = scene.duration;
    startedAtRef.current = null;
  }, [index, scene.duration]);

  useEffect(() => {
    if (frozen) {
      if (startedAtRef.current != null) {
        remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current));
        startedAtRef.current = null;
      }
      return;
    }
    startedAtRef.current = Date.now();
    const t = setTimeout(() => setIndex((i) => (i + 1) % SCENES.length), remainingRef.current);
    return () => clearTimeout(t);
  }, [index, frozen, scene.duration]);

  useEffect(() => {
    if (scene.id !== "resumo") return;
    setResumoPhase("insight");
  }, [scene.id, index]);

  useEffect(() => {
    if (scene.id !== "resumo" || frozen) return;
    if (resumoPhase === "insight") {
      const t = setTimeout(() => setResumoPhase("radar"), 2800);
      return () => clearTimeout(t);
    }
    if (resumoPhase === "radar") {
      const t = setTimeout(() => setResumoPhase("fab"), 1400);
      return () => clearTimeout(t);
    }
  }, [scene.id, resumoPhase, frozen]);

  const spotlight: Spotlight = scene.id === "resumo" ? resumoPhase : scene.spotlight;

  function goToTab(tab: Scene["tab"]) {
    const first = SCENES.findIndex((s) => s.tab === tab);
    setIndex(first >= 0 ? first : 0);
  }

  const showResumo = scene.tab === "resumo" || scene.id === "ask_campaign";
  const showDash =
    (scene.tab === "dash" || scene.id === "ask_context") &&
    scene.id !== "grapho" &&
    scene.id !== "node_detail" &&
    scene.id !== "timeline" &&
    scene.id !== "drag_meeting" &&
    scene.id !== "adzchat_run" &&
    scene.id !== "adzchat_ask";
  const showTimeline = scene.id === "timeline" || scene.id === "drag_meeting";
  const showAdzChat =
    scene.id === "drag_meeting" || scene.id === "adzchat_run" || scene.id === "adzchat_ask";
  const showGraph = scene.id === "grapho" || scene.id === "node_detail";

  function stageKey() {
    if (showAdzChat || scene.id === "timeline") return "super-bridge";
    if (showGraph) return "supergraph";
    return scene.tab;
  }

  function adzMode(): "awaiting" | "run" | "ask" {
    if (scene.id === "adzchat_ask") return "ask";
    if (scene.id === "adzchat_run") return "run";
    return "awaiting";
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-6xl mx-auto">
      {/*
        Sem glow retangular atrás do card: o blur criava uma “placa” cinza
        que aparecia nas 4 pontas do border-radius.
        Sombra só no miolo branco arredondado.
      */}
      <div className="relative overflow-hidden rounded-2xl border border-[#08080C]/8 bg-white shadow-[0_20px_50px_-28px_rgba(8,8,12,0.28)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-3 sm:px-4 py-3 border-b border-[#08080C]/8 bg-white">
          <div className="flex items-center gap-2 shrink-0">
            <img src={adzhubLogo} alt="AdzHub" className="h-6 w-auto" />
          </div>

          <div className="flex-1 flex flex-nowrap items-center gap-1 overflow-x-auto overscroll-x-contain touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV_TABS.map((t) => {
              const Icon = t.icon;
              const active = scene.tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goToTab(t.id)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors ${
                    active ? "bg-[#37489d] text-white" : "text-[#6B7280] hover:bg-[#37489d]/8"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            className="hidden sm:inline-flex self-auto items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] hover:bg-[#F6F6F6] border border-[#08080C]/8"
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {paused ? "Play" : "Pause"}
          </button>
        </div>

        <div className={`relative ${STAGE_H} bg-white overflow-hidden touch-pan-y`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stageKey()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              {showResumo && (
                <ResumoView
                  key={scene.id === "resumo" ? `resumo-${index}` : "resumo-bg"}
                  spotlight={spotlight}
                  animateChecks={scene.id === "resumo"}
                  paused={frozen}
                />
              )}
              {showDash && <DashView spotlight={spotlight} />}
              {showGraph && (
                <VagasGraphView
                  spotlightActive={spotlight === "graph" || spotlight === "detail"}
                  phase={scene.id === "node_detail" ? "detail" : "graph"}
                />
              )}

              {/* Ponte timeline → AdzChat */}
              {(showTimeline || showAdzChat) && (
                <div className="absolute inset-0 overflow-hidden">
                  {showTimeline && (
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        opacity: scene.id === "drag_meeting" ? 0.35 : 1,
                        scale: scene.id === "drag_meeting" ? 0.97 : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <TimelineView
                        spotlight={spotlight}
                        meetingLifted={scene.id === "drag_meeting"}
                        forceShowMeeting
                      />
                    </motion.div>
                  )}

                  {showAdzChat && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{
                        opacity: scene.id === "adzchat_run" || scene.id === "adzchat_ask" ? 1 : 0.82,
                        x: scene.id === "drag_meeting" ? 18 : 0,
                      }}
                      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <AdzChatAgentView mode={adzMode()} paused={frozen} />
                    </motion.div>
                  )}

                  {scene.id === "drag_meeting" && (
                    <DragMeetingOverlay active paused={frozen} />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {scene.chat !== "hidden" && (
            <FloatingAskAdz
              key={scene.id}
              open={scene.chat === "open"}
              mode={scene.id === "ask_context" ? "context" : "campaign"}
              spotlight={spotlight}
              playKey={scene.id}
              paused={frozen}
            />
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-[#08080C]/6 bg-white">
          <div className="flex justify-center gap-1.5 flex-wrap">
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.label}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-[#37489d]" : "w-1.5 bg-[#08080C]/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Views ─── */

function ResumoView({
  spotlight,
  animateChecks = false,
  paused = false,
}: {
  spotlight: Spotlight;
  /** Início do loop = continuação do AdzChat: anima checks nas tarefas. */
  animateChecks?: boolean;
  paused?: boolean;
}) {
  const narrating = ["insight", "radar", "fab", "chat"].includes(spotlight);
  const [doneCount, setDoneCount] = useState(animateChecks ? 0 : MEETING_TASKS.length);

  useEffect(() => {
    if (!animateChecks) {
      setDoneCount(MEETING_TASKS.length);
      return;
    }
    setDoneCount(0);
  }, [animateChecks]);

  useEffect(() => {
    if (!animateChecks || paused) return;
    if (doneCount >= MEETING_TASKS.length) return;
    const t = setTimeout(() => setDoneCount((c) => c + 1), doneCount === 0 ? 500 : 750);
    return () => clearTimeout(t);
  }, [animateChecks, paused, doneCount]);

  const pendingLeft = Math.max(0, MEETING_TASKS.length - doneCount);
  const allDone = doneCount >= MEETING_TASKS.length;

  return (
    <div className="h-full p-3 sm:p-4 overflow-hidden flex flex-col gap-3 max-w-5xl mx-auto pb-16">
      {/* Insight — compacto para liberar o radar */}
      <div
        className={`rounded-2xl bg-[#F3F4F6] border border-[#E5E7EB] p-3 sm:p-4 shadow-sm shrink-0 ${spotClass(
          spotlight === "insight",
          narrating && spotlight !== "insight",
        )}`}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#37489d] mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Insight da semana
        </p>
        <h3 className="text-base sm:text-lg font-bold text-[#1e3a5f] leading-tight">Olá, housewhey!</h3>
        <p className="text-xs text-[#6B7280] mb-3">Resumo para suas decisões desta semana</p>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-[#1e3a5f]">
              {allDone ? "Tarefas da reunião:" : "Precisa da sua atenção:"}
            </p>
            <AnimatePresence mode="wait">
              <motion.span
                key={pendingLeft}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-white text-[11px] font-bold ${
                  pendingLeft === 0 ? "bg-emerald-500" : "bg-orange-500"
                }`}
              >
                {pendingLeft === 0 ? "✓" : pendingLeft}
              </motion.span>
            </AnimatePresence>
          </div>
          <ul className="space-y-1.5">
            {MEETING_TASKS.map((title, i) => {
              const done = i < doneCount;
              const justDone = animateChecks && i === doneCount - 1;
              return (
                <motion.li
                  key={title}
                  animate={
                    justDone
                      ? { scale: [1, 1.02, 1], backgroundColor: ["#fff", "#ecfdf5", "#fff"] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 shadow-sm ${
                    done ? "bg-emerald-50/80 border-emerald-200" : "bg-white border-[#E5E7EB]"
                  }`}
                >
                  {done ? (
                    <motion.span
                      initial={animateChecks ? { scale: 0 } : false}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    </motion.span>
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                  )}
                  <span
                    className={`flex-1 text-xs sm:text-sm font-medium ${
                      done ? "text-emerald-800 line-through decoration-emerald-400/60" : "text-[#1e3a5f]"
                    }`}
                  >
                    {title}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs whitespace-nowrap hidden sm:inline ${
                      done ? "text-emerald-600 font-semibold" : "text-[#9CA3AF]"
                    }`}
                  >
                    {done ? "Concluída" : "Da reunião"}
                  </span>
                  {!done && <ChevronRight className="w-4 h-4 text-[#C4C4C4] shrink-0" />}
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold text-[#1e3a5f] mb-1">Decisão sugerida:</p>
          <p className="text-xs text-[#6B7280] leading-relaxed pl-1">
            <span className="mr-1.5">·</span>
            {doneCount > 0
              ? "Tarefas da Reunião Spot sincronizadas pelo AdzChat Pro. Acompanhar próximos passos com a equipe Spot."
              : "Priorizar as tarefas geradas na Reunião Spot · Housewhey. Alinhar execução com a equipe Spot."}
          </p>
        </div>
      </div>

      {/* Radar — mais altura, sem espremer */}
      <div
        className={`rounded-2xl border border-[#08080C]/8 bg-white p-3 sm:p-4 shadow-sm flex-1 min-h-[200px] overflow-hidden flex flex-col ${spotClass(
          spotlight === "radar",
          narrating && spotlight !== "radar",
        )}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#37489d] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Maturidade do perfil
          </p>
          <div className="flex flex-wrap gap-2 text-[9px] text-[#6B7280]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#37489d]/40" /> Tri anteriores
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(41,100%,58%)]" /> Plano do tri
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Concluído
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-3 sm:gap-6">
          <div className="flex items-center justify-center h-full min-h-[180px]">
            <RadarChart className="w-full max-w-[260px] sm:max-w-[300px] h-auto aspect-square" />
          </div>
          <div className="text-center sm:text-left sm:pr-4 shrink-0 pb-1">
            <p className="text-[10px] text-[#6B7280] mb-0.5">Score geral</p>
            <p className="text-3xl font-bold text-[#08080C] leading-none">
              42<span className="text-base text-[#9CA3AF]">/100</span>
            </p>
            <span className="inline-flex mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#37489d]/10 text-[#37489d]">
              Em evolução
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ className = "" }: { className?: string }) {
  const cx = 160;
  const cy = 160;
  const r = 100;
  const n = RADAR_AXES.length;

  function point(i: number, value: number) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * r * value,
      y: cy + Math.sin(angle) * r * value,
    };
  }

  const grid = [0.25, 0.5, 0.75, 1].map((level) => {
    const pts = Array.from({ length: n }, (_, i) => point(i, level));
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  });

  const poly = RADAR_VALUES.map((v, i) => point(i, v))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <svg viewBox="-24 -24 368 368" className={className} aria-hidden>
      {grid.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#E5E7EB" strokeWidth="1" />
      ))}
      {RADAR_AXES.map((_, i) => {
        const tip = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#E5E7EB" strokeWidth="1" />;
      })}
      <motion.polygon
        points={poly}
        fill="hsla(41, 100%, 58%, 0.28)"
        stroke="hsl(41, 100%, 48%)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      {RADAR_AXES.map((label, i) => {
        const tip = point(i, 1.18);
        return (
          <text
            key={label}
            x={tip.x}
            y={tip.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[#6B7280]"
            fontSize="9"
            fontFamily="system-ui, sans-serif"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function DashView({ spotlight }: { spotlight: Spotlight }) {
  const bars = [42, 55, 48, 70, 62, 78, 66, 88, 74, 92, 80, 96];
  const lit = spotlight === "dash";
  return (
    <div className="h-full p-3 sm:p-4 overflow-hidden flex flex-col gap-2.5 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#37489d] mb-0.5">Dashboard</p>
          <h3 className="text-base font-semibold text-[#08080C]">Performance operacional</h3>
        </div>
        <span className="text-xs text-[#6B7280]">Últimos 30 dias</span>
      </div>

      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 shrink-0 ${spotClass(lit, spotlight === "chat")}`}>
        {[
          { label: "Leads", value: "186", Icon: Users, trend: "+23%" },
          { label: "CPA médio", value: "R$ 28", Icon: Target, trend: "-12%" },
          { label: "ROAS", value: "3,4x", Icon: TrendingUp, trend: "+0,4" },
          { label: "Posts", value: "24", Icon: FileText, trend: "no plano" },
        ].map(({ label, value, Icon, trend }) => (
          <div key={label} className="rounded-xl border border-[#08080C]/8 bg-white p-2.5">
            <div className="flex items-center justify-between mb-1">
              <Icon className="w-3.5 h-3.5 text-[#37489d]" />
              <span className="text-[10px] font-semibold text-emerald-600">{trend}</span>
            </div>
            <p className="text-base font-bold text-[#08080C]">{value}</p>
            <p className="text-[10px] text-[#6B7280]">{label}</p>
          </div>
        ))}
      </div>

      <div className={`grid lg:grid-cols-5 gap-2 flex-1 min-h-0 ${spotClass(lit, spotlight === "chat")}`}>
        <div className="lg:col-span-3 rounded-xl border border-[#08080C]/8 bg-white p-3 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="text-sm font-medium text-[#08080C]">Leads por semana</span>
            <ArrowUpRight className="w-4 h-4 text-[#37489d]" />
          </div>
          <div className="flex items-end gap-1.5 flex-1 min-h-[100px]">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-[#37489d] to-[#8da4ff]"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 rounded-xl border border-[#08080C]/8 bg-white p-3 space-y-2 overflow-hidden">
          <span className="text-sm font-medium text-[#08080C] block">Canais</span>
          {[
            { name: "Meta Ads", pct: 48 },
            { name: "Google Ads", pct: 27 },
            { name: "Orgânico", pct: 18 },
            { name: "Social", pct: 7 },
          ].map((c) => (
            <div key={c.name}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#6B7280]">{c.name}</span>
                <span className="font-semibold text-[#08080C]">{c.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#F0F0F0] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#37489d]"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ duration: 0.45 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineView({
  spotlight,
  meetingLifted = false,
  forceShowMeeting = false,
}: {
  spotlight: Spotlight;
  meetingLifted?: boolean;
  forceShowMeeting?: boolean;
}) {
  const baseEvents = [
    {
      id: "old-1",
      t: "Ontem",
      title: "Drift de campanha sinalizado",
      body: "Insight da semana gerado no Resumo · KPI em atenção.",
    },
    {
      id: "old-2",
      t: "3 dias",
      title: "Grafo de contexto atualizado",
      body: "WhatsApp SPOT ↔ Housewhey, aprovações e peças ligados ao Supercérebro.",
    },
    {
      id: "old-3",
      t: "1 sem.",
      title: "Plano de sucesso · semana 12",
      body: "11 ações ativas; radar de maturidade atualizado.",
    },
  ];

  const [showMeeting, setShowMeeting] = useState(forceShowMeeting);

  useEffect(() => {
    if (forceShowMeeting) {
      setShowMeeting(true);
      return;
    }
    const t = setTimeout(() => setShowMeeting(true), 700);
    return () => clearTimeout(t);
  }, [forceShowMeeting]);

  return (
    <div
      className={`h-full p-3 sm:p-5 overflow-hidden max-w-3xl mx-auto ${spotClass(
        spotlight === "timeline" || spotlight === "drag",
        false,
      )}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#37489d] flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#37489d]">Supercérebro · Timeline</p>
          <h3 className="text-base font-semibold text-[#08080C]">Memória da operação</h3>
          <p className="text-xs text-[#6B7280]">Do grafo ao histórico: o que a reunião gerou.</p>
        </div>
      </div>

      <div className="relative pl-1 overflow-hidden max-h-[calc(100%-4.5rem)]">
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-[#37489d]/20" aria-hidden />
        <ul className="space-y-2.5">
          <AnimatePresence>
            {showMeeting && (
              <motion.li
                key="meeting"
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{
                  opacity: meetingLifted ? 0.25 : 1,
                  y: 0,
                  scale: meetingLifted ? 0.96 : 1,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="relative flex gap-2.5"
              >
                <div className="relative z-10 w-8 h-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shrink-0 shadow-md">
                  <Video className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <MeetingContextCard />
                </div>
              </motion.li>
            )}
          </AnimatePresence>

          {baseEvents.map((e, i) => (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + 0.1 * i }}
              className="relative flex gap-2.5"
            >
              <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-[#37489d]/35 flex items-center justify-center shrink-0">
                <Clock className="w-3 h-3 text-[#37489d]" />
              </div>
              <div className="flex-1 rounded-xl border border-[#08080C]/8 bg-white p-2.5 shadow-sm">
                <div className="flex justify-between gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-[#08080C]">{e.title}</p>
                  <span className="text-[10px] text-[#6B7280] whitespace-nowrap">{e.t}</span>
                </div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">{e.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Floating chat com envio + streaming ─── */

type ChatPhase = "typing_input" | "sending" | "thinking" | "streaming" | "done";

function FloatingAskAdz({
  open,
  mode,
  spotlight,
  playKey,
  paused = false,
}: {
  open: boolean;
  mode: "campaign" | "context";
  spotlight: Spotlight;
  playKey: string;
  paused?: boolean;
}) {
  const fabLit = spotlight === "fab";
  const chatLit = spotlight === "chat";
  const question = mode === "campaign" ? CHAT_Q1 : CHAT_Q2;
  const answer = mode === "campaign" ? CHAT_A1_FULL : CHAT_A2_FULL;

  const [phase, setPhase] = useState<ChatPhase>("typing_input");
  const inputTw = useTypewriter(question, open && phase === "typing_input", 36, paused);
  const answerTw = useTypewriter(answer, open && phase === "streaming", 42, paused);

  useEffect(() => {
    if (!open) {
      setPhase("typing_input");
      return;
    }
    setPhase("typing_input");
  }, [open, playKey]);

  useEffect(() => {
    if (!open || paused) return;
    if (phase === "typing_input" && inputTw.done) {
      const t = setTimeout(() => setPhase("sending"), 280);
      return () => clearTimeout(t);
    }
    if (phase === "sending") {
      const t = setTimeout(() => setPhase("thinking"), 450);
      return () => clearTimeout(t);
    }
    if (phase === "thinking") {
      const t = setTimeout(() => setPhase("streaming"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "streaming" && answerTw.done) {
      setPhase("done");
    }
  }, [open, phase, inputTw.done, answerTw.done, paused]);

  const showUserBubble = phase !== "typing_input";
  const showThinking = phase === "thinking";
  const showAnswer = phase === "streaming" || phase === "done";

  return (
    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: chatLit ? 1.02 : 1,
              boxShadow: chatLit
                ? "0 0 0 3px rgba(55,72,157,0.25), 0 25px 50px -12px rgba(0,0,0,0.25)"
                : "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="w-[min(100%,280px)] sm:w-[340px] rounded-[14px] bg-white shadow-2xl border border-[#08080C]/10 overflow-hidden pointer-events-auto"
          >
            <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#08080C]/6">
              <ColorOrb dimension="24px" tones={ORB_TONES} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#08080C]">Pergunte ao Adz</p>
                <p className="text-[10px] text-[#6B7280]">Perfil: housewhey</p>
              </div>
              <span className="text-[10px] text-[#9CA3AF] flex items-center gap-0.5">
                Enter <CornerDownLeft className="w-3 h-3" />
              </span>
              <X className="w-4 h-4 text-[#9CA3AF]" />
            </div>

            <div className="px-3 py-3 space-y-2.5 min-h-[180px] max-h-[220px] overflow-hidden bg-[#FAFAFA]">
              <AnimatePresence>
                {showUserBubble && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[90%] rounded-2xl rounded-br-md bg-[#E8E8E6] px-3 py-2 text-xs text-[#08080C]">
                      {question}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {showThinking && (
                <div className="rounded-2xl rounded-bl-md bg-[#F3EDE4] px-3 py-2.5 w-fit">
                  <span className="inline-flex gap-1 items-center">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]"
                        animate={paused ? { y: 0, opacity: 0.6 } : { y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                        transition={paused ? { duration: 0 } : { duration: 0.7, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </span>
                </div>
              )}

              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl rounded-bl-md bg-[#F3EDE4] px-3 py-2.5 text-xs text-[#08080C]/90 whitespace-pre-wrap leading-relaxed"
                >
                  {phase === "done" ? answer : answerTw.text}
                  {phase === "streaming" && !paused && (
                    <motion.span
                      className="inline-block w-[2px] h-3 bg-[#37489d] ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )}
            </div>

            <div className="px-3 py-2.5 border-t border-[#08080C]/6">
              <div className="rounded-md bg-[#F0F0F0] px-3 py-2.5 text-xs min-h-[40px] flex items-center">
                {phase === "typing_input" ? (
                  <span className="text-[#08080C]">
                    {inputTw.text}
                    <motion.span
                      className="inline-block w-[2px] h-3 bg-[#37489d] ml-0.5 align-middle"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.45, repeat: Infinity }}
                    />
                  </span>
                ) : (
                  <span className="text-[#9CA3AF]">Pergunte qualquer coisa…</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          type="button"
          className="pointer-events-auto inline-flex items-center gap-2 h-11 pl-2.5 pr-3.5 rounded-full bg-white border border-[#08080C]/10 shadow-lg"
          animate={
            fabLit
              ? {
                  scale: [1, 1.06, 1],
                  boxShadow: [
                    "0 10px 15px -3px rgba(0,0,0,0.1)",
                    "0 0 0 4px rgba(55,72,157,0.28), 0 10px 25px -3px rgba(0,0,0,0.15)",
                    "0 10px 15px -3px rgba(0,0,0,0.1)",
                  ],
                }
              : { scale: 1 }
          }
          transition={fabLit ? { duration: 1.5, repeat: Infinity } : {}}
          aria-label="Pergunte ao Adz"
        >
          <ColorOrb dimension="24px" tones={ORB_TONES} />
          <span className="text-sm font-medium text-[#08080C] whitespace-nowrap">Pergunte ao Adz</span>
        </motion.button>
      )}
    </div>
  );
}
