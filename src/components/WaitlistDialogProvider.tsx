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

type ProfileRole = "marketing" | "entrepreneur";

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

const ROLE_LABEL: Record<ProfileRole, string> = {
  marketing: "Profissional de marketing",
  entrepreneur: "Empresário(a)",
};

export function WaitlistDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState<ProfileRole | "">("");

  const resetForm = React.useCallback(() => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setRole("");
  }, []);

  const openWaitlist = React.useCallback(() => setOpen(true), []);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (submitting) return;
      setOpen(next);
      if (!next) resetForm();
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
    const digits = trimmedPhone.replace(/\D/g, "");
    if (digits.length < 10) {
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
          telefone: trimmedPhone,
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
      toast.success(data.message || "Solicitação enviada!");
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Não conseguimos concluir o envio agora. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const value = React.useMemo(() => ({ openWaitlist }), [openWaitlist]);

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[min(100vw-2rem,26rem)] sm:max-w-md border-[#37489d]/15 bg-white">
          <DialogHeader className="text-left space-y-2 pr-6">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#37489d]">
              Lista de espera
            </DialogTitle>
            <DialogDescription className="sr-only">
              Formulário de inscrição na lista de espera da plataforma AdzHub.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="waitlist-name" className="text-[#37489d]">
                Nome
              </Label>
              <Input
                id="waitlist-name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="Seu nome completo"
                className="border-[#37489d]/20"
                autoComplete="name"
                required
                disabled={submitting}
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
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waitlist-phone" className="text-[#37489d]">
                Telefone
              </Label>
              <Input
                id="waitlist-phone"
                type="tel"
                required
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                placeholder="(11) 99999-9999"
                className="border-[#37489d]/20"
                autoComplete="tel"
                disabled={submitting}
              />
            </div>

            <fieldset className="space-y-3 rounded-xl border border-[#37489d]/12 bg-[#37489d]/[0.04] p-3">
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
            </fieldset>

            {role === "entrepreneur" && (
              <div className="space-y-2">
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
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#37489d] hover:bg-[#37489d]/90 text-white"
            >
              {submitting ? "Enviando…" : "Enviar solicitação"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </WaitlistContext.Provider>
  );
}
