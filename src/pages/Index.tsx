import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Link } from 'react-router-dom';
import { MessageSquare, Bot, Calendar as CalendarIcon, FileText, Palette, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { MorphPanel } from '@/components/ui/ai-input';

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const apps = [
    {
      id: 1,
      name: 'Chat AI',
      description: 'Converse com IA para gerar ideias e conteúdos',
      icon: MessageSquare,
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'Gerador de Conteúdo',
      description: 'Crie posts e artigos automaticamente',
      icon: FileText,
      status: 'Ativo'
    },
    {
      id: 3,
      name: 'Agendador',
      description: 'Agende suas publicações',
      icon: CalendarIcon,
      status: 'Em breve'
    },
    {
      id: 4,
      name: 'Editor Visual',
      description: 'Edite imagens para redes sociais',
      icon: Palette,
      status: 'Ativo'
    },
    {
      id: 5,
      name: 'Assistente AI',
      description: 'Automações inteligentes',
      icon: Bot,
      status: 'Ativo'
    },
    {
      id: 6,
      name: 'Análises',
      description: 'Métricas e insights',
      icon: Sparkles,
      status: 'Em breve'
    }
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-10">
            {/* Welcome Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Bem-vindo ao AdzHub
                </h1>
                <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl leading-relaxed">
                  Sua plataforma completa de gestão de conteúdo e automação com inteligência artificial
                </p>
              </div>
              
              <Link to="/chat" className="block mt-8">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Abrir o Chat
                </Button>
              </Link>
            </div>

            {/* Apps Section */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-foreground">Aplicativos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {apps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <Card 
                      key={app.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-card hover:bg-action-card-hover"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2.5 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors duration-300">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge 
                            variant={app.status === 'Ativo' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{app.name}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {app.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Desempenho Geral</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="relative w-36 h-36 mb-6">
                  <svg className="transform -rotate-90 w-36 h-36">
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-muted opacity-30"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="64"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 64}`}
                      strokeDashoffset={`${2 * Math.PI * 64 * (1 - 0.82)}`}
                      className="text-primary transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">82%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center font-medium">
                  Taxa de engajamento mensal
                </p>
              </CardContent>
            </Card>

            {/* Calendar Card */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center pb-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MorphPanel />
    </div>
  );
};

export default Index;
