import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedCursor } from "@/components/motion-showcase/AnimatedCursor";
import { SeoBlogPlatformMock } from "./SeoBlogPlatformMock";
import type { BlogViewId } from "./constants";

interface MotionStep {
  duration: number;
  view: BlogViewId;
  cursorX: number;
  cursorY: number;
  clicking: boolean;
  highlightNav: "posts" | null;
  highlightEditIndex: number | null;
  listScrollY: number;
}

const STEPS: MotionStep[] = [
  {
    duration: 2200,
    view: "gsc",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: null,
    listScrollY: 0,
  },
  {
    duration: 2000,
    view: "ideas",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: null,
    listScrollY: 0,
  },
  {
    duration: 900,
    view: "ideas",
    cursorX: 118,
    cursorY: 198,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: null,
    listScrollY: 0,
  },
  {
    duration: 220,
    view: "ideas",
    cursorX: 118,
    cursorY: 198,
    clicking: true,
    highlightNav: "posts",
    highlightEditIndex: null,
    listScrollY: 0,
  },
  {
    duration: 500,
    view: "posts",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: null,
    listScrollY: 0,
  },
  {
    duration: 2400,
    view: "posts",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: null,
    listScrollY: -130,
  },
  {
    duration: 900,
    view: "posts",
    cursorX: 698,
    cursorY: 312,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: 2,
    listScrollY: -130,
  },
  {
    duration: 220,
    view: "posts",
    cursorX: 698,
    cursorY: 312,
    clicking: true,
    highlightNav: null,
    highlightEditIndex: 2,
    listScrollY: -130,
  },
  {
    duration: 500,
    view: "editor",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: null,
    listScrollY: 0,
  },
  {
    duration: 3800,
    view: "editor",
    cursorX: -80,
    cursorY: -80,
    clicking: false,
    highlightNav: null,
    highlightEditIndex: null,
    listScrollY: 0,
  },
];

const CAPTIONS: string[] = [
  "Dashboard Search Console: cliques, impressões e dicas por página — no mesmo perfil do cliente.",
  "Em Big Ideas, a IA sugere temas com palavra-chave e intenção de busca alinhados à sua marca.",
  "Navegue até Postagens para ver o pipeline editorial integrado ao blog.",
  "Um clique leva da estratégia à lista de artigos prontos para revisão.",
  "Postagens Pendentes: busque, filtre por status e aprove sem sair da AdzHub.",
  "Role o acervo e encontre o artigo certo para otimizar ou publicar.",
  "Abra a edição para ajustar título, capa, slug e metadados de SEO.",
  "Confirme a edição e publique com SEO automático já calculado.",
  "Editor integrado: capa com IA, autor, status e preview antes de ir ao ar.",
  "Do GSC à publicação: posicionamento orgânico e execução na mesma plataforma.",
];

/** Motion hero da página /seo — fluxo GSC → Big Ideas → Postagens → Editor. */
export function SeoHeroMotion() {
  const [stepIndex, setStepIndex] = useState(0);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const step = STEPS[stepIndex] ?? STEPS[0];
  const caption = CAPTIONS[stepIndex] ?? CAPTIONS[0];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsNarrowViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setStepIndex((i) => (i + 1 >= STEPS.length ? 0 : i + 1));
    }, step.duration);
    return () => clearTimeout(t);
  }, [stepIndex, step.duration]);

  const showCursor =
    !isNarrowViewport && step.cursorX >= 0 && step.cursorY >= 0;

  return (
    <motion.div
      className="relative pb-2 w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="absolute -inset-3 bg-gradient-to-r from-[#37489d]/12 via-[#F9C7B2]/12 to-[#F9B2D4]/12 rounded-[28px] blur-xl pointer-events-none"
        aria-hidden
      />

      <motion.div className="relative w-full">
        <SeoBlogPlatformMock
          view={step.view}
          listScrollY={isNarrowViewport ? Math.round(step.listScrollY * 0.45) : step.listScrollY}
          highlightNav={step.highlightNav}
          highlightEditIndex={step.highlightEditIndex}
        />
        {showCursor && (
          <AnimatedCursor x={step.cursorX} y={step.cursorY} clicking={step.clicking} />
        )}
      </motion.div>

      <motion.div className="mt-4 px-1 sm:px-2 min-h-[4.5rem] flex items-start justify-center">
        <motion.p
          key={stepIndex}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl"
        >
          {caption}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
