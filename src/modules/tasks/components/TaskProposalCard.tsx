import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, Flag, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Subtask {
  name: string;
  content: string;
  assignees: (string | number)[];
  start_date_ts: number;
  due_date_ts: number;
  priority: number;
}

interface ParentTask {
  name: string;
  content: string;
  assignees: (string | number)[];
  start_date_ts: number;
  due_date_ts: number;
  priority: number;
}

interface TaskProposal {
  id: string;
  request_id: string;
  card_type: string;
  parent_task: ParentTask;
  subtasks: Subtask[];
  created_at: string;
}

interface TaskProposalCardProps {
  proposal: TaskProposal;
}

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1: return { label: 'Alta', color: 'bg-red-500' };
    case 2: return { label: 'Média', color: 'bg-yellow-500' };
    case 3: return { label: 'Baixa', color: 'bg-green-500' };
    default: return { label: 'Média', color: 'bg-yellow-500' };
  }
};

const formatDate = (timestamp: number) => {
  if (timestamp === 0) return 'Não definido';
  return format(new Date(timestamp * 1000), 'dd/MM/yyyy');
};

export const TaskProposalCard = ({ proposal }: TaskProposalCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { parent_task, subtasks, request_id } = proposal;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg mb-2">{parent_task.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {request_id}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(true)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Tarefas Geradas ({subtasks.length})
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{parent_task.name}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 text-sm mt-2">
                <Badge className={`${getPriorityLabel(parent_task.priority).color} text-white`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {getPriorityLabel(parent_task.priority).label}
                </Badge>
                {parent_task.assignees.length > 0 && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{parent_task.assignees.join(', ')}</span>
                  </div>
                )}
                {parent_task.due_date_ts > 0 && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(parent_task.due_date_ts)}</span>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Prompt da Solicitação:</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {request_id}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Descrição:</h4>
              <p className="text-sm text-muted-foreground">{parent_task.content}</p>
            </div>
            
            {subtasks.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-3">Subtarefas ({subtasks.length})</h4>
                <div className="space-y-3">
                  {subtasks.map((subtask, index) => {
                    const subPriorityInfo = getPriorityLabel(subtask.priority);
                    return (
                      <div key={index} className="border-l-2 border-primary pl-4 py-3 bg-muted/30 rounded-r-md">
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="font-medium text-sm">{subtask.name}</h5>
                          <Badge variant="outline" className={`${subPriorityInfo.color} text-white text-xs`}>
                            {subPriorityInfo.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{subtask.content}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          {subtask.assignees.length > 0 && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{subtask.assignees.join(', ')}</span>
                            </div>
                          )}
                          {subtask.due_date_ts > 0 && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(subtask.due_date_ts)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};