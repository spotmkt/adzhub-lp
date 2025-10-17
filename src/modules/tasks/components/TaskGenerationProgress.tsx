import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SessionStatus } from '../hooks/useTaskGenerationFlow';

interface TaskGenerationProgressProps {
  status: SessionStatus;
}

const steps = [
  { id: 'processing', label: 'Analisando contexto' },
  { id: 'awaiting_context', label: 'Coletando informações' },
  { id: 'processing_context', label: 'Gerando tarefas' },
  { id: 'awaiting_review', label: 'Aguardando revisão' },
  { id: 'completed', label: 'Concluído' },
];

export const TaskGenerationProgress = ({ status }: TaskGenerationProgressProps) => {
  // Não mostrar se estiver idle ou com erro
  if (status === 'idle' || status === 'error' || status === 'cancelled') {
    return null;
  }

  const getStepIndex = (stepId: string) => {
    return steps.findIndex((s) => s.id === stepId);
  };

  const currentStepIndex = getStepIndex(status);

  const getStepStatus = (index: number) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="mb-8 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                {/* Ícone do step */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                    {
                      'border-primary bg-primary text-primary-foreground':
                        stepStatus === 'completed',
                      'border-primary bg-background': stepStatus === 'current',
                      'border-muted bg-background text-muted-foreground':
                        stepStatus === 'upcoming',
                    }
                  )}
                >
                  {stepStatus === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                  {stepStatus === 'current' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  {stepStatus === 'upcoming' && <Circle className="h-4 w-4" />}
                </div>

                {/* Label do step */}
                <span
                  className={cn('text-xs text-center whitespace-nowrap', {
                    'text-foreground font-medium': stepStatus === 'current',
                    'text-muted-foreground': stepStatus !== 'current',
                  })}
                >
                  {step.label}
                </span>
              </div>

              {/* Linha conectora */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 transition-colors',
                    stepStatus === 'completed' ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};