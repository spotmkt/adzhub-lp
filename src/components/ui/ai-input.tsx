"use client";

import React from "react";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
interface OrbProps {
  dimension?: string;
  className?: string;
  tones?: {
    base?: string;
    accent1?: string;
    accent2?: string;
    accent3?: string;
  };
  spinDuration?: number;
}
const ColorOrb: React.FC<OrbProps> = ({
  dimension = "192px",
  className,
  tones,
  spinDuration = 20
}) => {
  const fallbackTones = {
    base: "oklch(95% 0.02 264.695)",
    accent1: "oklch(75% 0.15 350)",
    accent2: "oklch(80% 0.12 200)",
    accent3: "oklch(78% 0.14 280)"
  };
  const palette = {
    ...fallbackTones,
    ...tones
  };
  const dimValue = parseInt(dimension.replace("px", ""), 10);
  const blurStrength = dimValue < 50 ? Math.max(dimValue * 0.008, 1) : Math.max(dimValue * 0.015, 4);
  const contrastStrength = dimValue < 50 ? Math.max(dimValue * 0.004, 1.2) : Math.max(dimValue * 0.008, 1.5);
  const pixelDot = dimValue < 50 ? Math.max(dimValue * 0.004, 0.05) : Math.max(dimValue * 0.008, 0.1);
  const shadowRange = dimValue < 50 ? Math.max(dimValue * 0.004, 0.5) : Math.max(dimValue * 0.008, 2);
  const maskRadius = dimValue < 30 ? "0%" : dimValue < 50 ? "5%" : dimValue < 100 ? "15%" : "25%";
  const adjustedContrast = dimValue < 30 ? 1.1 : dimValue < 50 ? Math.max(contrastStrength * 1.2, 1.3) : contrastStrength;
  return <div className={cn("color-orb", className)} style={{
    width: dimension,
    height: dimension,
    "--base": palette.base,
    "--accent1": palette.accent1,
    "--accent2": palette.accent2,
    "--accent3": palette.accent3,
    "--spin-duration": `${spinDuration}s`,
    "--blur": `${blurStrength}px`,
    "--contrast": adjustedContrast,
    "--dot": `${pixelDot}px`,
    "--shadow": `${shadowRange}px`,
    "--mask": maskRadius
  } as React.CSSProperties}>
      <style>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .color-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          transform: scale(1.1);
        }

        .color-orb::before,
        .color-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translateZ(0);
        }

        .color-orb::before {
          background:
            conic-gradient(
              from calc(var(--angle) * 2) at 25% 70%,
              var(--accent3),
              transparent 20% 80%,
              var(--accent3)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 45% 75%,
              var(--accent2),
              transparent 30% 60%,
              var(--accent2)
            ),
            conic-gradient(
              from calc(var(--angle) * -3) at 80% 20%,
              var(--accent1),
              transparent 40% 60%,
              var(--accent1)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 15% 5%,
              var(--accent2),
              transparent 10% 90%,
              var(--accent2)
            ),
            conic-gradient(
              from calc(var(--angle) * 1) at 20% 80%,
              var(--accent1),
              transparent 10% 90%,
              var(--accent1)
            ),
            conic-gradient(
              from calc(var(--angle) * -2) at 85% 10%,
              var(--accent3),
              transparent 20% 80%,
              var(--accent3)
            );
          box-shadow: inset var(--base) 0 0 var(--shadow) calc(var(--shadow) * 0.2);
          filter: blur(var(--blur)) contrast(var(--contrast));
          animation: spin var(--spin-duration) linear infinite;
        }

        .color-orb::after {
          background-image: radial-gradient(
            circle at center,
            var(--base) var(--dot),
            transparent var(--dot)
          );
          background-size: calc(var(--dot) * 2) calc(var(--dot) * 2);
          backdrop-filter: blur(calc(var(--blur) * 2)) contrast(calc(var(--contrast) * 2));
          mix-blend-mode: overlay;
        }

        .color-orb[style*="--mask: 0%"]::after {
          mask-image: none;
        }

        .color-orb:not([style*="--mask: 0%"])::after {
          mask-image: radial-gradient(black var(--mask), transparent 75%);
        }

        @keyframes spin {
          to {
            --angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .color-orb::before {
            animation: none;
          }
        }
      `}</style>
    </div>;
};
const SPEED_FACTOR = 1;
interface ContextShape {
  showForm: boolean;
  successFlag: boolean;
  triggerOpen: () => void;
  triggerClose: () => void;
}
const FormContext = React.createContext({} as ContextShape);
const useFormContext = () => React.useContext(FormContext);
export function MorphPanel() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [successFlag, setSuccessFlag] = React.useState(false);
  const triggerClose = React.useCallback(() => {
    setShowForm(false);
    textareaRef.current?.blur();
  }, []);
  const triggerOpen = React.useCallback(() => {
    setShowForm(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }, []);
  const handleSuccess = React.useCallback(() => {
    triggerClose();
    setSuccessFlag(true);
    setTimeout(() => setSuccessFlag(false), 1500);
  }, [triggerClose]);
  React.useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && showForm) {
        triggerClose();
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [showForm, triggerClose]);
  const ctx = React.useMemo(() => ({
    showForm,
    successFlag,
    triggerOpen,
    triggerClose
  }), [showForm, successFlag, triggerOpen, triggerClose]);
  return <div className="fixed bottom-4 right-4 z-50 flex items-center justify-center">
      <motion.div ref={wrapperRef} data-panel className={cx("bg-background relative flex flex-col items-center overflow-hidden border shadow-lg")} initial={false} animate={{
      width: showForm ? FORM_WIDTH : "auto",
      height: showForm ? FORM_HEIGHT : 44,
      borderRadius: showForm ? 14 : 20
    }} transition={{
      type: "spring",
      stiffness: 550 / SPEED_FACTOR,
      damping: 45,
      mass: 0.7,
      delay: showForm ? 0 : 0.08
    }}>
        <FormContext.Provider value={ctx}>
          <DockBar />
          <InputForm ref={textareaRef} onSuccess={handleSuccess} />
        </FormContext.Provider>
      </motion.div>
    </div>;
}
function DockBar() {
  const {
    showForm,
    triggerOpen
  } = useFormContext();
  return <footer className="mt-auto flex h-[44px] items-center justify-center whitespace-nowrap select-none">
      <div className="flex items-center justify-center gap-2 px-3 max-sm:h-10 max-sm:px-2">
        <div className="flex w-fit items-center gap-2">
          <AnimatePresence mode="wait">
            {showForm ? <motion.div key="blank" initial={{
            opacity: 0
          }} animate={{
            opacity: 0
          }} exit={{
            opacity: 0
          }} className="h-5 w-5" /> : <motion.div key="orb" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.2
          }}>
                <ColorOrb dimension="24px" tones={{
              base: "oklch(95% 0.05 330)",
              accent1: "oklch(70% 0.18 50)",
              accent2: "oklch(62% 0.24 280)",
              accent3: "oklch(40% 0.15 265)"
            }} />
              </motion.div>}
          </AnimatePresence>
        </div>

        <Button type="button" className="flex h-fit flex-1 justify-end rounded-full px-2 !py-0.5" variant="ghost" onClick={triggerOpen}>
          <span className="truncate">Respostas rápidas e diretas</span>
        </Button>
      </div>
    </footer>;
}
const FORM_WIDTH = 400;
const FORM_HEIGHT = 320;
interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

function InputForm({
  ref,
  onSuccess
}: {
  ref: React.Ref<HTMLTextAreaElement>;
  onSuccess: () => void;
}) {
  const {
    triggerClose,
    showForm
  } = useFormContext();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sessionId] = React.useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Subscrever às mensagens da conversa
  useEffect(() => {
    if (!sessionId) return;

    let channel: any = null;
    let retryTimeout: any = null;

    // Configurar subscription do Realtime
    const setupRealtimeSubscription = async () => {
      console.log('🔄 Tentando configurar Realtime para session:', sessionId);
      
      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .select('id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar conversa:', error);
        return;
      }

      if (!conversation) {
        console.log('⏳ Conversa ainda não existe, tentando novamente em 2s...');
        retryTimeout = setTimeout(setupRealtimeSubscription, 2000);
        return;
      }

      console.log('✅ Conversa encontrada:', conversation.id);

      // Buscar mensagens existentes
      const { data: msgs } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (msgs && msgs.length > 0) {
        console.log('📨 Carregando', msgs.length, 'mensagens existentes');
        setMessages(msgs as Message[]);
      }

      // Configurar realtime subscription
      console.log('🔔 Configurando Realtime subscription...');
      channel = supabase
        .channel(`ai-messages-${conversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'ai_messages',
            filter: `conversation_id=eq.${conversation.id}`
          },
          (payload) => {
            console.log('✉️ Nova mensagem recebida via Realtime:', payload.new);
            const newMessage = payload.new as Message;
            
            setMessages(prev => {
              // Evitar duplicatas
              if (prev.some(m => m.created_at === newMessage.created_at && m.content === newMessage.content)) {
                return prev;
              }
              return [...prev, newMessage];
            });
            
            if (newMessage.role === 'assistant') {
              setIsLoadingResponse(false);
            }
          }
        )
        .subscribe((status) => {
          console.log('📡 Status do Realtime:', status);
        });

      console.log('✅ Realtime configurado com sucesso!');
    };

    setupRealtimeSubscription();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (channel) {
        console.log('🔌 Desconectando Realtime');
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId]);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    
    if (!message?.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    setIsLoadingResponse(true);
    
    try {
      const page = window.location.pathname;
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: {
          session_id: sessionId,
          page: page,
          message: message.trim(),
          user_id: user?.id || null
        }
      });
      
      if (error) throw error;
      
      // Limpar o textarea
      if (ref && 'current' in ref && ref.current) {
        ref.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao enviar pergunta:', error);
      toast.error('Erro ao enviar pergunta. Tente novamente.');
      setIsLoadingResponse(false);
    } finally {
      setIsSubmitting(false);
    }
  }
  function handleKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") triggerClose();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btnRef.current?.click();
    }
  }
  return <form onSubmit={handleSubmit} className="absolute bottom-0" style={{
    width: FORM_WIDTH,
    height: FORM_HEIGHT,
    pointerEvents: showForm ? "all" : "none"
  }}>
      <AnimatePresence>
        {showForm && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        type: "spring",
        stiffness: 550 / SPEED_FACTOR,
        damping: 45,
        mass: 0.7
      }} className="flex h-full flex-col p-1">
            <div className="flex justify-between py-1">
              <p className="text-foreground z-2 ml-[38px] flex items-center gap-[6px] select-none">Respostas rápidas e diretas</p>
              <button 
                type="submit" 
                ref={btnRef} 
                disabled={isSubmitting}
                className="text-foreground right-4 mt-1 flex -translate-y-[3px] cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-transparent pr-1 text-center select-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <KeyHint className="w-fit">{isSubmitting ? '...' : 'Enter'}</KeyHint>
              </button>
            </div>
            
            {/* Histórico de mensagens */}
            {messages.length > 0 && (
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 mb-2">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "text-sm p-2 rounded",
                      msg.role === 'user' 
                        ? "bg-primary/10 text-foreground ml-8" 
                        : "bg-muted text-foreground mr-8"
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoadingResponse && (
                  <div className="text-sm p-2 rounded bg-muted text-foreground mr-8 animate-pulse">
                    Aguardando resposta...
                  </div>
                )}
              </div>
            )}
            
            <textarea ref={ref} placeholder="Pergunte qualquer coisa..." name="message" className="min-h-[60px] w-full resize-none scroll-py-2 rounded-md p-4 outline-0 bg-muted" required onKeyDown={handleKeys} spellCheck={false} />
          </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="absolute top-2 left-3">
            <ColorOrb dimension="24px" tones={{
          base: "oklch(95% 0.05 330)",
          accent1: "oklch(70% 0.18 50)",
          accent2: "oklch(62% 0.24 280)",
          accent3: "oklch(40% 0.15 265)"
        }} />
          </motion.div>}
      </AnimatePresence>
    </form>;
}
function KeyHint({
  children,
  className
}: {
  children: string;
  className?: string;
}) {
  return <kbd className={cx("text-foreground flex h-6 w-fit items-center justify-center rounded-sm border px-[6px] font-sans", className)}>
      {children}
    </kbd>;
}
export default MorphPanel;