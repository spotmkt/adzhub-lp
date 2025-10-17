import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TaskProposalCard } from '../components/TaskProposalCard';
import { Skeleton } from '@/components/ui/skeleton';

const TaskHistory = () => {
  const [taskProposals, setTaskProposals] = useState<any[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTaskProposals();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProposals(taskProposals);
    } else {
      const filtered = taskProposals.filter(proposal => {
        const searchLower = searchTerm.toLowerCase();
        const parentTask = proposal.parent_task?.toLowerCase() || '';
        const requestId = proposal.request_id?.toLowerCase() || '';
        const subtasksText = JSON.stringify(proposal.subtasks || []).toLowerCase();
        
        return parentTask.includes(searchLower) || 
               requestId.includes(searchLower) ||
               subtasksText.includes(searchLower);
      });
      setFilteredProposals(filtered);
    }
  }, [searchTerm, taskProposals]);

  const loadTaskProposals = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('task_proposals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading task proposals:', error);
    } else {
      setTaskProposals(data || []);
      setFilteredProposals(data || []);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/apps/tasks/generator')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Histórico de Solicitações</h1>
                <p className="text-muted-foreground mt-1">
                  Todas as tarefas geradas pelo sistema
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pesquisar</CardTitle>
            <CardDescription>
              Encontre tarefas por título, ID ou conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                {filteredProposals.length} resultado(s) encontrado(s)
              </p>
            )}
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProposals.length > 0 ? (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => (
              <TaskProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa gerada ainda'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Tente ajustar os termos da sua busca'
                  : 'As tarefas geradas aparecerão aqui'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/apps/tasks/generator')}>
                  Criar Nova Tarefa
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
