import { useState, useEffect, useRef, useCallback } from "react";

const PHASE_VH = 85;

export function useMem0Scroll(phaseCount: number) {
  const [activePhase, setActivePhase] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    phaseRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isClickScrolling.current) {
            setActivePhase(i);
          }
        },
        { threshold: 0.45, rootMargin: "-25% 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [phaseCount]);

  const goToPhase = useCallback((index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    setActivePhase(index);
    isClickScrolling.current = true;

    const stickyOffset = 96;
    const phasePx = (window.innerHeight * PHASE_VH) / 100;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionBottom = sectionTop + section.offsetHeight;
    const maxScroll = sectionBottom - window.innerHeight;

    const targetTop = Math.min(
      Math.max(sectionTop + index * phasePx - stickyOffset, 0),
      maxScroll
    );

    window.scrollTo({ top: targetTop, behavior: "smooth" });

    window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);
  }, []);

  return {
    activePhase,
    sectionRef,
    phaseRefs,
    goToPhase,
    sectionMinHeight: `${phaseCount * PHASE_VH}vh`,
    phaseHeight: `${PHASE_VH}vh`,
  };
}
