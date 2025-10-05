import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AgendaEvent } from '../AgendaModule';

interface AgendaCalendarProps {
  events: AgendaEvent[];
  onEventClick: (event: AgendaEvent) => void;
  onDateSelect: (date: Date) => void;
}

export const AgendaCalendar = ({ events, onEventClick, onDateSelect }: AgendaCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      try {
        const eventDate = new Date(event.start_date);
        return isSameDay(eventDate, date);
      } catch {
        return false;
      }
    });
  };

  const getEventColor = (event: AgendaEvent) => {
    if (event.color) return event.color;
    return event.status === 'completed' ? 'bg-green-500' : 'bg-primary';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1));
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Hoje
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(date => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isPendingEvent = dayEvents.some(e => e.status === 'pending');
            const isCompletedEvent = dayEvents.some(e => e.status === 'completed');

            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateSelect(date)}
                className={`
                  relative min-h-[80px] p-2 border rounded-lg transition-colors
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isToday(date) ? 'ring-2 ring-primary' : ''}
                  hover:bg-muted
                `}
              >
                <div className="text-sm font-medium mb-1">
                  {format(date, 'd')}
                </div>

                {/* Event indicators */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`
                        text-xs p-1 rounded truncate cursor-pointer
                        ${getEventColor(event)} text-white
                        hover:opacity-80 transition-opacity
                      `}
                      title={event.title}
                    >
                      <div className="flex items-center gap-1">
                        {event.status === 'completed' ? (
                          <CheckCircle className="h-2.5 w-2.5" />
                        ) : (
                          <Clock className="h-2.5 w-2.5" />
                        )}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayEvents.length - 2} mais
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
