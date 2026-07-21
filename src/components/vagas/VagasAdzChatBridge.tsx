import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckSquare,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  Video,
  CheckCircle2,
  CornerDownLeft,
} from "lucide-react";

export const MEETING_TITLE = "Reunião Spot · Housewhey";
export const MEETING_TASKS = [
  "Revisar criativos Ômega 3",
  "Aprovar e-mail de queima",
  "Atualizar KPI Meta Ads",
] as const;

export const UPDATE_PROMPT =
  "atualiza o insight da semana do cliente com essas tarefas concluídas";

const AGENT_STEPS = [
  { id: "extract", label: "Extrair tarefas da reunião", detail: "3 ações identificadas no contexto" },
  { id: "criativos", label: MEETING_TASKS[0], detail: "Briefing e peças revisados" },
  { id: "email", label: MEETING_TASKS[1], detail: "Rascunho pronto · confirmação ok" },
  { id: "kpi", label: MEETING_TASKS[2], detail: "KPI sincronizado no painel" },
] as const;

function useTypewriter(full: string, active: boolean, cps = 32, paused = false) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const iRef = useRef(0);

  // Só reseta ao (re)ativar — ao desativar, congela o texto
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

/** Card compacto da reunião — usado na timeline, no drag e no drop. */
export function MeetingContextCard({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border-2 border-red-200 bg-red-50/90 shadow-md ${
        compact ? "p-2" : "p-2.5"
      } ${className}`}
    >
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0">
          <Video className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-2">
            <p className={`font-semibold text-[#08080C] ${compact ? "text-[11px]" : "text-xs"}`}>
              {MEETING_TITLE}
            </p>
            <span className="text-[10px] font-bold text-red-600 shrink-0">Agora</span>
          </div>
          {!compact && (
            <ul className="mt-1.5 space-y-0.5">
              {MEETING_TASKS.map((t) => (
                <li key={t} className="flex items-center gap-1 text-[10px] text-[#374151]">
                  <CheckSquare className="w-2.5 h-2.5 text-[#37489d]" />
                  {t}
                </li>
              ))}
            </ul>
          )}
          {compact && (
            <p className="text-[10px] text-[#6B7280] mt-0.5">3 tarefas · contexto anexado</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Cursor estilo sistema + card voando da timeline → AdzChat. */
export function DragMeetingOverlay({
  active,
  paused = false,
}: {
  active: boolean;
  paused?: boolean;
}) {
  const [phase, setPhase] = useState<"approach" | "grab" | "fly" | "drop">("approach");

  useEffect(() => {
    if (!active) setPhase("approach");
  }, [active]);

  useEffect(() => {
    if (!active || paused) return;
    const next = { approach: "grab", grab: "fly", fly: "drop", drop: null } as const;
    const delay = { approach: 700, grab: 500, fly: 2000, drop: null } as const;
    const n = next[phase];
    const d = delay[phase];
    if (!n || d == null) return;
    const t = setTimeout(() => setPhase(n), d);
    return () => clearTimeout(t);
  }, [active, paused, phase]);

  const path = {
    approach: { x: 42, y: 8 },
    grab: { x: 28, y: 22 },
    fly: { x: 58, y: 48 },
    drop: { x: 62, y: 58 },
  } as const;

  const pos = path[phase];
  const grabbed = phase === "grab" || phase === "fly" || phase === "drop";
  const flying = phase === "fly" || phase === "drop";

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden" aria-hidden>
      {flying && (
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-[#37489d]/10 blur-2xl"
          animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          style={{ x: "-50%", y: "-50%" }}
        />
      )}

      <AnimatePresence>
        {grabbed && (
          <motion.div
            className="absolute w-[220px] sm:w-[260px] z-20"
            initial={{ left: "28%", top: "22%", scale: 1, rotate: 0, opacity: 1 }}
            animate={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              scale: phase === "drop" ? 0.72 : phase === "fly" ? 0.9 : 1.05,
              rotate: phase === "fly" ? -6 : phase === "drop" ? -2 : 2,
              opacity: phase === "drop" ? 0.85 : 1,
              x: "-40%",
              y: "-30%",
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
          >
            <div className="shadow-2xl ring-2 ring-[#37489d]/25 rounded-xl">
              <MeetingContextCard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute z-30"
        animate={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          scale: phase === "grab" ? 0.92 : 1,
        }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        style={{ x: 8, y: 8 }}
      >
        <MousePointer grabbed={grabbed && phase !== "drop"} />
      </motion.div>
    </div>
  );
}

function MousePointer({ grabbed }: { grabbed: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
      <path
        d="M5.5 3.5L19 12.2l-6.2 1.4 2.8 6.6-2.4 1-2.8-6.6L5.5 20.5V3.5z"
        fill="#08080C"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {grabbed && (
        <circle cx="18" cy="6" r="3" fill="#37489d" stroke="#fff" strokeWidth="1" />
      )}
    </svg>
  );
}

type AdzPhase =
  | "awaiting_drop"
  | "dropped"
  | "planning"
  | "executing"
  | "done"
  | "typing_update"
  | "update_sent"
  | "update_ack";

/** AdzChat interno — AdzChat Pro, sem logo duplicada. */
export function AdzChatAgentView({
  mode,
  paused = false,
}: {
  mode: "awaiting" | "run" | "ask";
  paused?: boolean;
}) {
  const [phase, setPhase] = useState<AdzPhase>(mode === "awaiting" ? "awaiting_drop" : "dropped");
  const [stepIndex, setStepIndex] = useState(-1);
  const inputTw = useTypewriter(UPDATE_PROMPT, phase === "typing_update", 34, paused);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "awaiting") {
      setPhase("awaiting_drop");
      setStepIndex(-1);
      return;
    }
    if (mode === "ask") {
      setPhase("typing_update");
      setStepIndex(AGENT_STEPS.length);
      return;
    }
    setPhase("dropped");
    setStepIndex(-1);
  }, [mode]);

  useEffect(() => {
    if (paused || mode !== "run") return;
    if (phase === "dropped") {
      const t = setTimeout(() => setPhase("planning"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "planning") {
      const t = setTimeout(() => {
        setPhase("executing");
        setStepIndex(0);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [mode, phase, paused]);

  useEffect(() => {
    if (paused) return;
    if (phase !== "executing" || stepIndex < 0) return;
    if (stepIndex >= AGENT_STEPS.length - 1) {
      const t = setTimeout(() => setPhase("done"), 1100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 1200);
    return () => clearTimeout(t);
  }, [phase, stepIndex, paused]);

  useEffect(() => {
    if (paused) return;
    if (phase === "typing_update" && inputTw.done) {
      const t = setTimeout(() => setPhase("update_sent"), 350);
      return () => clearTimeout(t);
    }
    if (phase === "update_sent") {
      const t = setTimeout(() => setPhase("update_ack"), 500);
      return () => clearTimeout(t);
    }
  }, [phase, inputTw.done, paused]);

  // Rola só dentro do chat — sem scrollIntoView (evita rolar a página)
  useEffect(() => {
    if (phase !== "update_sent" && phase !== "update_ack") return;
    const el = scrollRef.current;
    if (!el) return;
    const scroll = () => {
      el.scrollTop = el.scrollHeight;
    };
    const t0 = requestAnimationFrame(scroll);
    const t1 = setTimeout(scroll, phase === "update_ack" ? 140 : 40);
    return () => {
      cancelAnimationFrame(t0);
      clearTimeout(t1);
    };
  }, [phase]);

  const showContext = phase !== "awaiting_drop";
  const dropHighlight = mode === "awaiting";
  const showSteps =
    phase === "executing" ||
    phase === "done" ||
    phase === "typing_update" ||
    phase === "update_sent" ||
    phase === "update_ack" ||
    phase === "planning";
  const stepsDone =
    phase === "done" ||
    phase === "typing_update" ||
    phase === "update_sent" ||
    phase === "update_ack";

  return (
    <div className="h-full flex bg-[#F9F9F9] overflow-hidden">
      <aside className="hidden sm:flex w-[180px] shrink-0 flex-col border-r border-[#1A2B4B]/8 bg-white py-3 px-2">
        <div className="px-1.5 mb-4">
          <p className="text-xs font-semibold text-[#1A2B4B]">AdzChat</p>
          <p className="text-[9px] text-[#1A2B4B]/40">Equipe interna</p>
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#1A2B4B]/40 px-1.5 mb-1.5">
          Modelos
        </p>
        <div className="space-y-0.5 mb-3">
          {[
            { name: "AdzChat Mini", on: false, Icon: MessageSquare },
            { name: "AdzChat Pro", on: true, Icon: Sparkles },
          ].map(({ name, on, Icon }) => (
            <div
              key={name}
              className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] ${
                on ? "bg-[#F59E0B]/12 font-medium" : "text-[#1A2B4B]/70"
              }`}
            >
              <Icon className="w-3 h-3 text-[#F59E0B] shrink-0" />
              <span className="truncate">{name}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#1A2B4B]/40 px-1.5 mb-1">
          Chats
        </p>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 text-[10px]">
          <div>
            <p className="text-[9px] text-[#1A2B4B]/35 px-1.5 mb-0.5">Hoje</p>
            {[
              { title: "Reunião → execução", when: "agora", active: true },
              { title: "Otimização Meta Q3", when: "1h atrás", active: false },
              { title: "Briefing Ômega 3", when: "3h atrás", active: false },
            ].map((c) => (
              <div
                key={c.title}
                className={`px-1.5 py-1 rounded-md ${
                  c.active ? "bg-[#F9F9F9]" : "hover:bg-[#F9F9F9]/80"
                }`}
              >
                <p className="truncate text-[#1A2B4B]/90">{c.title}</p>
                <p className="text-[9px] text-[#1A2B4B]/40">{c.when}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[9px] text-[#1A2B4B]/35 px-1.5 mb-0.5">Últimos 7 dias</p>
            {[
              { title: "Relatório mensal Meta", when: "2d atrás" },
              { title: "Diagnóstico housewhey", when: "4d atrás" },
              { title: "Criativos Namorados", when: "5d atrás" },
              { title: "Plano de sucesso · s12", when: "6d atrás" },
            ].map((c) => (
              <div key={c.title} className="px-1.5 py-1 rounded-md">
                <p className="truncate text-[#1A2B4B]/90">{c.title}</p>
                <p className="text-[9px] text-[#1A2B4B]/40">{c.when}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-10 shrink-0 flex items-center gap-2 px-3 border-b border-[#1A2B4B]/8">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-xs font-semibold text-[#1A2B4B]">AdzChat Pro</span>
          <span className="text-[10px] text-[#1A2B4B]/40 ml-auto hidden sm:inline">Equipe interna</span>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-none px-3 sm:px-4 py-3 space-y-2.5"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <AnimatePresence>
            {showContext && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="max-w-md"
              >
                <p className="text-[10px] text-[#1A2B4B]/45 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Contexto anexado
                </p>
                <MeetingContextCard compact />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSteps && phase !== "awaiting_drop" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg rounded-2xl rounded-bl-md bg-white border border-[#1A2B4B]/8 px-3 py-2.5 shadow-sm"
              >
                <p className="text-[11px] text-[#1A2B4B]/85 leading-relaxed mb-2">
                  {phase === "planning"
                    ? "Contexto da reunião recebido. Montando plano de execução com confirmação…"
                    : "Executando com base nas tarefas extraídas da reunião:"}
                </p>

                {(phase === "executing" || stepsDone) && (
                  <ul className="space-y-1.5">
                    {AGENT_STEPS.map((step, i) => {
                      const done = stepsDone || i < stepIndex;
                      const active = phase === "executing" && i === stepIndex;
                      const pending = !stepsDone && i > stepIndex;
                      return (
                        <motion.li
                          key={step.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: pending ? 0.35 : 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-[11px] ${
                            active ? "bg-[#37489d]/8 ring-1 ring-[#37489d]/20" : ""
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">
                            {done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : active ? (
                              <Loader2 className="w-3.5 h-3.5 text-[#37489d] animate-spin" />
                            ) : (
                              <span className="block w-3.5 h-3.5 rounded-full border border-[#1A2B4B]/20" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="font-medium text-[#1A2B4B] block">{step.label}</span>
                            {(active || done) && (
                              <span className="text-[10px] text-[#1A2B4B]/50">{step.detail}</span>
                            )}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(phase === "update_sent" || phase === "update_ack") && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex justify-end"
              >
                <div className="max-w-[90%] rounded-2xl rounded-br-md bg-[#E8E8E6] px-3 py-2 text-xs text-[#08080C]">
                  {UPDATE_PROMPT}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "update_ack" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg rounded-2xl rounded-bl-md bg-white border border-[#1A2B4B]/8 px-3 py-2.5 shadow-sm text-[11px] text-[#1A2B4B]/85 leading-relaxed"
              >
                Pronto: vou sincronizar o <span className="font-semibold">Insight da semana</span> do
                cliente housewhey. As 3 tarefas da reunião aparecerão como concluídas no Resumo.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-2 shrink-0" aria-hidden />
        </div>

        <div className="shrink-0 px-3 sm:px-4 pb-3">
          <motion.div
            animate={
              dropHighlight
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(55,72,157,0)",
                      "0 0 0 3px rgba(55,72,157,0.35)",
                      "0 0 0 0 rgba(55,72,157,0)",
                    ],
                    borderColor: ["rgba(26,43,75,0.12)", "rgba(55,72,157,0.55)", "rgba(26,43,75,0.12)"],
                  }
                : {}
            }
            transition={dropHighlight ? { duration: 1.4, repeat: Infinity } : {}}
            className={`rounded-2xl border bg-white px-3 py-2.5 flex items-end gap-2 ${
              dropHighlight ? "border-dashed border-[#37489d]/40 bg-[#37489d]/[0.03]" : "border-[#1A2B4B]/12"
            }`}
          >
            <div className="flex-1 min-w-0 min-h-[28px] flex items-center">
              {dropHighlight ? (
                <p className="text-[11px] text-[#37489d] font-medium py-1">
                  Solte o contexto da reunião aqui…
                </p>
              ) : phase === "typing_update" ? (
                <span className="text-[11px] text-[#08080C]">
                  {inputTw.text}
                  <motion.span
                    className="inline-block w-[2px] h-3 bg-[#37489d] ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.45, repeat: Infinity }}
                  />
                </span>
              ) : (
                <p className="text-[11px] text-[#1A2B4B]/40 py-1 flex items-center gap-1">
                  Continuar com o agente…
                  {phase === "done" && (
                    <span className="text-[9px] text-[#9CA3AF] inline-flex items-center gap-0.5 ml-1">
                      Enter <CornerDownLeft className="w-2.5 h-2.5" />
                    </span>
                  )}
                </p>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-[#37489d] flex items-center justify-center shrink-0">
              <Send className="w-3.5 h-3.5 text-white" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
