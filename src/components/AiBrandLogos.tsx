/** Logos Gemini, ChatGPT e Claude — hero de /seo. */

function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="seo-gemini" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1BA1E3" />
          <stop offset="50%" stopColor="#8B6DEF" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        fill="url(#seo-gemini)"
        d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"
      />
    </svg>
  );
}

function ChatGptLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A5.985 5.985 0 0 0 4.816 4.313a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.096 5.98 5.98 0 0 0 .511 4.91 6.046 6.046 0 0 0 6.51 2.9A5.985 5.985 0 0 0 19.186 19.69a5.985 5.985 0 0 0 3.997-2.9 6.046 6.046 0 0 0-.743-7.096 5.954 5.954 0 0 0-.158.027zM13.5 21.167a4.476 4.476 0 0 1-2.876-1.027l.141-.079 4.779-2.76a.794.794 0 0 0 .392-.681v-6.736l2.02 1.168a.071.071 0 0 1 .038.052v5.577a4.504 4.504 0 0 1-4.494 4.486zm-9.562-3.91a4.47 4.47 0 0 1-.534-3.014l.142.085 4.783 2.761a.771.771 0 0 0 .78 0l5.843-3.373v2.332a.08.08 0 0 1-.033.062L9.74 19.804a4.504 4.504 0 0 1-5.802-2.547zM2.34 7.895a4.48 4.48 0 0 1 2.365-1.973V12.6a.772.772 0 0 0 .388.676l5.815 3.355-2.02 1.168a.078.078 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.1 3.855-5.815-3.365 2.02-1.163a.08.08 0 0 1 .071 0l4.83 2.787a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.41-.675zm2.08-3.023-.141-.085-4.784-2.769a.776.776 0 0 0-.785 0L9.409 9.241V6.91a.08.08 0 0 1 .033-.061l4.83-2.787a4.504 4.504 0 0 1 6.68 4.66zm-12.64 2.76L5.866 9.32v-2.332a.08.08 0 0 1 .033-.061l4.83-2.787a4.503 4.503 0 0 1 6.687 1.456l-.141.079-4.778 2.758a.794.794 0 0 0-.393.681zm1.097-2.356 2.602-1.5 2.606 1.5v2.999l-2.597 1.5-2.607-1.5z"
      />
    </svg>
  );
}

/** Asterisco estilizado (marca Claude / Anthropic). */
function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#D97757"
        d="M12.9 2.4 14.7 8.1l5.7 1.8-5.7 1.8-1.8 5.7-1.8-5.7L5.4 9.9l5.7-1.8 1.8-5.7Zm-5.5 12.2-.7 2.2-2.2.7 2.2.7.7 2.2.7-2.2 2.2-.7-2.2-.7-.7-2.2Zm10.1-7.3-.5 1.6-1.6.5 1.6.5.5 1.6.5-1.6 1.6-.5-1.6-.5-.5-1.6Z"
      />
    </svg>
  );
}

const LOGOS = [
  { name: "Gemini", Logo: GeminiLogo, className: "h-4 w-4 sm:h-5 sm:w-5" },
  { name: "ChatGPT", Logo: ChatGptLogo, className: "h-4 w-4 sm:h-5 sm:w-5 text-[#10A37F]" },
  { name: "Claude", Logo: ClaudeLogo, className: "h-4 w-4 sm:h-5 sm:w-5" },
] as const;

export function AiBrandLogos({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 align-middle ${className}`}
      role="img"
      aria-label="Gemini, ChatGPT e Claude"
    >
      {LOGOS.map(({ name, Logo, className: logoClass }) => (
        <span
          key={name}
          title={name}
          className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white border border-[#08080C]/08 shadow-sm"
        >
          <Logo className={logoClass} />
        </span>
      ))}
    </span>
  );
}
