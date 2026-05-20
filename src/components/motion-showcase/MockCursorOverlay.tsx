import { useEffect, useState } from "react";
import { AnimatedCursor } from "./AnimatedCursor";

interface MockCursorOverlayProps {
  /** Ref do wrapper que contém o MockInterface (mesmo box de coordenadas). */
  containerRef: React.RefObject<HTMLElement | null>;
  /** `data-cursor-target` do elemento alvo; prioridade sobre fallback. */
  target?: string | null;
  fallbackX?: number;
  fallbackY?: number;
  clicking?: boolean;
  hidden?: boolean;
  /** Força novo cálculo quando o mock muda layout (dropdown, formulário, etc.). */
  layoutKey?: string;
}

/** Posiciona o cursor sobre elementos do mock via `data-cursor-target`. */
export function MockCursorOverlay({
  containerRef,
  target,
  fallbackX,
  fallbackY,
  clicking = false,
  hidden = false,
  layoutKey = "",
}: MockCursorOverlayProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (hidden) {
      setPos(null);
      return;
    }

    const resolve = () => {
      const root = containerRef.current;
      if (!root) return;

      if (target) {
        const el = root.querySelector(`[data-cursor-target="${target}"]`);
        if (el) {
          const rootRect = root.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          setPos({
            x: elRect.left - rootRect.left + elRect.width * 0.72,
            y: elRect.top - rootRect.top + elRect.height * 0.55,
          });
          return;
        }
      }

      if (fallbackX != null && fallbackY != null) {
        setPos({ x: fallbackX, y: fallbackY });
        return;
      }

      setPos(null);
    };

    resolve();

    const root = containerRef.current;
    if (!root) return;

    const ro = new ResizeObserver(() => resolve());
    ro.observe(root);

    const mo = new MutationObserver(() => resolve());
    mo.observe(root, { childList: true, subtree: true, attributes: true });

    const t1 = window.setTimeout(resolve, 50);
    const t2 = window.setTimeout(resolve, 280);
    const t3 = window.setTimeout(resolve, 520);
    const t4 = window.setTimeout(resolve, 900);

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [containerRef, target, fallbackX, fallbackY, hidden, layoutKey]);

  if (hidden || !pos) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-2xl">
      <AnimatedCursor x={pos.x} y={pos.y} clicking={clicking} />
    </div>
  );
}
