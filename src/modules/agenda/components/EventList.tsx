import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Clock, Trash2, Calendar, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AgendaEvent } from '../AgendaModule';

interface EventListProps {
  events: AgendaEvent[];
  onEventClick: (event: AgendaEvent) => void;
  onToggleStatus: (eventId: string, currentStatus: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventList = ({ events, onEventClick, onToggleStatus, onDeleteEvent }: EventListProps) => {
  const upcomingEvents = events
    .filter(e => e.status !== 'cancelled')
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 10);

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Nenhum evento agendado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold mb-4">Próximos Eventos</h3>
      {upcomingEvents.map((event) => (
        <div
          key={event.id}
          className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onEventClick(event)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{event.title}</h4>
                {event.is_recurring && (
                  <Repeat className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </div>
              {event.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(event.id, event.status);
              }}
            >
              {event.status === 'completed' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(event.start_date), "d 'de' MMM, HH:mm", { locale: ptBR })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Badge variant={event.status === 'completed' ? 'secondary' : 'default'} className="text-xs">
                {event.status === 'completed' ? 'Concluído' : 'Pendente'}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Tem certeza que deseja excluir este evento?')) {
                    onDeleteEvent(event.id);
                  }
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
