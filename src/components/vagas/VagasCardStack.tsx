import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface VagasCardStackProps {
  label: string;
  meta?: string;
  items: string[];
  /** Prefixo do contador em cada card (ex.: "Req."). */
  itemPrefix?: string;
  Icon: LucideIcon;
}

const VISIBLE_CARDS = 3;

/** Pilha de cards com dismiss por arrasto/clique (estilo sidebar-news da Dub). */
export function VagasCardStack({ label, meta, items, itemPrefix, Icon }: VagasCardStackProps) {
  const [index, setIndex] = useState(0);
  const done = index >= items.length;
  const visible = items.slice(index, index + VISIBLE_CARDS);
  const progress = done ? 1 : (index + 1) / items.length;

  function next() {
    setIndex((i) => Math.min(i + 1, items.length));
  }

  function previous() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#37489d]">
          {label}
          {meta && <span className="ml-1.5 font-semibold normal-case tracking-normal text-[#9CA3AF]">· {meta}</span>}
        </p>
        <span className="text-[11px] font-semibold tabular-nums text-[#6B7280]">
          {done ? items.length : index + 1}
          <span className="font-normal text-[#9CA3AF]"> / {items.length}</span>
        </span>
      </div>

      <div className="mb-4 h-1 overflow-hidden rounded-full bg-[#08080C]/6">
        <motion.div
          className="h-full rounded-full bg-[#37489d]"
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>

      <div className="relative h-[208px] sm:h-[196px]">
        <AnimatePresence>
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-x-0 top-0 flex h-[176px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#37489d]/15 bg-[#37489d]/[0.04] p-5 text-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#37489d]/10">
                <Check className="h-4.5 w-4.5 text-[#37489d]" aria-hidden />
              </span>
              <p className="text-sm font-medium text-[#08080C]">Você viu tudo por aqui.</p>
              <button
                type="button"
                onClick={() => setIndex(0)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#37489d] hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Rever itens
              </button>
            </motion.div>
          ) : (
            visible
              .map((item, i) => {
                const isTop = i === 0;
                return (
                  <motion.div
                    key={item}
                    className={`absolute inset-x-0 top-0 flex h-[176px] select-none flex-col rounded-2xl border border-[#08080C]/8 bg-white p-4 shadow-[0_10px_30px_-18px_rgba(8,8,12,0.35)] ${
                      isTop ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                    style={{ zIndex: VISIBLE_CARDS - i }}
                    initial={{ y: 12 * (i + 1), scale: 1 - 0.05 * (i + 1), opacity: i === VISIBLE_CARDS - 1 ? 0 : 1 }}
                    animate={{ y: 12 * i, scale: 1 - 0.05 * i, opacity: 1 }}
                    exit={{ x: -220, opacity: 0, rotate: -5, transition: { duration: 0.25 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    drag={isTop ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) next();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#37489d]/10">
                        <Icon className="h-3.5 w-3.5 text-[#37489d]" aria-hidden />
                      </span>
                      {itemPrefix && (
                        <span className="rounded-md bg-[#08080C]/4 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#6B7280]">
                          {itemPrefix} {String(index + i + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <p className="flex flex-1 items-center text-[13px] leading-relaxed text-[#1F2937] sm:text-sm">
                      {item}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#08080C]/6 pt-2.5">
                      <button
                        type="button"
                        onClick={previous}
                        disabled={index === 0}
                        className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#6B7280] transition-colors hover:text-[#37489d] disabled:pointer-events-none disabled:opacity-35"
                        aria-label="Voltar ao card anterior"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                        Voltar aqui
                      </button>
                      {isTop && (
                        <button
                          type="button"
                          onClick={next}
                          className="inline-flex items-center gap-0.5 rounded-full border border-[#37489d]/15 bg-[#37489d]/5 py-1 pl-3 pr-2 text-[11px] font-semibold text-[#37489d] transition-colors hover:bg-[#37489d]/10"
                        >
                          Próximo
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
              .reverse()
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
