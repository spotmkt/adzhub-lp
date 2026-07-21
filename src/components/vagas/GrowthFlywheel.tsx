import { motion } from "framer-motion";

const INNER = ["Método", "IA", "Dados", "Plano"] as const;
const OUTER = [
  "PME",
  "Tráfego",
  "Conteúdo",
  "Redes",
  "APIs",
  "Escala",
  "Empresas",
  "Profissional de mkt",
] as const;

/** Posição polar em % do container (0° = topo). */
function polarPct(angleDeg: number, radiusPct: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    left: `${50 + radiusPct * Math.cos(rad)}%`,
    top: `${50 + radiusPct * Math.sin(rad)}%`,
  };
}

/** Flywheel nativo: órbitas com chips legíveis — sem Atrair/Engajar/Encantar. */
export function GrowthFlywheel() {
  return (
    <div className="relative w-full max-w-full sm:max-w-[420px] lg:max-w-[480px] mx-auto min-w-0 overflow-hidden">
      <div
        className="relative mx-auto aspect-square w-full max-w-full overflow-hidden"
        style={{ contain: "paint layout" }}
      >
        <div className="absolute inset-[22%] rounded-full border border-[#08080C]/10" aria-hidden />
        <div className="absolute inset-[8%] rounded-full border border-[#08080C]/[0.07]" aria-hidden />

        <OrbitRing
          radiusPct={26}
          duration={34}
          direction={1}
          labels={[...INNER]}
          chipClass="px-2 py-0.5 text-[9px] sm:px-2.5 sm:py-1 sm:text-[11px]"
        />
        <OrbitRing
          radiusPct={38}
          duration={50}
          direction={-1}
          labels={[...OUTER]}
          chipClass="px-2 py-0.5 text-[9px] sm:px-2.5 sm:py-1 sm:text-[11px]"
          startOffset={15}
        />

        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          <defs>
            <marker id="fw-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#5a6dc7" />
            </marker>
          </defs>
          {[0, 120, 240].map((d) => (
            <path
              key={d}
              d="M100,18 A82,82 0 0 1 158,44"
              fill="none"
              stroke="#5a6dc7"
              strokeWidth="1.25"
              strokeOpacity="0.45"
              markerEnd="url(#fw-a)"
              transform={`rotate(${d} 100 100)`}
            />
          ))}
        </motion.svg>

        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <motion.div
            className="w-[30%] aspect-square rounded-full bg-[#37489d] flex items-center justify-center shadow-[0_0_28px_rgba(55,72,157,0.3)] ring-[4px] sm:ring-[6px] ring-white"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
          >
            <span className="text-white text-xs sm:text-sm lg:text-base font-bold tracking-wide text-center leading-tight px-1.5">
              Adzhub
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function OrbitRing({
  radiusPct,
  duration,
  direction,
  labels,
  chipClass,
  startOffset = 0,
}: {
  radiusPct: number;
  duration: number;
  direction: 1 | -1;
  labels: string[];
  chipClass: string;
  startOffset?: number;
}) {
  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      animate={{ rotate: direction * 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {labels.map((label, i) => {
        const angle = startOffset + (360 / labels.length) * i;
        const pos = polarPct(angle, radiusPct);
        return (
          <div
            key={label}
            className="absolute z-10 pointer-events-none"
            style={{ left: pos.left, top: pos.top }}
          >
            <motion.span
              className={`block -translate-x-1/2 -translate-y-1/2 max-w-[7.5rem] truncate rounded-full border border-[#08080C]/12 bg-white text-[#374151] font-semibold shadow-sm ${chipClass}`}
              animate={{ rotate: direction * -360 }}
              transition={{ duration, ease: "linear", repeat: Infinity }}
            >
              {label}
            </motion.span>
          </div>
        );
      })}
    </motion.div>
  );
}
