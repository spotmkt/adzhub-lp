import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Play, Image as ImageIcon, Sparkles, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContentResult {
  id: string;
  type: 'video' | 'image';
  thumbnail: string;
  title: string;
  stats: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  hypothesis: string;
}

interface HistoryItem {
  id: string;
  post_id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  song_title: string | null;
  video_url: string | null;
  hypothesis: string | null;
  created_at: string;
}

const ThemeResearch = () => {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [theme, setTheme] = useState('');
  const [searchType, setSearchType] = useState<'trends' | 'views' | 'interactions'>('trends');
  const [filterValue, setFilterValue] = useState('');
  const [results, setResults] = useState<ContentResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('theme_research_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de pesquisas",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveToHistory = async (result: ContentResult) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('theme_research_history')
        .insert({
          user_id: user.id,
          theme,
          search_type: searchType,
          filter_value: filterValue || null,
          content_type: result.type,
          content_url: result.id,
          thumbnail_url: result.thumbnail,
          title: result.title,
          stats: result.stats,
          hypothesis: result.hypothesis,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const deleteFromHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('theme_research_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Item removido",
        description: "O item foi removido do histórico",
      });
    } catch (error) {
      console.error('Error deleting from history:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o item do histórico",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (!theme.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um tema para pesquisar",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulação de busca - aqui você conectaria com a API real
    setTimeout(async () => {
      const mockResults: ContentResult[] = [
        {
          id: '1',
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
          title: 'Tutorial prático sobre ' + theme,
          stats: { views: 125000, likes: 15400, comments: 892 },
          hypothesis: `Este formato de vídeo tutorial tem alta performance porque demonstra aplicação prática do tema "${theme}". A audiência responde bem a conteúdos educativos que mostram passo a passo, gerando alto engajamento e compartilhamentos.`
        },
        {
          id: '2',
          type: 'image',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
          title: 'Infográfico: Dados sobre ' + theme,
          stats: { likes: 28900, comments: 543 },
          hypothesis: `Infográficos sobre "${theme}" têm excelente performance visual e são altamente compartilháveis. Este formato simplifica informações complexas, tornando o conteúdo mais digestível e aumentando o potencial viral nas redes sociais.`
        },
        {
          id: '3',
          type: 'video',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          title: 'Tendências e insights de ' + theme,
          stats: { views: 89000, likes: 12100, comments: 678 },
          hypothesis: `Conteúdos que abordam tendências e análises de mercado sobre "${theme}" geram alta autoridade. Este formato atrai profissionais e tomadores de decisão, resultando em engajamento qualificado e maior retenção de audiência.`
        }
      ];
      
      setResults(mockResults);
      
      // Save all results to history
      for (const result of mockResults) {
        await saveToHistory(result);
      }
      
      setIsSearching(false);
      
      toast({
        title: "Pesquisa concluída",
        description: `Encontramos 3 conteúdos relevantes sobre "${theme}"`,
      });
    }, 2000);
  };

  const handleRemix = (content: ContentResult) => {
    toast({
      title: "Criando a partir desta hipótese",
      description: `Iniciando criação baseada em: ${content.title}`,
    });
    // Aqui você implementaria a lógica de remixar/criar conteúdo
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Pesquisa de Temas</h1>
          <p className="text-muted-foreground">
            Descubra conteúdos de alta performance e crie a partir das melhores hipóteses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="search">
              <Search className="mr-2 h-4 w-4" />
              Pesquisa
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6 mt-6">

            {/* Search Form */}
            <Card>
          <CardHeader>
            <CardTitle>Buscar Conteúdos</CardTitle>
            <CardDescription>
              Encontre os melhores conteúdos baseados em trends, visualizações ou interações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Input
                id="theme"
                placeholder="Digite o tema que deseja pesquisar..."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="searchType">Tipo de Busca</Label>
                <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                  <SelectTrigger id="searchType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trends">Trends</SelectItem>
                    <SelectItem value="views">Visualizações</SelectItem>
                    <SelectItem value="interactions">Interações</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter">Filtro (opcional)</Label>
                <Input
                  id="filter"
                  placeholder="Ex: mais de 10.000 curtidas"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="w-full"
              size="lg"
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Pesquisando...' : 'Pesquisar'}
            </Button>
            </CardContent>
            </Card>

            {/* Results */}
            {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Resultados da Pesquisa</h2>
            <div className="grid grid-cols-1 gap-6">
              {results.map((result) => (
                <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-[300px_1fr] gap-0">
                    {/* Thumbnail */}
                    <div className="relative bg-muted aspect-video md:aspect-auto">
                      <img 
                        src={result.thumbnail} 
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                        {result.type === 'video' ? (
                          <>
                            <Play className="h-3 w-3" />
                            <span className="text-xs font-medium">Vídeo</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3 w-3" />
                            <span className="text-xs font-medium">Imagem</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {result.stats.views && (
                              <span>👁 {formatNumber(result.stats.views)} visualizações</span>
                            )}
                            {result.stats.likes && (
                              <span>❤️ {formatNumber(result.stats.likes)} curtidas</span>
                            )}
                            {result.stats.comments && (
                              <span>💬 {formatNumber(result.stats.comments)} comentários</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg border border-border">
                          <div className="flex items-start gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm font-semibold">Hipótese de Resultados</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {result.hypothesis}
                          </p>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleRemix(result)}
                        className="mt-4"
                        variant="default"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Remizar (Criar a partir desta hipótese)
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            </div>
            )}

            {/* Empty State */}
            {results.length === 0 && !isSearching && (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Nenhuma pesquisa realizada</h3>
                <p className="text-muted-foreground">
                  Insira um tema e clique em pesquisar para encontrar conteúdos relevantes
                </p>
              </div>
              </div>
            </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            {isLoadingHistory ? (
              <Card className="p-12">
                <div className="text-center">
                  <p className="text-muted-foreground">Carregando histórico...</p>
                </div>
              </Card>
            ) : history.length === 0 ? (
              <Card className="p-12">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <History className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nenhum histórico encontrado</h3>
                    <p className="text-muted-foreground">
                      Faça uma pesquisa para começar a construir seu histórico
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Histórico de Pesquisas</h2>
                <div className="grid grid-cols-1 gap-6">
                  {history.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-[300px_1fr] gap-0">
                        {/* Video/Thumbnail */}
                        <div className="relative bg-muted aspect-video md:aspect-auto">
                          {item.video_url ? (
                            <video 
                              src={item.video_url} 
                              className="w-full h-full object-cover"
                              controls
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            <span className="text-xs font-medium">Vídeo</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteFromHistory(item.id)}
                                  className="flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {item.song_title && (
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                                  <span className="bg-muted px-2 py-1 rounded">🎵 {item.song_title}</span>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span>👁 {formatNumber(item.views)} visualizações</span>
                                <span>❤️ {formatNumber(item.likes)} curtidas</span>
                                <span>💬 {formatNumber(item.comments)} comentários</span>
                                <span>🔄 {formatNumber(item.shares)} compartilhamentos</span>
                                <span>🔖 {formatNumber(item.bookmarks)} salvos</span>
                              </div>
                            </div>

                            {item.hypothesis && (
                              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                <div className="flex items-start gap-2 mb-2">
                                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-sm font-semibold">Hipótese de Resultados</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {item.hypothesis}
                                </p>
                              </div>
                            )}
                            
                            <p className="text-xs text-muted-foreground">
                              Pesquisado em {new Date(item.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>

                          <Button 
                            onClick={() => handleRemix({ 
                              id: item.post_id, 
                              type: 'video',
                              thumbnail: item.video_url || '',
                              title: item.title,
                              stats: { views: item.views, likes: item.likes, comments: item.comments },
                              hypothesis: item.hypothesis || ''
                            })}
                            className="mt-4"
                            variant="default"
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Remizar (Criar a partir desta hipótese)
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThemeResearch;
