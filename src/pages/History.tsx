import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActionHistoryItem {
  id: string;
  action_id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  action_type: 'executed' | 'ignored';
  action_date: string;
  original_date: string;
  created_at: string;
}

const History = () => {
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todas');

  const priorityColors = {
    low: 'secondary',
    medium: 'default', 
    high: 'destructive'
  } as const;

  const actionTypeColors = {
    executed: 'default',
    ignored: 'secondary'
  } as const;

  const actionTypeLabels = {
    executed: 'Executada',
    ignored: 'Ignorada'
  } as const;

  useEffect(() => {
    const clientId = localStorage.getItem('selectedClientId');
    if (clientId) {
      // Validate clientId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(clientId)) {
        setSelectedClient(clientId);
      } else {
        console.error('Invalid UUID format:', clientId);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchActionHistory();
    }
  }, [selectedClient]);

  const fetchActionHistory = async () => {
    if (!selectedClient) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('action_history')
        .select('*')
        .eq('client_id', selectedClient)
        .order('action_date', { ascending: false });

      if (error) throw error;

      setActionHistory((data || []) as ActionHistoryItem[]);
    } catch (error) {
      console.error('Error fetching action history:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico de ações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum cliente selecionado</h3>
          <p className="text-muted-foreground">
            Selecione um cliente no ícone de perfil para visualizar o histórico.
          </p>
        </div>
      </div>
    );
  }

  const filteredHistory = actionHistory.filter(action => {
    if (activeTab === 'todas') return true;
    if (activeTab === 'executadas') return action.action_type === 'executed';
    if (activeTab === 'ignoradas') return action.action_type === 'ignored';
    return true;
  });

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Histórico de Ações</h1>
            <p className="text-muted-foreground mt-1">
              Visualize o histórico de todas as ações executadas e ignoradas
            </p>
          </div>
          {filteredHistory.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {filteredHistory.length} ações
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="executadas">Executadas</TabsTrigger>
            <TabsTrigger value="ignoradas">Ignoradas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {filteredHistory.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma ação encontrada</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'todas' 
                        ? 'Não há ações no histórico ainda.'
                        : `Não há ações ${activeTab} no histórico.`
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((action) => (
                  <Card key={action.id} className="w-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{action.title}</CardTitle>
                            <Badge variant={actionTypeColors[action.action_type]}>
                              {actionTypeLabels[action.action_type]}
                            </Badge>
                            <Badge variant={priorityColors[action.priority]}>
                              {action.priority.toUpperCase()}
                            </Badge>
                          </div>
                          {action.category && (
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-sm text-muted-foreground font-medium">
                                {action.category}
                              </span>
                            </div>
                          )}
                          <CardDescription className="text-base">
                            {action.description || 'Descrição da tarefa'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Data original: {action.original_date || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Ação em: {format(new Date(action.action_date), 'dd/MM/yyyy, HH:mm:ss', { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;