/** Logos oficiais Gemini, ChatGPT e Claude — arquivos em /public/seo/ai-logos. */

const LOGOS = [
  { name: "Gemini", src: "/seo/ai-logos/gemini.svg" },
  { name: "ChatGPT", src: "/seo/ai-logos/openai.svg" },
  { name: "Claude", src: "/seo/ai-logos/claude.svg" },
] as const;

export function AiBrandLogos({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 align-middle ${className}`}
      role="img"
      aria-label="Gemini, ChatGPT e Claude"
    >
      {LOGOS.map(({ name, src }) => (
        <span
          key={name}
          title={name}
          className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white border border-[#08080C]/08 shadow-sm"
        >
          <img src={src} alt="" className="h-3.5 w-3.5 sm:h-4 sm:w-4" width={16} height={16} />
        </span>
      ))}
    </span>
  );
}
