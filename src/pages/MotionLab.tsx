import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Mem0StyleHome, Mem0StyleSeo, NotionStyleHome, NotionStyleSeo } from "@/components/motion-lab";

type Section = "mem0-home" | "mem0-seo" | "notion-home" | "notion-seo";

const SECTIONS: { id: Section; label: string; badge: string; color: string }[] = [
  { id: "mem0-home", label: "Home — Estilo Mem0", badge: "Stepper + Scroll", color: "bg-violet-100 text-violet-700" },
  { id: "mem0-seo", label: "SEO — Estilo Mem0", badge: "Stepper + Scroll", color: "bg-violet-100 text-violet-700" },
  { id: "notion-home", label: "Home — Estilo Notion", badge: "Tabs + Auto-play", color: "bg-orange-100 text-orange-700" },
  { id: "notion-seo", label: "SEO — Estilo Notion", badge: "Tabs + Auto-play", color: "bg-orange-100 text-orange-700" },
];

export default function MotionLab() {
  const [active, setActive] = useState<Section>("mem0-home");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="h-5 w-px bg-gray-200 shrink-0" />

          <h1 className="text-sm font-bold text-[#08080C] shrink-0">
            Motion Lab
          </h1>

          <div className="flex-1" />

          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActive(s.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active === s.id
                    ? "bg-[#37489d] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-[#08080C]">
            {SECTIONS.find((s) => s.id === active)?.label}
          </h2>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SECTIONS.find((s) => s.id === active)?.color}`}>
            {SECTIONS.find((s) => s.id === active)?.badge}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
          {active.startsWith("mem0")
            ? "Stepper vertical à esquerda sincronizado com a demo à direita via Intersection Observer (scroll-driven). Inspirado na seção \"How it works\" do Mem0."
            : "Tabs clicáveis à esquerda com auto-play contínuo e botão de pause. Inspirado na seção \"Keep work moving 24/7\" da Notion."}
        </p>
      </div>

      {/* Content */}
      <div className="pb-24">
        {active === "mem0-home" && <Mem0StyleHome />}
        {active === "mem0-seo" && <Mem0StyleSeo />}
        {active === "notion-home" && <NotionStyleHome />}
        {active === "notion-seo" && <NotionStyleSeo />}
      </div>
    </div>
  );
}
