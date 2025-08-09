import React, { useState, useEffect } from 'react';
import { NavigationBar } from '@/components/NavigationBar';
import { Calendar, Clock, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface HistoryAction {
  id: string;
  action_id: string;
  action_type: 'executed' | 'ignored';
  title: string;
  description?: string;
  briefing?: string;
  category?: string;
  priority?: string;
  original_date?: string;
  action_date: string;
}

export default function History() {
  const [actions, setActions] = useState<HistoryAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('action_history')
        .select('*')
        .order('action_date', { ascending: false });

      if (error) throw error;
      setActions((data || []) as HistoryAction[]);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getActionTypeColor = (type: string) => {
    return type === 'executed' 
      ? 'bg-green-500/10 text-green-700 dark:text-green-400'
      : 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
  };

  const filteredActions = actions.filter(action => {
    if (activeTab === 'all') return true;
    return action.action_type === activeTab;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationBar activeItem="history" />
      
      <main className="flex-1 container mx-auto px-4 py-8 ml-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Histórico de Ações
            </h1>
            <p className="text-muted-foreground">
              Visualize o histórico de todas as ações executadas e ignoradas
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="executed">Executadas</TabsTrigger>
              <TabsTrigger value="ignored">Ignoradas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Carregando histórico...</p>
                </div>
              ) : filteredActions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhuma ação encontrada
                    </h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'all' 
                        ? 'Ainda não há ações no histórico'
                        : `Não há ações ${activeTab === 'executed' ? 'executadas' : 'ignoradas'}`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredActions.map((action) => (
                    <Card key={action.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">
                                {action.title}
                              </h3>
                              <Badge className={cn("text-xs", getActionTypeColor(action.action_type))}>
                                {action.action_type === 'executed' ? 'Executada' : 'Ignorada'}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {action.category && (
                                <Badge variant="outline" className="text-xs">
                                  {action.category}
                                </Badge>
                              )}
                              {action.priority && (
                                <Badge className={cn("text-xs", getPriorityColor(action.priority))}>
                                  {action.priority}
                                </Badge>
                              )}
                            </div>

                            {action.description && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {action.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Data original: {action.original_date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Ação em: {formatDate(action.action_date)}</span>
                              </div>
                            </div>
                          </div>

                          {action.briefing && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-4">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Briefing
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>{action.title}</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh] pr-4">
                                  <div className="space-y-4">
                                    {action.description && (
                                      <div>
                                        <h4 className="font-semibold text-sm mb-2">Descrição:</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {action.description}
                                        </p>
                                      </div>
                                    )}
                                    
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2">Briefing:</h4>
                                      <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap text-sm text-foreground bg-muted p-4 rounded-lg">
                                          {action.briefing}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}