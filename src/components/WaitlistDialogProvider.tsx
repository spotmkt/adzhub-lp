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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { pushDataLayer } from "@/lib/gtm";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Phone } from "lucide-react";

type ProfileRole = "marketing" | "entrepreneur";

const WAITLIST_STORAGE_KEY = "adzhub_waitlist_joined";

function formatBrazilianPhone(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }

  digits = digits.slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getBrazilianPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
}

function isValidBrazilianPhone(value: string): boolean {
  const digits = getBrazilianPhoneDigits(value);
  return (
    (digits.length === 10 || digits.length === 11) &&
    !/^(\d)\1+$/.test(digits) &&
    Number(digits.slice(0, 2)) >= 11
  );
}

const fieldAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function readWaitlistJoined(): boolean {
  try {
    return typeof window !== "undefined" && localStorage.getItem(WAITLIST_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWaitlistJoined(): void {
  try {
    localStorage.setItem(WAITLIST_STORAGE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}

type OpenWaitlistOptions = {
  onSuccess?: () => void;
};

type WaitlistContextValue = {
  openWaitlist: (opts?: OpenWaitlistOptions) => void;
  hasJoinedWaitlist: boolean;
};

const WaitlistContext = React.createContext<WaitlistContextValue | null>(null);

export function useWaitlistDialog(): WaitlistContextValue {
  const ctx = React.useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlistDialog must be used within WaitlistDialogProvider");
  }
  return ctx;
}

const ROLE_LABEL: Record<ProfileRole, string> = {
  marketing: "Profissional de marketing",
  entrepreneur: "Empresário(a)",
};

export function WaitlistDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState<ProfileRole | "">("");
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = React.useState(false);
  const onSuccessRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    setHasJoinedWaitlist(readWaitlistJoined());
  }, []);

  const resetForm = React.useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setRole("");
  }, []);

  const openWaitlist = React.useCallback((opts?: OpenWaitlistOptions) => {
    onSuccessRef.current = opts?.onSuccess ?? null;
    setSubmitted(false);
    setOpen(true);
  }, []);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (submitting) return;
      setOpen(next);
      if (!next) {
        setSubmitted(false);
        resetForm();
        onSuccessRef.current = null;
      }
    },
    [resetForm, submitting]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmed = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedSite = company.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

    if (!trimmedName) {
      toast.error("Informe seu nome.");
      return;
    }
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    const phoneDigits = getBrazilianPhoneDigits(trimmedPhone);
    if (!isValidBrazilianPhone(trimmedPhone)) {
      toast.error("Informe um telefone válido (com DDD).");
      return;
    }
    if (!role) {
      toast.error("Selecione se você é profissional de marketing ou empresário(a).");
      return;
    }
    if (role === "entrepreneur" && (!trimmedSite || !trimmedSite.includes("."))) {
      toast.error("Informe o site da empresa (ex.: empresa.com.br).");
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: trimmedName,
          email: trimmed,
          telefone: `+55${phoneDigits}`,
          role,
          site: role === "entrepreneur" ? trimmedSite : "",
          pagePath: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      const raw = await resp.text();
      let data: { ok?: boolean; message?: string } = {};
      try {
        data = JSON.parse(raw) as { ok?: boolean; message?: string };
      } catch {
        toast.error(
          resp.status === 405 || resp.status === 404
            ? "API de lista de espera ainda não está no ar. Faça o deploy e tente de novo."
            : "Não conseguimos concluir o envio agora. Tente novamente.",
        );
        return;
      }
      if (!resp.ok || !data.ok) {
        toast.error(data.message || "Não conseguimos concluir o envio agora. Tente novamente.");
        return;
      }
      markWaitlistJoined();
      setHasJoinedWaitlist(true);
      pushDataLayer({
        event: "waitlist_submit",
        form_name: "lista_espera",
        form_id: "waitlist",
        page_path: typeof window !== "undefined" ? window.location.pathname : "",
        role: role || undefined,
      });
      const after = onSuccessRef.current;
      onSuccessRef.current = null;
      setSubmitted(true);
      resetForm();
      after?.();
    } catch {
      toast.error("Não conseguimos concluir o envio agora. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const value = React.useMemo(
    () => ({ openWaitlist, hasJoinedWaitlist }),
    [openWaitlist, hasJoinedWaitlist],
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="vagas-modal-scroll max-h-[calc(100dvh-2rem)] max-w-[min(100vw-2rem,26rem)] overflow-y-auto overscroll-contain rounded-3xl border-[#37489d]/15 bg-white p-0 shadow-2xl sm:max-w-md sm:rounded-3xl">
          <div className="relative overflow-hidden rounded-t-lg bg-white px-6 pb-5 pt-6">
            <DialogHeader className="relative space-y-2 pr-6 text-left">
            <DialogTitle className="text-xl font-semibold text-[#37489d] sm:text-2xl">
              Lista de espera
            </DialogTitle>
            <p className="max-w-sm text-sm leading-relaxed text-[#37489d]/70">
              Seja um dos primeiros a transformar sua operação de marketing com a AdzHub.
            </p>
            <DialogDescription className="sr-only">
              Formulário de inscrição na lista de espera da plataforma AdzHub.
            </DialogDescription>
            </DialogHeader>
          </div>

          <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="waitlist-success"
              role="status"
              aria-live="polite"
              className="p-6 pt-2"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="rounded-2xl border border-[#37489d]/20 bg-white px-6 py-10 text-center">
                <motion.div
                  initial={{ scale: 0.45, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#37489d]/10"
                >
                  <Check className="h-7 w-7 text-[#37489d]" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-[#08080C]">
                  Recebemos seu interesse!
                </h3>
                <p className="text-sm leading-relaxed text-[#6B7280]">
                  Sua solicitação foi enviada para o nosso time. Avisaremos você assim que o acesso
                  estiver disponível.
                </p>
                <Button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="mt-7 w-full rounded-xl bg-[#37489d] text-white transition-colors hover:bg-[#37489d]/90"
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          ) : (
          <motion.form
            key="waitlist-form"
            onSubmit={handleSubmit}
            className="space-y-4 p-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
          >
            <motion.div variants={fieldAnimation} className="space-y-2">
              <Label htmlFor="waitlist-name" className="text-[#37489d]">
                Nome
              </Label>
              <Input
                id="waitlist-name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="Seu nome"
                className="border-[#37489d]/20"
                autoComplete="name"
                required
                disabled={submitting}
              />
            </motion.div>

            <motion.div variants={fieldAnimation} className="space-y-2">
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
                disabled={submitting}
              />
            </motion.div>

            <motion.div variants={fieldAnimation} className="space-y-2">
              <Label htmlFor="waitlist-phone" className="text-[#37489d]">
                WhatsApp
              </Label>
              <div className="flex h-10 overflow-hidden rounded-md border border-[#37489d]/20 bg-white transition-all focus-within:border-[#37489d]/50 focus-within:ring-2 focus-within:ring-[#37489d]/10">
                <div className="flex shrink-0 items-center gap-2 border-r border-[#37489d]/15 bg-[#37489d]/[0.04] px-3 text-sm text-[#37489d]">
                  <span aria-hidden>🇧🇷</span>
                  <span className="font-medium">+55</span>
                </div>
                <div className="relative min-w-0 flex-1">
                  <Phone
                    aria-hidden
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#37489d]/45"
                  />
                  <Input
                    id="waitlist-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(ev) => setPhone(formatBrazilianPhone(ev.target.value))}
                    placeholder="(11) 99999-9999"
                    className="h-full border-0 pl-9 shadow-none focus-visible:ring-0"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={15}
                    disabled={submitting}
                    aria-describedby="waitlist-phone-hint"
                  />
                </div>
              </div>
              <p id="waitlist-phone-hint" className="text-xs text-[#37489d]/60">
                Usaremos este número apenas para falar sobre seu acesso.
              </p>
            </motion.div>

            <motion.fieldset
              variants={fieldAnimation}
              className="space-y-3 rounded-xl border border-[#37489d]/12 bg-[#37489d]/[0.04] p-3"
            >
              <legend className="px-1 text-sm font-medium text-[#08080C]">Eu sou</legend>
              <RadioGroup
                value={role || undefined}
                onValueChange={(v) => {
                  const next = v as ProfileRole;
                  setRole(next);
                  if (next !== "entrepreneur") setCompany("");
                }}
                className="gap-3"
                disabled={submitting}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="marketing" id="waitlist-role-marketing" />
                  <Label htmlFor="waitlist-role-marketing" className="font-normal cursor-pointer text-[#37489d]">
                    {ROLE_LABEL.marketing}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="entrepreneur" id="waitlist-role-entrepreneur" />
                  <Label htmlFor="waitlist-role-entrepreneur" className="font-normal cursor-pointer text-[#37489d]">
                    {ROLE_LABEL.entrepreneur}
                  </Label>
                </div>
              </RadioGroup>
            </motion.fieldset>

            <AnimatePresence initial={false}>
              {role === "entrepreneur" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                {/* padding evita o clipping do focus ring pelo overflow-hidden da animação */}
                <div className="space-y-2 p-1">
                  <Label htmlFor="waitlist-company" className="text-[#37489d]">
                    Site da empresa
                  </Label>
                  <Input
                    id="waitlist-company"
                    type="text"
                    required
                    value={company}
                    onChange={(ev) => setCompany(ev.target.value)}
                    placeholder="empresa.com.br"
                    className="border-[#37489d]/20"
                    autoComplete="url"
                    inputMode="url"
                    disabled={submitting}
                  />
                </div>
              </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={fieldAnimation}>
              <Button
              type="submit"
              disabled={submitting}
              className="group w-full rounded-xl bg-[#37489d] text-white transition-colors hover:bg-[#37489d]/90"
            >
              <AnimatePresence mode="wait" initial={false}>
                {submitting ? (
                  <motion.span
                    key="submitting"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando solicitação…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2"
                  >
                    Quero entrar na lista
                    <Check className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </motion.span>
                )}
              </AnimatePresence>
              </Button>
            </motion.div>
          </motion.form>
          )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </WaitlistContext.Provider>
  );
}
