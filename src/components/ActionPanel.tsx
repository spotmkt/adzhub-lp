import { Calendar, Clock, Star, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActionCard {
  id: string;
  title: string;
  description: string;
  briefing?: string;
  date: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface ActionPanelProps {
  actions?: ActionCard[];
  onExecute?: (actionId: string) => void;
  onEdit?: (actionId: string) => void;
  onIgnore?: (actionId: string) => void;
  onView?: (actionId: string) => void;
  onBack?: () => void;
}

const defaultActions: ActionCard[] = [
  {
    id: '1',
    title: 'Revisar proposta de design',
    description: 'Analisar e fornecer feedback sobre o novo conceito visual para o projeto X.',
    date: '10/12/2024',
    priority: 'high',
    category: 'Design'
  },
  {
    id: '2',
    title: 'Planejar sessão de brainstorm',
    description: 'Organizar reunião criativa para definir direcionamento da campanha.',
    date: '12/12/2024',
    priority: 'medium',
    category: 'Planejamento'
  },
  {
    id: '3',
    title: 'Pesquisar tendências',
    description: 'Investigar novas tendências em design gráfico e UX para 2025.',
    date: '15/12/2024',
    priority: 'low',
    category: 'Pesquisa'
  }
];

export const ActionPanel = ({ 
  actions = defaultActions, 
  onExecute, 
  onEdit, 
  onIgnore,
  onView,
  onBack 
}: ActionPanelProps) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full lg:w-80 bg-action-panel border-l border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-8 w-8 lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h2 className="text-base font-semibold text-foreground">Hoje</h2>
          </div>
          <Badge variant="secondary" className="text-xs">
            {actions.length} ações
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Ações recomendadas pela IA
        </p>
      </div>

      {/* Actions List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "bg-action-card border border-border rounded-lg p-3",
                "hover:bg-action-card-hover transition-all duration-300",
                "hover:shadow-glow hover:border-primary/20"
              )}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-xs leading-tight">
                    {action.title}
                  </h3>
                  {action.category && (
                    <Badge 
                      variant="outline" 
                      className="mt-1 text-[10px] px-1.5 py-0.5 h-auto border-border"
                    >
                      {action.category}
                    </Badge>
                  )}
                </div>
                {action.priority && (
                  <Badge 
                    className={cn(
                      "text-[10px] ml-2 flex-shrink-0 px-1.5 py-0.5 h-auto",
                      getPriorityColor(action.priority)
                    )}
                  >
                    {action.priority}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                {action.description}
              </p>

              {/* Date */}
              <div className="flex items-center text-[10px] text-muted-foreground mb-3">
                <Calendar className="h-2.5 w-2.5 mr-1" />
                <span>{action.date}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5">
                <div className="flex space-x-1.5">
                  <Button
                    size="sm"
                    onClick={() => onExecute?.(action.id)}
                    className="flex-1 h-6 text-[10px] bg-primary hover:bg-primary/90"
                  >
                    Executar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.(action.id)}
                    className="h-6 px-2 text-[10px] border-border hover:bg-muted"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onIgnore?.(action.id)}
                    className="h-6 px-2 text-[10px] hover:bg-muted"
                  >
                    Ignorar
                  </Button>
                </div>
                {action.briefing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onView?.(action.id)}
                    className="w-full h-6 text-[10px]"
                  >
                    <Eye className="h-2.5 w-2.5 mr-1" />
                    Ver Briefing
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};