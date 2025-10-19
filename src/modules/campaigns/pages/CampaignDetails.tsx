import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Clock, MessageSquare, Users, Image as ImageIcon, CheckCircle2, XCircle, Loader2, Download } from 'lucide-react';
import { useCampaignDetails } from '../hooks/useCampaigns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: campaign, isLoading } = useCampaignDetails(id || null);

  // Calculate metrics from recipients
  const metrics = campaign?.recipients ? {
    total: campaign.recipients.length,
    sent: campaign.recipients.filter((r: any) => r.status === 'sent').length,
    pending: campaign.recipients.filter((r: any) => r.status === 'pending').length,
    failed: campaign.recipients.filter((r: any) => r.status === 'failed').length,
    responded: campaign.recipients.filter((r: any) => r.has_response).length,
  } : { total: 0, sent: 0, pending: 0, failed: 0, responded: 0 };

  const responseRate = metrics.total > 0 ? ((metrics.responded / metrics.total) * 100).toFixed(1) : '0';
  const progressPercent = metrics.total > 0 ? ((metrics.sent / metrics.total) * 100) : 0;

  const pieData = [
    { name: 'Pendente', value: metrics.pending, color: 'hsl(var(--chart-2))' },
    { name: 'Enviado', value: metrics.sent, color: 'hsl(var(--chart-1))' },
    { name: 'Falha', value: metrics.failed, color: 'hsl(var(--destructive))' },
  ].filter(item => item.value > 0);

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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/campaigns/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Campaign Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {campaign.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {campaign.instance_label}
                  </p>
                </div>
              </div>
            </Card>

            {/* Campaign Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Informações da Campanha</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Instância</p>
                    <p className="text-sm font-medium">{campaign.instance_label}</p>
                  </div>
                </div>

                {campaign.scheduled_for && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Agendado para</p>
                      <p className="text-sm font-medium">
                        {format(new Date(campaign.scheduled_for), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Criado em</p>
                    <p className="text-sm font-medium">
                      {format(new Date(campaign.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Message and Image */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Mensagem e Imagem:</h2>
              <div className="space-y-4">
                {campaign.image_url && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Imagem anexada</span>
                    </div>
                    <img 
                      src={campaign.image_url} 
                      alt="Campaign" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                    {campaign.message_content}
                  </p>
                </div>
              </div>
            </Card>

            {/* Recipients List */}
            {campaign.recipients && campaign.recipients.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Destinatários ({campaign.recipients.length})
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Lista de todos os contatos desta campanha
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {campaign.recipients.map((recipient: any, index: number) => (
                    <div 
                      key={recipient.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">
                            {recipient.name || `Contato ${index + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{recipient.phone}</p>
                        </div>
                      </div>
                      <Badge variant={
                        recipient.status === 'sent' ? 'default' : 
                        recipient.status === 'failed' ? 'destructive' : 
                        'secondary'
                      } className="text-xs">
                        {recipient.status === 'sent' ? 'Pendente' : 
                         recipient.status === 'failed' ? 'Falhou' : 
                         'Pendente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Status */}
          <div className="space-y-6">
            {/* Status Badge */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Status</h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Baixar relatório
                </Button>
              </div>
              <div className="mb-4">
                {getStatusBadge(campaign.status)}
              </div>

              {campaign.status === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso dos envios</span>
                    <span className="font-medium">{progressPercent.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              )}
            </Card>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{metrics.sent}</div>
                <div className="text-xs text-muted-foreground mt-1">MENSAGENS DISPARADAS</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{metrics.total}</div>
                <div className="text-xs text-muted-foreground mt-1">TOTAL DE MENSAGENS</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{metrics.responded}</div>
                <div className="text-xs text-muted-foreground mt-1">MENSAGENS RESPONDIDAS</div>
              </Card>
            </div>

            {/* Status Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Status dos disparos</h2>
              {pieData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2 w-full">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">Sem dados disponíveis</p>
              )}
            </Card>

            {/* Detailed Metrics */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Métricas Detalhadas</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Última atualização: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Total</span>
                  </div>
                  <span className="font-semibold">{metrics.total}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Enviados</span>
                  </div>
                  <span className="font-semibold text-green-600">{metrics.sent}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <span className="font-semibold text-yellow-600">{metrics.pending}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Respondidos</span>
                  </div>
                  <span className="font-semibold text-blue-600">{metrics.responded}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">Falhas</span>
                  </div>
                  <span className="font-semibold text-destructive">{metrics.failed}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Taxa de Resposta</span>
                  </div>
                  <span className="font-semibold text-purple-600">{responseRate}%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
