import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_REF_KEY = "adzhub_waitlist_ref";
const SESSION_INVITER_KEY = "adzhub_waitlist_inviter";

function randomRefSegment(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function getOrCreateReferralCode(): string {
  try {
    const existing = localStorage.getItem(STORAGE_REF_KEY);
    if (existing && existing.length >= 6) return existing;
    const next = randomRefSegment();
    localStorage.setItem(STORAGE_REF_KEY, next);
    return next;
  } catch {
    return randomRefSegment();
  }
}

function captureInviterFromUrl(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref")?.trim();
    if (ref && /^[a-z0-9]{6,12}$/i.test(ref)) {
      sessionStorage.setItem(SESSION_INVITER_KEY, ref.toLowerCase());
    }
  } catch {
    /* ignore */
  }
}

function getSessionInviter(): string | null {
  try {
    return sessionStorage.getItem(SESSION_INVITER_KEY);
  } catch {
    return null;
  }
}

type WaitlistContextValue = {
  openWaitlist: () => void;
};

const WaitlistContext = React.createContext<WaitlistContextValue | null>(null);

export function useWaitlistDialog(): WaitlistContextValue {
  const ctx = React.useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlistDialog must be used within WaitlistDialogProvider");
  }
  return ctx;
}

export function WaitlistDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [referralCode, setReferralCode] = React.useState("");
  const [referralUrl, setReferralUrl] = React.useState("");

  React.useEffect(() => {
    captureInviterFromUrl();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const code = getOrCreateReferralCode();
    setReferralCode(code);
    const origin = window.location.origin;
    setReferralUrl(`${origin}/?ref=${code}`);
  }, [open]);

  const openWaitlist = React.useCallback(() => setOpen(true), []);

  const handleRequestInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    const inviter = getSessionInviter();
    const lines = [
      "Olá, equipe AdzHub —",
      "",
      "Quero solicitar um convite para a plataforma (lista de espera).",
      "",
      `Nome: ${name.trim() || "(não informado)"}`,
      `E-mail: ${trimmed}`,
      `Meu código de indicação (se gerado neste dispositivo): ${referralCode}`,
    ];
    if (inviter) {
      lines.push("", `Fui indicado pelo código: ${inviter}`);
    }
    lines.push("", "Obrigado!");
    const body = encodeURIComponent(lines.join("\n"));
    const subject = encodeURIComponent("Lista de espera — solicitação de convite AdzHub");
    window.location.href = `mailto:contato@adzhub.com.br?subject=${subject}&body=${body}`;
    toast.success("Abrimos seu app de e-mail com a mensagem pronta. É só enviar.");
  };

  const handleCopyLink = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      toast.success("Link copiado. Compartilhe com quem pode se beneficiar da AdzHub.");
    } catch {
      toast.error("Não foi possível copiar. Selecione o link e copie manualmente.");
    }
  };

  const handleShare = async () => {
    if (!referralUrl) return;
    const shareData = {
      title: "AdzHub — lista de espera",
      text: "Entre na lista de espera da AdzHub com meu link — plataforma de marketing para PMEs.",
      url: referralUrl,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      /* fall through */
    }
    handleCopyLink();
  };

  const value = React.useMemo(() => ({ openWaitlist }), [openWaitlist]);

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(100vw-2rem,28rem)] sm:max-w-lg max-h-[min(90vh,640px)] overflow-y-auto border-[#37489d]/15 bg-white">
          <DialogHeader className="text-left space-y-2 pr-6">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#37489d]">
              Estamos em lista de espera
            </DialogTitle>
            <DialogDescription className="text-[#4B5563] text-sm leading-relaxed">
              Liberamos acesso em ondas. Peça um convite com seu e-mail e{" "}
              <strong className="font-medium text-[#37489d]">suba de prioridade indicando amigos</strong> — no mesmo
              modelo usado por produtos como o Langflow: quanto mais gente entra pela sua indicação, mais cedo você pode
              ser chamado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <form onSubmit={handleRequestInvite} className="space-y-4 rounded-2xl border border-[#37489d]/12 bg-[#37489d]/[0.04] p-4">
              <p className="text-sm font-medium text-[#08080C]">Solicitar convite</p>
              <div className="space-y-2">
                <Label htmlFor="waitlist-name" className="text-[#37489d]">
                  Nome (opcional)
                </Label>
                <Input
                  id="waitlist-name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder="Como podemos te chamar?"
                  className="border-[#37489d]/20"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waitlist-email" className="text-[#37489d]">
                  E-mail
                </Label>
                <Input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="voce@empresa.com.br"
                  className="border-[#37489d]/20"
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-[#37489d] hover:bg-[#37489d]/90 text-white"
              >
                Enviar solicitação por e-mail
              </Button>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Abriremos seu cliente de e-mail com uma mensagem pronta para contato@adzhub.com.br. Nada é salvo neste site
                até integrarmos o cadastro automático.
              </p>
            </form>

            <div className="space-y-3 rounded-2xl border border-[#08080C]/10 bg-[#FAFAFA] p-4">
              <p className="text-sm font-medium text-[#08080C] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#37489d]" aria-hidden />
                Convidar amigos
              </p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Compartilhe seu link exclusivo. Quem se cadastrar na lista usando esse link contará como sua indicação
                quando validarmos os convites —{" "}
                <span className="font-medium text-[#08080C]">quem indicar mais, entra antes</span>.
              </p>
              <div className="rounded-xl bg-white border border-[#08080C]/8 p-3">
                <p className="text-[10px] uppercase tracking-wide text-[#6B7280] mb-1">Seu link</p>
                <p className="text-xs font-mono text-[#37489d] break-all">{referralUrl || "…"}</p>
                <p className="text-[10px] text-[#6B7280] mt-2">Código: {referralCode || "…"}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl border-[#37489d]/30 text-[#37489d] hover:bg-[#37489d]/5"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                  Copiar link
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 rounded-xl bg-[#37489d]/10 text-[#37489d] hover:bg-[#37489d]/15"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </div>
              <ul className="text-xs text-[#6B7280] space-y-1.5 list-disc pl-4">
                <li>
                  <span className="text-[#08080C] font-medium">1 indicação válida:</span> prioridade na fila.
                </li>
                <li>
                  <span className="text-[#08080C] font-medium">3 indicações:</span> grupo com acesso antecipado ao beta.
                </li>
                <li>
                  <span className="text-[#08080C] font-medium">5 ou mais:</span> convite para sessões fechadas com o time.
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </WaitlistContext.Provider>
  );
}
