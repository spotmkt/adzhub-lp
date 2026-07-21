import type { ReactNode } from "react";

/** Borda animada tipo Border Beam (estilo React Bits) — accent AdzHub. */
export function BorderBeamCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative rounded-2xl p-[1.5px] overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 animate-[vagas-beam_4s_linear_infinite]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, transparent 35%, #37489d 48%, #8da4ff 52%, transparent 65%, transparent 100%)",
        }}
        aria-hidden
      />
      <div className="relative rounded-[14.5px] bg-white h-full w-full shadow-sm">{children}</div>
      <style>{`
        @keyframes vagas-beam {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
