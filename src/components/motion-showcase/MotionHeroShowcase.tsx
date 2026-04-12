import { AdzChatShowcase } from "./AdzChatShowcase";

/**
 * Mesmo showcase da rota /motion do app (AdzChatShowcase), com halo visual
 * equivalente ao antigo DashboardMockup na LP.
 */
export function MotionHeroShowcase() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div
        className="absolute -inset-4 bg-gradient-to-r from-[#37489d]/20 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] blur-2xl pointer-events-none"
        aria-hidden
      />
      <div className="relative">
        <AdzChatShowcase variant="platform" />
      </div>
    </div>
  );
}
