import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, Network, Video } from "lucide-react";

type GraphKind = "hub" | "person" | "campaign" | "channel" | "task" | "meeting";

type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  c: string;
  r: number;
  kind: GraphKind;
};

const SELECTED_NODE_ID = "reuniao";

/** Layout orbital — hub no centro, clusters por tipo. */
const GRAPH_NODES: GraphNode[] = [
  { id: "spot", label: "SPOT", x: 320, y: 200, c: "#37489d", r: 22, kind: "hub" },
  { id: "house", label: "Housewhey", x: 320, y: 78, c: "#1e3a5f", r: 14, kind: "hub" },
  { id: "aline", label: "Aline", x: 175, y: 130, c: "#7c3aed", r: 12, kind: "person" },
  { id: "luiza", label: "Luiza", x: 465, y: 130, c: "#7c3aed", r: 12, kind: "person" },
  { id: "carolina", label: "Carolina", x: 220, y: 295, c: "#7c3aed", r: 11, kind: "person" },
  { id: "reuniao", label: "Reunião Spot", x: 430, y: 200, c: "#e11d48", r: 15, kind: "meeting" },
  { id: "omega", label: "Ômega 3", x: 95, y: 185, c: "#f59e0b", r: 12, kind: "campaign" },
  { id: "whey", label: "Whey", x: 145, y: 265, c: "#f59e0b", r: 11, kind: "campaign" },
  { id: "namorados", label: "Namorados", x: 545, y: 270, c: "#f59e0b", r: 11, kind: "campaign" },
  { id: "meta", label: "Meta Ads", x: 130, y: 85, c: "#0d9488", r: 11, kind: "channel" },
  { id: "wa", label: "WhatsApp", x: 530, y: 155, c: "#0d9488", r: 11, kind: "channel" },
  { id: "email", label: "E-mail", x: 80, y: 290, c: "#0d9488", r: 11, kind: "channel" },
  { id: "aprov", label: "Aprovação", x: 555, y: 330, c: "#64748b", r: 11, kind: "task" },
  { id: "criativo", label: "Criativos", x: 455, y: 325, c: "#64748b", r: 11, kind: "task" },
  { id: "kpi", label: "KPI Meta", x: 300, y: 345, c: "#64748b", r: 11, kind: "task" },
];

const GRAPH_EDGES: [string, string][] = [
  ["spot", "house"],
  ["spot", "aline"],
  ["spot", "luiza"],
  ["spot", "carolina"],
  ["spot", "reuniao"],
  ["house", "reuniao"],
  ["aline", "omega"],
  ["aline", "email"],
  ["luiza", "whey"],
  ["luiza", "wa"],
  ["carolina", "kpi"],
  ["reuniao", "criativo"],
  ["reuniao", "aprov"],
  ["reuniao", "wa"],
  ["omega", "meta"],
  ["omega", "email"],
  ["namorados", "criativo"],
  ["namorados", "luiza"],
  ["meta", "kpi"],
  ["whey", "aline"],
];

function edgePath(ax: number, ay: number, bx: number, by: number, cx = 320, cy = 200) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const qx = mx + (mx - cx) * 0.18;
  const qy = my + (my - cy) * 0.18;
  return `M ${ax} ${ay} Q ${qx} ${qy} ${bx} ${by}`;
}

function spotClass(active: boolean) {
  if (active) {
    return "relative z-10 ring-2 ring-[#37489d]/35 shadow-lg scale-[1.01] transition-all duration-500";
  }
  return "transition-all duration-500";
}

export function VagasGraphView({
  phase,
  spotlightActive = true,
}: {
  phase: "graph" | "detail";
  spotlightActive?: boolean;
}) {
  const W = 640;
  const H = 400;
  const byId = useMemo(() => Object.fromEntries(GRAPH_NODES.map((n) => [n.id, n])), []);
  const selected = byId[SELECTED_NODE_ID];
  const showDetail = phase === "detail";

  return (
    <div className="h-full p-3 sm:p-4 overflow-hidden flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Network className="w-4 h-4 text-[#37489d] shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#37489d]">Supercérebro · Grafo</p>
            <p className="text-xs text-[#6B7280] truncate">
              {showDetail
                ? "Detalhe do nó selecionado: contexto da reunião"
                : "Pessoas, tarefas e canais ligados ao contexto do cliente"}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 text-[9px] text-[#6B7280] shrink-0">
          {[
            { c: "#7c3aed", t: "Pessoas" },
            { c: "#f59e0b", t: "Campanhas" },
            { c: "#0d9488", t: "Canais" },
            { c: "#e11d48", t: "Reunião" },
          ].map((l) => (
            <span key={l.t} className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: l.c }} />
              {l.t}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`relative flex-1 rounded-2xl border border-[#08080C]/8 overflow-hidden min-h-0 ${spotClass(
          spotlightActive,
        )}`}
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #eef1fb 0%, #ffffff 55%, #f7f7f5 100%)",
        }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" aria-hidden>
          <defs>
            <pattern id="vagas-g-dot" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#94a3b8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vagas-g-dot)" />
        </svg>

        <motion.svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          animate={{ x: showDetail ? -36 : 0, scale: showDetail ? 0.9 : 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        >
          <defs>
            <radialGradient id="vagas-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#37489d" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#37489d" stopOpacity="0" />
            </radialGradient>
            <filter id="vagas-node-soft" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#08080C" floodOpacity="0.18" />
            </filter>
            <linearGradient id="vagas-edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#64748b" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          <circle cx={320} cy={200} r={70} fill="url(#vagas-hub-glow)" />
          <circle
            cx={320}
            cy={200}
            r={95}
            fill="none"
            stroke="#37489d"
            strokeOpacity="0.08"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {showDetail && (
            <>
              <motion.circle
                cx={selected.x}
                cy={selected.y}
                fill="none"
                stroke="#e11d48"
                strokeWidth="2"
                initial={{ r: selected.r + 4, opacity: 0.55 }}
                animate={{ r: selected.r + 32, opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.circle
                cx={selected.x}
                cy={selected.y}
                fill="none"
                stroke="#e11d48"
                strokeWidth="1.25"
                initial={{ r: selected.r + 4, opacity: 0.4 }}
                animate={{ r: selected.r + 22, opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.45 }}
              />
            </>
          )}

          {GRAPH_EDGES.map(([a, b], i) => {
            const na = byId[a];
            const nb = byId[b];
            const related =
              !showDetail || a === SELECTED_NODE_ID || b === SELECTED_NODE_ID;
            return (
              <motion.path
                key={`${a}-${b}`}
                d={edgePath(na.x, na.y, nb.x, nb.y)}
                fill="none"
                stroke={related && showDetail ? "#37489d" : "url(#vagas-edge-grad)"}
                strokeWidth={related && showDetail ? 2.25 : 1.4}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: related ? (showDetail ? 0.85 : 0.65) : 0.08,
                }}
                transition={{ duration: 0.7, delay: showDetail ? 0 : 0.03 * i, ease: "easeOut" }}
              />
            );
          })}

          {GRAPH_NODES.map((n, i) => {
            const isSel = n.id === SELECTED_NODE_ID && showDetail;
            const related =
              !showDetail ||
              n.id === SELECTED_NODE_ID ||
              GRAPH_EDGES.some(
                ([a, b]) =>
                  (a === SELECTED_NODE_ID && b === n.id) ||
                  (b === SELECTED_NODE_ID && a === n.id),
              );
            const isHub = n.kind === "hub";
            const pillW = Math.max(52, n.label.length * 6.6 + 14);
            return (
              <g key={n.id} opacity={related ? 1 : 0.18} filter="url(#vagas-node-soft)">
                <circle cx={n.x} cy={n.y} r={n.r + (isHub ? 6 : 4)} fill={n.c} fillOpacity={0.12} />
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  fill={n.c}
                  stroke="#fff"
                  strokeWidth={isSel ? 3.5 : 2.5}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{
                    r: isSel ? n.r + 3 : n.r,
                    opacity: 1,
                    cy: showDetail ? n.y : [n.y - 1.5, n.y + 1.5, n.y - 1.5],
                  }}
                  transition={{
                    r: {
                      delay: showDetail ? 0 : 0.06 + 0.035 * i,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    },
                    opacity: { delay: showDetail ? 0 : 0.06 + 0.035 * i },
                    cy: {
                      duration: 3.2 + (i % 5) * 0.25,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.08,
                    },
                  }}
                />
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: related ? 1 : 0.2 }}
                  transition={{ delay: showDetail ? 0.05 : 0.12 + 0.03 * i }}
                >
                  <rect
                    x={n.x - pillW / 2}
                    y={n.y + n.r + 6}
                    width={pillW}
                    height={16}
                    rx={8}
                    fill="white"
                    fillOpacity={0.94}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                  <text
                    x={n.x}
                    y={n.y + n.r + 17}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1e293b"
                    fontSize={isSel || isHub ? 11 : 10}
                    fontWeight={isSel || isHub ? 700 : 600}
                    fontFamily="system-ui, sans-serif"
                  >
                    {n.label}
                  </text>
                </motion.g>

                {!showDetail && n.id === SELECTED_NODE_ID && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], x: [12, 0, 0, 0], y: [14, 0, 0, 0] }}
                    transition={{ duration: 2.4, delay: 2.0, times: [0, 0.25, 0.75, 1] }}
                  >
                    <path
                      d={`M ${n.x + 8} ${n.y + 6} l 10 7 -4.5 1 2 5 -2 0.8 -2-5 -4.5 4.5 z`}
                      fill="#08080C"
                      stroke="#fff"
                      strokeWidth="0.8"
                    />
                  </motion.g>
                )}
              </g>
            );
          })}
        </motion.svg>

        <AnimatePresence>
          {showDetail && (
            <motion.aside
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className="absolute top-3 right-3 bottom-3 w-[min(100%-1.5rem,260px)] rounded-xl bg-white/95 backdrop-blur border border-[#08080C]/10 shadow-xl p-3.5 overflow-hidden flex flex-col"
            >
              <div className="flex items-start gap-2 mb-3">
                <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">Nó · Reunião</p>
                  <h4 className="text-sm font-semibold text-[#08080C] leading-snug">Reunião Spot · Housewhey</h4>
                  <p className="text-[10px] text-[#6B7280]">20 jul · 30 min · Aline, Luiza, Carolina</p>
                </div>
              </div>

              <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3">
                Alinhamento semanal: promoção Ômega 3, correção de rotulagem do Whey e peças do Dia dos Namorados.
              </p>

              <p className="text-[10px] font-semibold text-[#08080C] mb-1.5">Tarefas geradas</p>
              <ul className="space-y-1.5 flex-1">
                {[
                  "Revisar criativos Ômega 3",
                  "Aprovar e-mail de queima",
                  "Atualizar KPI Meta Ads",
                ].map((t, i) => (
                  <motion.li
                    key={t}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="flex items-start gap-1.5 text-[11px] text-[#374151] bg-[#F7F7F5] rounded-lg px-2 py-1.5"
                  >
                    <CheckSquare className="w-3 h-3 text-[#37489d] shrink-0 mt-0.5" />
                    {t}
                  </motion.li>
                ))}
              </ul>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-[10px] text-[#37489d] font-medium mt-2 pt-2 border-t border-[#08080C]/6"
              >
                Abrindo timeline de contexto…
              </motion.p>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
