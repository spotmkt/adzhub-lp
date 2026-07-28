/** Logos oficiais Gemini, ChatGPT e Claude — arquivos em /public/seo/ai-logos. */

const LOGOS = [
  { name: "Gemini", src: "/seo/ai-logos/gemini.svg" },
  { name: "ChatGPT", src: "/seo/ai-logos/openai.svg" },
  { name: "Claude", src: "/seo/ai-logos/claude.svg" },
] as const;

export function AiBrandLogos({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 align-middle ${className}`}
      role="img"
      aria-label="Gemini, ChatGPT e Claude"
    >
      {LOGOS.map(({ name, src }) => (
        <span
          key={name}
          title={name}
          className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white border border-[#08080C]/08 shadow-sm"
        >
          <img src={src} alt="" className="h-4 w-4 sm:h-5 sm:w-5" width={20} height={20} />
        </span>
      ))}
    </span>
  );
}
