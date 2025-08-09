import { Calendar, Clock, Star, Eye } from 'lucide-react';
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
  onView 
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
    <div className="w-80 bg-action-panel border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Hoje</h2>
          <Badge variant="secondary" className="text-xs">
            {actions.length} ações
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Ações recomendadas pela IA
        </p>
      </div>

      {/* Actions List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className={cn(
                "bg-action-card border border-border rounded-xl p-4",
                "hover:bg-action-card-hover transition-all duration-300",
                "hover:shadow-glow hover:border-primary/20"
              )}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm leading-snug">
                    {action.title}
                  </h3>
                  {action.category && (
                    <Badge 
                      variant="outline" 
                      className="mt-2 text-xs border-border"
                    >
                      {action.category}
                    </Badge>
                  )}
                </div>
                {action.priority && (
                  <Badge 
                    className={cn(
                      "text-xs ml-2 flex-shrink-0",
                      getPriorityColor(action.priority)
                    )}
                  >
                    {action.priority}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {action.description}
              </p>

              {/* Date */}
              <div className="flex items-center text-xs text-muted-foreground mb-4">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{action.date}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => onExecute?.(action.id)}
                    className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90"
                  >
                    Executar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.(action.id)}
                    className="h-8 px-3 text-xs border-border hover:bg-muted"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onIgnore?.(action.id)}
                    className="h-8 px-3 text-xs hover:bg-muted"
                  >
                    Ignorar
                  </Button>
                </div>
                {action.briefing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onView?.(action.id)}
                    className="w-full h-8 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
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