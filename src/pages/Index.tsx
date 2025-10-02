import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Link } from 'react-router-dom';
import { MessageSquare, BarChart3, FileText, Image, Video, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const categories = [
    { icon: BarChart3, label: 'Analytics', color: 'text-blue-500' },
    { icon: FileText, label: 'Conteúdo', color: 'text-green-500' },
    { icon: Image, label: 'Imagens', color: 'text-purple-500' },
    { icon: Video, label: 'Vídeos', color: 'text-red-500' },
  ];

  const quickAccess = [
    { name: 'Instagram', icon: '📱', bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: 'Facebook', icon: '👍', bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { name: 'LinkedIn', icon: '💼', bgColor: 'bg-gradient-to-br from-blue-700 to-blue-800' },
    { name: 'TikTok', icon: '🎵', bgColor: 'bg-gradient-to-br from-black to-gray-800' },
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Bem-vindo ao AdzHub
                </h1>
                <p className="text-muted-foreground text-lg">
                  Sua plataforma completa de gestão de conteúdo e automação
                </p>
              </div>
              
              <Link to="/chat">
                <Button size="lg" className="w-full sm:w-auto">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Ir para o Chat
                </Button>
              </Link>
            </div>

            {/* Categories Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Categorias</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Card 
                      key={index}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                        <Icon className={`h-8 w-8 ${category.color}`} />
                        <span className="text-sm font-medium text-foreground">{category.label}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick Access Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Acesso Rápido</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickAccess.map((app, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <CardContent className={`flex flex-col items-center justify-center p-6 space-y-2 ${app.bgColor} text-white`}>
                      <span className="text-4xl">{app.icon}</span>
                      <span className="text-sm font-medium">{app.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desempenho Geral</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.82)}`}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">82%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Taxa de engajamento mensal
                </p>
              </CardContent>
            </Card>

            {/* Calendar Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
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
    </div>
  );
};

export default Index;
