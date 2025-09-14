import { Calendar, Clock, Star, Eye, ArrowLeft, FileText, CheckCircle, XCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ActionPanelSkeleton } from '@/components/ui/skeleton-screens';

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
  contentIdeasCount?: number;
  loading?: boolean;
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
  contentIdeasCount = 0,
  loading = false,
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

  if (loading) {
    return <ActionPanelSkeleton />;
  }

  return (
    <div className="w-full lg:w-80 bg-card border-l border-border flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ações recomendadas pela IA</h2>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* History Link */}
        <Link to="/history">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <History className="h-4 w-4 mr-2" />
            Ver Histórico de Ações
          </Button>
        </Link>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {/* Content Ideas Notification */}
          {contentIdeasCount > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Ideias de Conteúdo</CardTitle>
                  </div>
                  <Badge variant="secondary">{contentIdeasCount}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-3">
                  {contentIdeasCount === 1 
                    ? 'Nova big idea pendente de aprovação'
                    : `${contentIdeasCount} big ideas pendentes de aprovação`
                  }
                </CardDescription>
                <Link to="/content">
                  <Button size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-1" />
                    Revisar Ideias
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Regular Actions */}
          {actions.length === 0 && contentIdeasCount === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma ação pendente</h3>
              <p className="text-muted-foreground text-sm">
                Suas ações recomendadas aparecerão aqui
              </p>
            </div>
          ) : (
            actions.map((action) => (
              <div key={action.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                  {action.priority && (
                    <Badge className={cn("text-xs ml-2", getPriorityColor(action.priority))}>
                      {action.priority.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {action.category && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {action.category}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {action.date}
                  </div>
                </div>

                <div className="flex gap-2">
                  {onView && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onView(action.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  )}
                  {onIgnore && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => onIgnore(action.id)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Ignorar
                    </Button>
                  )}
                  {onExecute && (
                    <Button 
                      size="sm"
                      onClick={() => onExecute(action.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Executar
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};