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
      setOpen(next);
      if (!next) resetForm();
    },
    [resetForm]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmed = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedCompany = company.trim();

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
    if (!trimmedCompany) {
      toast.error("Informe o nome da empresa.");
      return;
    }

    const lines = [
      "Olá, equipe AdzHub —",
      "",
      "Quero entrar na lista de espera da plataforma.",
      "",
      `Nome: ${trimmedName}`,
      `E-mail: ${trimmed}`,
      `Telefone: ${trimmedPhone}`,
      `Perfil: ${ROLE_LABEL[role]}`,
      `Empresa: ${trimmedCompany}`,
    ];
    lines.push("", "Obrigado!");

    const body = encodeURIComponent(lines.join("\n"));
    const subject = encodeURIComponent("Lista de espera — AdzHub");
    window.location.href = `mailto:team@adzhub.com.br?subject=${subject}&body=${body}`;
    toast.success("Abrimos seu app de e-mail com a mensagem pronta. É só enviar.");
    handleOpenChange(false);
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
              />
            </div>

            <fieldset className="space-y-3 rounded-xl border border-[#37489d]/12 bg-[#37489d]/[0.04] p-3">
              <legend className="px-1 text-sm font-medium text-[#08080C]">Eu sou</legend>
              <RadioGroup
                value={role || undefined}
                onValueChange={(v) => setRole(v as ProfileRole)}
                className="gap-3"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="marketing" id="waitlist-role-marketing" />
                  <Label htmlFor="waitlist-role-marketing" className="font-normal cursor-pointer text-[#37489d]">
                    Profissional de marketing
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="entrepreneur" id="waitlist-role-entrepreneur" />
                  <Label htmlFor="waitlist-role-entrepreneur" className="font-normal cursor-pointer text-[#37489d]">
                    Empresário(a)
                  </Label>
                </div>
              </RadioGroup>
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="waitlist-company" className="text-[#37489d]">
                Nome da empresa
              </Label>
              <Input
                id="waitlist-company"
                required
                value={company}
                onChange={(ev) => setCompany(ev.target.value)}
                placeholder="Nome fantasia ou razão social"
                className="border-[#37489d]/20"
                autoComplete="organization"
              />
            </div>

            <Button type="submit" className="w-full rounded-xl bg-[#37489d] hover:bg-[#37489d]/90 text-white">
              Enviar solicitação
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </WaitlistContext.Provider>
  );
}
