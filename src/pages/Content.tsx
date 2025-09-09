import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, Calendar, Tag, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ContentIdea {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: 'pending' | 'approved' | 'rejected';
  prioridade: 'low' | 'medium' | 'high';
  created_at: string;
}

interface ContentAsset {
  id: string;
  content_idea_id: string;
  canal: string;
  tipo_conteudo: string;
  titulo: string;
  conteudo: string;
  status_publicacao: string;
  data_publicacao: string;
  created_at: string;
  content_ideas: {
    titulo: string;
  };
}

const Content = () => {
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const priorityColors = {
    low: 'secondary',
    medium: 'default',
    high: 'destructive'
  } as const;

  const statusColors = {
    pending: 'default',
    approved: 'default',
    rejected: 'destructive'
  } as const;

  useEffect(() => {
    // Get selected client from localStorage or other state management
    const clientId = localStorage.getItem('selectedClientId');
    if (clientId) {
      setSelectedClient(clientId);
      fetchContentData(clientId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchContentData = async (clientId: string) => {
    try {
      // Fetch content ideas
      const { data: ideas, error: ideasError } = await supabase
        .from('content_ideas')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (ideasError) throw ideasError;

      // Fetch content assets
      const { data: assets, error: assetsError } = await supabase
        .from('content_assets')
        .select(`
          *,
          content_ideas (titulo)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (assetsError) throw assetsError;

      setContentIdeas((ideas || []) as ContentIdea[]);
      setContentAssets(assets || []);
    } catch (error) {
      console.error('Error fetching content data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados de conteúdo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('content_ideas')
        .update({ status: 'approved' })
        .eq('id', ideaId);

      if (error) throw error;

      setContentIdeas(prev =>
        prev.map(idea =>
          idea.id === ideaId ? { ...idea, status: 'approved' } : idea
        )
      );

      toast({
        title: 'Sucesso',
        description: 'Big idea aprovada com sucesso!',
      });
    } catch (error) {
      console.error('Error approving idea:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível aprovar a big idea.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('content_ideas')
        .update({ status: 'rejected' })
        .eq('id', ideaId);

      if (error) throw error;

      setContentIdeas(prev =>
        prev.map(idea =>
          idea.id === ideaId ? { ...idea, status: 'rejected' } : idea
        )
      );

      toast({
        title: 'Sucesso',
        description: 'Big idea rejeitada.',
      });
    } catch (error) {
      console.error('Error rejecting idea:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível rejeitar a big idea.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando conteúdos...</p>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum cliente selecionado</h3>
          <p className="text-muted-foreground">
            Selecione um cliente no topo da página para visualizar o conteúdo.
          </p>
        </div>
      </div>
    );
  }

  const pendingIdeas = contentIdeas.filter(idea => idea.status === 'pending');

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Módulo de Conteúdo</h1>
        {pendingIdeas.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {pendingIdeas.length} ideias pendentes
          </Badge>
        )}
      </div>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ideas">Central de Big Ideias</TabsTrigger>
          <TabsTrigger value="history">Histórico de Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="space-y-4">
          <div className="grid gap-4">
            {pendingIdeas.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma ideia pendente</h3>
                    <p className="text-muted-foreground">
                      Todas as big ideias foram aprovadas ou rejeitadas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              pendingIdeas.map((idea) => (
                <Card key={idea.id} className="w-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl mb-2">{idea.titulo}</CardTitle>
                        <CardDescription className="text-base">
                          {idea.descricao}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Badge variant={priorityColors[idea.prioridade]}>
                          {idea.prioridade.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {idea.categoria && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {idea.categoria}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(idea.created_at), 'dd/MM/yyyy')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectIdea(idea.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveIdea(idea.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {contentIdeas.filter(idea => idea.status !== 'pending').length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Ideias Processadas</h2>
              <div className="grid gap-4">
                {contentIdeas
                  .filter(idea => idea.status !== 'pending')
                  .map((idea) => (
                    <Card key={idea.id} className="opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{idea.titulo}</CardTitle>
                            <CardDescription>{idea.descricao}</CardDescription>
                          </div>
                          <Badge variant={statusColors[idea.status]}>
                            {idea.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4">
            {contentAssets.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum conteúdo gerado</h3>
                    <p className="text-muted-foreground">
                      Os conteúdos gerados aparecerão aqui.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              contentAssets.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{asset.titulo}</CardTitle>
                        <CardDescription>
                          Big Idea: {asset.content_ideas?.titulo}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{asset.canal}</Badge>
                        <Badge variant="secondary">{asset.tipo_conteudo}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {asset.conteudo && (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm">{asset.conteudo}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Status: {asset.status_publicacao}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(asset.created_at), 'dd/MM/yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Content;