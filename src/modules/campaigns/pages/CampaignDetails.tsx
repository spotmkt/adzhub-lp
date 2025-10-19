import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MessageSquare, Users, Image as ImageIcon, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useCampaignDetails } from '../hooks/useCampaigns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: campaign, isLoading } = useCampaignDetails(id || null);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', variant: 'secondary' as const, icon: Clock },
      scheduled: { label: 'Agendada', variant: 'default' as const, icon: Calendar },
      processing: { label: 'Enviando', variant: 'default' as const, icon: Loader2 },
      completed: { label: 'Concluída', variant: 'default' as const, icon: CheckCircle2 },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/campaigns/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Card className="p-8">
            <p className="text-muted-foreground">Campanha não encontrada.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/campaigns/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        {/* Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {campaign.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Instância: {campaign.instance_label}
              </p>
            </div>
            {getStatusBadge(campaign.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Criada em</p>
                <p className="text-sm font-medium">
                  {format(new Date(campaign.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>

            {campaign.scheduled_for && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Agendada para</p>
                  <p className="text-sm font-medium">
                    {format(new Date(campaign.scheduled_for), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}

            {campaign.recipients && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Destinatários</p>
                  <p className="text-sm font-medium">{campaign.recipients.length}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Message Content */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Mensagem</h2>
          </div>
          <p className="text-foreground whitespace-pre-wrap">{campaign.message_content}</p>
          
          {campaign.image_url && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Imagem anexada</span>
              </div>
              <img 
                src={campaign.image_url} 
                alt="Campaign" 
                className="max-w-md rounded-lg border"
              />
            </div>
          )}
        </Card>

        {/* Recipients List */}
        {campaign.recipients && campaign.recipients.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Destinatários ({campaign.recipients.length})</h2>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {campaign.recipients.map((recipient: any) => (
                <div 
                  key={recipient.id} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{recipient.name || 'Sem nome'}</p>
                    <p className="text-sm text-muted-foreground">{recipient.phone}</p>
                  </div>
                  <Badge variant={
                    recipient.status === 'sent' ? 'default' : 
                    recipient.status === 'failed' ? 'destructive' : 
                    'secondary'
                  }>
                    {recipient.status === 'sent' ? 'Enviado' : 
                     recipient.status === 'failed' ? 'Falhou' : 
                     'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
