import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Trash2, Users, Calendar, Tag, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo, useEffect, useRef } from 'react';
import { calculateEstimatedTime, formatDuration, ProcessingHistory } from '../utils/timeEstimation';
interface ContactList {
  id: string;
  list_name: string;
  total_contacts: number;
  identifier_type: string;
  identifier_column: string;
  metadata_columns: string[];
  created_at: string;
  updated_at: string;
  job_id: string;
}
interface ContactJob {
  id: string;
  status: string;
  processed_contacts: number;
  total_contacts: number;
}
interface ContactListCardProps {
  list: ContactList;
  job?: ContactJob;
  onView: (list: ContactList) => void;
  onDelete: (listId: string) => void;
}
export const ContactListCard = ({
  list,
  job,
  onView,
  onDelete
}: ContactListCardProps) => {
  const historyRef = useRef<ProcessingHistory[]>([]);
  
  const identifierTypeLabel = {
    email: 'E-mail',
    phone: 'Telefone',
    cpf: 'CPF',
    other: 'Outro'
  }[list.identifier_type] || list.identifier_type;
  const isProcessing = job?.status === 'processing' || job?.status === 'queued';
  const isCompleted = job?.status === 'completed';
  const isFailed = job?.status === 'failed';
  const progress = job ? Math.round(job.processed_contacts / job.total_contacts * 100) : 100;
  
  // Atualizar histórico de processamento
  useEffect(() => {
    if (job && isProcessing && job.processed_contacts > 0) {
      const newEntry: ProcessingHistory = {
        timestamp: Date.now(),
        processed: job.processed_contacts
      };
      
      // Manter apenas os últimos 10 registros
      historyRef.current = [...historyRef.current, newEntry].slice(-10);
    }
  }, [job?.processed_contacts, isProcessing]);
  
  // Calcular tempo estimado
  const estimatedSeconds = useMemo(() => {
    if (!job || !isProcessing || progress >= 95) return null;
    
    return calculateEstimatedTime(
      job.processed_contacts,
      job.total_contacts,
      historyRef.current
    );
  }, [job?.processed_contacts, job?.total_contacts, isProcessing, progress]);
  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (isCompleted) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (isFailed) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return null;
  };
  const getStatusText = () => {
    if (isProcessing) return 'Processando...';
    if (isCompleted) return 'Concluída';
    if (isFailed) return 'Erro';
    return 'Concluída';
  };
  return <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{list.list_name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">
                {formatDistanceToNow(new Date(list.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
              </span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            <Tag className="h-3 w-3 mr-1" />
            {identifierTypeLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de Progresso */}
        {job && isProcessing && <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Processando contatos</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {job.processed_contacts.toLocaleString('pt-BR')} de {job.total_contacts.toLocaleString('pt-BR')} contatos
            </p>
            {estimatedSeconds !== null && progress < 95 && historyRef.current.length >= 2 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Tempo estimado: {formatDuration(estimatedSeconds)}</span>
              </div>
            )}
            {progress >= 95 && (
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <CheckCircle className="h-3 w-3" />
                <span>Quase pronto...</span>
              </div>
            )}
          </div>}

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total de contatos</span>
          </div>
          <span className="font-semibold text-lg">{list.total_contacts.toLocaleString('pt-BR')}</span>
        </div>

        {list.metadata_columns.length > 0 && <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Campos Adicionais:</p>
            <div className="flex flex-wrap gap-1">
              {list.metadata_columns.slice(0, 3).map(col => <Badge key={col} variant="outline" className="text-xs">
                  {col}
                </Badge>)}
              {list.metadata_columns.length > 3 && <Badge variant="outline" className="text-xs">
                  +{list.metadata_columns.length - 3}
                </Badge>}
            </div>
          </div>}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(list)} disabled={isProcessing}>
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(list.id)} disabled={isProcessing}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>;
};