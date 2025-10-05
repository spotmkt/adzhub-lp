import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MessageSquare, Users, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Campaign {
  id: string;
  name: string;
  instance_label: string;
  message_content: string;
  status: string;
  created_at: string;
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  image_url: string | null;
}

const CampaignsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Campanhas carregadas:', data);
      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar campanhas:', error);
      toast({
        title: 'Erro ao carregar campanhas',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Rascunho', variant: 'secondary' as const },
      processing: { label: 'Processando', variant: 'default' as const },
      sending: { label: 'Enviando', variant: 'default' as const },
      completed: { label: 'Concluída', variant: 'default' as const },
      failed: { label: 'Falhou', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    
    return (
      <Badge variant={config.variant} className="gap-1">
        {status === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
        {status === 'completed' && <CheckCircle className="h-3 w-3" />}
        {status === 'failed' && <XCircle className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard de Campanhas</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas campanhas de WhatsApp</p>
          </div>
          <Button onClick={() => navigate('/campaigns')} size="lg">
            Nova Campanha
          </Button>
        </div>

        {loading ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Carregando campanhas...</p>
            </div>
          </Card>
        ) : campaigns.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h2 className="text-xl font-semibold">Nenhuma campanha criada</h2>
                <p className="text-muted-foreground mt-2">
                  Clique em "Nova Campanha" para começar a enviar mensagens
                </p>
              </div>
              <Button onClick={() => navigate('/campaigns')}>
                Criar Primeira Campanha
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card 
                key={campaign.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/campaigns/campaign/${campaign.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
                    {getStatusBadge(campaign.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Instância: {campaign.instance_label}</span>
                  </div>
                  
                  {campaign.image_url && (
                    <div className="relative h-32 bg-muted rounded-md overflow-hidden">
                      <img 
                        src={campaign.image_url} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p className="line-clamp-2 text-muted-foreground">
                      {campaign.message_content}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(campaign.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  {campaign.scheduled_for && (
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Clock className="h-3 w-3" />
                      <span>
                        Agendada: {format(new Date(campaign.scheduled_for), "dd/MM 'às' HH:mm")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsDashboard;
