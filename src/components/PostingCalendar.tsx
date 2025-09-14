import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, CheckCircle, Zap, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, startOfDay, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
      case 'published':
        return 'bg-emerald-500 text-white';
      case 'agendado':
      case 'scheduled':
      case 'pending':
        return 'bg-blue-500 text-white';
      case 'rascunho':
      case 'draft':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'publicado':
      case 'published':
        return 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800';
      case 'agendado':
      case 'scheduled':
      case 'pending':
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      case 'rascunho':
      case 'draft':
        return 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
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

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                  <div key={day} className={cn(
                    "p-3 text-center text-sm font-semibold",
                    isWeekend(new Date(2024, 0, index)) ? "text-red-600 dark:text-red-400" : "text-foreground"
                  )}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map(date => {
                  const postsForDate = getPostsForDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isPast = isBefore(date, startOfDay(new Date()));
                  const isCurrentDay = isToday(date);
                  const isWeekendDay = isWeekend(date);
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "group relative p-3 h-20 text-sm rounded-xl transition-all duration-200 border-2",
                        "hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]" 
                          : "border-border hover:border-primary/30 hover:bg-accent/50",
                        isCurrentDay && !isSelected && "ring-2 ring-primary/50 bg-primary/5",
                        isPast && !isSelected && "opacity-60",
                        isWeekendDay && !isSelected && "bg-muted/30"
                      )}
                    >
                      <div className={cn(
                        "font-semibold text-base mb-1",
                        isCurrentDay && !isSelected && "text-primary",
                        isWeekendDay && !isSelected && "text-red-600 dark:text-red-400"
                      )}>
                        {format(date, 'd')}
                      </div>
                      
                      {/* Post indicators */}
                      {postsForDate.length > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                          {/* Status counts */}
                          <div className="flex flex-wrap gap-1 justify-center">
                            {(() => {
                              const statusCounts = postsForDate.reduce((acc, post) => {
                                const status = post.status_publicacao.toLowerCase();
                                acc[status] = (acc[status] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>);

                              return Object.entries(statusCounts).map(([status, count]) => {
                                const StatusIcon = getStatusIcon(status);
                                return (
                                  <div
                                    key={status}
                                    className={cn(
                                      "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-sm",
                                      "transform group-hover:scale-110 transition-transform duration-200",
                                      getStatusColor(status)
                                    )}
                                  >
                                    <StatusIcon className="h-2.5 w-2.5" />
                                    <span>{count}</span>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )}
                      
                      {/* Empty state indicator */}
                      {postsForDate.length === 0 && !isPast && (
                        <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-40 transition-opacity">
                          <Plus className="h-3 w-3 text-muted-foreground" />
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
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="text-lg">
                    {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                  </div>
                  {isToday(selectedDate) && (
                    <Badge variant="secondary" className="text-xs">Hoje</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDatePosts.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Nenhuma postagem agendada para esta data.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDatePosts.map((post) => {
                      const StatusIcon = getStatusIcon(post.status_publicacao);
                      return (
                        <div
                          key={post.id}
                          className={cn(
                            "p-4 rounded-lg border-2 space-y-3 transition-all duration-200",
                            "hover:shadow-md",
                            getStatusBgColor(post.status_publicacao)
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-semibold text-sm leading-tight flex-1">
                              {post.titulo}
                            </h4>
                            <Badge 
                              className={cn(
                                "text-xs shrink-0 border-0",
                                getStatusColor(post.status_publicacao)
                              )}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {post.status_publicacao === 'pending' ? 'Agendado' : post.status_publicacao}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs font-medium">
                              {post.canal}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {post.tipo_conteudo}
                            </Badge>
                          </div>
                          
                          {post.data_publicacao && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {(() => {
                                try {
                                  return format(new Date(post.data_publicacao), 'HH:mm');
                                } catch {
                                  return 'Horário inválido';
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-center py-16">
                <div className="text-center max-w-sm">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Selecione uma data</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Clique em uma data no calendário para ver as postagens agendadas e detalhes do dia.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Legend */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Legenda de Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                  <CheckCircle className="h-2.5 w-2.5" />
                  <span>2</span>
                </div>
                <span className="text-sm">Publicado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                  <Clock className="h-2.5 w-2.5" />
                  <span>1</span>
                </div>
                <span className="text-sm">Agendado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
                  <Zap className="h-2.5 w-2.5" />
                  <span>3</span>
                </div>
                <span className="text-sm">Rascunho</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};