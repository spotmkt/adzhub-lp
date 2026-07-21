import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  // Prédio
  {
    src: "/vagas/p7-fachada-aerea.png",
    alt: "Vista aérea do P7 Criativo",
  },
  // Equipe
  {
    src: "/vagas/time-spot-sofa.png",
    alt: "Time SPOT no P7 Criativo",
  },
  {
    src: "/vagas/time-spot-grupo.png",
    alt: "Time SPOT reunido no P7 Criativo",
  },
  {
    src: "/vagas/spot-equipe.png",
    alt: "Time SPOT trabalhando no escritório",
  },
  {
    src: "/vagas/maps/spot-maps-3.jpg",
    alt: "Time SPOT trabalhando no escritório",
  },
  {
    src: "/vagas/maps/spot-maps-4.jpg",
    alt: "Operação da SPOT no P7 Criativo",
  },
  // Áreas internas
  {
    src: "/vagas/p7-recepcao.png",
    alt: "Recepção do P7 Criativo",
  },
  {
    src: "/vagas/p7-reuniao.png",
    alt: "Sala de reunião no P7 Criativo",
  },
  {
    src: "/vagas/pilar-amor.png",
    alt: "Cultura SPOT no escritório",
  },
  {
    src: "/vagas/pilar-icones.png",
    alt: "Detalhes criativos do escritório",
  },
  // Vista do prédio
  {
    src: "/vagas/vista-belo-horizonte.png",
    alt: "Vista de Belo Horizonte a partir do P7 Criativo",
  },
  {
    src: "/vagas/vista-bh-mural.png",
    alt: "Vista de Belo Horizonte a partir do escritório",
  },
  {
    src: "/vagas/fachada.avif",
    alt: "Fachada do P7 Criativo em Belo Horizonte",
  },
];

const INTERVAL_MS = 2200;

/** Carrossel automático das fotos do escritório (P7 / SPOT). */
export function OfficeCarousel() {
  const [index, setIndex] = useState(0);
  // Pausa o autoplay por um tempo quando o usuário navega manualmente
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (interacted) {
      const t = setTimeout(() => setInteracted(false), INTERVAL_MS * 2);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [interacted]);

  function goTo(next: number) {
    setIndex((next + SLIDES.length) % SLIDES.length);
    setInteracted(true);
  }

  const slide = SLIDES[index];

  return (
    <div className="relative w-full">
      <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-2xl overflow-hidden border border-[#08080C]/8 shadow-lg bg-[#F8F8F8]">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent pt-16 pb-4 px-4">
          <p className="text-white text-xs sm:text-sm font-medium drop-shadow-sm">{slide.alt}</p>
        </div>

        <button
          type="button"
          aria-label="Foto anterior"
          onClick={() => goTo(index - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur border border-[#08080C]/10 shadow-md flex items-center justify-center text-[#08080C] hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Próxima foto"
          onClick={() => goTo(index + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur border border-[#08080C]/10 shadow-md flex items-center justify-center text-[#08080C] hover:bg-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex max-w-full flex-wrap items-center justify-center gap-2 mt-4 px-2" role="tablist" aria-label="Fotos do escritório">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Foto ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-[#37489d]" : "w-1.5 bg-[#08080C]/20 hover:bg-[#08080C]/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
