import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, Calendar, Tag, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PostingCalendar } from '@/components/PostingCalendar';
import { IdeaViewDialog } from '@/components/IdeaViewDialog';
import { ContentLoadingSkeleton } from '@/components/ui/skeleton-screens';

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  client_id: string;
  created_at: string;
  slug?: string;
  primary_keyword?: string;
  secondary_keywords?: string[];
  intent?: string;
  justification?: string;
  alternatives?: string[];
  tags?: string[];
  scheduled_date?: string;
  // Legacy fields for compatibility
  titulo?: string;
  descricao?: string;
  categoria?: string;
  prioridade?: 'low' | 'medium' | 'high';
  search_intent?: string;
  reason?: string;
  excluded_matches?: string[];
  title_suggestion?: string;
  proposed_theme?: string;
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

interface PendingPost {
  id: string;
  client_id: string;
  tipo_postagem: string;
  titulo: string;
  conteudo: string;
  canal: string;
  status: string;
  metadata: any;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
}

const Content = () => {
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [ideaDialogOpen, setIdeaDialogOpen] = useState(false);

  // Helper function to transform database idea to ContentIdea
  const transformIdea = (dbIdea: any): ContentIdea => ({
    ...dbIdea,
    title: dbIdea.titulo || dbIdea.title,
    description: dbIdea.descricao || dbIdea.description,
    priority: dbIdea.prioridade || dbIdea.priority,
    intent: dbIdea.search_intent || dbIdea.intent,
    justification: dbIdea.reason || dbIdea.justification,
    tags: dbIdea.categoria ? [dbIdea.categoria] : (dbIdea.tags || []),
  });

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

    // Listen for profile changes
    const handleProfileChange = (event: CustomEvent) => {
      const newClient = event.detail;
      if (newClient && newClient.id) {
        console.log('Content - Profile changed, reloading data for client:', newClient.id);
        setSelectedClient(newClient.id);
        setLoading(true);
        fetchContentData(newClient.id);
      }
    };

    window.addEventListener('profileChanged', handleProfileChange as EventListener);

    return () => {
      window.removeEventListener('profileChanged', handleProfileChange as EventListener);
    };
  }, []);

  const fetchContentData = async (clientId: string) => {
    try {
      // Validate clientId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(clientId)) {
        console.error('Invalid UUID format:', clientId);
        setLoading(false);
        return;
      }
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

      // Fetch pending posts
      const { data: posts, error: postsError } = await supabase
        .from('pending_posts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      setContentIdeas((ideas || []).map(transformIdea));
      setContentAssets(assets || []);
      setPendingPosts(posts || []);
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

      // Find the approved idea to send to webhook
      const approvedIdea = contentIdeas.find(idea => idea.id === ideaId);
      
      // Trigger webhook
      if (approvedIdea) {
        try {
          // Fetch client profile data for channels and platforms
          const { data: clientProfile } = await supabase
            .from('client_profiles')
            .select('canais_habilitados, plataforma, tom_voz, tom_voz_detalhes, frequencia_publicacao, sitemap')
            .eq('client_id', selectedClient)
            .single();

          await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/40c64e0b-06d3-4817-a08a-7ab8dc545b4d', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idea: approvedIdea,
              client_id: selectedClient,
              action: 'approved',
              client_profile: clientProfile || {}
            }),
          });
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          // Don't block the approval if webhook fails
        }
      }

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

  const handleApprovePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('pending_posts')
        .update({ status: 'approved' })
        .eq('id', postId);

      if (error) throw error;

      setPendingPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, status: 'approved' } : post
        )
      );

      toast({
        title: 'Sucesso',
        description: 'Postagem aprovada com sucesso!',
      });
    } catch (error) {
      console.error('Error approving post:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível aprovar a postagem.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('pending_posts')
        .update({ status: 'rejected' })
        .eq('id', postId);

      if (error) throw error;

      setPendingPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, status: 'rejected' } : post
        )
      );

      toast({
        title: 'Sucesso',
        description: 'Postagem rejeitada.',
      });
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível rejeitar a postagem.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <ContentLoadingSkeleton />;
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
  const pendingPostsFiltered = pendingPosts.filter(post => post.status === 'pending');

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Módulo de Conteúdo</h1>
          <div className="flex gap-2">
            {pendingIdeas.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {pendingIdeas.length} ideias pendentes
              </Badge>
            )}
            {pendingPostsFiltered.length > 0 && (
              <Badge variant="default" className="text-sm">
                {pendingPostsFiltered.length} postagens pendentes
              </Badge>
            )}
          </div>
        </div>

      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ideas">Central de Big Ideias</TabsTrigger>
          <TabsTrigger value="posts">Postagens Pendentes</TabsTrigger>
          <TabsTrigger value="history">Calendário de Postagens</TabsTrigger>
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
                <Card key={idea.id} className="w-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1 line-clamp-2">{idea.title || idea.titulo}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {idea.description || idea.descricao}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <Badge variant={priorityColors[idea.priority || idea.prioridade || 'low']}>
                          {(idea.priority || idea.prioridade || 'low').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {(idea.tags?.length ? idea.tags[0] : idea.categoria) && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {idea.tags?.length ? idea.tags[0] : idea.categoria}
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
                          variant="ghost"
                          onClick={() => {
                            setSelectedIdea(idea);
                            setIdeaDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Mais
                        </Button>
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
                    <Card key={idea.id} className="opacity-75 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{idea.title || idea.titulo}</CardTitle>
                            <CardDescription className="text-sm">{idea.description || idea.descricao}</CardDescription>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Badge variant={statusColors[idea.status]}>
                              {idea.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedIdea(idea);
                                setIdeaDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4">
            {pendingPostsFiltered.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma postagem pendente</h3>
                    <p className="text-muted-foreground">
                      Todas as postagens foram aprovadas ou rejeitadas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              pendingPostsFiltered.map((post) => (
                <Card key={post.id} className="w-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1 line-clamp-2">{post.titulo}</CardTitle>
                        <CardDescription className="text-sm line-clamp-3">
                          {post.conteudo}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <Badge variant="outline">
                          {post.tipo_postagem}
                        </Badge>
                        <Badge variant="secondary">
                          {post.canal}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.created_at), 'dd/MM/yyyy')}
                        </div>
                        {post.scheduled_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Agendado: {format(new Date(post.scheduled_date), 'dd/MM/yyyy')}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectPost(post.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprovePost(post.id)}
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

          {pendingPosts.filter(post => post.status !== 'pending').length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Postagens Processadas</h2>
              <div className="grid gap-4">
                {pendingPosts
                  .filter(post => post.status !== 'pending')
                  .map((post) => (
                    <Card key={post.id} className="opacity-75 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{post.titulo}</CardTitle>
                            <CardDescription className="text-sm line-clamp-2">{post.conteudo}</CardDescription>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Badge variant={post.status === 'approved' ? 'default' : 'destructive'}>
                              {post.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {post.tipo_postagem}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PostingCalendar contentAssets={contentAssets} />
        </TabsContent>
      </Tabs>
      
      <IdeaViewDialog
        idea={selectedIdea}
        open={ideaDialogOpen}
        onOpenChange={setIdeaDialogOpen}
      />
      </div>
    </div>
  );
};

export default Content;