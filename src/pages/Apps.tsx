import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppWindow, Bot, Calendar, FileText, MessageSquare, Palette, Settings, Sparkles, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const apps = [
  {
    id: 1,
    name: 'Chat AI',
    description: 'Converse com IA para gerar ideias e conteúdos',
    icon: MessageSquare,
    color: 'primary',
    status: 'Em breve'
  },
  {
    id: 2,
    name: 'Gerador de Conteúdo',
    description: 'Crie posts e artigos automaticamente',
    icon: FileText,
    color: 'accent',
    status: 'Ativo'
  },
  {
    id: 9,
    name: 'Campanhas de WhatsApp',
    description: 'Crie e gerencie campanhas de disparo em massa',
    icon: MessageCircle,
    color: 'primary',
    status: 'Ativo'
  },
  {
    id: 3,
    name: 'Agendador',
    description: 'Agende suas publicações em múltiplas plataformas',
    icon: Calendar,
    color: 'secondary',
    status: 'Em breve'
  },
  {
    id: 4,
    name: 'Editor Visual',
    description: 'Edite imagens e designs para suas redes sociais',
    icon: Palette,
    color: 'primary',
    status: 'Em breve'
  },
  {
    id: 5,
    name: 'Assistente AI',
    description: 'Automações inteligentes para seu marketing',
    icon: Bot,
    color: 'accent',
    status: 'Em breve'
  },
  {
    id: 6,
    name: 'Análises',
    description: 'Métricas e insights sobre seu desempenho',
    icon: Sparkles,
    color: 'secondary',
    status: 'Em breve'
  },
  {
    id: 7,
    name: 'Configurações',
    description: 'Personalize sua experiência',
    icon: Settings,
    color: 'muted',
    status: 'Em breve'
  },
  {
    id: 8,
    name: 'Mais Apps',
    description: 'Novos aplicativos em desenvolvimento',
    icon: AppWindow,
    color: 'muted',
    status: 'Em breve'
  }
];

const Apps = () => {
  const navigate = useNavigate();

  const handleAppClick = (appId: number) => {
    if (appId === 2) {
      navigate('/content');
    } else if (appId === 9) {
      navigate('/campaigns');
    }
  };

  const handleSettingsClick = (e: React.MouseEvent, appId: number) => {
    e.stopPropagation();
    if (appId === 2) {
      navigate('/content-generator-settings');
    }
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Aplicações</h1>
          <p className="text-muted-foreground">
            Explore todos os aplicativos disponíveis na plataforma AdzHub
          </p>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Card 
                key={app.id}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-card hover:bg-action-card-hover"
                onClick={() => handleAppClick(app.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === 'Ativo' && app.id === 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleSettingsClick(e, app.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                      <Badge 
                        variant={app.status === 'Ativo' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {app.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-card rounded-lg border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Novos aplicativos em breve</h3>
              <p className="text-sm text-muted-foreground">
                Estamos constantemente desenvolvendo novas ferramentas para melhorar sua experiência. 
                Fique atento às atualizações!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apps;
