import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface PostingCalendarProps {
  contentAssets: ContentAsset[];
}

export const PostingCalendar = ({ contentAssets }: PostingCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get posts for the current month
  const monthPosts = contentAssets.filter(asset => {
    if (!asset.data_publicacao) return false;
    try {
      const postDate = new Date(asset.data_publicacao);
      return postDate >= monthStart && postDate <= monthEnd;
    } catch {
      return false;
    }
  });

  // Get posts for selected date
  const selectedDatePosts = selectedDate 
    ? contentAssets.filter(asset => {
        if (!asset.data_publicacao) return false;
        try {
          return isSameDay(new Date(asset.data_publicacao), selectedDate);
        } catch {
          return false;
        }
      })
    : [];

  const getPostsForDate = (date: Date) => {
    return contentAssets.filter(asset => {
      if (!asset.data_publicacao) return false;
      try {
        return isSameDay(new Date(asset.data_publicacao), date);
      } catch {
        return false;
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'publicado':
        return 'bg-green-500';
      case 'agendado':
        return 'bg-blue-500';
      case 'rascunho':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'publicado':
        return CheckCircle;
      case 'agendado':
        return Clock;
      case 'rascunho':
        return Zap;
      default:
        return Clock;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          Calendário de Postagens
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-[160px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map(date => {
                  const postsForDate = getPostsForDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isPast = isBefore(date, startOfDay(new Date()));
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        relative p-2 h-16 text-sm border rounded-lg transition-colors
                        ${isSelected 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'border-border hover:bg-muted'
                        }
                        ${isToday(date) ? 'ring-2 ring-primary ring-opacity-50' : ''}
                        ${isPast ? 'opacity-75' : ''}
                      `}
                    >
                      <div className="font-medium">
                        {format(date, 'd')}
                      </div>
                      
                      {/* Post indicators */}
                      {postsForDate.length > 0 && (
                        <div className="absolute bottom-1 left-1 right-1 flex gap-1 justify-center">
                          {postsForDate.slice(0, 3).map((post, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${getStatusColor(post.status_publicacao)}`}
                            />
                          ))}
                          {postsForDate.length > 3 && (
                            <div className="w-2 h-2 rounded-full bg-muted-foreground">
                              <span className="text-[8px] text-white">+</span>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          {selectedDate ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                  {isToday(selectedDate) && (
                    <Badge variant="secondary" className="ml-2">Hoje</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDatePosts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhuma postagem agendada para esta data.
                  </p>
                ) : (
                  selectedDatePosts.map((post) => {
                    const StatusIcon = getStatusIcon(post.status_publicacao);
                    return (
                      <div
                        key={post.id}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm leading-tight">
                            {post.titulo}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className="text-xs shrink-0"
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {post.status_publicacao}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.canal}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {post.tipo_conteudo}
                          </Badge>
                        </div>
                        
                        {post.data_publicacao && (
                          <p className="text-xs text-muted-foreground">
                            {(() => {
                              try {
                                return format(new Date(post.data_publicacao), 'HH:mm');
                              } catch {
                                return 'Horário inválido';
                              }
                            })()}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Selecione uma data</h3>
                  <p className="text-muted-foreground text-sm">
                    Clique em uma data no calendário para ver as postagens agendadas.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Publicado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Agendado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Rascunho</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};