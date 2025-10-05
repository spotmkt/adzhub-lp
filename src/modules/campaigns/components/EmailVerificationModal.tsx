import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const EmailVerificationModal = ({ isOpen, onClose, email }: EmailVerificationModalProps) => {
  const [isResending, setIsResending] = useState(false);
  const [emailSend, setEmailSend] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Erro ao reenviar email",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setEmailSend(true);
        toast({
          title: "Email reenviado",
          description: "Verifique sua caixa de entrada e spam.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Verificação de Email
          </DialogTitle>
          <DialogDescription>
            Enviamos um email de confirmação para seu endereço. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            Email enviado para: <strong>{email}</strong>
          </div>
          
          <div className="text-sm text-center text-muted-foreground">
            Não recebeu o email? Verifique sua pasta de spam ou reenvie uma nova confirmação.
          </div>
          
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending}
              className="flex-1"
            >
              {isResending ? "Reenviando..." : "Reenviar Email"}
            </Button>
            
            <Button
              variant="default"
              onClick={onClose}
              className="flex-1"
            >
              Entendi
            </Button>
          </div>
          
          {emailSend && (
            <div className="text-sm text-green-600 text-center">
              ✓ Email reenviado com sucesso!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
