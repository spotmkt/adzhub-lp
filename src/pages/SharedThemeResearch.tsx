import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SharedItem {
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
}

const SharedThemeResearch = () => {
  const { token } = useParams<{ token: string }>();
  const [item, setItem] = useState<SharedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedItem = async () => {
      if (!token) {
        setError('Link inválido');
        setLoading(false);
        return;
      }

      try {
        // Get the share record
        const { data: shareData, error: shareError } = await supabase
          .from('theme_research_shares')
          .select('history_id')
          .eq('share_token', token)
          .single();

        if (shareError || !shareData) {
          setError('Link não encontrado ou expirado');
          setLoading(false);
          return;
        }

        // Get the history item
        const { data: historyData, error: historyError } = await supabase
          .from('theme_research_history')
          .select('*')
          .eq('id', shareData.history_id)
          .single();

        if (historyError || !historyData) {
          setError('Conteúdo não encontrado');
          setLoading(false);
          return;
        }

        setItem(historyData);
      } catch (err) {
        console.error('Error loading shared item:', err);
        setError('Erro ao carregar conteúdo compartilhado');
      } finally {
        setLoading(false);
      }
    };

    loadSharedItem();
  }, [token]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8">
          <p className="text-muted-foreground">Carregando...</p>
        </Card>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Link inválido'}</AlertDescription>
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pesquisa de Tema Compartilhada</h1>
          <p className="text-muted-foreground">
            Análise de conteúdo viral
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[400px_1fr] gap-0">
            {/* Video */}
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
            <CardContent className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
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
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Compartilhado via AdzHub - Pesquisa de Temas</p>
        </div>
      </div>
    </div>
  );
};

export default SharedThemeResearch;
