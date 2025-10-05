import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Plus, Settings as SettingsIcon, User, Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { AgendaCalendar } from './components/AgendaCalendar';
import { EventDialog } from './components/EventDialog';
import { EventList } from './components/EventList';
import { ContentLoadingSkeleton } from '@/components/ui/skeleton-screens';

export interface AgendaEvent {
  id: string;
  user_id: string;
  client_id?: string;
  title: string;
  description?: string;
  agenda_type: 'personal' | 'automation';
  status: 'pending' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  all_day: boolean;
  is_recurring: boolean;
  recurrence_frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  recurrence_interval?: number;
  recurrence_end_date?: string;
  parent_event_id?: string;
  metadata?: any;
  color?: string;
  linked_resource_type?: string;
  linked_resource_id?: string;
  created_at: string;
  updated_at: string;
}

const AgendaModule = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'personal' | 'automation'>('personal');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Autenticação necessária',
          description: 'Você precisa fazer login para acessar a agenda.',
          variant: 'destructive',
        });
        navigate('/auth?redirect=/agenda');
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        navigate('/auth?redirect=/agenda');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const clientId = localStorage.getItem('selectedClientId');
    if (clientId) {
      setSelectedClient(clientId);
      fetchEvents(clientId);
    } else {
      setLoading(false);
    }

    const handleProfileChange = (event: CustomEvent) => {
      const newClient = event.detail;
      if (newClient && newClient.id) {
        setSelectedClient(newClient.id);
        setLoading(true);
        fetchEvents(newClient.id);
      }
    };

    window.addEventListener('profileChanged', handleProfileChange as EventListener);
    return () => {
      window.removeEventListener('profileChanged', handleProfileChange as EventListener);
    };
  }, [isAuthenticated]);

  const fetchEvents = async (clientId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('agenda_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleEditEvent = (event: AgendaEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('agenda_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(e => e.id !== eventId));
      toast({
        title: 'Sucesso',
        description: 'Evento excluído com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o evento.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await supabase
        .from('agenda_events')
        .update({ status: newStatus })
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, status: newStatus as any } : e
        )
      );

      toast({
        title: 'Sucesso',
        description: `Evento marcado como ${newStatus === 'completed' ? 'concluído' : 'pendente'}.`,
      });
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveEvent = async (eventData: Partial<AgendaEvent>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Validar campos obrigatórios
      if (!eventData.title?.trim()) {
        throw new Error('O título é obrigatório');
      }

      if (!eventData.start_date) {
        throw new Error('A data de início é obrigatória');
      }

      if (selectedEvent) {
        // Atualizar evento existente
        const { error } = await supabase
          .from('agenda_events')
          .update(eventData)
          .eq('id', selectedEvent.id);

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message || 'Erro ao atualizar evento');
        }

        setEvents(prev =>
          prev.map(e =>
            e.id === selectedEvent.id ? { ...e, ...eventData } as AgendaEvent : e
          )
        );

        toast({
          title: 'Sucesso',
          description: 'Evento atualizado com sucesso.',
        });
      } else {
        // Criar novo evento
        const insertData = {
          user_id: user.id,
          client_id: selectedClient || null,
          agenda_type: activeTab,
          title: eventData.title.trim(),
          description: eventData.description || null,
          start_date: eventData.start_date,
          end_date: eventData.end_date || null,
          all_day: eventData.all_day ?? false,
          is_recurring: eventData.is_recurring ?? false,
          recurrence_frequency: eventData.is_recurring ? eventData.recurrence_frequency : null,
          recurrence_interval: eventData.is_recurring ? eventData.recurrence_interval : null,
          recurrence_end_date: eventData.is_recurring ? eventData.recurrence_end_date : null,
          status: eventData.status || 'pending',
          color: eventData.color || null,
          metadata: eventData.metadata || null,
        };

        const { data, error } = await supabase
          .from('agenda_events')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message || 'Erro ao criar evento');
        }

        if (data) setEvents(prev => [...prev, data]);

        toast({
          title: 'Sucesso',
          description: 'Evento criado com sucesso.',
        });
      }

      setEventDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: 'Erro ao salvar evento',
        description: error.message || 'Não foi possível salvar o evento.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated || loading) {
    return <ContentLoadingSkeleton />;
  }

  const personalEvents = events.filter(e => e.agenda_type === 'personal');
  const automationEvents = events.filter(e => e.agenda_type === 'automation');

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Agenda
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus compromissos e automações
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/agenda/settings')}
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreateEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Agenda Pessoal
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Automações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgendaCalendar
                  events={personalEvents}
                  onEventClick={handleEditEvent}
                  onDateSelect={(date) => {
                    setSelectedEvent({
                      start_date: date.toISOString(),
                      agenda_type: 'personal',
                    } as any);
                    setEventDialogOpen(true);
                  }}
                />
              </div>
              <div>
                <Card>
                  <CardContent className="p-4">
                    <EventList
                      events={personalEvents}
                      onEventClick={handleEditEvent}
                      onToggleStatus={handleToggleStatus}
                      onDeleteEvent={handleDeleteEvent}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgendaCalendar
                  events={automationEvents}
                  onEventClick={handleEditEvent}
                  onDateSelect={(date) => {
                    setSelectedEvent({
                      start_date: date.toISOString(),
                      agenda_type: 'automation',
                    } as any);
                    setEventDialogOpen(true);
                  }}
                />
              </div>
              <div>
                <Card>
                  <CardContent className="p-4">
                    <EventList
                      events={automationEvents}
                      onEventClick={handleEditEvent}
                      onToggleStatus={handleToggleStatus}
                      onDeleteEvent={handleDeleteEvent}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <EventDialog
          open={eventDialogOpen}
          onOpenChange={setEventDialogOpen}
          event={selectedEvent}
          onSave={handleSaveEvent}
          agendaType={activeTab}
        />
      </div>
    </div>
  );
};

export default AgendaModule;
