import { AdzChatShowcase } from "./AdzChatShowcase";

/** Showcase animado do AdzChat (UI estilo produto) para a landing /chat. */
export function AdzChatMotionHero() {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div
        className="absolute -inset-4 bg-gradient-to-r from-[#37489d]/20 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] blur-2xl pointer-events-none"
        aria-hidden
      />
      <div className="relative">
        <AdzChatShowcase variant="product" />
      </div>
    </div>
  );
}
