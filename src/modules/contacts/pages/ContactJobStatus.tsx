import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import { calculateEstimatedTime, formatDuration, ProcessingHistory } from '../utils/timeEstimation';

interface ContactUploadJob {
  id: string;
  user_id: string;
  file_name: string;
  identifier_type: string;
  identifier_column: string;
  metadata_columns: any;
  total_contacts: number;
  processed_contacts: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  lgpd_consent: boolean;
  data_usage_consent: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export const ContactJobStatus = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<ContactUploadJob | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const historyRef = useRef<ProcessingHistory[]>([]);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_upload_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Error fetching job:', error);
        setIsLoading(false);
        return;
      }

      setJob(data as ContactUploadJob);
      if (data?.total_contacts && data?.processed_contacts) {
        setProgress((data.processed_contacts / data.total_contacts) * 100);
        
        // Inicializar histórico
        if (data.status === 'processing') {
          historyRef.current = [{
            timestamp: Date.now(),
            processed: data.processed_contacts
          }];
        }
      }
      setIsLoading(false);
    };

    fetchJob();

    // Subscrever a atualizações em tempo real
    const channel = supabase
      .channel(`job-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contact_upload_jobs',
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          const updatedJob = payload.new as ContactUploadJob;
          setJob(updatedJob);

          if (updatedJob.total_contacts && updatedJob.processed_contacts) {
            const newProgress = (updatedJob.processed_contacts / updatedJob.total_contacts) * 100;
            setProgress(newProgress);
            
            // Atualizar histórico
            if (updatedJob.status === 'processing') {
              const newEntry: ProcessingHistory = {
                timestamp: Date.now(),
                processed: updatedJob.processed_contacts
              };
              historyRef.current = [...historyRef.current, newEntry].slice(-10);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  // Polling como fallback
  useEffect(() => {
    if (job?.status === 'processing') {
      const interval = setInterval(async () => {
        const { data } = await supabase
          .from('contact_upload_jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (data) {
          setJob(data as ContactUploadJob);
          if (data.total_contacts && data.processed_contacts) {
            const newProgress = (data.processed_contacts / data.total_contacts) * 100;
            setProgress(newProgress);
          }
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [job?.status, jobId]);

  const getStatusIcon = () => {
    switch (job?.status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-6 w-6 text-primary animate-spin" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (job?.status) {
      case 'queued':
        return 'Na fila';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusVariant = () => {
    switch (job?.status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  // Calcular tempo estimado e tempo decorrido
  const estimatedSeconds = useMemo(() => {
    if (!job || job.status !== 'processing' || progress >= 95) return null;
    
    return calculateEstimatedTime(
      job.processed_contacts,
      job.total_contacts,
      historyRef.current
    );
  }, [job?.processed_contacts, job?.total_contacts, job?.status, progress]);
  
  const elapsedSeconds = useMemo(() => {
    if (!job) return null;
    const start = new Date(job.created_at).getTime();
    const now = Date.now();
    return Math.round((now - start) / 1000);
  }, [job?.created_at]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando informações do job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Job não encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Não foi possível encontrar o job solicitado.
            </p>
            <Button onClick={() => navigate('/apps/contacts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/apps/contacts')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Status do Processamento</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe o processamento da sua base de contatos em tempo real
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getStatusIcon()}
              <span>Processamento de Contatos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={getStatusVariant()}>
                {getStatusText()}
              </Badge>
            </div>

            {/* Progress Bar */}
            {job.status === 'processing' && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progresso</span>
                  <span className="text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>
                      {job.processed_contacts.toLocaleString('pt-BR')} de {job.total_contacts.toLocaleString('pt-BR')} contatos processados
                    </span>
                  </div>
                  
                  {/* Tempo estimado e decorrido */}
                  <div className="flex items-center justify-center gap-4 text-xs">
                    {elapsedSeconds !== null && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Decorrido: {formatDuration(elapsedSeconds)}</span>
                      </div>
                    )}
                    
                    {estimatedSeconds !== null && progress < 95 && historyRef.current.length >= 2 && (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Clock className="h-3 w-3" />
                        <span>Estimado: {formatDuration(estimatedSeconds)}</span>
                      </div>
                    )}
                    
                    {progress >= 95 && (
                      <div className="flex items-center gap-1.5 text-primary">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Quase pronto...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Informações do Job */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Arquivo</span>
                <p className="text-sm font-medium break-all">{job.file_name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Total de Contatos</span>
                <p className="text-sm font-medium">{job.total_contacts.toLocaleString('pt-BR')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Tipo de Identificador</span>
                <p className="text-sm font-medium capitalize">{job.identifier_type === 'phone' ? 'Telefone' : 'E-mail'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Coluna Identificadora</span>
                <p className="text-sm font-medium">{job.identifier_column}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Iniciado em</span>
                <p className="text-sm font-medium">
                  {new Date(job.created_at).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              {job.completed_at && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Finalizado em</span>
                  <p className="text-sm font-medium">
                    {new Date(job.completed_at).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Columns */}
            {job.metadata_columns && Array.isArray(job.metadata_columns) && job.metadata_columns.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Colunas de Metadados:</span>
                <div className="flex flex-wrap gap-2">
                  {job.metadata_columns.map((col: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {col}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {job.status === 'failed' && job.error_message && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-destructive">Erro no Processamento</p>
                    <p className="text-sm text-destructive/80">{job.error_message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {job.status === 'completed' && (
              <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-600">
                      Base processada com sucesso!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      {job.processed_contacts.toLocaleString('pt-BR')} contatos foram importados e estão prontos para uso.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Queued Message */}
            {job.status === 'queued' && (
              <div className="p-4 bg-primary/10 border border-primary rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Aguardando processamento</p>
                    <p className="text-sm text-primary/80">
                      Seu arquivo está na fila e será processado em breve.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LGPD Compliance Info */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Conformidade LGPD
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${job.lgpd_consent ? 'bg-green-500' : 'bg-destructive'}`} />
                  <span>Consentimento LGPD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${job.data_usage_consent ? 'bg-green-500' : 'bg-destructive'}`} />
                  <span>Consentimento de Uso</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactJobStatus;
