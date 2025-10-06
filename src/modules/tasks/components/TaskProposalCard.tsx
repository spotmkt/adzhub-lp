import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Flag } from 'lucide-react';
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
  const { parent_task, subtasks } = proposal;
  const priorityInfo = getPriorityLabel(parent_task.priority);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{parent_task.name}</CardTitle>
            <CardDescription className="text-sm">{parent_task.content}</CardDescription>
          </div>
          <Badge className={`${priorityInfo.color} text-white`}>
            <Flag className="h-3 w-3 mr-1" />
            {priorityInfo.label}
          </Badge>
        </div>
        
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          {parent_task.assignees.length > 0 && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{parent_task.assignees.join(', ')}</span>
            </div>
          )}
          {parent_task.due_date_ts > 0 && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Prazo: {formatDate(parent_task.due_date_ts)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      {subtasks.length > 0 && (
        <CardContent>
          <h4 className="font-semibold mb-3">Subtarefas ({subtasks.length})</h4>
          <div className="space-y-3">
            {subtasks.map((subtask, index) => {
              const subPriorityInfo = getPriorityLabel(subtask.priority);
              return (
                <div key={index} className="border-l-2 border-primary/30 pl-4 py-2">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-medium">{subtask.name}</h5>
                    <Badge variant="outline" className={`${subPriorityInfo.color} text-white text-xs`}>
                      {subPriorityInfo.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{subtask.content}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
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
        </CardContent>
      )}
    </Card>
  );
};